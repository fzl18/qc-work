import { http } from '@/utils/http'

const CostApi = {
    async search(query, pagination) {
        let params = {...query, pagination, isCancelToken: true };
        return await http.get('cost/list', params);
    },
    async getMarketDetail(query) {
        return await http.get('cost/MarketList', query);
    },
    async getExcahngeDetail(query) {
        return await http.post('cost/ExcahngeRateList', query);
    },
    async exportData(query, filename) {
        return await http.download('cost/Export', query, false, filename);
    }
}
export default CostApi;