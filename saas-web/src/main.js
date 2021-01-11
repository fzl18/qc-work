import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import '@/styles/index.scss'; // global css

import App from './App.vue';
import router from './router/index';
import store from './store/index';

import '@/icons'; // icon component
import './permission';
import * as filters from './filters'; // import global filters
import { Opt } from './utils/auth'
Vue.use(ElementUI, { size: 'small' });

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.directive('hasAuth', Opt)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
