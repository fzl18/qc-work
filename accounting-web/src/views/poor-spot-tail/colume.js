import { utils } from "@/utils/utils";
export let  colume = (commonData,context) => [
  {
    title: "结算日期",
    key: "settlementDate",
    align: "center",
    minWidth: 80,
    render: (h, params) => {
      return h("span", utils.formatDate(params.row.settlementDate));
    }
  },
  {
    title: "合同编号",
    key: "contractCode",
    align: "center",
    minWidth: 120,
  },
  {
    title: "品类",
    key: "commodityTypeName",
    align: "center",
    minWidth: 100,
  },
  {
    title: "结算重量",
    key: "settlementWeight",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return <format-cell fixed={4}>{params.row.settlementWeight}</format-cell>
    }
  },
  {
    title: "结算金额",
    key: "settlementPrice",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return <format-cell>{params.row.settlementPrice}</format-cell>
    }
  },
  {
    title: "备注",
    key: "notes",
    align: "center",
    minWidth: 100,
  },
  {
    title: "单位",
    key: "unitName",
    align: "center",
    minWidth: 100,
  },
  {
    title: "币种",
    key: "currencyName",
    align: "center",
    minWidth: 100,
  },
  {
    title: "更新者",
    key: "lastUpdatedBy",
    align: "center",
    minWidth: 100,
  },
  {
    title: "更新时间",
    key: "lastUpdatedTime",
    align: "center",
    minWidth: 120,
    render: (h, params) => {
      return h("span", utils.formatDate(params.row.lastUpdatedTime, 'YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    title: "操作",
    align: "center",
    width: 100,
    fixed: "right",
    render: (h, params) => {
        return h("div", [
          h(
            "Tooltip",
            {
              props: {
                content: "编辑",
                placement: "top",
                transfer: true
              }
            },
            [
              h("Button", {
                props: {
                  size: "small",
                  icon: "md-create"
                },
                style: {
                  marginRight: "3px",
                  display: context.isShow('H_UpdateAcSpotTailDiffrenceInfo') ? "block" : "none"
                },
                on: {
                  click: () => {
                    context.onEdit(params);
                  }
                }
              })
            ]
          ),
          h(
            "Tooltip",
            {
              props: {
                content: "删除",
                placement: "top",
                transfer: true
              }
            },
            [
              h("Button", {
                props: {
                  size: "small",
                  icon: "md-trash"
                },
                style: {
                  marginRight: "3px",
                  display: context.isShow('H_DeleteAcSpotTailDiffrenceInfo') ? "block" : "none"
                },
                on: {
                  click: () => {
                    context.onDelete(params);
                  }
                }
              })
            ]
          )
        ]);
    }
  }
]
export let  importColumns = (commonData,context) => [
  {
    title: "结算日期",
    key: "settlementDate",
    align: "center",
    minWidth: 80,
    render: (h, params) => {
      return h("span", utils.formatDate(params.row.settlementDate));
    }
  },
  {
    title: "合同编号",
    key: "contractCode",
    align: "center",
    minWidth: 120,
  },
  {
    title: "品类",
    key: "commodityType",
    align: "center",
    minWidth: 100,
  },
  {
    title: "结算重量",
    key: "settlementWeight",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return <format-cell fixed={4}>{params.row.settlementWeight}</format-cell>
    }
  },
  {
    title: "结算金额",
    key: "settlementPrice",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return <format-cell>{params.row.settlementPrice}</format-cell>
    }
  },
  {
    title: "备注",
    key: "notes",
    align: "center",
    minWidth: 100,
  }
]