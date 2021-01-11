export default {
  path: '/Quantity',
  name: 'Quantity',
  redirect: { name: 'QuantityList' },
  hidden: true,
  meta: {
    title: '量管理'
  },
  children: [
    {
      path: 'list',
      name: 'QuantityList',
      component: () => import('./index'),
      meta: {
        title: '列表'
      }
    },
    {
      path: 'add',
      name: 'QuantityAdd',
      component: () => import('./add'),
      meta: {
        title: '添加'
      }
    }
  ]
}
