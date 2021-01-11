import Index from "./index";
import List from "./list"

const router = {
    path: "/foreign-exchange-position",
    name: "ForeignExchangePosition",
    redirect: { name: "ForeignExchangePositionList" },
    component: Index,
    meta: {
        title: "外汇持仓"
    },
    children: [{
        path: "list",
        name: "ForeignExchangePositionList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchAcPositionForex'         //账户外汇持仓-查询 H_SearchAcPositionForex
        }
    }]

};
export default router;
