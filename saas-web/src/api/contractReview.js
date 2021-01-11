import request from '@/utils/request';

const baseUrl = `/api/review-contractData`;

export function review(accountId) {
  return request({
    url: `${baseUrl}/review/${accountId}`,
    method: 'get',
    timeout: 600000
  });
}

export function getCommonData() {
  return request({
    url: `${baseUrl}/CommonData`,
    method: 'get'
  });
}

export function exportList(accountId) {
  return request({
    url: `${baseUrl}/export`,
    method: 'get',
    timeout: 600000,
    params: {
      accountId
    },
    responseType: 'blob'
  });
}