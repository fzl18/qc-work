import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = 'ac-spot-tail-diffrence'
    // ifApi for instrument feed Api
const api = {
    async getCommonData() {
        let commondata = await http.get(`${baseUrl}/getcommondata`);
        return commondata;
    },
    async list(query, pagination) {
        let params = utils.cleanEmpty({...query, isCancelToken: true, pagination});
        let result = http.get(`${baseUrl}/list`, params);
        return result;
    },
    async getById(id) {
        let item = http.get(`${baseUrl}/${id}`);
        return item;
    },
    async save(data) {
        await http.post(`${baseUrl}`, data);
    },
    async delete(id) {
        await http.delete(`${baseUrl}/${id}`);
    },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/export`, query, false, filename);
    },
    async edit(data){
        return await http.put(`${baseUrl}`,data);
    },
    async multDelete(ids) {
        return await http.post(`${baseUrl}/multDelete`,ids);
    },
}

export default api
