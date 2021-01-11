import { http } from '@/utils/http'
import { utils } from '@/utils/utils'

const baseUrl = 'AcSpotAveragePricingInfo';

const api = {
  async list(query, pagination) {
    let params = utils.cleanEmpty({...query, isCancelToken: true, pagination});
    return await http.get(`${baseUrl}/List`, params);
  },
  async getCommonData() {
    return await http.get(`${baseUrl}/GetCommonData`);
  },
  async create(form) {
    return await http.post(`${baseUrl}/Create`, form);
  },
  async update(form) {
    return await http.post(`${baseUrl}/Update`, form);
  },
  async mannualGenerateTradePricing(form) {
    return await http.post(`${baseUrl}/MannualGenerateTradePricing`, form);
  },
  async get(id) {
    return await http.get(`${baseUrl}/Get/${id}`);
  },
  async delete(id) {
    return await http.post(`${baseUrl}/Delete/${id}`);
  },
  async exportExcel(query, filename) {
      return await http.download(`${baseUrl}/Export`, query, false, filename);
  },
}
export default api;