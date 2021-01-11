import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = '/AcCommissionRate'
const api = {
  async getCommonData() {
    let commondata = await http.get(`${baseUrl}/getcommondata`);
    return commondata;
  },
  async list(query, pagination) {
    let params = utils.cleanEmpty({...query, pagination, isCancelToken: true });
    let result = http.get(`${baseUrl}/list`, params);
    return result;
  },
  async getById(id) {
    let result = http.get(`${baseUrl}/FetchById/${id}`);
    return result;
  },
  async save(data) {
    await http.post(`${baseUrl}/save`, data);
  },
  async delete(id) {
    await http.post(`${baseUrl}/RemoveById/${id}`);
  },
  async exportExcel(query, filename) {
    return await http.download(`${baseUrl}/Export`, query, false, filename);
  }
}

export default api
