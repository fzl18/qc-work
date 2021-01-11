import Index from './index'
import List from './list'
import Manage from './manage'
const router = {
    path: '/account-equity-allocation',
    name: 'AccountEquityAllocation',
    redirect: { name: 'AccountEquityAllocationList' },
    component: Index,
    meta: {
        title: '账户权益配置',
    },
    children: [{
            path: 'list',
            name: 'AccountEquityAllocationList',
            component: List,
            meta: {
                title: '列表',
                permission:'H_SearchAcTradeAccountEquityConfig'
            }
        },
        {
            path: 'create',
            name: 'AccountEquityAllocationCreate',
            component: Manage,
            meta: {
                title: '新增',
                permission:'H_CreateAcTradeAccountEquityConfig'
            }
        },
        {
            path: 'edit',
            name: 'AccountEquityAllocationEdit',
            component: Manage,
            meta: {
                title: '编辑',
                permission:'H_UpdateAcTradeAccountEquityConfig'
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
