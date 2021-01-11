<template>
  <div class="review-table">
    <div class="review-header">
      <p class="title">{{reviewTitle}}</p>
    </div>
    <Table size="small" border :columns="reviewColumns" :data="reviewData" height="335"></Table>
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
  border-bottom: 1px solid #dcdee2;
  margin: 5px 0;
  p.title {
    height: 32px;
    line-height: 32px;
    color: #ffffff;
    font-size: 14px;
    background-color: rgba(42, 130, 228, 1);
    width: 130px;
    text-align: center;
  }
}
.review-table {
  margin-top: 20px;
}
</style>