export default {
  path: '/PaymentType',
  name: 'PaymentType',
  redirect: { name: 'PaymentTypeList' },
  meta: {
    title: '收支类型'
  },
  children: [
    {
      path: 'list',
      name: 'PaymentTypeList',
      component: () => import('./index'),
      meta: {
        title: '列表'
      }
    }
  ]
}
