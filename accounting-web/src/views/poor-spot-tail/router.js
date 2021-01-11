import Index from './index'
import List from './list'
import Manage from './manage'
// import Manage from './role-manage'
const router = {
    path: '/poor-spot-tail',
    name: 'poorSpotTail',
    redirect: { name: 'poorSpotTailList' },
    component: Index,
    meta: {
        title: '现货尾差信息',
    },
    children: [{
        path: 'list',
        name: 'poorSpotTailList',
        component: List,
        meta: {
            title: '列表',
            permission: 'H_SearchAcSpotTailDiffrenceInfo'
        }
    },
    {
        path: 'create',
        name: 'poorSpotTailEdit',
        component: Manage,
        meta: {
            title: '新增',
            permission:'H_CreateAcSpotTailDiffrenceInfo'
        }
    },
    {
        path: 'edit',
        name: 'poorSpotTailEdit',
        component: Manage,
        meta: {
            title: '编辑',
            permission:'H_UpdateAcSpotTailDiffrenceInfo'
        },
        props: route => {
            return {
                id: route.query.id
            }
        }
    }]
}

export default router
