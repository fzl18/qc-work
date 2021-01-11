import index from '@/views/main'

export default {
  path: '/PriceDeviationLimit',
  name: 'PriceDeviationLimit',
  redirect: { name: 'PriceDeviationLimitList' },
  component: index,
  meta: {
    title: '下单价格限制',
  },
  children: [
    {
      path: 'list',
      name: 'PriceDeviationLimitList',
      component: () => import('./index'),
      meta: {
        title: '下单价格限制列表',
      },
    }
  ]
}