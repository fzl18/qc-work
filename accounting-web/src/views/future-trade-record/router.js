import Index from './index';
import List from './list';

const router = {
  path: '/future-trade-record',
  name: 'FutureTradeRecord',
  redirect: { name: 'FutureTradeRecordList' },
  component: Index,
  meta: {
    title: '期货交易记录',
  },
  children: [
    {
      path: 'list',
      name: 'FutureTradeRecordList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcFutureTradeRecord'
      },
      props: route => {
        return {
          tradeAccountId: route.query.tradeAccountId,
          instrumentCategoryId: route.query.instrumentCategoryId,
          instrumentId: route.query.instrumentId,
          isBuy: route.query.isBuy,
        };
      }
    },
    {
      path: 'create',
      name: 'FutureTradeRecordCreate',
      component: () => import('./manage'),
      meta: {
        title: '新增',
        permission: 'H_CreateAcFutureTradeRecord'
      }
    },
    {
      path: 'edit',
      name: 'FutureTradeRecordEdit',
      component: () => import('./manage'),
      meta: {
        title: '编辑',
        permission: 'H_UpdateAcFutureTradeRecord'
      },
      props: route => {
        return {
          id: route.query.id
        };
      }
    }
  ]
};

export default router;
