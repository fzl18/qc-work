<template>
<div>
    <Table
      minWidth="150"
      size="small"
      border
      class="margin-bottom-10"
      :columns="columns"
      :data="showList"
      v-maxHeight
      bottomDistance='170'
    ></Table>
     <!-- <QcPage
        size="small"
        show-total
        show-elevator
        :current="currentPage"
        :total="total.length"
        :page-size="pageSize"
        @on-page-size-change="pageSizeChange"
        @on-change="onPageChange"
      ></QcPage> -->
 </div>
</template>
<script>
import { utils } from "@/utils/utils";
export default {
   props: {
    data: {
      type: Array,
      default: () => []
    },
    isShowErrorList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: 1,
      loadList: [],
      pageSize: 15,
      columns: [
        {
         title: "错误信息",
          key: "errorMessages",
          align: "center",
          minWidth: 250,
          render: (h, {row}) => {
            return h(
              "span",
              {
                style: {
                  color: "red"
                }
              },
             row.errorMessages.length? row.sheetName+row.excelIndex+'行：'+ row.errorMessages.join(','): ''
            );
          }
        },
        {
          title: "合约",
          key: "instrumentCode",
          align: "center",
          minWidth: 160,
        },
         {
          title: "买持仓",
          key: "buyPosition",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.buyPosition}</format-cell>
          }
        },
        {
          title: "买均价",
          key: "buyAveragePrice",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.buyAveragePrice}</format-cell>
          }
        },
         {
          title: "卖持仓",
          key: "salePosition",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.salePosition}</format-cell>
          }
        },
        {
          title: "卖均价",
          key: "saleAveragePrice",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.saleAveragePrice}</format-cell>
          }
        },
         {
          title: "昨结算价",
          key: "prevSettlementPrice",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.prevSettlementPrice}</format-cell>
          }
        },
         {
          title: "今结算价",
          key: "prevSettlementPrice",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.currentSettlementPrice}</format-cell>
          }
        },
         {
          title: "浮动盈亏",
          key: "floatingPnL",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.floatingPnL}</format-cell>
          }
        },
         {
          title: "交易保证金",
          key: "tradeMargin",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.tradeMargin}</format-cell>
          }
        },
         {
          title: "投机/套保",
          key: "hedgeFlagType",
          align: "center",
          minWidth: 160
        },
         {
          title: "交易编码",
          key: "tradeNumber",
          align: "center",
          minWidth: 160
        }
      ]
    }
  },
  computed: {
    showSheets() {
      return (
        this.previewData &&
        this.previewData.sheetList &&
        this.previewData.sheetList.length
      );
    },
    showList() {
      let list
      if(this.isShowErrorList) {
        list = this.data && this.data.filter(item => item.errorMessages.length)
      } else {
        list = this.data
      }
      return list
    },
    // total() {
    //   if(this.isShowErrorList) {
    //    return this.data && this.data.filter(item => item.errorMessages.length)
    //   }
    //   return this.data
    // }
  },
  methods: {
    pageSizeChange(e) {
      this.pageSize = e
    },
    onPageChange(index=1) {
      this.currentPage = index
    }
  }
}
</script>