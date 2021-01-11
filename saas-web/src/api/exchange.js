import request from '@/utils/request'
import { formatParams } from '@/utils/index'

export const baseUrl = `/api/exchange`

export function list (query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: formatParams(query)
  })
}

export function add (data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'put',
    data: data
  })
}

export function toggleAble (id) {
  return request({
    url: `${baseUrl}/${id}/toggle`,
    method: 'put',
    data: {}
  })
}

export function saveTime (data) {
  return request({
    url: `${baseUrl}/saveTimeRanges`,
    method: 'post',
    data
  })
}

export function getCommonData (data) {
  return request({
    url: `${baseUrl}/commonData`,
    method: 'get',
    data
  })
}