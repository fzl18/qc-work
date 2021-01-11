import i18n from '@/i18n'

export default {
  index: 20,
  path: '/Commodities',
  name: 'Commodities',
  redirect: { name: 'CommoditiesList' },
  meta: {
    title: '品种管理',
  },
  children: [
    {
      path: 'list',
      name: 'CommoditiesList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    },
    {
      path: 'add',
      name: 'CommoditiesAdd',
      component: () => import('./add'),
      meta: {
        title: '添加',
      },
    },
    {
      path: 'edit',
      name: 'CommoditiesEdit',
      component: () => import('./add'),
      meta: {
        title: '编辑',
      },
    },
    {
      path: 'view',
      name: 'CommoditiesView',
      component: () => import('./detail'),
      meta: {
        title: '详情',
      },
    }
  ]
}
