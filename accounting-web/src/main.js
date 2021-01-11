import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@/assets/content/theme.less';
import 'lodash';
import VeLine from 'v-charts/lib/line.common';
import VeHistogram from 'v-charts/lib/histogram.common';
import VeBar from 'v-charts/lib/bar.common';
import VeRing from 'v-charts/lib/ring.common';
import { Table,TreeSelect} from 'ant-design-vue';
import { api } from '@/api/api';
import { http } from '@/utils/http';
import { utils } from '@/utils/utils';
import '@/assets/content/style.css';
import 'v-charts/lib/style.css';
import customComponents from '@/components/index';
import directives from '@/directives/index'

//全局api 设置
Vue.prototype.api = api;
Vue.prototype.http = http;
Vue.prototype.utils = utils;
Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(customComponents);
Vue.use(directives);
Vue.component(VeLine.name, VeLine);
Vue.component(VeHistogram.name, VeHistogram);
Vue.component(VeBar.name, VeBar);
Vue.component(VeRing.name, VeRing);
Vue.component(Table.name, Table);
Vue.component(TreeSelect.name, TreeSelect);

Vue.directive('color-green', function (el, binding) {
  el.style.color = binding.value < 0 ? 'red' : '#43cf7c';
});
Vue.directive('color-blue', function (el, binding) {
  el.style.color = binding.value < 0 ? 'red' : '#2a82e4';
});

let versionId = '' //版本号

function readFile(filePath) {
  let xhr = null
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    // eslint-disable-next-line
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }
  const okStatus = document.location.protocol === 'file' ? 0 : 200
  xhr.open('GET', filePath, false)
  xhr.overrideMimeType('text/html;charset=utf-8')
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}

// if(process.env.NODE_ENV !== 'development') {
  versionId = readFile('/version.txt').split("\n")[2]
  localStorage.setItem('versionId', versionId)
// }


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
