import { http } from '@/utils/http'
const baseUrl = 'AcPositionForex';
const api = {
    async list(query) {
        let params = {...query,isCancelToken:true }
        return await http.get(`${baseUrl}/List`, params);
    },
    async getMarketDetail(query) {
        return await http.post(`${baseUrl}/ExcahngeRateList`, query);
    },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/Export`, query, false, filename);
    },
}
export default api;