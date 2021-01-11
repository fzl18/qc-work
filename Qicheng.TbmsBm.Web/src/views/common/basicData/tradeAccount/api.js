import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/WFTradeAccount`
const api = {
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getcommondata`)
    return commondata
  },
  async list (query, pagination) {
    let params = { ...query, pagination}
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
  async getById (id) {
    let result = http.get(`${baseUrl}/getById/${id}`)
    return result
  },
  async save (data) {
    await http.post(`${baseUrl}/Save`, data)
  },
  async GetAccountTypes (data) {
    return await http.get(`${baseUrl}/GetAccountTypes`, data)
  },
  async SaveAccountTypes (data) {
    await http.post(`${baseUrl}/SaveAccountTypes`, data)
  },
  async setDisableStatus (id, data) {
    await http.post(`${baseUrl}/setDisableStatus`, data)
  }
}
export default api
