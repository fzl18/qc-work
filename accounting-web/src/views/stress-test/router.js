import Index from './index';
import List from './list';

const router = {
  path: '/stress-test',
  name: 'StressTest',
  redirect: { name: 'StressTestList' },
  component: Index,
  meta: {
    title: '压力测试',
  },
  children: [
    {
      path: 'list',
      name: 'StressTestList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcStressTestReport'
      }
    }
  ]
};

export default router;
