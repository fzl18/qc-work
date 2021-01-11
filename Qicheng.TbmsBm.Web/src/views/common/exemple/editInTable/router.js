// import i18n from '@/i18n'

export default {
  index: 10,
  path: '/editInTable',
  name: 'editInTable',
  redirect: { name: 'editInTableList' },
  meta: {
    title: '表格内编辑',
  },
  children: [
    {
      path: 'list',
      name: 'editInTableList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}