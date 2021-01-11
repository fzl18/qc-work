import Index from './index'
import List from './list'
import Manage from './manage'

const router = {
  path: '/commission-rate-configuration',
  name: 'CommissionRateConfiguration',
  redirect: { name: 'CommissionRateConfigurationList' },
  component: Index,
  meta: {
    title: '手续费率配置',
  },
  children: [
    {
      path: 'list',
      name: 'CommissionRateConfigurationList',
      component: List,
      meta: {
        title: '列表',
        permission: 'H_SearchAcCommissionRate'
      }
    },
    {
      path: 'create',
      name: 'CommissionRateConfigurationCreate',
      component: Manage,
      meta: {
        title: '新增',
        permission: 'H_AddAcCommissionRate'
      }
    },
    {
      path: 'edit',
      name: 'CommissionRateConfigurationEdit',
      component: Manage,
      meta: {
        title: '编辑',
        permission: 'H_EditAcCommissionRate'
      },
      props: route => {
        return {
          id: route.query.id
        }
      }
    }
  ]
}

export default router
