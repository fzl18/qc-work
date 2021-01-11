
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 10,
  path: '/futuresConfig',
  name: 'futuresConfig',
  meta: {
    title: '期货配置',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}