import { http } from '@/utils/http';
import { utils } from '@/utils/utils';

const baseUrl = 'AcMarginRateConfig';
const api = {
  
  async getCommonData() {
    return await http.get(`${baseUrl}/GetCommonData`);
  },

  async list(query, pagination) {
    let params = utils.cleanEmpty({ ...query, pagination , isCancelToken: true});
    return http.get(`${baseUrl}/list`, params);
  },

  async getById(id) {
    return http.get(`${baseUrl}/GetById/${id}`);
  },

  async save(data) {
    await http.post(`${baseUrl}/SaveMarginRateConfig`, data);
  },

  async delete(id) {
    await http.post(`${baseUrl}/Delete/${id}`);
  },
  
  async batchDelete(ids) {
    await http.post(`${baseUrl}/MultiDelete`, ids);
  },

  async exportExcel(query, filename) {
    return await http.download(`${baseUrl}/Export`, query, false, filename);
  }

};

export default api;
