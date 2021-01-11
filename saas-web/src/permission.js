import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth";
import { Message } from "element-ui";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (!store.getters.userInfo.userId) {
        store
          .dispatch("GetUserInfo")
          .then(response => {
            if (response.status === 200) {
              next({ ...to, replace: true });
            }
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              Message.error("验证失败,请重新登录");
              next({ path: "/login" });
            });
          });
      } else {
        let userInfo = store.getters.userInfo
        if(userInfo.isAdmin){
          next()
        }else{
          let passList = ['/dashboard', '/p-403','/change-password','/p-404']
          let verifySectionCode = to.meta.sectionCode
          let toPageInfo = userInfo.userAuth.sectionOperations.find(item => {
            return item.qcSectionCode == verifySectionCode
          })
          let pass = toPageInfo && toPageInfo.operations.find( item =>{ return item.qcOperationCode == 'list'})
          if(to.name == "UserManage" && to.query.type == "setting"){
            pass = toPageInfo && toPageInfo.operations.find( item =>{ return item.qcOperationCode == 'authority-config'})
          }
          if(pass || passList.includes(to.path)){
            next()
          }else{
            next({ path: "/p-403" });
          }
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      next();
    } else {
      Message({
        message: `您已登出`,
        type: "warning",
        duration: 3 * 1000
      });
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
