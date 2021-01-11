import i18n from '@/i18n'

export default {
  path: '/table',
  name: 'table',
  redirect: { name: 'tablelist' },
  meta: {
    title: '表格',
  },
  children: [
    {
      path: 'tablelist',
      name: 'tablelist',
      component: () => import('./index'),
      meta: {
        title: '列表',
      },
    }
  ]
}