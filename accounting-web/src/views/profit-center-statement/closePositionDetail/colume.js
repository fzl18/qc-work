import { utils } from "@/utils/utils";
export let  closePositionDetails = (commonData) => [
  {
    title: "资金账户",
    key: "tradeAccountText",
    align: "center",
    minWidth: 100
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
    title: "开仓方向",
    key: "openIsBuy",
    align: "center",
    minWidth: 100,
    render(h, {row}) {
      return <span>{ row.openIsBuy==true ? '买' :row.openIsBuy==false? '卖':''}</span>
    },
  },
  {
    title: "开仓价格",
    key: "openPrice",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.openPrice}</format-cell>
    }
  },
  {
    title: "平仓价格",
    key: "closePrice",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.closePrice}</format-cell>
    }
  },
  {
    title: "平仓数量",
    key: "closeWeight",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell fixed={4}>{params.row.closeWeight}</format-cell>
    }
  },
  {
    title: "平仓盈亏",
    key: "closeProfit",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.closeProfit}</format-cell>
    }
  },
  {
    title: "平仓时间",
    key: "closeTime",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return h("span", utils.formatDate(params.row.closeTime, 'HH:mm:ss'));
    }
  },
  {
    title: "开成交序号",
    key: "openTradeNumber",
    align: "center",
    minWidth: 100,
  },
  {
    title: "平成交序号",
    key: "closeTradeNumber",
    align: "center",
    minWidth: 100,
  },
  {
    title: "交易币种",
    key: "currencyName",
    align: "center",
    minWidth: 100,
  },
]
