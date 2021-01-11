import { http } from '@/utils/http'

const ProfitApi = {
    async search(query, pagination) {
        let params = {...query, pagination, isCancelToken: true };
        return await http.get('profit/list', params);
    },
    async getMarketDetail(query) {
        return await http.get('profit/MarketList', query);
    },
    async getExcahngeDetail(query) {
        return await http.post('profit/ExcahngeRateList', query);
    },
    async exportExcel(query, filename) {
        return await http.download('profit/Export', query, false, filename);
    }
}
export default ProfitApi;