import Index from '@/index.vue';
// import i18n from '../i18n';
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('../views', true, /moduleRouter.js$/)

export const asyncRoutes = CreateRoute(subRoutes)
