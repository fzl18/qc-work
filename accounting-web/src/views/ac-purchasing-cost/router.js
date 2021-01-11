import Index from "./index";
import List from "./list"

const router = {
  path: "/ac-purchasing-cost",
  name: "AcPurchasingCost",
  redirect: { name: "AcPurchasingCostList" },
  component: Index,
  meta: {
    title: "采购成本"
  },
  children: [{
    path: "list",
    name: "AcPurchasingCostList",
    component: List,
    meta: {
      title: '列表',
      permission:'H_SearchAcPurchasingCost'
    }
  }]

};
export default router;
