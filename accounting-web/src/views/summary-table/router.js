import Index from "./index";
import List from "./list"

const router = {
    path:"/summary-table",
    name: "SummaryTable",
    redirect:{ name:"SummaryTableList" },
    component: Index,
    meta:{
        title:"策略综合报表"
    },
    children:[
        {
            path:"list",
            name:"SummaryTableList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchAcRiskControlDailyReport'
            }
        }
    ]

};
export default router;
