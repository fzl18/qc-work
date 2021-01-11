import Index from './index'
import List from './list'
import Manage from './manage'
// import Manage from './role-manage'
const router = {
    path: '/other-payment-record',
    name: 'OtherPaymentRecord',
    redirect: { name: 'OtherPaymentRecordList' },
    component: Index,
    meta: {
        title: '其他收支记录',
    },
    children: [{
            path: 'list',
            name: 'OtherPaymentRecordList',
            component: List,
            meta: {
                title: '列表',
                permission:'H_SearchAcOtherPaymentRecord'
            }
        },
        {
            path: 'create',
            name: 'OtherPaymentRecordCreate',
            component: Manage,
            meta: {
                title: '新增',
                permission:'H_CreateAcOtherPaymentRecord'
            }
        },
        {
            path: 'edit',
            name: 'OtherPaymentRecordEdit',
            component: Manage,
            meta: {
                title: '编辑',
                permission:'H_UpdateAcOtherPaymentRecord'
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
