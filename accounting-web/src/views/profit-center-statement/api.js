import { http } from '@/utils/http'
const baseUrl = 'AcProfitCenterStatement';
const api = {
    async list(query) {
        let params = {...query, isCancelToken: true }
        return await http.get(`${baseUrl}/List`, params);
    },
    async getCommonData(query) {
        return await http.get(`${baseUrl}/GetCommonData`);
    },
    // async getMarketDetail(query) {
    //     return await http.get('CapitalOccupationFuture/MarketList', query);
    // },
    // async getExcahngeDetail(query) {
    //     return await http.post('CapitalOccupationFuture/ExcahngeRateList', query);
    // },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/Export`, query, false, filename);
    },
}
export default api;