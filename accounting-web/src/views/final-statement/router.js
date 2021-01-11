import Index from './index'
import List from './list'
// import Manage from './role-manage'
const router = {
    path: '/final-statement',
    name: 'finalStatement',
    redirect: { name: 'finalStatementList' },
    component: Index,
    meta: {
        title: '结算单记录',
    },
    children: [{
        path: 'list',
        name: 'finalStatementList',
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchStatementRecord'
        }
    },
    {
        path: 'info/:id',
        name: 'finalStatementInfo',
        component: () => import('./info.vue'),
        meta: {
            title: '详情',
            permission:'H_SearchStatementRecord'
        }
    },
    ]
}

export default router
