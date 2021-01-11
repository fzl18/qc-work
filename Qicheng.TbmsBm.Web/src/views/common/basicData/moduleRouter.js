
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 10,
  path: '/basicData',
  name: 'basicData',
  meta: {
    title: '基础数据',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}