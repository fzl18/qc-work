import { http } from '@/utils/http';
import { utils } from '@/utils/utils';

const baseUrl = 'AcInterSpreadMarginRate';
const api = {

  async getCommonData() {
    return await http.get(`${baseUrl}/GetCommonData`);
  },

  async list(query, pagination) {
    let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
    return http.get(`${baseUrl}/list`, params);
  },

  async getDetail(obj) {
    return http.get(`${baseUrl}/GetByKeys`, obj, true);
  },
  
  async getAcMarginTierCount(obj) {
    return http.post(`${baseUrl}/GetAcMarginTierCount`, obj, true);
  },

  async save(data) {
    await http.post(`${baseUrl}/save`, data);
  },

  async delete(id) {
    await http.post(`${baseUrl}/RemoveById/${id}`);
  },

  async batchDelete(ids) {
    await http.post(`${baseUrl}/MultiDelete`, ids);
  },

  async exportExcel(query, filename) {
    return await http.download(`${baseUrl}/Export`, query, false, filename);
  }

};

export default api;
