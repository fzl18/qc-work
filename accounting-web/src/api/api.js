import moment from 'moment';
import { Notice } from 'view-design';
import { http } from '@/utils/http';
import store from '@/store';

const commonApi = {
  async getCommonData(url, params, cacheKey) {
    if (!url) {
      // eslint-disable-next-line no-console
      console.error('无法查询Common Data');
      return;
    }
    url = url.toLowerCase();
    url = `${url}/getcommondata`;
    let urlKey = url.split('/').join('_');
    cacheKey = cacheKey || urlKey;
    let cachedCommonData = store.state.cachedCommonData[cacheKey];
    if (!cachedCommonData) {
      cachedCommonData = await http.get(url, params);
      let data = {
        key: cacheKey,
        commonData: cachedCommonData
      };
      store.commit('cacheCommonData', data);
    }
    return cachedCommonData;
  },

  async getPermissions(refresh) {
    let cachedPermissions = store.state.userPermissions;
    if (!cachedPermissions || refresh) {

      let { userPermissions } = await http.get(
        `/Common/GetEffectivePermissionOfCurrentUserForSettlement?userId=${localStorage.userId}&token=${localStorage.token}`
      ).catch(() => {
        Notice.error({
          title: '系统错误',
          desc: '获取用户权限失败'
        });
        cachedPermissions = [];
        store.commit('cacheUserPermissions', []);
      });
      store.commit('cacheUserPermissions', userPermissions);
      cachedPermissions = userPermissions;
    }
    return cachedPermissions;
  },

  async getPrivileges() {
    return [];
  },

  async getPrivilegesAndPermissions() {
    return [];
  },

  async getLocales() {
    return {};
  },
  async getMainLoginUrl() {
    let defaultUrl = 'http://localhost:59713/-TestC/Account/Login';
    let mainLoginUrl = JSON.parse(localStorage.getItem('mainLoginUrl'));
    if (!mainLoginUrl) {
      // mainLoginUrl = await http.get('api/common/getMainLoginUrl');
      // localStorage.setItem('mainLoginUrl', JSON.stringify(mainLoginUrl));
    }
    // main login url TBD
    return mainLoginUrl || defaultUrl;
  },

  /**
   * 配置复核天数, 结算日期区间
   * @return {Promise<Date[]>} [currentDate - <defaultStatementReviewDay>, currentDate]
   */
  async getDefaultStatementReviewDays() {
    const defaultStatementReviewDay = await http.get('Common/GetDefaultStatementReviewDays');
    return [moment().subtract(defaultStatementReviewDay, 'days').toDate(), moment().toDate()];
  },

  /**
   * 根据版本号获取具体合约并缓存
   * @returns {Promise<any>}
   */
  async getInstrument() {
    let version = localStorage.getItem('version')
    let localInstrument = JSON.parse(localStorage.getItem('instrument'))
    let instrument = await http.get('common/getInstrumentByVersion?version=' + version)
    if(instrument) {
      localStorage.setItem('version', instrument.version)
    }
    if(instrument.isNewVersion) {
      localStorage.setItem('instrument', JSON.stringify(instrument.result))
      localInstrument = instrument.result
    }
    return localInstrument
  },
};

export let api = commonApi;
