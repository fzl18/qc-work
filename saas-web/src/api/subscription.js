import request from '@/utils/request'
import { formatParams } from '@/utils/index'

const url = `/api/app-subscription`

export function list (query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: formatParams(query)
  })
}

export function push (data) {
  return request({
    url: `${url}`,
    method: 'post',
    data: data
  })
}

