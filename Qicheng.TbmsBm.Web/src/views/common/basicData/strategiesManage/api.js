import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/WFTradingStrategy`
const api = {
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getcommondata`)
    return commondata
  },
  async list (query, pagination) {
    let params = { ...query, pagination}
    let result = await http.get(`${baseUrl}/listTree`, params)
    return result
  },
  async selectList () {
    let result = await http.get(`${baseUrl}/list`)
    return result
  },
  async getById (id) {
    let result = await http.get(`${baseUrl}/getById/${id}`)
    return result
  },
  async save (data) {
    return await http.post(`${baseUrl}/save`, data)
  },
  async batchAttach (data) {
    await http.post(`${baseUrl}/batchAttach`, data)
  },
  async setDisableStatus (data) {
    await http.post(`${baseUrl}/SetDisableStatus`, data)
  },

  async profitCenterList () {
    await http.post(`${proxy.common}/WFAccountEntity/ProfitCenterList`, )
  }
}
export default api
