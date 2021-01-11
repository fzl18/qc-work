import request from '@/utils/request'
import { formatParams } from '@/utils/index'

/**
 * 标准合约维护api
 */
export const url = `/api/instrument-category`

export function list (query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: formatParams(query)
  })
}

export function commonData () {
  return request({
    url: `${url}/commonData`,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: `${url}`,
    method: 'post',
    data: data
  })
}

export function getById (id) {
  return request({
    url: `${url}/${id}`,
    method: 'get',
    params: {}
  })
}

export function update (id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data: data
  })
}

export function remove (id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete',
    data: {}
  })
}

/**
 * 启用/停用
 * @param id
 */
export function toggle (id) {
  return request({
    url: `${url}/toggle/${id}`,
    method: 'put',
    data: {}
  })
}

