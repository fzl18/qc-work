<template>
  <div>
    <div class='exposureInfo'>
    <Card>
      <p slot="title">
        基本信息
      </p>
      <Form
        ref="form"
        label-position="right"
        :label-width="100"
        :model="info"
      >
        <Row>
          <Col span="6">
            <FormItem label="结算单日期:">
              {{utils.formatDate(info.statementDate)}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="资金账户:">
              {{info.tradeAccountName}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="期货公司:">
              {{utils.showText(commonData.brokerCompanies, info.brokerId, 'fullText')}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="法人:">
              {{info.corporationName}}
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="6">
            <FormItem label="账户号:">
              {{info.account}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="账户币种:">
              {{info.currencyName}}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="风险度:" >
              {{info.accountRiskValue?info.accountRiskValue+'%':''}}
            </FormItem>
          </Col>
         </Row>
        <Row>
           <Col span="6">
              <FormItem label="客户权益:">
                 <format-cell justify='start'>{{info.customerEquity}}</format-cell>
              </FormItem>
           </Col>
           <Col span="6">
              <FormItem label="可用资金:">
                 <format-cell justify='start'>{{info.availableFunds}}</format-cell>
              </FormItem>
           </Col>
         
           <Col span="6">
              <FormItem label="上日结存:">
                 <format-cell justify='start'>{{info.prevBalanceAmount}}</format-cell>
              </FormItem>
           </Col>
          
          <Col span="6">
              <FormItem label="当日结存:">
                 <format-cell justify='start'>{{info.currentBalanceAmount}}</format-cell>
              </FormItem>
           </Col>
        </Row>
        <Row>
            <Col span="6">
              <FormItem label="平仓盈亏:">
                 <format-cell justify='start'>{{info.closePnL}}</format-cell>
              </FormItem>
           </Col>
          
          <Col span="6">
              <FormItem label="浮动盈亏:">
                 <format-cell justify='start'>{{info.floatingPnL}}</format-cell>
              </FormItem>
           </Col>
            <Col span="6">
              <FormItem label="当日总权利金:">
                 <format-cell justify='start'>{{info.currentTotalPremium}}</format-cell>
              </FormItem>
           </Col>
          
          <Col span="6">
              <FormItem label="当日手续费:">
                 <format-cell justify='start'>{{info.currentCommission}}</format-cell>
              </FormItem>
           </Col>
        </Row>
        <Row>
            <Col span="6">
              <FormItem label="当日存取合计:">
                <format-cell justify='start'>{{info.currentAccessSummarry}}</format-cell>
              </FormItem>
           </Col>
          
          <Col span="6">
              <FormItem label="实有货币资金:">
                 <format-cell justify='start'>{{info.realMonetaryFunds}}</format-cell>
              </FormItem>
           </Col>
            <Col span="6">
              <FormItem label="非货币充抵金额:">
                 <format-cell justify='start'>{{info.nonMonetaryCreditAmount}}</format-cell>
              </FormItem>
           </Col>
          
          <Col span="6">
              <FormItem label="货币充抵金额:">
                 <format-cell justify='start'>{{info.monetaryCreditAmount}}</format-cell>
              </FormItem>
           </Col>
         </Row>
         <Row> 
            <Col span="6">
              <FormItem label="保证金占用:">
                 <format-cell justify='start'>{{info.marginOccupation}}</format-cell>
              </FormItem>
           </Col>
            <Col span="6">
              <FormItem label="追加保证金:">
                 <format-cell justify='start'>{{info.additionalMargin}}</format-cell>
              </FormItem>
           </Col>
            <Col span="6">
              <FormItem label="冻结资金:">
                <format-cell justify='start'>{{info.freezingFunds}}</format-cell>
              </FormItem>
           </Col>
        </Row>
      </Form>
      <div style="padding-left: 20px;margin-top:20px;color: #2db7f5; cursor:pointer" @click="$router.push({name: 'StatementFutureTradeList', params: {
        statementDate: info.statementDate,
        tradeAccountId: info.tradeAccountId
      }})" >查看当日成交明细</div> 
      </Card>
      </br>
      </br>
       <Card>
        <p slot="title">
          资金变动明细
        </p>
         <Table
          size="small"
          border
          :columns="fundsColumns"
          :data="fundsList"
        ></Table>
       </Card>
        </br>
      </br>
       <Card>
        <p slot="title">
          期货持仓明细
        </p>
         <Table
          size="small"
          border
          :columns="futuresPositionColumns"
          :data="futuresPositionList"
        ></Table>
       </Card>
        </br>
      </br>
       <Card>
        <p slot="title">
          期权持仓明细
        </p>
         <Table
          size="small"
          border
          :columns="optionsPositionColumns"
          :data="optionsPositionList"
        ></Table>
       </Card>
    </div>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
export default {
  components: {
  },
  data() {
    return {
      info: {},
      fundsColumns: [
        {
          title: "发生日期",
          key: "happenedDate",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.happenedDate));
          }
        },
        {
          title: "权益类型",
          key: "equityTypeId",
          align: "center",
          minWidth: 100,
          maxWidth: 150,
          render: (h, params) => {
            return h("span", utils.showText(this.commonData.equityType, params.row.equityTypeId, 'text'));
          }
        },
        {
          title: "品类",
          key: "commodityTypeText",
          minWidth: 100,
          maxWidth: 200,
          align: "center",
        },
        {
          title: "业务类型",
          key: "businessTypeText",
           minWidth: 100,
          maxWidth: 200,
          align: "center",
        },
        {
          title: "金额",
          key: "amount",
          align: "center",
           minWidth: 100,
          maxWidth: 150,
          render: (h, params) => {
             return  <format-cell>{params.row.amount}</format-cell>
          }
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 200
        },
      ],
      fundsList: [],
      futuresPositionColumns: [
        {
          title: "合约",
          key: "instrumentText",
          align: "center",
          render: (h, params) => {
            if(params.row.sum) {
              return <div>总计</div>
            } else{
              return <div> {params.row.instrumentText}</div>
            }
          }
        },
        {
          title: "买持仓",
          key: "buyPosition",
          align: "center",
          render: (h, params) => {
             return  <format-cell>{params.row.buyPosition}</format-cell>
          }
        },
        {
          title: "买均价",
          key: "buyAveragePrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.buyAveragePrice}</format-cell>
          }
        },
        {
          title: "卖持仓",
          key: "salePosition",
          align: "center",
          render: (h, params) => {
           return  <format-cell>{params.row.salePosition}</format-cell>
          }
        },
        {
          title: "卖均价",
          key: "saleAveragePrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.saleAveragePrice}</format-cell>
          }
        },
        {
          title: "昨日结算价",
          key: "prevSettlementPrice",
          align: "center",
          render: (h, params) => {
             return  <format-cell>{params.row.prevSettlementPrice}</format-cell>
          }
        },
        {
          title: "今日结算价",
          key: "currentSettlementPrice",
          align: "center",
          render: (h, params) => {
             return  <format-cell>{params.row.currentSettlementPrice}</format-cell>
          }
        },
        {
          title: "浮动盈亏",
          key: "floatingPnL",
          align: "center",
          render: (h, params) => {
             return  <format-cell>{params.row.floatingPnL}</format-cell>
          }
        },
        {
          title: "交易保证金",
          key: "tradeMargin",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.tradeMargin}</format-cell>
          }
        },
        {
          title: "投机套保",
          key: "hedgeFlagType",
          align: "center",
        },
      ],
      futuresPositionList: [],
      optionsPositionColumns: [
        {
          title: "品种合约",
          key: "instrumentText",
          align: "center",
          render: (h, params) => {
            if(params.row.sum) {
                return <div>总计</div>
              } else{
                return <div> {params.row.instrumentText}</div>
              }
            }
        },
        {
          title: "标的合约",
          key: "underlyingInstrumentText",
          align: "center",
        },
        {
          title: "期权类型",
          key: "callOptionType",
          align: "center",
        },
        {
          title: "行权价",
          key: "realStrikePrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.realStrikePrice}</format-cell>
          }
        },
        {
          title: "买持仓",
          key: "buyPosition",
          align: "center",
          render: (h, params) => {
           return  <format-cell>{params.row.buyPosition}</format-cell>
          }
        },
        {
          title: "买均价",
          key: "buyAveragePrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.buyAveragePrice}</format-cell>
          }
        },
         {
          title: "卖持仓",
          key: "salePosition",
          align: "center",
          render: (h, params) => {
             return  <format-cell>{params.row.salePosition}</format-cell>
          }
        },
        {
          title: "卖均价",
          key: "saleAveragePrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.saleAveragePrice}</format-cell>
          }
        },
         {
          title: "昨日结算",
          key: "prevSettlementPrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.prevSettlementPrice}</format-cell>
          }
        },
        {
          title: "今日结算",
          key: "currentSettlementPrice",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.currentSettlementPrice}</format-cell>
          }
        },
         {
          title: "交易保证金",
          key: "tradeMargin",
          align: "center",
          render: (h, params) => {
            return  <format-cell>{params.row.tradeMargin}</format-cell>
          }
        },
        {
          title: "交易编码",
          key: "tradeNumber",
          align: "center",
        },
        {
          title: "备注",
          key: "note",
          align: "center",
        },
      ],
      optionsPositionList: [],
      commonData: {
       
      },
    };
  },
  computed: {
  },
  async mounted() {
   this.getInfo()
   this.commonData = await api.getCommonData();
  },
  methods: {
    async getInfo() {
      let result = await api.getById(this.$route.params.id);
      this.info = result
      this.fundsList = result.acStatementTaEquityRecords
      let total = {
        buyPosition: null,
        salePosition: null,
        tradeMargin: null,
        floatingPnL: null,
      }
      result.futurePositionDetails.forEach(item => {
        Object.keys(total).forEach(t => {
            total[t] += item[t]
        })
      })
      total.sum = true
      total.buyPosition =  total.buyPosition || null
      total.salePosition =  total.salePosition || null
      total.tradeMargin =  total.tradeMargin || null
      total.floatingPnL =  total.floatingPnL || null
      if(result.futurePositionDetails.length) {
        result.futurePositionDetails.push(total)
      }
      this.futuresPositionList = result.futurePositionDetails
      let total2 = {
        buyPosition: null,
        salePosition: null,
        tradeMargin: null,
      }
      result.optionPositionDetails.forEach(item => {
        Object.keys(total2).forEach(t => {
            total2[t] +=item[t]
        })
      })
      total2.sum = true
      total2.buyPosition =  total2.buyPosition || null
      total2.salePosition =  total2.salePosition || null
      total2.tradeMargin =  total2.tradeMargin || null
      if(result.optionPositionDetails.length) {
        result.optionPositionDetails.push(total2)
      }
      this.optionsPositionList = result.optionPositionDetails
    }
  }
};
</script>

<style lang='less'>
</style>