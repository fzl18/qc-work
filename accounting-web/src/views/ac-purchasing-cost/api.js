import { http } from '@/utils/http'
const baseUrl = 'AcPurchasingCost';
const api = {
  async list(query) {
    let params = {...query, isCancelToken: true }
    return await http.get(`${baseUrl}/List`, params);
  },
  async exportExcel(query, filename) {
    return await http.download(`${baseUrl}/Export`, query, false, filename);
  },
}
export default api;
