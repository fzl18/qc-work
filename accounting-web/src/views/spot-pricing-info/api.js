import { http } from '@/utils/http'
import { utils } from '@/utils/utils'

const baseUrl = 'AcSpotPricingRecord'
// ifApi for instrument feed Api
const api = {
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/GetCommonData`)
    return commondata
  },
  async list (query, pagination) {
    let params = utils.cleanEmpty({ ...query, isCancelToken: true, pagination })
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
  async getById (id) {
    let item = http.get(`${baseUrl}/get/${id}`)
    return item
  },
  async add (data) {
    await http.post(`${baseUrl}/add`, data)
  },
  async upDate (data) {
    await http.post(`${baseUrl}/upDate`, data)
  },
  async delete (id) {
    await http.delete(`${baseUrl}/delete/${id}`)
  },
  async exportExcel (query, filename) {
    return await http.download(`${baseUrl}/Export`, query, false, filename)
  }
}

export default api
