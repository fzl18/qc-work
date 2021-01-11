import { http, proxy } from '@/utils/http'
const baseUrl = `${proxy.common}/TraderAddressBinding`
const api = {
  async getUserList () {
    let list = await http.get(`${proxy.common}/wfuser/list`)
    return list
  },
  async list (query, pagination) {
    let params = { ...query, pagination}
    let result = http.get(`${baseUrl}/GetTraderAddressBinding`, params)
    return result
  },
  async save (data) {
    await http.post(`${baseUrl}/SaveTraderAddressBinding`, data)
  },
  async onDelete (userId) {
    await http.delete(`${baseUrl}/DeleteTraderAddressBinding/${userId}`)
  },
}
export default api
