import { http, proxy } from '@/utils/http'

// const baseUrl = 'WFCurrency',
const baseUrl = `${proxy.common}/WFInstrument`
const api = {
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getCommonData`)
    return commondata
  },
  async list (query, pagination) {
    let params = { ...query, pagination}
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
  async getById (query) {
    let result = http.get(`${baseUrl}/getById`, query)
    return result
  },
  async deleteById (query) {
    let result = http.paramsPut(`${baseUrl}/deleteById`, query)
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
