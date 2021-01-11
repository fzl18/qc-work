import i18n from '@/i18n'

export default {
  path: '/privilege',
  name: 'privilege',
  redirect: { name: 'privilegelist' },
  meta: {
    title: '权限or合约弹框',
  },
  children: [
    {
      path: 'privilegelist',
      name: 'privilegelist',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}