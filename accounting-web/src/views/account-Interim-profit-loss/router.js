import Index from "./index";
import List from "./list"

const router = {
    path:"/account-Interim-profit-loss",
    name: "accountInterimProfitLoss",
    redirect:{ name:"accountInterimProfitLossList" },
    component: Index,
    meta:{
        title:"账户期间盈亏"
    },
    children:[
        {
            path:"list",
            name:"accountInterimProfitLossList",
            component:List,
            meta:{
                title:'列表',
                second: true,
                permission:'H_SearchAcTradeAccountPeriodReport'
            }
        }
    ]

};
export default router;
