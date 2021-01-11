<template>
   <Card class="left" :bordered="false">
    <p slot="title">{{accountingEntityName}}{{accountingEntityName?'-':''}}盈亏状况</p>
    <div class="font12">
      <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">总利润:</span>
          {{item.currencySymbol}}<format-cell justify='start' inline>{{item.totalNetPnL}}</format-cell>
        </div>
        <div class="flex1">
          <span class="label">总盯市盈亏:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.positionPnL}}</format-cell>
        </div>
      </div>
      <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">总毛利:</span>
          {{item.currencySymbol}}<format-cell justify='start' inline>{{item.totalTradePnL}}</format-cell>
        </div>
        <div class="flex1">
          <span class="label">总其他盈亏:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.totalOtherPnL}}</format-cell>
        </div>
      </div>
      <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">总费用:</span>
          {{item.currencySymbol}}<format-cell justify='start' inline>{{item.totalFee}}</format-cell>
        </div>
        <!-- <div class="flex1">
          <span class="label">总其他盈亏:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.totalOtherPnL}}</format-cell>
        </div> -->
      </div>
      <div class="border"></div>
        <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">今日利润:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.dayNetPnL}}</format-cell>
        </div>
        <div class="flex1">
          <span class="label">今日盯市盈亏:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.dayClosePnL}}</format-cell>
        </div>
      </div>
      <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">今日毛利:</span>
          {{item.currencySymbol}}<format-cell justify='start' inline>{{item.dayTradePnL}}</format-cell>
        </div>
        <div class="flex1">
          <span class="label">今日其他盈亏:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.dayOtherPnL}}</format-cell>
        </div>
      </div>
      <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">今日交易费用:</span>
          {{item.currencySymbol}}<format-cell justify='start' inline>{{item.dayTradeFee}}</format-cell>
        </div>
        <div class="flex1">
          <span class="label">今日其他费用:</span>
            {{item.currencySymbol}}<format-cell justify='start' inline>{{item.dayOtherFee}}</format-cell>
        </div>
      </div>
      <div class="border"></div>
        <div class="flex lineHeight32">
        <div class="flex1">
          <span class="label">资金占用:</span>
          {{item.currencySymbol}}<format-cell justify='start' inline>{{item.homeOccupyAmount}}</format-cell>
        </div>
      </div>
    </div>
  </Card>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    accountingEntityName: {
      type: String
    }
  }
}
</script>
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
