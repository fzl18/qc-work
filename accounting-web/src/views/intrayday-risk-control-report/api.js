import { http } from "@/utils/http";
import { utils } from "@/utils/utils";
const baseUrl = "/IntraydayRiskControl";
const baseUrl2 = "/DepositRate";
// ifApi for instrument feed Api
const api = {
    async getCommonData() {
        let commondata = await http.get(`${baseUrl}/getcommondata`);
        return commondata;
    },

    async listCancelOrderCount(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/ListCancelOrderCount`, params);
        return result;

    },

    async getOriginalFeeReport(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/GetOriginalFeeReport`, params);
        return result;

    },

    async listFundStatus(query) {
        let params = utils.cleanEmpty({ ...query });
        let result = http.get(`${baseUrl}/ListFundStatus`, params);
        return result;
    },
    async listAccountPosition(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/ListAccountPosition`, params);
        return result;
    },
    async listPortfolioContractPosition(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination,isCancelToken: true });
        let result = http.get(
            `${baseUrl}/ListPortfolioContractPosition`,
            params
        );
        return result;
    },
    // 利润中心持仓汇总
    async listAccountPositionList(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/ListPC_AccountPosition`, params);
        return result;
    },
    // 利润中心持仓明细
    async listAccountPositionDetail(query) {
        let params = utils.cleanEmpty({ ...query });
        let result = http.get(`${baseUrl}/ListPC_AccountPositionDetail`, params);
        return result;
    },
    // 利润中心盈亏汇总
    async listPC_ProfitLoss(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/ListPC_ProfitLoss`, params);
        return result;
    },
    // 利润中心盈亏明细
    async listPC_ProfitLossDetail(query) {
        let params = utils.cleanEmpty({ ...query });
        let result = http.get(`${baseUrl}/ListPC_ProfitLossDetail`, params);
        return result;
    },
    // 利润中心盈亏修改
    async savePC_ProfitLossDetails(data) {
        return await http.post(`${baseUrl}/savePC_ProfitLossDetails`, data);
    },
    async exportExcel(query, filename) {
        return await http.download('IntraydayRiskControl/ExportOriginalFee', query, false, filename);
    },
    async DepositRateList(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl2}/List`, params);
        return result;
    },
    async exportToExcel(query, filename) {
        return await http.download('/DepositRate/Export', query, false, filename);
    },
    async ListForeignAccountCashReportList(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/ListForeignAccountCashReport`, params);
        return result;
    },
    async savePC_ProfitLoss(data) {
        return await http.post(`${baseUrl}/savePC_ProfitLoss`, data);
    }
};

export default api;
