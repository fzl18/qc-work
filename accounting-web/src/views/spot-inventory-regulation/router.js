import Index from "./index";
import List from "./list"

const router = {
    path: "/spot-inventory-regulation",
    name: "SpotInventoryRegulation",
    redirect: { name: "SpotInventoryRegulationList" },
    component: Index,
    meta: {
        title: "现货库存调节表"
    },
    children: [{
        path: "list",
        name: "SpotInventoryRegulationList",
        component: List,
        meta: {
            title: '列表',
            second: true,
            permission:'H_SearchAcSpotInventoryAdjustment'         //现货库存调节表-查询
        }
    }]

};
export default router;
