import Vue from 'vue';
import { api } from '@/api/api';
import { Message } from 'view-design';
import goMainLogin from '@/utils/mainLogin';
import { utils } from '@/utils/utils';
import Router from 'vue-router';
import App from '@/App.vue';
import Main from '@/views/main.vue';
import Index from '@/views/index.vue';
import Home from '@/views/home.vue';
import StageProfit from '@/views/stage-profit/list';
import Login from '@/views/login/login.vue';
import FastLogin from '@/views/login/fastLogin.vue';
import Page404 from '@/views/404';
import Page403 from '@/views/403';
import spotPositionRouter from '@/views/spot-position/router';
import futureTradeRecordRouter from '@/views/future-trade-record/router';
import futurePositionRouter from '@/views/future-position/router';
import futureProfitRouter from '@/views/futures-profit/router';
import profitRouter from '@/views/profit/router';
import costRouter from '@/views/cost/router';

import poorSpotTail from '@/views/poor-spot-tail/router';
import spotTradeRecordRouter from '@/views/trade-pricing/router';
import otherPaymentRouter from '@/views/other-payment-record/router';
import spotAvgInformation from '@/views/spot-avg-information/router';
import spotPricing from '@/views/spot-pricing-info/router';

import capitalOccupationRouter from '@/views/capital-occupation/router';
import futuresCapitalOccupationRouter from '@/views/futures-capital-occupation/router';
import capitalOccupationCWRouter from '@/views/capital-occupation-finance/router';
import accountForeignExchangePositionRouter from '@/views/account-foreign-exchange-position/router';
import foreignExchangePositionRouter from '@/views/foreign-exchange-position/router';
import foreignExchangeTradeRecordRouter from '@/views/foreign-exchange-trade-record/router';
import SpotInventoryRegulationRouter from '@/views/spot-inventory-regulation/router';
import reportChartsRouter from '@/views/report-charts/router';
import summaryTableRouter from '@/views/summary-table/router';
import accountInterimProfitLossRouter from '@/views/account-Interim-profit-loss/router';
import intraydayRiskControlReportRouter from '@/views/intrayday-risk-control-report/router';
import commissionRateConfigurationRouter from '@/views/commission-rate-configuration/router';
import acMarginTierRouter from '@/views/ac-margin-tier/router';
import acInterSpreadMarginRateRouter from '@/views/ac-inter-spread-margin-rate/router';
import externalSettlementTimeRouter from '@/views/external-settlement-time/router';

import stressTestRouter from '@/views/stress-test/router';
import AcPurchasingCostRouter from '@/views/ac-purchasing-cost/router';

import accountEquityAllocationRouter from '@/views/account-equity-allocation/router';
import acMarginRateConfigurationRouter from '@/views/ac-margin-rate-configuration/router';

// import liveStreamRouter from "@/views/live-stream-update/router";
import realTimeRiskControlRouter from '@/views/real-time-risk-control/router';

import finalStatement from '@/views/final-statement/router';
import statementFutureTradeRouter from '@/views/statement-future-trade/router';
import statementEquityRecordRouter from '@/views/statement-equity-record/router';
import statementReviewReport from '@/views/statement-review-report/router';
import statementProfitRecord from '@/views/statement-profit-record/router';
import profitCenterStatement from '@/views/profit-center-statement/router';


Vue.use(Router);

