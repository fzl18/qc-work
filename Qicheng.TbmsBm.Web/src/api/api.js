import { http } from '@/utils/http'
import store from '@/store'
const commonApi = {
  async getPermissions() {
    let id = localStorage.getItem('userId')
    if (!id) {
      console.warn('没有登录的用户，请登录')
      let { privileges, userPermissions } = {};
      return { userPermissions };
    }

    let userPermissions = JSON.parse(localStorage.getItem('userPermissions'));
    if (!userPermissions || !userPermissions.length) {
      let { userPermissions } = await http.get('api/common/GetEffectivePermissionOfCurrentUser', { userId: id })
      // store.commit('cachePermissions', { userPermissions })
      localStorage.setItem('userPermissions', JSON.stringify(userPermissions))
    }
    return { userPermissions }
  },
  async getUserPermissions() {
    let id = localStorage.getItem('userId');
    let { userPermissions } = await http.get('api/common/GetEffectivePermissionOfCurrentUser', { userId: id })
    return userPermissions
  },
  async getLocales() {
    let locales = JSON.parse(localStorage.getItem('locales'));
    if(!locales) {
      locales = await http.get('api/accounts/locales')
      localStorage.setItem('locales', JSON.stringify(locales));
    }
    return locales;
  },
  async getMainLoginUrl() {
    let mainLoginUrl = JSON.parse(localStorage.getItem('mainLoginUrl'));
    if(!mainLoginUrl) {
      mainLoginUrl = await http.get('api/common/getMainLoginUrl');
      localStorage.setItem('mainLoginUrl', JSON.stringify(mainLoginUrl));
    }
    return mainLoginUrl;
  },
  async getCommonData(data) {

    /**
			 * @params (object) data
			 * @example
			 * {
			 *  isIncludedCorporation: true, 是否包含法人信息
			 *  isIncludedCorporationAuthenticated: true  是否包含当前用户有权限的法人
                isIncludedAccountEntity: true,  是否包含利润中心信息
                isIncludedAccountEntityAuthenticated: true  是否包含当前用户有权限的利润中心
                isIncludedCommodityType: true,  是否包含品类信息
                isIncludedUnit: true, 是否包含单位
                isIncludedCurrency: true 是否包含币种
                isIncludedTradeAccount: true 是否包含资金账户
                isIncludedTradeAccountAuthenticated: true  当前用户有权限的法人下的资金账户
                isIncludedMarket: true  作价市场
                isIncludeCommodityTypeQuantityUnit: true 是否包含品类量单位
                isIncludedUnitConversion: true 重量单位转换关系
                isIncludedHedgePlanEnums: true  是否包含套保方案枚举
                isIncludeRiskExposuerEnums: true  是否包含风险敞口枚举对象
                isIncludedHedgeExecuteInstructionEnums: true 是否包含套保执行计划枚举
			 * }
			 */
    data = data || {}
    let param = ''
    Object.keys(data).forEach(p => {
      param += '&' + p + '=' + data[p]
    })
    let commonData = await http.get('api/common/getCommonData?' + param)
    return commonData
  }
}

export let api = commonApi
