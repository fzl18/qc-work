import Index from './index';
import List from './list';
import Manage from './manage';

const router = {
  path: '/ac-margin-tier',
  name: 'AcMarginTier',
  redirect: { name: 'AcMarginTierList' },
  component: Index,
  meta: {
    title: '保证金期间',
  },
  children: [
    {
      path: 'list',
      name: 'AcMarginTierList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcMarginTier'
      }
    },
    {
      path: 'create',
      name: 'AcMarginTierCreate',
      component: Manage,
      meta: {
        title: '新增',
        permission: 'H_CreateAcMarginTier'
      },
      props: () => {
        return {
          action: 'create'
        }
      }
    },
    {
      path: 'edit',
      name: 'AcMarginTierEdit',
      component: Manage,
      meta: {
        title: '编辑',
        permission: 'H_UpdateAcMarginTier'
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
