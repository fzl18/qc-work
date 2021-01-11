
import Index from '@/index.vue';
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 1000,
  path: '/exemple',
  name: 'exemple',
  component: Index,
  meta: {
    title: '示例',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}