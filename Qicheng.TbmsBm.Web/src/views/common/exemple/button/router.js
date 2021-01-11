import i18n from '@/i18n'

export default {
  index: 20,
  path: '/button',
  name: 'button',
  redirect: { name: 'buttonlist' },
  meta: {
    title: '按钮',
  },
  children: [
    {
      path: 'buttonlist',
      name: 'buttonlist',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}