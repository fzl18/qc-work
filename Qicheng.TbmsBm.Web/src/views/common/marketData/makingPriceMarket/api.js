import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/Exchange`
const api = {
  async list (query, pagination) {
    let params = { ...query, pagination, isCancelToken: true }
    return http.get(`${baseUrl}/list`, params)
  },
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getCommonData`)
    return commondata
  },
  async get (query) {
    let result = http.get(`${baseUrl}/getById`, query)
    return result
  },
  async setDisableStatus (query) {
    let result = http.paramsPut(`${baseUrl}/setDisableStatus`, query)
    return result
  },
  async save (form) {
    await http.post(`${baseUrl}/create`, form)
  },
  async update (data) {
    await http.put(`${baseUrl}/update`, data)
  },
  async saveExchangeType (data) {
    await http.post(`${baseUrl}/saveExchangeType`, data)
  },
  async deleteExchangeType (data) {
    await http.post(`${baseUrl}/deleteExchangeType`, data)
  }
}
export default api