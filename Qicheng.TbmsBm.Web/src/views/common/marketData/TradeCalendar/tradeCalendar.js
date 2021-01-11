import { http as request, proxy }  from '@/utils/http';

export const baseUrl = `${proxy.common}/WFMarketCalendar`

export function list (query) {
  return request.get(`${baseUrl}/List?${query}`)
}

export function tradingDays (data) {
  return request.post(`${baseUrl}/ModifyTradeDaysStatus`,{isTradeDay:true,...data})
}

export function notTradingDays (data) {
  return request.post(`${baseUrl}/ModifyTradeDaysStatus`,{isTradeDay:false,...data})
}

export function initTradingDays (data) {
  return request.post(`${baseUrl}/InitWeekendAsNotTradeDays`,data)
}

export function getCommonData (data) {
  return request.get(`${baseUrl}/GetCommonData`)
}

export function exchangeList (data) {
  return request.get(`${baseUrl}/GetCommonData`)
}