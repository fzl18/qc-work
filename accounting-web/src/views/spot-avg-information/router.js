import Index from './index'

const spotAvgInformation = {
    path: "/spot-avg-information",
    name: "spotAvgInformation",
    redirect: {
        name: "spotAvgInformationList"
    },
    component: Index,
    meta: {
        title: "现货均价信息"
    },
    children: [{
        path: "list",
        name: "spotAvgInformationList",
        component: () => import('./list'),
        meta: {
            title: '列表',
            permission:'H_SearchAcSpotAveragePricingRecord'
        }
    },{
        path: "create",
        name: "spotAvgInformationCreate",
        component: () => import('./edit'),
        meta: {
            title: '新增',
            permission:'H_CreateAcSpotAveragePricingRecord'
        }
    },{
        path: "edit",
        name: "spotAvgInformationEdit",
        component: () => import('./edit'),
        meta: {
            title: '编辑',
            permission:'H_UpdateAcSpotAveragePricingRecord'
        }
    }]
}

export default spotAvgInformation
