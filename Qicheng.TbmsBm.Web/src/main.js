import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@/assets/theme.less';
import '@/assets/style.less'
import 'lodash'
import { api } from '@/api/api'
import { http } from '@/utils/http'
import { utils } from '@/utils/utils'
import './permission'
import i18n from './i18n'
import customComponents from '@/components/index'
import directives from '@/directives/index'
//全局api 设置
Vue.prototype.api = api
Vue.prototype.http = http
Vue.prototype.utils = utils

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(customComponents)
Vue.use(directives)

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
versionId = readFile('/version.txt').split('\n')[2]
localStorage.setItem('versionId', versionId)
// }

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
