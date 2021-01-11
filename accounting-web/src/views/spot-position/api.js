import { http } from '@/utils/http'

const PositionSpotApi = {
    async search(query, pagination) {
        var params = {...query, pagination,isCancelToken:true };
        return await http.get('positionspot/list', params);
    },
    async getMarketDetail(query) {
        return await http.get('positionspot/MarketList', query);
    },
    async exportExcel(query, filename) {
        return await http.download('positionspot/Export', query, false, filename);
    }
}
export default PositionSpotApi;