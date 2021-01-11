import { utils } from "@/utils/utils";
export let  dealDetails = (commonData) => [
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
    title: "成交手数",
    key: "volume",
    align: "center",
    minWidth: 80,
    render(h, params){
      return <format-cell fixed={0}>{params.row.volume}</format-cell>
    }
  },
  {
    title: "成交价",
    key: "price",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.price}</format-cell>
    }
  },
  {
    title: "成交金额",
    key: "totalAmount",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.totalAmount}</format-cell>
    }
  },
  {
    title: "手续费",
    key: "commission",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell>{params.row.commission}</format-cell>
    }
  },
  {
    title: "开/平",
    key: "isClose",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <span>{ params.row.isClose==true ? '平' :params.row.isClose==false? '开':''}</span>
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

export let  dealSummary = (commonData) => [

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
    minWidth: 80,
    render(h, {row}) {
      return <span>{ row.isBuy==true ? '买' :row.isBuy==false? '卖':''}</span>
    },
  },
  {
    title: "成交手数",
    key: "volume",
    align: "center",
    minWidth: 80,
    render(h, params){
      return <format-cell fixed={0}>{params.row.volume}</format-cell>
    }
  },
  {
    title: "成交价",
    key: "price",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell >{params.row.price}</format-cell>
    }
  },
  {
    title: "成交金额",
    key: "totalAmount",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell >{params.row.totalAmount}</format-cell>
    }
  },
  {
    title: "手续费",
    key: "commission",
    align: "center",
    minWidth: 100,
    render(h, params){
      return <format-cell >{params.row.commission}</format-cell>
    }
  },
  {
    title: "开/平",
    key: "isClose",
    align: "center",
    minWidth: 80,
    render(h, params){
      return <span>{ params.row.isClose==true ? '平' :params.row.isClose==false? '开':''}</span>
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
    minWidth: 100,
  },
]
