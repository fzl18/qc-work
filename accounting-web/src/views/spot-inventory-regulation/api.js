import { http } from '@/utils/http'
const baseUrl = 'SpotInventoryAdjustmentController';
const api = {
    async list(query) {
        let params = {...query }
        return await http.get(`${baseUrl}/ReportList`, params);
    },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/Export`, query, false, filename);
    },
}
export default api;