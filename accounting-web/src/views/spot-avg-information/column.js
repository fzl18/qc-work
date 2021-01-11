import { utils } from '@/utils/utils'

export let importColumns = (commonData) => [
  {
    title: "作价开始日期",
    align: "center",
    minWidth: 120,
    render: (h, { row }) =>
      h("span", utils.formatDate(row.pricingStartDate), "YYYY-MM-DD"),
  },
  {
    title: "作价结束日期",
    align: "center",
    minWidth: 120,
    render: (h, { row }) =>
      h("span", utils.formatDate(row.pricingEndDate), "YYYY-MM-DD"),
  },
  {
    title: "利润中心",
    key: "accountingEntity",
    align: "center",
    minWidth: 120
  },
  {
    title: "策略",
    key: "tradingStrategy",
    align: "center",
    minWidth: 120
  },
  {
    title: "法人",
    key: "corporation",
    align: "center",
    minWidth: 120
  },
  {
    title: "方向",
    key: "isBuy",
    align: "center",
    minWidth: 120
  },
  {
    title: "货量",
    key: "cargoQuantity",
    align: "center",
    minWidth: 120,
    render: (h, { row }) => <format-cell fixed={4}>{row.cargoQuantity}</format-cell>
  },
  {
    title: "升贴水",
    key: "premiumDiscount",
    align: "center",
    minWidth: 120,
  render: (h, { row }) => <format-cell>{row.premiumDiscount}</format-cell>
  },
  {
    title: "单位",
    key: "unit",
    align: "center",
    minWidth: 120
  },
  {
    title: "币种",
    key: "currency",
    align: "center",
    minWidth: 120
  },
  {
    title: "品种",
    key: "commodity",
    align: "center",
    minWidth: 120
  },
  {
    title: "品类",
    key: "commodityType",
    align: "center",
    minWidth: 120
  },
  {
    title: "物料",
    key: "material",
    align: "center",
    minWidth: 120
  },
  {
    title: "作价市场",
    key: "market",
    align: "center",
    minWidth: 120
  },
  {
    title: "具体合约",
    key: "instrumentCode",
    align: "center",
    minWidth: 120
  },
  {
    title: "行情价格类型",
    key: "feedType",
    align: "center",
    minWidth: 120
  },
  {
    title: "贸易类型",
    key: "tradeType",
    align: "center",
    minWidth: 120
  },
  {
    title: "税率",
    align: "center",
    minWidth: 120,
    render: (h, { row }) => <format-cell>{row.taxRate}</format-cell>
  },
  {
    title: "合同编号",
    key: "contractCode",
    align: "center",
    minWidth: 120
  },
  {
    title: "客户",
    key: "customer",
    align: "center",
    minWidth: 120
  },
  {
    title: "备注",
    key: "notes",
    align: "center",
    minWidth: 120
  },
]

