import CancelOrderCount from "./cancel-order-count";
import FundStatus from "./fund-status";
import AccountPosition from "./account-position";
import PortfolioContractPosition from "./portfolio-contract-position";
import PC_AccountPosition from "./pc_account-position";
import PC_ProfitLoss from "./pc_profit-loss";
import OriginalHandlingRate from "./original-handling-rate";
import DepositRateReport from "./deposit-rate-report";
import ExternalCapitalStatus from "./external-capital-status-report";
import Index from "./index";
const router = [
    {
        path: "/cancel-order-count",
        name: "CancelOrderCount",
        component: Index,
        redirect: { name: "CancelOrderCountList" },
        meta: {
            title: "撤单次数"
        },
        children: [
            {
                path: "list",
                name: "CancelOrderCountList",
                component: CancelOrderCount,
                meta: {
                    title: "列表",
                    permission: "H_SearchCancelOrderCountReport"
                }
            }
        ]
    },
    {
        path: "/account-position",
        name: "AccountPosition",
        component: Index,
        redirect: { name: "AccountPositionList" },
        meta: {
            title: "账户持仓"
        },
        children: [
            {
                path: "list",
                name: "AccountPositionList",
                component: AccountPosition,
                meta: {
                    title: "列表",
                    permission: "H_SearchAccountPositionReport"
                }
            }
        ]
    },
    {
        path: "/fund-status",
        name: "FundStatus",
        component: Index,
        redirect: { name: "FundStatusList" },
        meta: {
            title: "账户资金状况(内盘)"
        },
        children: [
            {
                path: "list",
                name: "FundStatusList",
                component: FundStatus,
                meta: {
                    title: "列表",
                    permission: "H_SearchFundStatusReport"
                }
            }
        ]
    },
    {
        path: "/external-capital-status-report",
        name: "ExternalCapitalStatusReport",
        component: ExternalCapitalStatus,
        redirect: { name: "ExternalCapitalStatusList" },
        meta: {
            title: "账户资金状况(外盘)"
        },
        children: [
            {
                path: "list",
                name: "ExternalCapitalStatusList",
                component: ExternalCapitalStatus,
                meta: {
                    title: "列表",
                    permission: "H_ReadForeignAccountCashReport"
                }
            }
        ]
    },
    {
        path: "/portfolio-contract-position",
        name: "PortfolioContractPosition",
        component: Index,
        redirect: { name: "PortfolioContractPositionList" },
        meta: {
            title: "组合合约持仓"
        },
        children: [
            {
                path: "list",
                name: "PortfolioContractPositionList",
                component: PortfolioContractPosition,
                meta: {
                    title: "列表",
                    permission: "H_SearchPortfolioContractPositionReport"
                }
            }
        ]
    },
    {
        path: "/pc_account-position",
        name: "PC_AccountPosition",
        component: Index,
        redirect: { name: "PC_AccountPositionList" },
        meta: {
            title: "利润中心持仓"
        },
        children: [
            {
                path: "list",
                name: "PC_AccountPositionList",
                component: PC_AccountPosition,
                meta: {
                    title: "列表",
                    permission: "H_SearchProfitCenterAccountPositionReport"
                }
            }
        ]
    },
    {
        path: "/pc_profit-loss",
        name: "PC_ProfitLoss",
        component: Index,
        redirect: { name: "PC_ProfitLossList" },
        meta: {
            title: "利润中心资金"
        },
        children: [
            {
                path: "list",
                name: "PC_ProfitLossList",
                component: PC_ProfitLoss,
                meta: {
                    title: "列表",
                    permission: "H_SearchProfitCenterPnLReport"
                }
            }
        ]
    },
    {
        path: "/original-handling-rate",
        name: "OriginalHandlingRate",
        component: OriginalHandlingRate,
        redirect: { name: "OriginalHandlingRateList" },
        meta: {
            title: "原始手续费率"
        },
        children: [
            {
                path: "list",
                name: "OriginalHandlingRateList",
                component: OriginalHandlingRate,
                meta: {
                    title: "列表",
                    permission: "H_SearchOriginalFee"
                }
            }
        ]
    },
    {
        path: "/deposit-rate-report",
        name: "DepositRateReport",
        component: DepositRateReport,
        redirect: { name: "DepositRateReportList" },
        meta: {
            title: "原始保证金率"
        },
        children: [
            {
                path: "list",
                name: "DepositRateReportList",
                component: DepositRateReport,
                meta: {
                    title: "列表",
                    permission: "H_ReadMarginRate"
                }
            }
        ]
    }
];

export default router;
