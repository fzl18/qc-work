<template>
  <div class="review-table">
    <div class="review-header">
      <span class="title">{{reviewTitle}}</span>
      <span>总计{{countAllAccount}}个资金账户，存在{{countErrorAccount}}个账户异常</span>
    </div>
    <Table size="small"  border :columns="reviewColumns" :data="reviewData" maxHeight="313"></Table>
  </div>
</template>

<script>
export default {
  props: {
    reviewColumns: {
      type: Array,
      default: () => []
    },
    reviewData: {
      type: Array,
      default: () => []
    },
    reviewTitle: {
      type: String,
      default: ''
    },
    countAllAccount: {
      type: Number,
      default: 0
    },
    countErrorAccount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      accountNums: 0,
      errAccountNums: 0,
    }
  }
}
</script>

<style lang="less" scoped>
.review-header {
  border: 1px solid #dcdee2;
  height: 32px;
  line-height: 32px;
  margin: 5px 0;
  box-shadow: 0 -4px 0 rgba(255, 195, 0, 1);
  span {
    color: #ff0000;
    font-size: 12px;
  }
  span.title {
    color: black;
    font-weight: 600;
    font-size: 14px;
    padding: 0 21px 0 3px;
  }
}
.review-table {
  margin-top: 20px;
}
</style>