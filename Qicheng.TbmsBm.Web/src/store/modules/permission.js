import { constantRoutes } from '@/router'
import { asyncRoutes } from '@/router/asyncRoutes'
import { utils } from '@/utils/utils'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(menus) {
  return menus.filter(item => {

    // 非三级路由 有子路由的情况下递归处理
    if(item.children && item.children.length) {
      item.children = filterAsyncRoutes(item.children)
    }

    // 判断非三级路由是否有子路由
    if(item.children && item.children.length == 0) {

      return false
    }
    // 判断是否第三级路由 如果是第三级路由没有配置permission则不显示
    // if(!item.children && item.meta && !item.meta.permission) {
    //   return false
    // }

    // 判断第三级路由是否有权限
    if(!item.children) {
      if(item.meta && utils.hasPermission(item.meta.permission)) {
        return true
      } else {
        return false
      }
    }
    return true
  })
}
const state = {
  routes: [],
  addRoutes: [],
  routeInit: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.routeInit = true
  }
}

const actions = {
  generateRoutes({ commit }) {
    let accessedRoutes = filterAsyncRoutes(asyncRoutes)
    commit('SET_ROUTES', accessedRoutes)
    return [...accessedRoutes, { path: '*', redirect: '/404'}]
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
