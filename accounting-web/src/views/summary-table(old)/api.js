import { http } from '@/utils/http'

const PositionSpotApi = {
    async search(query) {
        return await http.get('Report/GetRiskControlLogReport', query);
    },
    // async getMarketDetail(query) {
    //     return await http.get('positionspot/MarketList', query);
    // },
    // async exportExcel(query, filename) {
    //     return await http.download('positionspot/Export', query, false, filename);
    // }
}
export default PositionSpotApi;