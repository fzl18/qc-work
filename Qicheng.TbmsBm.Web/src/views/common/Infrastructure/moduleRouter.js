
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 10,
  path: '/Infrastructure',
  name: 'Infrastructure',
  meta: {
    title: '组织架构',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}