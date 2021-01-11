
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 30,
  path: '/marketData',
  name: 'marketData',
  meta: {
    title: '市场数据',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}