const subRoutes = [
  {
    path: '/spot',
    name: 'SpotPositionManage',
    component: Index,
    meta: {
      title: '现货管理',
      icon: 'ios-stats'
    },
    children: [
      spotPricing,
      spotAvgInformation,
      poorSpotTail,
      spotTradeRecordRouter,
      spotPositionRouter
    ]
  },
  {
    path: '/future',
    name: 'FutureManage',
    component: Index,
    meta: {
      title: '期货管理',
      icon: 'ios-podium'
    },
    children: [
      futureTradeRecordRouter,
      futurePositionRouter,
      futureProfitRouter,
      profitCenterStatement
    ]
  },
  {
    path: '/foreign-exchange',
    name: 'ForeignExchange',
    component: Index,
    meta: {
      title: '外汇管理',
      icon: 'logo-euro'
    },
    children: [
      foreignExchangeTradeRecordRouter,
      foreignExchangePositionRouter,
      accountForeignExchangePositionRouter,
    ]
  },
  {
    path: '/other-payment',
    name: 'OtherPayment',
    component: Index,
    meta: {
      title: '收支记录',
      icon: 'ios-paper'
    },
    children: [otherPaymentRouter]
  },
  {
    path: '/final-statement-review',
    name: 'FinalStatementReview',
    component: Index,
    meta: {
      title: '结算单管理',
      icon: 'md-checkbox'
    },
    children: [
      // accountFuturePositionRouter,
      // accountTradeProfitLossRouter,
      // accountRightProfitLossRouter,
      // recordReviewRouter,
      // holdPositionReviewRouter,
      // profitLossReviewRouter,
      // rightCheckRouter,
      // 新的加在下面
      finalStatement,
      statementFutureTradeRouter,
      statementEquityRecordRouter,
      statementProfitRecord,
      statementReviewReport
    ]
  },
  {
    path: '/intrayday-risk-control-report',
    name: 'IntraydayRiskControlReport',
    component: Index,
    meta: {
      title: '盘中风控',
      icon: 'md-warning'
    },
    children: [
      capitalOccupationRouter,
      realTimeRiskControlRouter,
      ...intraydayRiskControlReportRouter
    ]
  },
  {
    path: '/report',
    name: 'reportManage',
    component: Index,
    meta: {
      title: '报表管理',
      icon: 'md-pie'
    },
    children: [
      profitRouter,
      costRouter,
      futuresCapitalOccupationRouter,
      capitalOccupationCWRouter,
      reportChartsRouter,
      summaryTableRouter,
      AcPurchasingCostRouter,
      stressTestRouter,
      accountInterimProfitLossRouter,
      SpotInventoryRegulationRouter
    ]
  },
  {
    path: '/system-parameter',
    name: 'SystemParameter',
    component: Index,
    meta: {
      title: '系统配置',
      icon: 'md-settings'
    },
    children: [
      accountEquityAllocationRouter,
      commissionRateConfigurationRouter,
      acMarginRateConfigurationRouter,
      acMarginTierRouter,
      acInterSpreadMarginRateRouter,
      externalSettlementTimeRouter
    ]
  }
];

const loginRouter = {
  path: '/login',
  name: 'login',
  component: Login,
  meta: {
    title: '登录'
  }
};
const fastLoginRouter = {
  path: '/fastlogin',
  name: 'fastlogin',
  component: FastLogin,
  props: route => {
    return {
      token: route.query.token,
      redirect: route.query.redirect
    };
  },
  meta: {
    title: '正在进行免登验证...'
  }
};

const page404 = {
  path: '/404',
  name: 'page404',
  meta: {
    title: '404您访问的页面不存'
  },
  component: Page404
};

const page403 = {
  path: '/403',
  name: 'page403',
  meta: {
    title: '403页面无访问权'
  },
  component: Page403
};

var routers = [
  {
    path: '/',
    component: App,
    meta: {
      title: '风控清算管理平台'
    },
    children: [
      loginRouter,
      fastLoginRouter,
      page404,
      page403,
      {
        path: '/',
        component: Main,
        redirect: Home,
        children: [
          {
            path: '/home',
            name: 'home',
            component: StageProfit,
            meta: {
              title: '首页'
            }
          },
          ...subRoutes
        ]
      }
    ]
  }
];
const RouterConfig = {
  mode: 'history',
  routes: routers
};
const router = new Router(RouterConfig);

// 路由守卫
let path = '';
router.beforeEach(async (to, from, next) => {
  Message.destroy();
  path = to.matched[3]?  to.matched[3].path: '';
  sessionStorage.setItem('page',  path)
  if (to.matched.length === 0) {
    router.push({
      name: 'page404',
      params: { '0': to.path }
    });
  }

  let token = localStorage.getItem('token');
  //TODO:: 服务�缓存token�这里的判断token是否有效 需要调用服务器端的代码
  let invalidLogin = !token && to.name !== 'login' && to.name !== 'fastlogin';
  if (invalidLogin) {
    goMainLogin();
  }
  let permission = to.meta.permission;
  if (permission) {
    await api.getPermissions();
    if (to.name !== 'page403' && !utils.hasPermission(permission)) {
      router.push({
        name: 'page403',
        params: { '0': to.path }
      });
      next();
      return;
    }
  }

  // let host = window.location.host;
  // let userPermissions = await api.getPermissions();

  let title = to.meta.title;
  if (title) {
    let parentRouter = to.matched[3]?  to.matched[3]: ''
    if(!parentRouter) {
      if (to.matched.length>2) {
        window.document.title = to.matched[2].meta.title
      }
    } else {
      window.document.title = parentRouter.meta.title
      ? `${parentRouter.meta.title}-${title}`
      : title;
    }
  }
  next();
});

router.afterEach((to, from) => {
  if(from.matched[3]) {
    if (path !== (from.matched[3].path)) {
      sessionStorage.removeItem('querys')
    }
  }
})
export const menuRouters = [...subRoutes];
export default router;
