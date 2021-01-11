import request from '@/utils/request';
import { formatParams } from '@/utils/index';

export const url = `/api/ReviewTradeAccount`;

export function list(query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: formatParams(query)
  });
}

export function getCommonData() {
  return request({
    url: `${url}/CommonData`,
    method: 'get'
  });
}

export function add(data) {
  return request({
    url: `${url}`,
    method: 'post',
    data: data
  });
}

export function getById(id) {
  return request({
    url: `${url}/${id}`,
    method: 'get',
    params: {}
  });
}

export function update(id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data: data
  });
}

export function remove(id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete',
    data: {}
  });
}

