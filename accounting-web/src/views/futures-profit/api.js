import { http } from '@/utils/http'
const baseUrl = 'Report';
const api = {
    async list(query) {
        let params = {...query, isCancelToken: true }
        return await http.get(`${baseUrl}/GetAcPnlReport`, params);
    },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/ExportAcPnlReport`, query, false, filename);
    },
}
export default api;