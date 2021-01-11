import { http, proxy } from '@/utils/http'
import { utils } from '@/utils/utils'

const baseUrl = `${proxy.common}/Unit`
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
  async listUnitConversionUnconfigured (query, pagination) {
    let params = { ...query, pagination }
    let result = http.get(`${baseUrl}/ListUnitConversionUnconfigured`, params, false)
    return result
  },
  async getViewUnitConversionByUnitId (query, pagination) {
    let params = { ...query, pagination }
    let result = http.get(`${baseUrl}/GetViewUnitConversionByUnitId`, params, false)
    return result
  },
  async getById (id) {
    let result = http.get(`${baseUrl}/GetById`, { id })
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
  async setDisabled (data) {
    await http.paramsPut(`${baseUrl}/SetDisabled`, data)
  }
}
export default api
