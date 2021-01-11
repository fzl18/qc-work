import { http } from '@/utils/http';
import { utils } from '@/utils/utils';

const baseUrl = 'AcStatementFutureTradeRecord/';

const api = {

  async getCommonData() {
    return await http.get(`${baseUrl}GetCommonData`);
  },

  async list(query, pagination) {
    let params = utils.cleanEmpty({ ...query, pagination, isCancelToken:true});
    return http.get(`${baseUrl}list`, params, false);
  },

  async getDetail(id) {
    return http.get(`${baseUrl}Get/${id}`);
  },

  async save(data) {
    await http.post(`${baseUrl}Save`, data);
  },

  async batchEdit(data) {
    return await http.post(`${baseUrl}/multModify`, data);
  },

  async delete(id) {
    await http.post(`${baseUrl}Delete/${id}`);
  },

  async batchDelete(ids) {
    await http.post(`${baseUrl}MultDelete`, ids);
  },

  async exportExcel(query, filename) {
    return await http.download(`${baseUrl}Export`, query, false, filename);
  }

};

export default api;
