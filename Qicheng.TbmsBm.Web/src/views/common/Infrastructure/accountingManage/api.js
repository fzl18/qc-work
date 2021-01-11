import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/WFAccountEntity`
const api = {
  async list (query, pagination) {
    let params = { ...query, pagination, isCancelToken: true }
    return http.get(`${baseUrl}/list`, params)
  },
  async profitCenterList (query, pagination) {
    let params = { ...query, pagination, isCancelToken: true }
    return http.get(`${baseUrl}/profitCenterList`, params)
  },
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getCommonData`)
    return commondata
  },
  async get (query) {
    let result = http.get(`${baseUrl}/get`, query)
    return result
  },
  async deleteById (query) {
    let result = http.get(`${baseUrl}/deleteById`, query)
    return result
  },
  async save (form) {
    await http.post(`${baseUrl}/create`, form)
  },
  async update (data) {
    await http.put(`${baseUrl}/update`, data)
  },
  async setDisableStatus (data) {
    await http.paramsPut(`${baseUrl}/setDisableStatus`, data)
  }
}
export default api
