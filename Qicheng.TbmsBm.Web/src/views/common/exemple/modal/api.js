import { http } from '@/utils/http';

const baseUrl = '';
const api = {
  // 保值信息汇总
  async GetCommoditiesTreeList (query) {
    return await http.get(`${baseUrl}/CommoditiesTree/GetCommoditiesTreeList`, query, false);
  },
};
export default api;
