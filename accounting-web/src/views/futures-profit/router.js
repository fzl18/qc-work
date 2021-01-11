import Index from "./index";
import List from "./list"

const router = {
    path: "/futures-profit",
    name: "FuturesProfit",
    redirect: { name: "FuturesProfitList" },
    component: Index,
    meta: {
        title: "期货利润"
    },
    children: [{
        path: "list",
        name: "FuturesProfitList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchAcPnLReport'         //期货利润-查询  H_SearchAcCapitalOccupation H_SearchAcPnLReport
        }
    }]

};
export default router;
