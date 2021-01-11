import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/WFCurrency`
const api = {
  // async getCommonData () {
  //   let commondata = await http.get(`${baseUrl}/getcommondata`)
  //   return commondata
  // },
  async list (query, pagination) {
    let params = { ...query, pagination, isCancelToken: true }
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
  async setDisableStatus(data) {
    await http.paramsPut(`${baseUrl}/SetDisableStatus`, data)
  },
  async save(data) {
    await http.post(`${baseUrl}/Create`, data)
  },
  async update(data) {
    await http.put(`${baseUrl}/update`, data)
  }
  // async getById (id) {
  //   let result = http.get(`${baseUrl}/Get/${id}`)
  //   return result
  // },
  // async save (data) {
  //   await http.post(`${baseUrl}/Save`, data)
  // },
  // async delete (id) {
  //   await http.post(`${baseUrl}/Delete/${id}`)
  // }
}
export default api
