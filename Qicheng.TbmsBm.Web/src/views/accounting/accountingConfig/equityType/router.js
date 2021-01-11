export default {
  path: '/EquityType',
  name: 'EquityType',
  redirect: { name: 'EquityTypeList' },
  meta: {
    title: '权益类型'
  },
  children: [
    {
      path: 'list',
      name: 'EquityTypeList',
      component: () => import('./index'),
      meta: {
        title: '列表'
      }
    },
    {
      path: 'add',
      name: 'EquityTypeAdd',
      component: () => import('./add'),
      meta: {
        title: '添加'
      }
    }
  ]
}
