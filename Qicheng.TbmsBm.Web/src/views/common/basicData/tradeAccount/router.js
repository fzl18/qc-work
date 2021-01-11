import index from '@/views/main'
import i18n from '@/i18n'
export default {
  path: '/tradeAccount',
  name: 'tradeAccount',
  redirect: { name: 'tradeAccountList' },
  component: index,
  meta: {
    title: '资金账户',
  },
  children: [
    {
      path: 'list',
      name: 'tradeAccountList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      }
    }
  ]
}
