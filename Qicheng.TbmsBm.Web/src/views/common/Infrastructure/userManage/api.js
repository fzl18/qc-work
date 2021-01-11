import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/WFUser`
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
    await http.post(`${baseUrl}/save`, data)
  },
  // async update (data) {
  //   await http.put(`${baseUrl}/update`, data)
  // },
  async setDisableStatus (data) {
    await http.paramsPut(`${baseUrl}/setDisableStatus`, data)
  },
  async saveNewPassword (id, pw) {
    return await http.post(`${baseUrl}/AdminSetOtherUserPassword?userId=${id}&psw=${pw}`)
  },
  async generateNewPassword () {
    return await http.get(`${baseUrl}/generateNewPassword`)
  }
}
export default api
