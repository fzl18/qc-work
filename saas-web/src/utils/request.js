import axios from 'axios';
import store from '../store';
import { Message, MessageBox } from 'element-ui';
import { getToken } from './auth';
import { setToken } from './auth';

let baseURL = Window.apiUrl;
const service = axios.create({
  baseURL: baseURL,
  timeout: 60000
});

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['token'] = getToken();
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    if (response && response.headers.newtoken) {
      setToken(response.headers.newtoken);
    }
    if (response.status === 500) {
      Message({
        message: response.data.errorMessage,
        type: 'error',
        duration: 5 * 1000
      });
    }
    if (!response.status) {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      });
    }

    return response;
  },
  error => {
    if (error.response) {
      Message({
        message: `${error.response.data.message}`,
        type: 'error',
        duration: 5 * 1000
      });
      if (error.response.status === 401) {
        MessageBox.confirm('会话超时，请重新登录！', '确定', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();
          });
        });
      }
    } else {
      Message({
        message: `${error.message}, 稍后重试...`,
        type: 'error',
        duration: 2 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
