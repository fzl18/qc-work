// import i18n from '@/i18n'

export default {
  index: 10,
  path: '/currency',
  name: 'currency',
  redirect: { name: 'currencyList' },
  meta: {
    title: '币种管理',
  },
  children: [
    {
      path: 'list',
      name: 'currencyList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}