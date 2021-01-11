import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = 'AcStatementRecord'
    // ifApi for instrument feed Api
const api = {
    async getCommonData() {
        let commondata = await http.get(`${baseUrl}/getcommondata`);
        return commondata;
    },
    async list(query, pagination) {
        let params = utils.cleanEmpty({...query, pagination,isCancelToken:true });
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
        return await http.download(`${baseUrl}TradePricing/Export`, query, false, filename);
    },
    async Import() {
        return await http.download(`${baseUrl}/Import`, query, false, filename);
    },
    async querySettlementPriceQuotationList(query){
        return await http.get(`${baseUrl}/querySettlementPriceQuotationList`,query);
    },
    async save(query){
        return await http.post(`${baseUrl}/SaveSettlementPriceQuotation`,query);
    }
}

export default api