import Index from "./index";
import List from "./list"
import Manage from "./manage"

const router = {
  path: "/ac-margin-rate-configuration",
  name: "AcMarginRateConfiguration",
  redirect: { name: "AcMarginRateConfigurationList" },
  component: Index,
  meta: {
    title: "保证金率配置"
  },
  children: [{
    path: "list",
    name: "AcMarginRateConfigurationList",
    component: List,
    meta: {
      title: '列表',
      permission:'H_SearchAcMarginRate'
    }
  },{
    path: "create",
    name: "AcMarginRateConfigurationCreate",
    component: Manage,
    meta: {
      title: '新增',
      permission:'H_CreateAcMarginRate'
    }
  }]

};
export default router;
