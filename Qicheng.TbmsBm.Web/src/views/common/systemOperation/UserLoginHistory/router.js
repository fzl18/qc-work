import index from '@/views/main'
// import i18n from '@/i18n/index'
export default {
  path: '/UserLoginHistory',
  name: 'UserLoginHistory',
  redirect: { name: 'UserLoginHistoryList' },
  component: index,
  meta: {
    title: '用户登录历史',
  },
  children: [
    {
      path: 'list',
      name: 'UserLoginHistoryList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}