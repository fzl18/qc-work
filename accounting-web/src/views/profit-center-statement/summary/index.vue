<template>
  <div class="profitSummary">
     <Row type="flex" :gutter="24" class="chart">
      <Col :xxl="8"  :sm="10"  class-name="margin-bottom-10">
      <model1 :item='item' v-if="clearMode==1 || clearMode==4" :accountingEntityName='accountingEntityName' />
      <model2 :item='item' v-else :accountingEntityName='accountingEntityName' />
      </Col>
      <Col :xxl="16"  :sm="14" class-name="margin-bottom-10">
      <Card class="right" :bordered="false" >
        <p slot="title">{{accountingEntityName}}{{accountingEntityName?'-':''}}费用明细</p>
        <div style="position:relative">
          <Table
            size="small"
            border
            :maxHeight='300'
            :columns="costDetailsColumns"
            :data="dailySummaryFeeDetails"
          ></Table>
        </div>
      </Card>
      </Col>
     </Row>
    <!-- </div> -->
      <Card   :bordered="false" >
        <p slot="title">持仓汇总</p>
        <div style="position:relative">
        <Table
        size="small"
        border
        :maxHeight='530'
        :columns="positionSummaryColume"
        :data="dailySummaryPositionCollection"
      ></Table>
        </div>
      </Card>

  </div>
</template>
<script>
import {
  costDetails,positionSummary
} from './colume'
import model1 from './model1'
import model2 from './model2'
import sum from '../total_mixin'
export default {
  components: {
    model1, model2
  },
  mixins: [sum],
  data() {
    return {
    }
  },
   props: {
    data:{
      type: Object,
      default: () => {}
    },
    commonData: {
      type: Object,
      default: () => {}
    },
    accountingEntityId:{
      type: Number
    },
    clearMode: {
      type: [String, Number]
    }
  },
  computed: {
    accountingEntityName() {
      return this.utils.showText(this.commonData.accountEntities, this.accountingEntityId)
    },
    item() {
      return this.data.dailySummaryProfit || {}
    },
    dailySummaryPositionCollection() {
      return this.handleSummary({columns: this.positionSummaryColume, data: this.data.dailySummaryPositionCollection},'currencyId',['positionPnL'])
    },
    dailySummaryFeeDetails() {
      return this.handleSummary({columns: this.costDetailsColumns, data: this.data.dailySummaryFeeDetails},'currencyId',['amount'])
    },
    costDetailsColumns() {
      return costDetails(this.commonData)
    },
    positionSummaryColume() {
      return positionSummary(this.commonData)
    }
  }
}
</script>
<style lang="less">
   .profitSummary {
      .ivu-table-small td{
       height: 30px;
     }
   }
</style>
<style lang="less" scoped>
  .flex{
    display: flex;
  }
  .flex1 {
    flex: 1
  }
  .flex1_40 {
    flex: 1 ;
    width: 40%;
  }
  .flex1_60 {
    flex: 1 ;
    width:500px;
  }
  .marginr_10 {
    margin-right: 10px;
  }
  .border {
    border-bottom: 1px solid #e8eaec;
  }
  .font12{
    font-size: 12px;
  }
  .font13{
    font-size: 13px;
  }
  .lineHeight32{
    line-height: 32px;
  }
  .lineHeight40{
    line-height: 40px;
  }
  .label {
    display: inline-block;
    width: 90px;
    text-align: right;
  }
</style>
