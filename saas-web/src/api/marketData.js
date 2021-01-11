import request from '@/utils/request'
import { formatParams } from '@/utils/index'

const baseUrl = `/api/instrumentfeed`

function list (query) {
  return request({
    url: `${baseUrl}`,
    method: 'get',
    params: formatParams(query)
  })
}

function getCommonData () {
  return request({
    url: `${baseUrl}/CommonData`,
    method: 'get'
  })
}

function exportList (data) {
  return request({
    url: `${baseUrl}/export`,
    method: 'get',
    responseType: 'blob',
    params: formatParams(data)
  })
}

function downloadTmp () {
  return request({
    url: `${baseUrl}/Download`,
    method: 'get',
    responseType: 'blob'
  })
}

function add (data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data
  })
}

function preview (data) {
  return request({
    url: `${baseUrl}/preview`,
    method: 'post',
    data
  })
}

function importData (data) {
  return request({
    url: `${baseUrl}/import`,
    method: 'post',
    data
  })
}

function update (id, data) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'put',
    data
  })
}

function changePassword (data) {
  return request({
    url: `${baseUrl}/current/change-password`,
    method: 'put',
    data
  })
}

function remove (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete',
    data: {}
  })
}

function multiDelete (data) {
  return request({
    url: `${baseUrl}`,
    method: 'delete',
    data
  })
}

export {
  list,
  add,
  update,
  changePassword,
  remove,
  multiDelete,
  preview,
  downloadTmp,
  importData,
  exportList,
  getCommonData
}
