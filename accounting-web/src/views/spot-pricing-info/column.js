import { utils } from '@/utils/utils'

export let listColumns = (commonData, vm) => [
  {
    title: '作价日期',
    key: 'pricingDate',
    align: 'center',
    minWidth: 100,
    render: (h, {row}) => {
      return h('span', utils.formatDate(row.pricingDate))
    }
  },
  {
    title: '利润中心',
    key: 'accountingEntityText',
    align: 'center',
    minWidth: 120
  },
  {
    title: '策略',
    key: 'tradingStrategyText',
    align: 'center',
    minWidth: 120
  },
  {
    title: '法人',
    key: 'corporationName',
    align: 'center',
    minWidth: 150
  },
  {
    title: '方向',
    key: 'isBuy',
    align: 'center',
    minWidth: 80,
    render: (h, {row}) =>
    h(
    'span',
    typeof row.isBuy === 'boolean'
    ? row.isBuy
    ? '采购'
    : '销售'
    : ''
    )
  },
  {
    title: '货量',
    key: 'cargoQuantity',
    align: 'center',
    minWidth: 120,
    render: (h, { row }) => {
      return <format-cell fixed={4}>{row.cargoQuantity}</format-cell>
    }
  },
  {
    title: '基价',
    key: 'basePrice',
    align: 'center',
    minWidth: 120,
    render: (h, { row }) => {
      return <format-cell>{row.basePrice}</format-cell>
    }
  },
  {
    title: '升贴水',
    key: 'premiumDiscount',
    align: 'center',
    minWidth: 90,
    render: (h, {row}) => {
      return <format-cell>{row.premiumDiscount}</format-cell>
    }
  },
  {
    title: '单位',
    key: 'unitName',
    align: 'center',
    minWidth: 90
  },
  {
    title: '币种',
    key: 'currencyName',
    align: 'center',
    minWidth: 80
  },
  {
    title: '品种',
    key: 'commodityName',
    align: 'center',
    minWidth: 80
  },
  {
    title: '品类',
    key: 'commodityTypeText',
    align: 'center',
    minWidth: 80
  },
  {
    title: '物料',
    key: 'materialName',
    align: 'center',
    minWidth: 80
  },
  {
    title: '贸易类型',
    key: 'simpleTradeType',
    align: 'center',
    minWidth: 80,
    render: (h, {row}) => {
      return h(
      'span',
      utils.showText(
      commonData.simpleTradeType,
      row.simpleTradeType
      )
      )
    }
  },
  {
    title: '税率',
    key: 'taxRate',
    align: 'center',
    minWidth: 80,
    render: (h, {row}) => {
      return <format-cell>{row.taxRate }</format-cell>
    }
  },
  {
    title: '合同编号',
    key: 'contractCode',
    align: 'center',
    minWidth: 150
  },
  {
    title: '客户',
    key: 'customer',
    align: 'center',
    minWidth: 150
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    minWidth: 150
  },
  {
    title: '更新者',
    key: 'lastManipulationName',
    align: 'center',
    minWidth: 80
  },
  {
    title: '更新时间',
    key: 'lastManipulationTime',
    align: 'center',
    minWidth: 150,
    render: (h, {row}) => {
      return h(
      'span',
      utils.formatDate(
      row.lastManipulationTime,
      'YYYY-MM-DD HH:mm:ss'
      )
      )
    }
  },
  {
    title: '操作',
    fixed: 'right',
    align: 'center',
    minWidth: 150,
    render: (h, {row}) => {
      return h('div', [
        h(
        'Tooltip',
        {
          props: {
            content: '编辑',
            placement: 'top',
            transfer: true
          }
        },
        [
          h('Button', {
            props: {
              size: 'small',
              icon: 'md-create'
            },
            style: {
              marginRight: '3px',
              display: vm.isShow('H_UpdateAcSpotPricingRecord')
              ? 'block'
              : 'none'
            },
            on: {
              click: () => {
                vm.onEdit(row)
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
              display: vm.isShow('H_DeleteAcSpotPricingRecord') ? 'block' : 'none'
            },
            on: {
              click: () => {
                vm.onDelete(row);
              }
            }
          })
        ]
        )
      ])
    }
  }
]
export let importColumns = (commonData) => [
  {
    title: '作价日期',
    key: 'pricingDate',
    align: 'center',
    minWidth: 100,
    render: (h, {row}) => {
      return h('span', utils.formatDate(row.pricingDate))
    }
  },
  {
    title: '利润中心',
    key: 'accountingEntity',
    align: 'center',
    minWidth: 120
  },
  {
    title: '策略',
    key: 'tradingStrategy',
    align: 'center',
    minWidth: 120
  },
  {
    title: '法人',
    key: 'corporation',
    align: 'center',
    minWidth: 150
  },
  {
    title: '方向',
    key: 'isBuy',
    align: 'center',
    minWidth: 80
  },
  {
    title: '货量',
    key: 'cargoQuantity',
    align: 'center',
    minWidth: 120,
    render: (h, { row }) => {
      return <format-cell fixed={4}>{row.cargoQuantity}</format-cell>
    }
  },
  {
    title: '基价',
    key: 'basePrice',
    align: 'center',
    minWidth: 120,
    render: (h, { row }) => {
      return <format-cell>{row.basePrice}</format-cell>
    }
  },
  {
    title: '升贴水',
    key: 'premiumDiscount',
    align: 'center',
    minWidth: 90,
    render: (h, {row}) => {
      return <format-cell>{row.premiumDiscount}</format-cell>
    }
  },
  {
    title: '单位',
    key: 'unit',
    align: 'center',
    minWidth: 90
  },
  {
    title: '币种',
    key: 'currency',
    align: 'center',
    minWidth: 80
  },
  {
    title: '品种',
    key: 'commodity',
    align: 'center',
    minWidth: 80
  },
  {
    title: '品类',
    key: 'commodityType',
    align: 'center',
    minWidth: 80
  },
  {
    title: '物料',
    key: 'material',
    align: 'center',
    minWidth: 80
  },
  {
    title: '贸易类型',
    key: 'simpleTradeType',
    align: 'center',
    minWidth: 80
  },
  {
    title: '税率',
    key: 'taxRate',
    align: 'center',
    minWidth: 80,
    render: (h, {row}) => {
      return <format-cell>{row.taxRate }</format-cell>
    }
  },
  {
    title: '合同编号',
    key: 'contractCode',
    align: 'center',
    minWidth: 150
  },
  {
    title: '客户',
    key: 'customer',
    align: 'center',
    minWidth: 150
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    minWidth: 150
  }
]
