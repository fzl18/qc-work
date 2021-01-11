// import i18n from '@/i18n'

export default {
  index: 40,
  path: '/specificInstrument',
  name: 'specificInstrument',
  redirect: { name: 'specificInstrumentList' },
  meta: {
    title: '具体合约',
  },
  children: [
    {
      path: 'list',
      name: 'specificInstrumentList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      }
    },
    {
      path: 'create',
      name: 'specificInstrumentCreate',
      component: () => import('./edit'),
      meta: {
        title: '添加',
      },
    },
    {
      path: 'edit',
      name: 'specificInstrumentUpdate',
      component: () => import('./edit'),
      meta: {
        title: '修改',
      },
    }
  ]
}
