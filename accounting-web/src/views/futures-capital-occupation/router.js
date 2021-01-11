import Index from "./index";
import List from "./list"

const router = {
    path: "/futures-capital-occupation",
    name: "FuturesFuturesCapitalOccupation",
    redirect: { name: "FuturesCapitalOccupationList" },
    component: Index,
    meta: {
        title: "期货资金占用"
    },
    children: [{
        path: "list",
        name: "FuturesCapitalOccupationList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchAcCapitalOccupation'         //期货资金占用-查询  H_SearchAcCapitalOccupation
        }
    }]

};
export default router;
