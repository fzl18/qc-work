
import Index from '@/index.vue';
import CreateRoute from '@/utils/createRoute'
const subRoutes = require.context('./', true, /router.js$/)
export default {
  index: 10,
  path: '/futuresOperation',
  name: 'futuresOperation',
  meta: {
    title: '期货平台运维',
    icon: 'md-menu'
  },
  children: CreateRoute(subRoutes)
}