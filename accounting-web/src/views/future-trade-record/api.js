import { http } from "@/utils/http";
import { utils } from "@/utils/utils";
const baseUrl = "/FutureTradeRecord";

const api = {
    async getCommonData() {
        let commondata = await http.get(`${baseUrl}/getcommondata`);
        return commondata;
    },
    async getClearingFeeData(data) {
        let result = await http.get(`${baseUrl}/CalculateCommission`, data);
        return result;
    },
    async save(data) {
        await http.post(`${baseUrl}/save`, data);
    },
    async list(query, pagination) {
        let params = utils.cleanEmpty({ ...query, pagination,isCancelToken:true});
        let result = http.get(`${baseUrl}/list`, params);
        return result;
    },
    async getById(id) {
        let item = http.get(`${baseUrl}/get/${id}`);
        return item;
    },
    async delete(id) {
        await http.post(`${baseUrl}/delete/${id}`);
    },
    async exportExcel(query, filename) {
        return await http.download(
            "FutureTradeRecord/Export",
            query,
            false,
            filename
        );
    },
    async getFutureRecord() {
        return await http.get(`${baseUrl}/getFutureRecord`);
    },
    async multModify(query) {
        return await http.post(`${baseUrl}/multModify`, query);
    },
    async multDelete(ids) {
        return await http.post(`${baseUrl}/multDelete`, ids);
    },

    async addDoubleData(data) {
        return await http.post(`${baseUrl}/addDoubleData`, data);
    }
};

export default api;
