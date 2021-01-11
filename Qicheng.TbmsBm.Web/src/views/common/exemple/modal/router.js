import i18n from '@/i18n'

export default {
  path: '/modal',
  name: 'modal',
  redirect: { name: 'modallist' },
  meta: {
    title: '弹框',
  },
  children: [
    {
      path: 'modallist',
      name: 'modallist',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}