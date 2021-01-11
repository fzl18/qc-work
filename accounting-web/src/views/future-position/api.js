import { http } from '@/utils/http'

const PositionFutureApi = {
    async search(query, pagination) {
        let params = {...query, pagination, isCancelToken:true }
        return await http.get('positionfuture/list', params);
    },
    async getPositionDetail(query) {
        return await http.get('positionfuture/GetPositionFutureDetails', query);
    },
    async getPositionExceptionRecords(query) {
        return await http.get('positionfuture/getPositionExceptionRecords', query);
    },
    async exportExcel(query, filename) {
        return await http.download('positionfuture/Export', query, false, filename);
    }
}
export default PositionFutureApi;