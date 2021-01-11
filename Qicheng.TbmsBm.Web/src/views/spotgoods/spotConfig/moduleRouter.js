
import Index from '@/index.vue';
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 10,
  path: '/spotConfig',
  name: 'spotConfig',
  meta: {
    title: '现货配置',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}