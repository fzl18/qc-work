import i18n from '@/i18n'

export default {
  path: '/strategies',
  name: 'strategies',
  redirect: { name: 'strategiesList' },
  meta: {
    title: '策略管理',
  },
  children: [
    {
      path: 'list',
      name: 'strategiesList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },      
    },
    {
      path: 'create',
      name: 'strategiesCreate',
      component: () => import('./create'),
      meta: {
        title: '添加',
      },      
    },
    {
      path: 'edit',
      name: 'strategiesEdit',
      component: () => import('./create'),
      meta: {
        title: '修改',
      },      
    }
  ]
}