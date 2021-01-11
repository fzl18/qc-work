export default {
  path: '/TradeAccountConfig',
  name: 'TradeAccountConfig',
  redirect: { name: 'TradeAccountConfigList' },
  meta: {
    title: '资金账户配置'
  },
  children: [
    {
      path: 'list',
      name: 'TradeAccountConfigList',
      component: () => import('./index'),
      meta: {
        title: '列表'
      }
    },
    {
      path: 'configEdit',
      name: 'TradeAccountConfigEdit',
      component: () => import('./configEdit'),
      meta: {
        title: '添加'
      }
    }
  ]
}
