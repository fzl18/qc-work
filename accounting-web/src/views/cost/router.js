import Index from "./index";
import List from "./list"

const router = {
    path:"/cost",
    name: "Cost",
    redirect:{ name:"CostList" },
    component: Index,
    meta:{
        title:"费用"
    },
    children:[
        {
            path:"list",
            name:"CostList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchAcCost'
            }
        }
    ]
};
export default router;
