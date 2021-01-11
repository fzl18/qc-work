export default {
  path: '/Units',
  name: 'Units',
  redirect: { name: 'UnitsList' },
  meta: {
    title: '单位管理'
  },
  children: [
    {
      path: 'list',
      name: 'UnitsList',
      component: () => import('./index'),
      meta: {
        title: '列表'
      }
    },
    {
      path: 'add',
      name: 'UnitsAdd',
      component: () => import('./add'),
      meta: {
        title: '添加'
      }
    },
    {
      path: 'add',
      name: 'UnitsAdd',
      component: () => import('./add'),
      meta: {
        title: '量管理'
      }
    }
  ]
}
