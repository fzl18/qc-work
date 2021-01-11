import Index from './index';
import List from './list';
import Manage from './manage';

const router = {
  path: '/statement-future-trade',
  name: 'StatementFutureTrade',
  redirect: { name: 'StatementFutureTradeList' },
  component: Index,
  meta: {
    title: '结算单交易记录',
  },
  children: [
    {
      path: 'list',
      name: 'StatementFutureTradeList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcStatementFutureTradeRecord'
      },
      props: route => {
        return {
          settlementDate: route.query.settlementDate,
          tradeAccountId: route.query.tradeAccountId,
          commodityTypeId: route.query.commodityTypeId,
          instrumentCategoryId: route.query.instrumentCategoryId,
          instrumentId: route.query.instrumentId,
          isBuy: route.query.isBuy,
        };
      }
    },
    {
      path: 'create',
      name: 'StatementFutureTradeCreate',
      component: Manage,
      meta: {
        title: '新增',
        permission: 'H_CreateAcStatementFutureTradeRecord'
      },
      props: () => {
        return {
          action: 'create'
        };
      }
    },
    {
      path: 'edit',
      name: 'StatementFutureTradeEdit',
      component: Manage,
      meta: {
        title: '编辑',
        permission: 'H_UpdateAcStatementFutureTradeRecord'
      },
      props: route => {
        return {
          action: 'edit',
          id: route.query.id,
        };
      }
    }
  ]
};

export default router;
