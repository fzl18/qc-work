// import i18n from '@/i18n/index'

export default {
  path: '/Corporation',
  name: 'Corporation',
  redirect: { name: 'corporationList' },
  meta: {
    title: '法人管理'
  },
  children: [
    {
      path: 'list',
      name: 'corporationList',
      component: () => import('./index'),
      meta: {
        title: '列表'
      }
    },
    {
      path: 'add',
      name: 'corporationAdd',
      component: () => import('./add'),
      meta: {
        title: '添加'
      }
    },
    {
      path: 'edit',
      name: 'corporationEdit',
      component: () => import('./add'),
      meta: {
        title: '修改'
      },
      props: route => {
        return {
          id: route.query.id
        }
      }
    }
  ]
}
