import Vue from 'vue';
import Router from 'vue-router';
import i18n from '../i18n'
import Main from '@/views/main.vue';
import Login from '@/views/login/login.vue';
import FastLogin from '@/views/login/fastLogin.vue'
import Page404 from '@/views/404';
export const constantRoutes = [
  {
    path: '/',
    component: Main,
    meta: {
      title: ''
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: i18n.t('login')
    }
  },
  {
    path: '/fastlogin',
    name: 'fastlogin',
    component: FastLogin,
    props: route => {
      return {
        token: route.query.token,
        redirect: route.query.redirect
      }
    },
    meta: {
      title: i18n.t('fastLogin')
    }
  },
  {
    path: '/404',
    name: 'page404',
    meta: {
      title: i18n.t('404NotFound')
    },
    component: Page404
  }
]
Vue.use(Router);
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
// 路由配置
export default router
