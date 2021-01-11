import Index from './index';
import List from './list';
import Manage from './manage';

const router = {
  path: '/ac-inter-spread-margin-rate',
  name: 'AcInterSpreadMarginRate',
  redirect: { name: 'AcInterSpreadMarginRateList' },
  component: Index,
  meta: {
    title: '跨期保证金',
  },
  children: [
    {
      path: 'list',
      name: 'AcInterSpreadMarginRateList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcInterSpreadMarginRate'
      }
    },
    {
      path: 'create',
      name: 'AcInterSpreadMarginRateCreate',
      component: Manage,
      meta: {
        title: '新增',
        permission: 'H_CreateAcInterSpreadMarginRate'
      },
      props: () => {
        return {
          action: 'create'
        };
      }
    },
    {
      path: 'edit',
      name: 'AcInterSpreadMarginRateEdit',
      component: Manage,
      meta: {
        title: '编辑',
        permission: 'H_UpdateAcInterSpreadMarginRate'
      },
      props: route => {
        return {
          action: 'edit',
          exchangeId: route.query.exchangeId,
          instrumentCategoryId: route.query.instrumentCategoryId,
          accountingDate: route.query.accountingDate,
        };
      }
    }
  ]
};

export default router;
