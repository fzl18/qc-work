import index from '@/views/main'
// import i18n from '@/i18n/index'
export default {
  path: '/CompanyGroup',
  name: 'CompanyGroup',
  redirect: { name: 'CompanyGroupList' },
  component: index,
  meta: {
    title: '法人组配置',
  },
  children: [
    {
      path: 'list',
      name: 'CompanyGroupList',
      component: () => import('./index'),
      meta: {
        title: '法人组配置列表',
      },
    }
  ]
}