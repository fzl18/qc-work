import Index from "./index";
import List from "./list"

const router = {
    path:"/profit",
    name: "Profit",
    redirect:{ name:"ProfitList" },
    component: Index,
    meta:{
        title:"利润"
    },
    children:[
        {
            path:"list",
            name:"ProfitList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchAcPnL'
            }
        }
    ]

};
export default router;
