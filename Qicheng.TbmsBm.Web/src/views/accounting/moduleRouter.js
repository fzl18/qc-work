
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 40,
  path: '/accountingConfig',
  name: 'accountingConfig',
  meta: {
    title: '清算配置',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}
