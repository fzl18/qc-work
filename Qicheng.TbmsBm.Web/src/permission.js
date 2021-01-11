import router from './router'
import store from './store'
// import { utils } from '@/utils/utils'
import i18n from '@/i18n/index'

let path
router.beforeEach(async(to, from, next) => {
  let token = localStorage.getItem('token') || '888'
  // let activeMenu = to.meta.activeMenu || ''
  // store.commit('setActiveMenu', activeMenu)
  let title = to.meta.title || i18n.t('index');
  if (title) {
    let parentRouter = to.matched[1] ?  to.matched[1] : ''
    window.document.title = parentRouter && parentRouter.meta && parentRouter.meta.title
      ? `${parentRouter.meta.title}-${title}`
      : title;
  }
  if (token) {
    if (to.path === '/login' || to.path === '/fastlogin') {
      // next({path: '/'})
    } else {
      const hasRoles = store.state.permission.routeInit
      if (hasRoles) {
        path =  to.matched[1] ?  to.matched[1].path : ''
        sessionStorage.setItem('page',  path)
        next()
      } else {
        try {
          // 触发获取用户权限列表
          // await store.dispatch('user/getUserPermissions')
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          router.addRoutes(accessRoutes)
          next({...to, replace: true})
        } catch (error) {
          console.log(error)
        }
      }
    }
  } else {
    // if(!to.query.token) {
    // const MODULE = 16;
    // let currentRouter = to.fullPath;
    // let host = window.location.host;
    // var returnUrl = `http://${host}/fastlogin?redirect=${currentRouter}`;
    // let mainLoginUrl = await store.dispatch('getMainLoginUrl')
    // let newUrl =
    //   mainLoginUrl +
    //   utils.param({
    //     'module': MODULE,
    //     returnUrl,
    //   });
    // window.location.href = newUrl;
    // } else {
    next()
    // }
  }
})

router.afterEach((to, from) => {
  if (from.matched[1]) {
    if (path !== (from.matched[1].path)) {
      sessionStorage.removeItem('querys')
    }
  }
})