import Index from "./index"
import List from "./list"
// import dataReviewResult from './data-review-result'

const router = {
    path: "/statement-review-report",
    name: "StatementReviewReport",
    redirect: { name: "StatementReviewList" },
    component: Index,
    meta: {
        title: "结算单复核报表"
    },
    children: [{
        path: "list",
        name: "StatementReviewList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchStatementReviewReport'         //报表查看权限
        }
    },{
        path: "data-review-result",
        name: "dataReviewResult",
        component: () => import('./data-review-result'),
        meta: {
            title: '结算单记录复核结果',
            permission:'H_SearchStatementReviewReport'         //报表查看权限
        }
    }]

};
export default router;
