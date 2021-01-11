// import i18n from '@/i18n'

export default {
  index: 30,
  path: '/profitCenterAuth',
  name: 'profitCenterAuth',
  redirect: { name: 'profitCenterAuthList' },
  meta: {
    title: '利润中心授权',
  },
  children: [
    {
      path: 'list',
      name: 'profitCenterAuthList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}