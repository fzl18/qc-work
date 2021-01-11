import Index from './index'

const spotPricingInfo = {
  path: '/spot-pricing-info',
  name: 'spotPricingInfo',
  redirect: {
    name: 'spotPricingInfoList'
  },
  component: Index,
  meta: {
    title: '现货点价信息'
  },
  children: [{
    path: 'list',
    name: 'spotPricingInfoList',
    component: () => import('./list'),
    meta: {
      title: '列表',
      permission:'H_SearchAcSpotPricingRecord'
    }
  }, {
    path: 'create',
    name: 'spotPricingInfoCreate',
    component: () => import('./add'),
    meta: {
      title: '新增',
      permission:'H_CreateAcSpotPricingRecord'
    }
  }, {
    path: 'edit',
    name: 'spotPricingInfoEdit',
    component: () => import('./add'),
    meta: {
      title: '编辑',
      permission:'H_UpdateAcSpotPricingRecord'
    },
    props: route => {
      return {
        id: route.query.id
      }
    }
  }]
}

export default spotPricingInfo
