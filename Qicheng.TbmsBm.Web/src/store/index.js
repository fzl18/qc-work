import Vuex from 'vuex';
import Vue from 'vue';
// import i18n from '../i18n'
import {api} from '@/api/api'
import enums from '@/utils/enums'
Vue.use(Vuex);
const modulesStore = require.context('../views', true, /store.js$/)
const Stores = modulesStore.keys().reduce((stores, storePath) => {
  let storeName = storePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  storeName = storeName.split('/')[0]
  const value = modulesStore(storePath)
  stores[storeName] = value.default
  return stores
}, {})

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, Stores)
export default new Vuex.Store({
  modules,
  state: {
    loading: false,
    isShowMessageModal: false,
    message: '',
    mainLoginUrl: '',
    options: enums
  },
  getters: {
    getLoading: state => state.loading,
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
    showModal(state, message) {
      state.isShowMessageModal = true;
      state.message = message;
    },
    hideModal(state) {
      state.isShowMessageModal = false;
      state.message = '';
    },
    setMainLoginUrl(state, url) {
      state.mainLoginUrl = url
    }
  },
  actions: {
    async getMainLoginUrl({ commit }) {
      let { mainLoginUrl } = await api.getMainLoginUrl();
      commit('setMainLoginUrl', mainLoginUrl)
      return mainLoginUrl
    },
  }
});
