import { http } from '@/utils/http';
import { utils } from '@/utils/utils';

const baseUrl = 'StatementReviewReport/';
const api = {

  async getCommonData() {
    return await http.get(`${baseUrl}GetCommonData`);
  },

  async list(query) {
    let params = utils.cleanEmpty(query);
    return http.get(`${baseUrl}List`, params, true);
  },

  async listDataReview(query) { //数据复核列表
    return http.get(`${baseUrl}ListDataReview`, query, true);
  },
  
  async listDataDetailReview(query) { // 数据复核成交明细
    return http.get(`${baseUrl}ListDataDetailReview`, query, true);
  },
  
  async listPositionDetailReview(query) { //数据复核持仓明细
    return http.get(`${baseUrl}ListPositionDetailReview`, query, true);
  },

  async listStatementPnLReviewDetail(query) { //盈亏复核明细
    return http.get(`${baseUrl}ListStatementPnLReviewDetail`, query, true);
  },

  async listStatementEquityCompareDetail(query) { //结算单权益复核明细
    return http.get(`${baseUrl}ListStatementEquityCompareDetail`, query, true);
  },

  async calcStatementReview(query) { //重算
    return http.get(`${baseUrl}CalcStatementReview`, query, true);
  },

};

export default api;