import { http } from '@/utils/http';
import axios from 'axios';

const baseUrl = 'acStressTest/';

const api = {
  async getCommonData() {
    return await http.get(`${baseUrl}GetCommonData`);
  },

  /**
   * 生成压测指标
   * @param data
   * @return {Promise<*>}
   */
  async generatePressureMeasureIndicators(data) {
    return http.post(`${baseUrl}GenarateIndicatorList`, data, false);
  },

  /**
   * 开始测算功能-生成压测报表
   * @param data
   * @return {Promise<void>}
   */
  async getStressTestReport(data) {
    return await http.post(`${baseUrl}GetStressTestReport`, data);
  },

  /**
   * 导出压测报表
   * @param data
   * @return {Promise<*>}
   */
  async exportExcel(data) {
    return await http.downloadPost(`${baseUrl}Export`, data, true)
  }

};

export default api;