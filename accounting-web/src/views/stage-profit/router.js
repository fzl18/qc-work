import Index from "./index";
import List from "./list"

const router = {
    path: "/stage-profit",
    name: "StageProfit",
    redirect: { name: "StageProfitList" },
    component: Index,
    meta: {
        title: "阶段利润统计报表"
    },
    children: [{
        path: "list",
        name: "StageProfitList",
        component: List,
        meta: {
            title: '列表',
            second: true,
            permission:'H_SearchAcStageProfitReport'         //报表查看权限
        }
    }]

};
export default router;
