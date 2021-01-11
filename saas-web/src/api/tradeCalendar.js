import request from '@/utils/request'

export const baseUrl = `/api/trade-calendar`

export function list (query) {
  return request({
    url: `${baseUrl}/?${query}`,
    method: 'get',
  })
}

export function tradingDays (data) {
  return request({
    url: `${baseUrl}/trading-days`,
    method: 'post',
    data: data
  })
}

export function notTradingDays (data) {
  return request({
    url: `${baseUrl}/not-trading-days`,
    method: 'post',
    data: data
  })
}

export function initTradingDays (data) {
  return request({
    url: `${baseUrl}/init`,
    method: 'post',
    data: data
  })
}

export function getCommonData (data) {
  return request({
    url: `${baseUrl}/commondata`,
    method: 'get',
    data
  })
}