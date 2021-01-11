<template>
  <div>
      <Card  :bordered="false" >
        <p slot="title">成交明细</p>
        <div style="position:relative">
        <Table
        size="small"
        border
       :maxHeight='530'
        class="margin-bottom-10"
        :columns="dealDetailColumns"
        :data="dealDetailsList"
      ></Table>
        </div>
      </Card>
      <Card  :bordered="false" >
        <p slot="title">成交汇总</p>
        <div style="position:relative">
        <Table
        size="small"
        border
        :maxHeight='530'
        class="margin-bottom-10"
        :columns="dealSummaryColume"
        :data="dealSummary"
      ></Table>
        </div>
      </Card>
  </div>
</template>
<script>
import {
  dealDetails,dealSummary
} from './colume'
import sum from '../total_mixin'
export default {
  mixins: [sum],
  props: {
    data:{
      type: Object,
      default: () => {}
    },
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dealDetailsList() {
      return this.handleSummary({columns: this.dealDetailColumns, data: this.data.tradeDetails},'currencyId',['commission', 'totalAmount'])
    },
    dealSummary() {
      return this.handleSummary({columns: this.dealSummaryColume, data: this.data.tradeDetailSummary},'currencyId',['commission', 'totalAmount'])
    },
    dealDetailColumns() {
      return dealDetails(this.commonData)
    },
    dealSummaryColume() {
      return dealSummary(this.commonData)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  // min-width: 1020px;
  overflow: hidden;
  .left{
    display: inline-block;
    float: left;
    width: 30%;
  }
  .right{
    display: inline-block;
    float: right;
    width: calc(70% - 10px);
  }
}
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
  .font14{
    font-size: 14px;
  }
  .lineHeight35{
    line-height: 32px;
  }
  .label {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
</style>
