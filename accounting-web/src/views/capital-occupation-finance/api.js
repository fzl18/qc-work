import { http } from '@/utils/http'
const baseUrl = 'CapitalOccupation';
const api = {
    async list(query) {
        let params = {...query , isCancelToken: true}
        return await http.get(`${baseUrl}/ListHistory`, params);
    },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/ExportHistory`, query, false, filename);
    },
}
export default api;