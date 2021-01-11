// import i18n from '@/i18n/index'

export default {
  path: '/code',
  name: 'code',
  redirect: { name: 'codeList' },
  meta: {
    title: '系统编号',
  },
  children: [
    {
      path: 'list',
      name: 'codeList',
      component: () => import('./index'),
      meta: {
        title: '系统编号列表',
      },
    }
  ]
}