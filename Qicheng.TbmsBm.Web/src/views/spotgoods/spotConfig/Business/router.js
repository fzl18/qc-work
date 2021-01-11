import index from '@/views/main'
import i18n from '@/i18n/index'

export default {
  path: '/business',
  name: 'business',
  redirect: { name: 'businessList' },
  component: index,
  meta: {
    title: '贸易业务',
  },
  children: [
    {
      path: 'list',
      name: 'businessList',
      component: () => import('./index'),
      meta: {
        title: '贸易业务列表',
      },
    }
  ]
}