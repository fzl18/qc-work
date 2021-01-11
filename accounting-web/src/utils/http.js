import axios from 'axios';
import baseURL from '@/utils/baseUrl';
import { ajax } from './httpBase';

//  响应时间
axios.defaults.timeout = 120000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; // 配置请求头responseType:
axios.defaults.baseURL = baseURL;

// 用于多次请求 取消前面正在pending的请求
// 存放处于pending状态的请求
let pending = [];
let CancelToken = axios.CancelToken;
let removePending = (config, str) => {
  _.forIn(pending, function (value, key) {
    if (value.u === config.url + '&' + config.method) {
      value.f('cancel');
      pending.splice(key, 1);
    }
  });
};

axios.interceptors.request.use(config => {
  let isCancelToken = false;
  if (config.method === 'post') {
    isCancelToken = config.data && config.data.isCancelToken;
  } else {
    isCancelToken = config.params && config.params.isCancelToken;
  }
  if (isCancelToken) {
    removePending(config, 'request');
    config.cancelToken = new CancelToken((cancel) => {
      pending.push({ u: config.url + '&' + config.method, f: cancel });
    });
  }
  return config;
}, err => {
  return Promise.reject(err);
}).time;

axios.interceptors.response.use(
  response => {
    let isCancelToken = false;
    if (response.config && response.config.method === 'post') {
      isCancelToken = response.config && response.config.data && response.config.data.isCancelToken;
    } else {
      isCancelToken = response.config && response.config.params && response.config.params.isCancelToken;
    }
    if (isCancelToken) {
      removePending(response.config, 'response');
    }
    return response;
  },
  err => {
    return Promise.reject(err);
  }
);

let httpMethods = {
  /** get 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  get: ajax('get'),
  /** post 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  post: ajax('post'),
  /** put 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  put: ajax('put'),
  /** delete 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  delete: ajax('delete'),

  download: ajax('get', true)
};

export let http = httpMethods;
