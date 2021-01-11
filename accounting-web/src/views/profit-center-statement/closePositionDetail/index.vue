<template>
  <div>
      <Card   :bordered="false">
        <p slot="title">平仓明细</p>
        <div style="position:relative">
        <Table
        size="small"
        border
        :maxHeight='950'
        :columns="closePositionDetailColume"
        :data="list"
      ></Table>
        </div>
      </Card>
  </div>
</template>
<script>
import {
  closePositionDetails
} from './colume'

import sum from '../total_mixin'
export default {
  mixins: [sum],
  props: {
    data:{
      type: Array,
      default: () => []
    },
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    closePositionDetailColume() {
      return closePositionDetails(this.commonData)
    },
    list() {
      return this.handleSummary({columns: this.closePositionDetailColume, data: this.data},'currencyId',['closeProfit'])
      return this.data
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
