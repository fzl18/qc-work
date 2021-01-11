import index from '@/views/main'
// import i18n from '@/i18n'

export default {
  path: '/brokerageCompany',
  name: 'brokerageCompany',
  redirect: { name: 'companyList' },
  component: index,
  meta: {
    title: '经纪公司',
  },
  children: [
    {
      path: 'list',
      name: 'companyList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}