export let listColumns = (vm) => [
  {
    title: "作价开始日期",
    align: "center",
    minWidth: 100,
    render: (h, { row }) =>
      h("span", utils.formatDate(row.pricingStartDate), "YYYY-MM-DD"),
  },
  {
    title: "作价结束日期",
    align: "center",
    minWidth: 100,
    render: (h, { row }) =>
      h("span", utils.formatDate(row.pricingEndDate), "YYYY-MM-DD"),
  },
  {
    title: "利润中心",
    key: "accountingEntityText",
    align: "center",
    minWidth: 120
  },
  {
    title: "策略",
    key: "tradingStrategyText",
    align: "center",
    minWidth: 100
  },
  {
    title: "法人",
    key: "corporationText",
    align: "center",
    minWidth: 100,
    render: (h, { row }) => h('span', utils.showText(vm.commonData.corporations, row.corporationId))
  },
  {
    title: "方向",
    key: "isBuyText",
    align: "center",
    minWidth: 80
  },
  {
    title: "货量",
    align: "center",
    minWidth: 120,
    render: (h, { row }) => <format-cell fixed={4}>{row.cargoQuantity}</format-cell>
  },
  {
    title: "升贴水",
    align: "center",
    minWidth: 120,
    render: (h, { row }) => <format-cell>{row.premiumDiscount}</format-cell>
  },
  {
    title: "单位",
    key: "unitText",
    align: "center",
    minWidth: 80
  },
  {
    title: "币种",
    key: "currencyText",
    align: "center",
    minWidth: 80
  },
  {
    title: "品种",
    key: "commodityText",
    align: "center",
    minWidth: 100,
    render: (h, { row }) => h('span', utils.showText(vm.commonData.commodities, row.commodityId))
  },
  {
    title: "品类",
    key: "commodityTypeText",
    align: "center",
    minWidth: 100
  },
  {
    title: "物料",
    key: "materialText",
    align: "center",
    minWidth: 100
  },
  {
    title: "作价市场",
    key: "exchangeText",
    align: "center",
    minWidth: 120
  },
  {
    title: "具体合约",
    key: "instrumentText",
    align: "center",
    minWidth: 120
  },
  {
    title: "行情价格类型",
    key: "feedTypeText",
    align: "center",
    minWidth: 100
  },
  {
    title: "贸易类型",
    key: "tradeTypeText",
    align: "center",
    minWidth: 100
  },
  {
    title: "税率",
    align: "center",
    minWidth: 120,
    render: (h, { row }) => <format-cell fixed={2}>{row.taxRate}</format-cell>
  },
  {
    title: "合同编号",
    key: "contractCode",
    align: "center",
    minWidth: 150
  },
  {
    title: "客户",
    key: "customer",
    align: "center",
    minWidth: 100
  },
  {
    title: "备注",
    key: "notes",
    align: "center",
    minWidth: 150
  },
  {
    title: "生成交易记录",
    key: "generateStatusText",
    align: "center",
    minWidth: 100
  },
  {
    title: "更新者",
    key: "lastManipulationName",
    align: "center",
    minWidth: 120
  },
  {
    title: "更新时间",
    align: "center",
    minWidth: 150,
    render: (h, { row }) =>
      h("span", utils.formatDate(row.lastManipulationTime, "YYYY-MM-DD HH:mm:ss")),
  },
  {
    title: "操作",
    fixed: "right",
    align: "center",
    minWidth: 150,
    render: (h, { row }) => {
      return h("div", [
        h(
          "Tooltip",
          {
            props: {
              content: "生成交易记录",
              placement: "top-start",
              transfer: true,
            },
          },
          [
            h("Button", {
              props: {
                size: "small",
                icon: "md-add-circle",
              },
              style: {
                marginRight: "3px",
                display: vm.isShow("H_SearchAcSpotAveragePricingRecord")
                  ? "block"
                  : "none",
              },
              on: {
                click: () => {
                  vm.isEditMore = true
                  vm.rowData = row
                },
              },
            }),
          ]
        ),
        h(
          "Tooltip",
          {
            props: {
              content: "编辑",
              placement: "top",
              transfer: true,
            },
          },
          [
            h("Button", {
              props: {
                size: "small",
                icon: "md-create",
              },
              style: {
                marginRight: "3px",
                display: vm.isShow("H_UpdateAcSpotAveragePricingRecord")
                  ? "block"
                  : "none",
              },
              on: {
                click: () => {
                  vm.onEdit(row);
                },
              },
            }),
          ]
        ),
        h(
          "Tooltip",
          {
            props: {
              content: "删除",
              placement: "top",
              transfer: true,
            },
          },
          [
            h("Button", {
              props: {
                size: "small",
                icon: "md-trash",
              },
              style: {
                marginRight: "3px",
                display: vm.isShow("H_DeleteAcSpotAveragePricingRecord")
                  ? "block"
                  : "none",
              },
              on: {
                click: () => {
                  vm.onDelete(row);
                },
              },
            }),
          ]
        ),
        h(
          "Tooltip",
          {
            props: {
              content: "查看交易记录",
              placement: "top-end",
              transfer: true,
            },
          },
          [
            h("Button", {
              props: {
                size: "small",
                icon: "md-eye",
              },
              style: {
                marginRight: "3px",
                display: vm.isShow("H_SearchAcSpotTradeRecord") && row.generateStatus
                  ? "block"
                  : "none",
              },
              on: {
                click: () => {
                  vm.$router.push({name: 'SpotTradeRecordList', params: { row }})
                },
              },
            }),
          ]
        )
      ]);
    },
  },
]