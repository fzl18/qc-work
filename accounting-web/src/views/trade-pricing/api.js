import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = 'TradePricing'
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
        let item = http.get(`${baseUrl}/get/${id}`);
        return item;
    },
    async save(data) {
        await http.post(`${baseUrl}/save`, data);
    },
    async delete(id) {
        await http.post(`${baseUrl}/delete/${id}`);
    },
    async exportExcel(query, filename) {
        return await http.download('TradePricing/Export', query, false, filename);
    },
    async multModify(query){
        return await http.post(`${baseUrl}/multModify`,query);
    },
    async multDelete(ids) {
        return await http.post(`${baseUrl}/multDelete`,ids);
    },
}

export default api
