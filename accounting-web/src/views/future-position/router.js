import Index from "./index";
import List from "./list"

const router = {
    path:"/future-position",
    name: "FuturePosition",
    redirect:{ name:"FuturePositionList" },
    component: Index,
    meta:{
        title:"期货持仓"
    },
    children:[
        {
            path:"list",
            name:"FuturePositionList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchAcFuturePosition'
            }
        }
    ]

};
export default router;
