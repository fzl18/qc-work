import Index from './index';
import List from './list';

const router = {
  path: '/account-foreign-exchange-position',
  name: 'AccountForeignExchangePosition',
  redirect: { name: 'AccountForeignExchangePositionList' },
  component: Index,
  meta: {
    title: '账户外汇持仓'
  },
  children: [{
    path: 'list',
    name: 'AccountForeignExchangePositionList',
    component: List,
    meta: {
      title: '列表',
      permission: 'H_SearchAcTAPositionForex'         //账户外汇持仓-查询 H_SearchAcTAPositionForex
    }
  }]

};
export default router;
