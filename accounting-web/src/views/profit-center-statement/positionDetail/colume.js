import { utils } from "@/utils/utils";
export let  positionDetails = (commonData) => [
  
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
    title: "方向",
    key: "isBuy",
    align: "center",
    minWidth: 100,
    render(h, {row}) {
      return <span>{ row.isBuy==true ? '买' :row.isBuy==false? '卖':''}</span>
    },
  },
  {
    title: "持仓手数",
    key: "currentPosition",
    align: "center",
    minWidth: 100,
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
      return <format-cell >{params.row.currentPrice}</format-cell>
    }
  },
  {
    title: "市场价格",
    key: "marketPrice",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell >{params.row.marketPrice}</format-cell>
    }
  },
  {
    title: "浮动盈亏",
    key: "positionPnL",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell >{params.row.positionPnL}</format-cell>
    }
  },
  {
    title: "投机/套保",
    key: "hedgeFlagType",
    align: "center",
    minWidth: 100,
  },
  {
    title: "成交时间",
    key: "tradeTime",
    align: "center",
    minWidth: 100,
    render: (h, params) => {
      return h("span", utils.formatDate(params.row.tradeTime, 'HH:mm:ss'));
    }
  },
  {
    title: "成交序号",
    key: "tradeNumber",
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
