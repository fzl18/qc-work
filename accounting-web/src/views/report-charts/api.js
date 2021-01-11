import { http } from '@/utils/http';

const PositionSpotApi = {
    async getCommonData() {
        return await http.get('report/getcommondata');
    },
    async search(query) {
        return await http.get('report/GetComprehensiveReport', query);
    },
    async getMarketDetail(query) {
        return await http.get('positionspot/MarketList', query);
    },
    async exportExcel(query, filename) {
        return await http.download('positionspot/Export', query, false, filename);
    }
}
export default PositionSpotApi;
