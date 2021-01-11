import request from '@/utils/request';
import { formatParams } from '@/utils/index';

export const url = `/api/commodity`;

export function list(query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: formatParams(query)
  });
}

export function commonData() {
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

export function update(id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data: data
  });
}

/**
 * 启用/停用
 * @param id
 */
export function toggle(id) {
  return request({
    url: `${url}/${id}/toggle`,
    method: 'put',
    data: {}
  });
}
