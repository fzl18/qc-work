import Index from './index';
import List from './list';
import Manage from './manage';

const router = {
  path: '/statement-equity-record',
  name: 'StatementEquityRecord',
  redirect: { name: 'StatementEquityRecordList' },
  component: Index,
  meta: {
    title: '结算单权益记录',
  },
  children: [
    {
      path: 'list',
      name: 'StatementEquityRecordList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcStatementTaEquityRecord'
      }
    },
    {
      path: 'create',
      name: 'StatementEquityRecordCreate',
      component: Manage,
      meta: {
        title: '新增',
        permission: 'H_CreateAcStatementTaEquityRecord'
      }
    },
    {
      path: 'edit',
      name: 'StatementEquityRecordEdit',
      component: Manage,
      meta: {
        title: '编辑',
        permission: 'H_UpdateAcStatementTaEquityRecord'
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
