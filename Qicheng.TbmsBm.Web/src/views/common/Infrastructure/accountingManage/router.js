import index from '@/views/main'
// import i18n from '@/i18n'

export default {
  index: 20,
  path: '/accounting',
  name: 'accounting',
  redirect: { name: 'accountingList' },
  component: index,
  meta: {
    title: '利润中心管理',
  },
  children: [
    {
      path: 'list',
      name: 'accountingList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      }
    },
    {
      path: 'create',
      name: 'accountingCreate',
      component: () => import('./edit'),
      meta: {
        title: '添加',
      }
    }
  ]
}
