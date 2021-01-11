import { http } from '@/utils/http';

const StageProfitApi = {
  async search (query) {
    return await http.get('Report/GetStageProfitReport', query);
  },
  async getCommonData () {
    return await http.get('report/getcommondata');
  }
};
export default StageProfitApi;
