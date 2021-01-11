import Index from './index'
import List from './list'
import Manage from './manage'
// import Manage from './role-manage'
const router = {
    path: '/spot-trade-record',
    name: 'SpotTradeRecord',
    redirect: { name: 'SpotTradeRecordList' },
    component: Index,
    meta: {
        title: '现货交易记录',
    },
    children: [{
        path: 'list',
        name: 'SpotTradeRecordList',
        component: List,
        meta: {
            title: '列表',
            permission: 'H_SearchAcSpotTradeRecord'
        }
    },
    {
        path: 'create',
        name: 'SpotTradeRecordCreate',
        component: Manage,
        meta: {
            title: '新增',
            permission:'H_CreateAcSpotTradeRecord'
        }
    },
    {
        path: 'edit',
        name: 'SpotTradeRecordEdit',
        component: Manage,
        meta: {
            title: '编辑',
            permission:'H_UpdateAcSpotTradeRecord'
        },
        props: route => {
            return {
                id: route.query.id
            }
        }
    }]
}

export default router
