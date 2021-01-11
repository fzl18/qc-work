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
      bottomDistance='200'
    ></Table>
     <QcPage
        size="small"
        show-total
        show-elevator
        :current="currentPage"
        :total="total.length"
        :page-size="pageSize"
        @on-page-size-change="pageSizeChange"
        @on-change="onPageChange"
      ></QcPage>
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
          title: "成交序号/流水号",
          key: "tradeNumber",
          align: "center",
          minWidth: 160
        },
        {
          title: "成交时间",
          key: "tradeTime",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.tradeTime));
          }
        },
         {
          title: "方向",
          key: "buyText",
          align: "center",
          minWidth: 160
        },
         {
          title: "投/保",
          key: "hedgeFlagType",
          align: "center",
          minWidth: 160
        },
         {
          title: "成交价",
          key: "price",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.price}</format-cell>
          }
        },
         {
          title: "手数",
          key: "volume",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell justify='end' fixed={0}>{params.row.volume}</format-cell>
          }
        },
         {
          title: "成交额",
          key: "totalAmount",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.totalAmount}</format-cell>
          }
        },
        {
          title: "开/平",
          key: "closeText",
          align: "center",
          minWidth: 160
        },
        {
          title: "手续费",
          key: "commission",
          align: "center",
          minWidth: 160,
           render: (h, params) => {
            return <format-cell >{params.row.commission}</format-cell>
          }
        },
        {
          title: "平仓盈亏",
          key: "closePnL",
          align: "center",
          minWidth: 160,
           render: (h, params) => {
             return <format-cell >{params.row.closePnL}</format-cell>
          }
        },
          {
          title: "成交日期",
          key: "tradeDate",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.tradeDate));
          }
        },
          {
          title: "备注",
          key: "remark",
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
      return list.slice(this.pageSize * (this.currentPage-1), this.pageSize + this.pageSize * (this.currentPage-1))
    },
    total() {
      if(this.isShowErrorList) {
       return this.data && this.data.filter(item => item.errorMessages.length)
      }
      return this.data
    }
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