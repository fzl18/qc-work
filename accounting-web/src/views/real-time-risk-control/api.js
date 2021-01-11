import { http } from '@/utils/http'

const CostApi = {
    async GetRiskWarningExceptionMessage(query, pagination) {
        return await http.get('/IntraydayRiskControl/GetRiskWarningExceptionMessage');
    },
    async GetRiskWarningMessage(query, pagination) {
        return await http.get('/IntraydayRiskControl/GetRiskWarningMessage', '', false);
    }
}
export default CostApi;