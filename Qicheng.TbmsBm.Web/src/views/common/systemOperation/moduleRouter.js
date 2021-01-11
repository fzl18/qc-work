
import Index from '@/index.vue';
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 30,
  path: '/systemOperation',
  name: 'systemOperation',
  component: Index,
  meta: {
    title: '系统运维',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}