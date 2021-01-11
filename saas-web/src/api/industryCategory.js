import request from '@/utils/request';
import { formatParams } from '@/utils/index';

export const url = `/api/industry-category`;

export function list(query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: formatParams(query)
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
    url: `${url}`,
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

/**
 * 启用/停用
 * @param id
 */
export function toggle(id) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data: {}
  });
}
