import { http } from '@/utils/http'
import { utils } from '@/utils/utils';
const baseUrl = '/AcAccountBenefitsConfig'
const api = {
    async getCommonData() {
        return await http.get(`${baseUrl}/GetCommonData`);
    },

    async list(query, pagination) {
        let params = utils.cleanEmpty({...query, pagination, isCancelToken: true });
        let result = http.get(`${baseUrl}/list`, params);
        return result;
    },
    async getBenefitsTypeList() {
        let result = http.get(`${baseUrl}/GetBenefitsTypeList`);
        return result;
    },
    async getById(id) {
        let item = http.get(`${baseUrl}/GetById/${id}`);
        return item;
    },
    async toggleBenefitsTypeStatus(id) {
        let data = http.post(`${baseUrl}/SetDisabledStatusForBenefitsType/${id}`);
        return data;
    },
    async delete(id) {
        await http.post(`${baseUrl}/delete/${id}`);
    },
    async save(data) {
        await http.post(`${baseUrl}/SaveTradeAccountEquityConfig`, data);
    },
    async saveBenefitsTypeConfig(data) {
        await http.post(`${baseUrl}/SaveBenefitsTypeConfig`, data);
    },
    async exportExcel(query, filename) {
        return await http.download(`${baseUrl}/Export`, query, false, filename);
    }
}

export default api
