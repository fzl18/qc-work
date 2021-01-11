import { http } from '@/utils/http'

const PositionFutureApi = {
    async search(query, pagination) {
        let params = {...query, pagination }
        return await http.get('positionfutureaccount/list', params);
    },
    async getMarketDetail(query) {
        return await http.get('positionfutureaccount/MarketList', query);
    },
    async exportExcel(query, filename) {
        return await http.download('positionfutureaccount/Export', query, false, filename);
    }
}
export default PositionFutureApi;