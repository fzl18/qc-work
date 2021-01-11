import axios from 'axios';
import store from '@/store';
import { Message } from 'view-design';
import goMainLogin from '@/utils/mainLogin';

let httpMethods = 0;
const ajax = (method, isDownload = false) => {
  return (url, params, needLoading = true, fileName, extensions = 'xls') => {
    // 如果参数是 FormData 默认不做参数清理 因为会将form data 对象变成空对象
    // if (!(params instanceof FormData)) {
    //     params = utils.cleanEmpty(params);
    // }

    axios.defaults.headers.common['token'] = window.localStorage.getItem('token');
    axios.defaults.headers.common['locale'] = window.localStorage.getItem('locale');
    axios.defaults.headers.common['tenant'] = window.localStorage.getItem('tenantCode') || 'TestC';

    return new Promise((resolve, reject) => {
      needLoading && store.commit('showLoading');
      httpMethods++;
      let config = {
        method: method,
        url: `api/${url}`,
      };
      if (method === 'post' || method === 'put') {
        config['data'] = params;
        if (isDownload) {
          config['responseType'] = 'blob';
        }
      } else {
        params = formatParams(params);
        config['params'] = params;
        if (isDownload) {
          // download 模式下 responseType: 'blob'
          config['responseType'] = 'blob';
        }
      }
      axios(config)
        .then((response) => {
          if (!isDownload) {
            if (response && response.data) {
              if (response.data.failed) {
                showStateError(response);
                reject(response.data);
                needLoading && store.commit('hideLoading');
                return;
              }
            }
            resolve(response.data);
            needLoading && store.commit('hideLoading');
          } else {
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            const parsedFilename = response.headers['content-disposition'].split(';').map(x => x.trim()).filter(x => x.startsWith('filename*=utf-8\'\'')).map(x => decodeURIComponent(x.substr('filename*=utf-8\'\''.length)))[0] || `${fileName}.${extensions}`;
            //downloadElement.download = parsedFilename
            downloadElement.setAttribute('download', parsedFilename);
            if (typeof downloadElement.download === 'undefined') {
              downloadElement.setAttribute('target', '_blank');
            }
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
            resolve('ok');
          }

          httpMethods--;
          if (!httpMethods) {
            needLoading && store.commit('hideLoading');
          }
        })
        .catch((error) => {
          if(error.message != 'cancel') {
            showStateError(error.response);
            reject(error);
          }
          httpMethods--;
          if (!httpMethods) {
            needLoading && store.commit('hideLoading');
          }
        });
    });
  };
};

function formatParams (params) {
  if (Object.prototype.toString.call(params) === '[object Object]') {
    Object.keys(params).forEach(function (key) {
      if (Object.prototype.toString.call(params[key]) === '[object String]') {
        params[key] = params[key].trim()
      }
    })
  }
  let _params = { ...params };
  if (params && params.pagination) {
    _params = {
      ..._params,
      'pagination.currentPage': _params.pagination.currentPage,
      'pagination.pageSize': _params.pagination.pageSize
    };
    delete _params.pagination;
  }
  return _params;
}


function showStateError (response) {
  if (!response) {
    showMessage('系统错误，请联系管理员');
    return;
  }
  let message = getMessage(response);
  switch (response.status) {
    case 200:
      showMessage(message);
      break;
    case 400:
      showMessage(message);
      return Promise.reject(response);
    case 401:
      goMainLogin();
      break;
    case 404:
      showMessage(message);
      break;
    case 500:
      showMessage(message);
      break;
    default:
      showMessage('系统错误，请联系管理员');
  }
}

function getMessage (response) {
  if (response.data instanceof Blob) {
    try {
      return JSON.parse(blobToString(response.data)).message;
    } catch {
      return '系统错误，请联系管理员';
    }
  }
  return response.data.message;
}

function blobToString (b) {
  var u, x;
  u = URL.createObjectURL(b);
  x = new XMLHttpRequest();
  x.open('GET', u, false); // although sync, you're not fetching over internet
  x.send();
  URL.revokeObjectURL(u);
  return x.responseText;
}

const showMessage = (message) => {
  Message.destroy();
  Message.error({
    content: message,
    duration: 0,
    closable: true,
    onClose: () => {
      Message.destroy();
    }
  });
};
export { ajax };
