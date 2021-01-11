import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = '/StatementProfitReport'
const api = {
  async getCommonData() {
    return await http.get(`${baseUrl}/GetCommonData`);
  },

  async list(query, pagination) {
    let params = utils.cleanEmpty({...query, pagination });
    let result = http.get(`${baseUrl}/list`, params);
    return result;
  }
}

export default api
