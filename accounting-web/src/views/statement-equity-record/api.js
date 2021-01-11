import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = '/ac-statement-ta-equity-records'
const api = {
    async getCommonData() {
        return await http.get(`${baseUrl}/common-data`);
    },

    async list(query, pagination) {
        let params = utils.cleanEmpty({...query, pagination, isCancelToken:true });
        let result = http.get(`${baseUrl}`, params);
        return result;
    },

    async getById(id) {
        let item = http.get(`${baseUrl}/${id}`);
        return item;
    },

    async delete(id) {
        await http.delete(`${baseUrl}/${id}`);
    },

    async create(data) {
        await http.post(`${baseUrl}`, data);
    },

    async save(data) {
        await http.put(`${baseUrl}/${data.id}`, data);
    },

    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/Export`, query, false, filename);
    }
}

export default api
