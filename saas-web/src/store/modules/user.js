import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, getUserInfo } from "../../api/account";

const user = {
  state: {
    token: getToken(),
    name: "",
    userInfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    }
  },
  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            if (!response.data.changPassword) {
              const token = response.data.token;
              setToken(token);
              commit("SET_TOKEN", token);
            }
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            commit("SET_USERINFO", response.data);
            commit("SET_NAME", response.data.displayName);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 退出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        commit("SET_NAME", "");
        commit("SET_USERINFO", {});
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
