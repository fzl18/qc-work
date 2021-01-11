import { http, proxy } from '@/utils/http'
import { utils } from '@/utils/utils'

const baseUrl = `${proxy.common}/WFQuantityType`
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
  async create (data) {
    const params = utils.cleanEmpty(data)
    await http.post(`${baseUrl}/Create`, params)
  },
  async update (data) {
    const params = utils.cleanEmpty(data)
    await http.put(`${baseUrl}/Update`, params)
  },
  async delete (data) {
    await http.put(`${baseUrl}/SetDisabled`, data)
  }
}
export default api
