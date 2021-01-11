import { http,proxy } from '@/utils/http'
const baseUrl = `${proxy.common}/LoginHistory`
const api = {
  async getCommonData () {
    let commondata = await http.get(`${proxy.common}/wfuser/getcommondata`)
    return commondata
  },
  async userlist () {
    let result = http.get(`${proxy.common}/wfuser/list`)
    return result
  },
  async list (query, pagination) {
    let params = { ...query, pagination}
    let result = http.get(`${baseUrl}/list`, params)
    return result
  },
}
export default api
