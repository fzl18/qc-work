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
          title: "发生日期",
          key: "happenedDate",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.happenedDate));
          }
        },
         {
          title: "权益类型",
          key: "equityType",
          align: "center",
          minWidth: 160
        },
        {
          title: "品类",
          key: "commodityTypeName",
          align: "center",
          minWidth: 160
        },
         {
          title: "业务类型",
          key: "bussinessType",
          align: "center",
          minWidth: 160
        },
         {
          title: "金额",
          key: "amount",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return <format-cell >{params.row.amount}</format-cell>
          }
        },
         {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 160
        }
      ],
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
      // .slice(this.pageSize * (this.currentPage-1), this.pageSize + this.pageSize * (this.currentPage-1))
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