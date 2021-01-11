import { utils } from "@/utils/utils";
export let  costDetails = (commonData) => [
  // {
  //   title: "发生日期",
  //   key: "tradeDate",
  //   align: "center",
  //   minWidth: 80,
  //   render: (h, params) => {
  //     return h("span", utils.formatDate(params.row.tradeDate));
  //   }
  // },
  {
    title: "资金账户",
    key: "tradeAccountText",
    align: "center",
    minWidth: 100,
  },
  {
    title: "交易所",
    key: "exchangeText",
    align: "center",
    minWidth: 100,
  },
  {
    title: "类型",
    key: "feeType",
    align: "center",
    minWidth: 100,
  },
  {
    title: "金额",
    key: "amount",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return <format-cell>{params.row.amount}</format-cell>
    }
  },
  {
    title: "币种",
    key: "currencyName",
    align: "center",
    minWidth: 100,
  },
  {
    title: "备注",
    key: "note",
    align: "center",
    minWidth: 100,
  },
]

export let  positionSummary = (commonData) => [
  {
    title: "资金账户",
    key: "tradeAccountText",
    align: "center",
    minWidth: 100,
  },
  {
    title: "具体合约",
    key: "instrumentText",
    align: "center",
    minWidth: 100,
  },
  {
    title: "合约类型",
    key: "financialInstrumentType",
    align: "center",
    minWidth: 100,
    render(h, {row}) {
      if(commonData.financialInstrumentType && row) {
        let result = commonData.financialInstrumentType.filter(c => c.value == row.financialInstrumentType)[0]
        return <span>{ result? result.text: ''}</span>
      }
    },
  },
  {
    title: "方向",
    key: "isBuy",
    align: "center",
    minWidth: 80,
    render(h, {row}) {
      return <span>{ row.isBuy==true ? '买' :row.isBuy==false? '卖':''}</span>
    },
  },
  {
    title: "持仓手数",
    key: "currentPosition",
    align: "center",
    minWidth: 80,
    render(h, params){
      return <format-cell fixed={0}>{params.row.currentPosition}</format-cell>
    }
  },
  {
    title: "持仓量",
    key: "currentWeight",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell fixed={4}>{params.row.currentWeight}</format-cell>
    }
  },
  {
    title: "持仓价",
    key: "currentPrice",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.currentPrice}</format-cell>
    }
  },
  {
    title: "市场价格",
    key: "marketPrice",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.marketPrice}</format-cell>
    }
  },
  {
    title: "浮动盈亏",
    key: "positionPnL",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.positionPnL}</format-cell>
    }
  },
  {
    title: "投机/套保",
    key: "hedgeFlagType",
    align: "center",
    minWidth: 100,
  },
  {
    title: "交易币种",
    key: "currencyName",
    align: "center",
    minWidth: 80,
  },
  {
    title: "重量单位",
    key: "unitName",
    align: "center",
    minWidth: 80,
  },
  {
    title: "外汇汇率",
    key: "exchangeRate",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.exchangeRate}</format-cell>
    }
  },
]
