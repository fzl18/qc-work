import Index from './index'
import List from './list'
import Manage from './manage'

const router = {
  path: '/external-settlement-time',
  name: 'ExternalSettlementTime',
  redirect: { name: 'ExternalSettlementTimeList' },
  component: Index,
  meta: {
    title: '外盘结算时间',
  },
  children: [
    {
      path: 'list',
      name: 'ExternalSettlementTimeList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcTradeSettlementDateConfig'
      }
    },
    {
      path: 'create',
      name: 'ExternalSettlementTimeCreate',
      component: Manage,
      meta: {
        title: '新增',
        permission: 'H_CreateAcTradeSettlementDateConfig'
      }
    },
    {
      path: 'edit',
      name: 'ExternalSettlementTimeEdit',
      component: Manage,
      meta: {
        title: '编辑',
        permission: 'H_UpdateAcTradeSettlementDateConfig'
      },
      props: route => {
        return {
          id: route.query.id
        }
      }
    }
  ]
}

export default router
