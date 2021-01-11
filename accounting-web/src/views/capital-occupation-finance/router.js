import Index from "./index";
import List from "./list"

const router = {
    path: "/capital-occupation-cw",
    name: "CapitalOccupationCW",
    redirect: { name: "CapitalOccupationCWList" },
    component: Index,
    meta: {
        title: "现货资金占用"
    },
    children: [{
        path: "list",
        name: "CapitalOccupationCWList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchAcCapitalOccupationSpot02'
        }
    }]

};
export default router;
