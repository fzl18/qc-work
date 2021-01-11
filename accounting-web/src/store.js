import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
let newPermission = []
export default new Vuex.Store({
    state: {
        loading: false,
        cachedCommonData: {},
        userPermissions: null
    },
    getters: {
        getLoading: state => state.loading,
        getPermission: () => newPermission
    },
    setters: {


    },
    mutations: {
        showLoading(state) {
            state.loading = true;
        },
        hideLoading(state) {
            state.loading = false;
        },
        //data contains cache key  & cache data
        cacheCommonData(state, data) {
            let cacheKey = data.key
            let commonData = data.commonData
                //没有缓存 需要在store中管理commonData
            state.cachedCommonData = state.cachedCommonData || {} //初始化
            if (!state.cachedCommonData[cacheKey]) {
                state.cachedCommonData[cacheKey] = commonData
            }

        },
        cacheUserPermissions( state, data) {
            newPermission = data.map(item => {item = item.toLowerCase(); return item})
            state.userPermissions = data;
        }
    }
});