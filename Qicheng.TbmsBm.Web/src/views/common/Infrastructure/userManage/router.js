import index from '@/views/main'
import i18n from '@/i18n'
export default {
  path: '/userManage',
  name: 'userManage',
  redirect: { name: 'userManageList' },
  component: index,
  meta: {
    title: '用户管理',
  },
  children: [
    {
      path: 'list',
      name: 'userManageList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}
