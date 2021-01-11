import { http, proxy } from '@/utils/http'

const baseUrl = `${proxy.common}/WFCommodityType`
const baseUrl1 = `${proxy.common}/WFCommodity`
const baseUrl2 = `${proxy.common}/WFSpecification`
const api = {
  async getCommonData () {
    let commondata = await http.get(`${baseUrl}/getcommondata`)
    return commondata
  },
  // 品类接口
  async list (query, pagination) {
    let params = { ...query, pagination, isCancelToken: true }
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
  async setDisable (data) {
    await http.put(`${baseUrl}/SetDisabled`, data)
  },
  // 品种接口
  async wFCommodityList (query) {
    let result = http.get(`${baseUrl1}/List`, query, false)
    return result
  },
  async setCommodityDisable (data) {
    await http.put(`${baseUrl1}/SetDisabledStatus`, data)
  },
  // 物料接口
  async wFSpecificationList (query) {
    let result = http.get(`${baseUrl2}/List`, query, false)
    return result
  },
  async setSpecificationDisable (data) {
    await http.put(`${baseUrl2}/SetDisabled`, data)
  },
  async getById (id) {
    let result = http.get(`${baseUrl}/Get/${id}`)
    return result
  },
  async save (data) {
    await http.post(`${baseUrl}/Save`, data)
  }
}
export default api
