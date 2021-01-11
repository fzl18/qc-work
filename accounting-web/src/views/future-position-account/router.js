import Index from "./index";
import List from "./list"

const router = {
    path:"/future-position-account",
    name: "FuturePositionAccount",
    redirect:{ name:"FuturePositionAccountList" },
    component: Index,
    meta:{
        title:"期货持仓(账户)"
    },
    children:[
        {
            path:"list",
            name:"FuturePositionAccountList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchPositionFutureAccount'
            }
        }
    ]

};
export default router;
