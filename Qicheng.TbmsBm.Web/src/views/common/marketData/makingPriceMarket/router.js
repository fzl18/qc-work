import index from '@/views/main'
// import i18n from '@/i18n'

export default {
  index: 10,
  path: '/makingPriceMarket',
  name: 'makingPriceMarket',
  redirect: { name: 'makingPriceMarketList' },
  component: index,
  meta: {
    title: '作价市场',
  },
  children: [
    {
      path: 'list',
      name: 'makingPriceMarketList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}