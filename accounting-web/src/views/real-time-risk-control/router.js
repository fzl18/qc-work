import Index from './index';
import List from './list';

const router = {
  path: '/real-time-risk-control',
  name: 'RealTimeRiskControl',
  redirect: { name: 'RealTimeRiskControlList' },
  component: Index,
  meta: {
    title: '实时期货风控',
  },
  children: [
    {
      path: 'list',
      name: 'RealTimeRiskControlList',
      component: List,
      meta: {
        title: '列表',
        // 实时风控-列表查询 的 权限 枚举值   H_RealTimeRiskControlList = 20900,
        permission: 'H_RealTimeRiskControlList'
      }
    }
  ]
};

export default router;
