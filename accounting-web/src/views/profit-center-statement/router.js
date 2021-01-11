import Index from "./index";
import List from "./list"

const router = {
    path: "/profit-center-statement",
    name: "profitCenterStatement",
    redirect: { name: "profitCenterStatementList" },
    component: Index,
    meta: {
        title: "利润中心结算单"
    },
    children: [{
        path: "list",
        name: "profitCenterStatementList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchAcProfitCenterStatementReport'         //期货资金占用-查询  H_SearchAcCapitalOccupation
        }
    }]

};
export default router;
