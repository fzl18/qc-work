import Index from './index'
import List from './list'
import Manage from './manage'
// import Manage from './role-manage'
const router = {
    path: '/foreign-exchange-trade-record',
    name: 'foreignExchangeTradeRecord',
    redirect: { name: 'foreignExchangeTradeRecordList' },
    component: Index,
    meta: {
        title: '外汇交易记录',
    },
    children: [{
            path: 'list',
            name: 'foreignExchangeTradeRecordList',
            component: List,
            meta: {
                title: '列表',
                permission:'H_SearchAcForexTradeRecord'
            }
        },
        {
            path: 'create',
            name: 'foreignExchangeTradeRecordCreate',
            component: Manage,
            meta: {
                title: '新增',
                permission:'H_CreateAcForexTradeRecord'
            }
        },
        {
            path: 'edit',
            name: 'foreignExchangeTradeRecordEdit',
            component: Manage,
            meta: {
                title: '编辑',
                permission:'H_UpdateAcForexTradeRecord'
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
