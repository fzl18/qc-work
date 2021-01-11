import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const moduleCn = require.context('../../src', true, /cn.json$/)
const moduleEn = require.context('../views', true, /en.json$/)

const cns = moduleCn.keys().reduce((cn, modulePath) => {
  let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  moduleName = moduleName.match(/^views(.*)tools/)
  if(moduleName && moduleName.length) {
    moduleName = moduleName[1].replace(/\//g, '')
  }
  if(moduleName) {
    cn[moduleName] =  moduleCn(modulePath)
  } else {
    cn = {...moduleCn(modulePath)}
  }
  return cn
}, {})

const ens = moduleEn.keys().reduce((en, modulePath) => {
  let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  moduleName = moduleName.match(/^views(.*)tools/)
  if(moduleName && moduleName.length) {
    moduleName = moduleName[1].replace(/\//g, '')
  }
  if(moduleName) {
    en[moduleName] =  moduleEn(modulePath)
  } else {
    en = {...moduleEn(modulePath)}
  }
  return en
}, {})

var langMessages = {
  'zh-CN': cns,
  en: ens
};
let locale = localStorage.getItem('locale') || 'zh-CN';
var i18n = new VueI18n({
  locale,
  messages: langMessages,
  silentTranslationWarn: true
});
export default i18n;
