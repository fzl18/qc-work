import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from '@/views/layout/Layout';

/**
 *  Note:
 *
 *  hidden: whether show this page.
 *
 *  route level code-splitting
 *  this generates a separate chunk (about.[hash].js) for this route
 *  which is lazy-loaded when the route is visited.
 **/

export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/p-404',
    component: () => import('@/views/errorPage/page-404'),
    hidden: true
  },
  {
    path: '/p-403',
    component: () => import('@/views/errorPage/page-403'),
    hidden: true
  },
  {
    path: '/change-password',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'changePassword',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/changePassword/index'),
        meta: { title: '修改密码', icon: 'dashboard' }
      }
    ],
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/tenant',
    component: Layout,
    meta: { title: '租户管理', icon: 'corporation' },
    children: [
      {
        path: 'corporation-manage',
        name: 'CorporationManage',
        component: () => import(/* webpackChunkName: "CorporationManage" */ '@/views/corporation-manage/index'),
        meta: { title: '企业管理', sectionCode: 'CorporationManage' }
      },
      {
        path: 'external-app',
        name: 'ExternalApp',
        component: () => import(/* webpackChunkName: "CorporationManage" */ '@/views/external-app/index'),
        meta: { title: '移动应用管理', sectionCode: 'TenantExternalApp' }
      },
      {
        path: 'tenant-external-app',
        name: 'TenantExternalApp',
        component: () => import(/* webpackChunkName: "CorporationManage" */ '@/views/tenant-external-app/index'),
        meta: { title: '移动租户管理', sectionCode: 'AppTenantManage' }
      },
      {
        path: 'db-instance-manage',
        name: 'DbInstanceManage',
        component: () => import(/* webpackChunkName: "CorporationManage" */ '@/views/db-instance-manage/index'),
        meta: { title: '数据库实例管理', sectionCode: 'DbInstanceManage' }
      }
    ]
  },
  {
    path: '/standard-data',
    component: Layout,
    redirect: '/standard-data/exchange',
    meta: { title: '基础数据管理', icon: 'standardData' },
    children: [
      {
        path: 'exchange',
        name: 'Exchange',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/exchange/index'),
        meta: { title: '交易所', sectionCode: 'Exchange' }
      },
      {
        path: 'trade-calendar',
        name: 'TradeCalendar',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/trade-calendar/index'),
        meta: { title: '交易日历', sectionCode: 'TradeCalendar' }
      },
      {
        path: 'commodity-type',
        name: 'CommodityType',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/commodityType/index'),
        meta: { title: '品类', sectionCode: 'CommodityType' }
      },
      {
        path: 'standard-contract',
        name: 'StandardContract',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/standard-contract/index'),
        meta: { title: '标准合约', sectionCode: 'InstrumentCategory' }
      },
      {
        path: 'qc-instrument',
        name: 'InstrumentIndex',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/qc-instrument/index'),
        meta: { title: '具体合约', sectionCode: 'Instrument' }
      },
      {
        path: 'industry-category',
        name: 'IndustryCategory',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/industry-category/index'),
        meta: { title: '行业类别', sectionCode: 'IndustryCategory' }
      },
      {
        path: 'unit-manage',
        name: 'UnitManage',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/unit-manage/index'),
        meta: { title: '单位管理', sectionCode: 'UnitManage' }
      },
      {
        path: 'measure-manage',
        name: 'MeasureManage',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/measure-manage/index'),
        meta: { title: '量管理', sectionCode: 'MeasureManage' }
      },
      {
        path: 'currency',
        name: 'Currency',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/currency/index'),
        meta: { title: '币种', sectionCode: 'Currency' }
      },
      {
        path: 'commodity',
        name: 'Commodity',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/commodity/index'),
        meta: { title: '品种', sectionCode: 'Commodity' }
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/brand/index'),
        meta: { title: '品牌', sectionCode: 'Brand' }
      },
      {
        path: 'specification',
        name: 'Specification',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/specification/index'),
        meta: { title: '物料', sectionCode: 'Specification' }
      },
      {
        path: 'broker',
        name: 'Broker',
        component: () => import(/* webpackChunkName: "StandardData" */ '@/views/broker/index'),
        meta: { title: '经纪公司', sectionCode: 'Broler' }
      }
    ]
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: Layout,
    redirect: '/subscription/market-data',
    meta: { title: '数据订阅', icon: 'subscribe' },
    children: [
      {
        path: 'market-data',
        name: 'marketData',
        component: () => import(/* webpackChunkName: "Subscription" */ '@/views/market-data/index'),
        meta: { title: '行情数据维护', sectionCode: 'MarketData' },
        alwaysShow: true
      },
    //   {
    //     path: 'data-push',
    //     name: 'SubscriptionDataPush',
    //     component: () => import(/* webpackChunkName: "Subscription" */ '@/views/subscription-data-push/index-new'),
    //     meta: { title: '订阅数据推送', sectionCode: 'SubscribeDataPush' }
    //   }
    ]
  },
  {
    path: '/trade-channel',
    name: 'TradeChannel',
    component: Layout,
    redirect: '/trade-channel/ctp-config',
    meta: { title: '交易通道管理', icon: 'tradeChannel' },
    children: [
      {
        path: 'ctp-config',
        name: 'CtpChannelConfig',
        component: () => import(/* webpackChunkName: "Main" */ '@/views/ctp-channel-config/index'),
        meta: { title: 'CTP通道配置', sectionCode: 'CtpConfiguration' },
        alwaysShow: true
      }
    ]
  },
  {
    path: '/system-devops',
    component: Layout,
    meta: { title: '系统运维', icon: 'systemConfig' },
    redirect: '/system-devops/user-manage',
    children: [
      {
        path: 'user-manage',
        name: 'UserManage',
        component: () => import(/* webpackChunkName: "SystemConfig" */ '@/views/user-manage/index'),
        meta: { title: '用户管理',subTitle: '', sectionCode: 'UserManage'},
      },
      {
        path: 'system-configurations',
        name: 'SystemConfigurations',
        component: () => import(/* webpackChunkName: "SystemConfig" */ '@/views/system-configurations/index'),
        meta: { title: '系统配置', sectionCode: 'SystemConfiguration' }
      },
      {
        path: 'system-logs',
        name: 'SystemLogs',
        component: () => import(/* webpackChunkName: "SystemConfig" */ '@/views/system-logs/index'),
        meta: { title: '系统操作日志', sectionCode: 'OperaionLog' }        
      },
      {
        path: 'trade-account-review',
        name: 'TradeAccountReview',
        component: () => import(/* webpackChunkName: "SystemConfig" */ '@/views/trade-account-review/index'),
        meta: { title: '资金账户复核', sectionCode: 'TradeAccountView' }        
      },
      {
        path: 'contract-review',
        name: 'ContractReview',
        component: () => import(/* webpackChunkName: "SystemConfig" */ '@/views/contract-review/index'),
        meta: { title: '合约数据复核', sectionCode: 'ContractDataView' }        
      }
    ]
  },
  { path: '*', redirect: '/p-404', hidden: true }
];

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: constantRoute
});
