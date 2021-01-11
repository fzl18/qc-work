import index from '@/views/main'
// import i18n from '@/i18n/index'
export default {
  path: '/UserLoginLimit',
  name: 'UserLoginLimit',
  redirect: { name: 'UserLoginLimitList' },
  component: index,
  meta: {
    title: '用户登录限制',
  },
  children: [
    {
      path: 'list',
      name: 'UserLoginLimitList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}