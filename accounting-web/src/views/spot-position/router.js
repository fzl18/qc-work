import Index from "./index";
import List from "./list"

const router = {
    path:"/spot-position",
    name: "SpotPosition",
    redirect:{ name:"SpotPositionList" },
    component: Index,
    meta:{
        title:"现货持仓"
    },
    children:[
        {
            path:"list",
            name:"SpotPositionList",
            component:List,
            meta:{
                title:'列表',
                permission:'H_SearchAcSpotPosition'
            }
        }
    ]

};
export default router;
