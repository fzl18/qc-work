import Index from "./index";
import List from "./list"

const router = {
    path: "/capital-occupation",
    name: "CapitalOccupation",
    redirect: { name: "CapitalOccupationList" },
    component: Index,
    meta: {
        title: "实时现货占用"
    },
    children: [{
        path: "list",
        name: "CapitalOccupationList",
        component: List,
        meta: {
            title: '列表',
            permission:'H_SearchAcCapitalOccupationSpot'
        }
    }]

};
export default router;
