import { http } from '@/utils/http'

const baseUrl = '/TradeSettlementDateConfig'
const api = {
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getcommondata`)
    return commondata
  },
  async list (query, pagination) {
    let params = { ...query, pagination, isCancelToken: true }
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
  async getById (id) {
    let result = http.get(`${baseUrl}/Get/${id}`)
    return result
  },
  async save (data) {
    await http.post(`${baseUrl}/Save`, data)
  },
  async delete (id) {
    await http.post(`${baseUrl}/Delete/${id}`)
  }
}
export default api
