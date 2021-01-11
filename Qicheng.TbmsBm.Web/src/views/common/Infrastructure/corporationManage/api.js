import { http, proxy } from '@/utils/http'
import { utils } from '@/utils/utils'

const baseUrl = `${proxy.common}/Corporation`
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
    let result = http.get(`${baseUrl}/GetById`, { id })
    return result
  },
  async update (data) {
    const params = utils.cleanEmpty(data)
    await http.put(`${baseUrl}/Update`, params)
  },
  async create (data) {
    const params = utils.cleanEmpty(data)
    await http.post(`${baseUrl}/Create`, params)
  },
  async setDisableStatus (data) {
    await http.paramsPut(`${baseUrl}/SetDisableStatus`, data)
  }
}
export default api
