import Index from "./index"
import List from "./list"
// import dataReviewResult from './data-review-result'

const router = {
    path: "/statement-profit-record",
    name: "statementProfitRecord",
    redirect: { name: "statementProfitRecordList" },
    component: Index,
    meta: {
        title: "结算单盈亏报表"
    },
    children: [{
        path: "list",
        name: "statementProfitRecordList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchStatementProfitReport'         //报表查看权限
        }
    }]

};
export default router;
