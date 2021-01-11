import index from '@/views/main'
// import i18n from '@/i18n'

export default {
  index: 30,
  path: '/standerdInstrument',
  name: 'standerdInstrument',
  redirect: { name: 'standerdInstrumentList' },
  component: index,
  meta: {
    title: '标准合约',
  },
  children: [
    {
      path: 'list',
      name: 'standerdInstrumentList',
      component: () => import('./index'),
      meta: {
        title: '列表',
      }
    },
    {
      path: 'create',
      name: 'tradingStrategiesCreate',
      component: () => import('./edit'),
      meta: {
        title: '添加',
      }
    },
    {
      path: 'edit',
      name: 'tradingStrategiesEdit',
      component: () => import('./edit'),
      meta: {
        title: '修改',
      }
    }
  ]
}