import Index from "./index";
import List from "./list"

const router = {
    path:"/report-charts",
    name: "ReportCharts",
    redirect:{ name:"ReportChartsList" },
    component: Index,
    meta:{
        title:"综合报表"
    },
    children:[
        {
            path:"list",
            name:"ReportChartsList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchAcGeneralDailyReport'
            }
        }
    ]

};
export default router;
