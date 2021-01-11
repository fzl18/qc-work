<template>
<div>
    <Table
      minWidth="150"
      size="small"
      v-maxHeight
      bottomDistance='170'
      border
      class="margin-bottom-10"
      :columns="columns"
      :data="showList"
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
          title: "内容",
          key: "content",
          align: "center",
          minWidth: 160
        },
         {
          title: "值",
          key: "value",
          align: "center",
          minWidth: 160,
          render(h, params) {
            if(params.row.isNeedFormatAmount) {
              return <format-cell justify='start'>{params.row.value}</format-cell>
            } else {
              return <span>{params.row.value}</span>
            }
          },
        },
        {
          title: "内容",
          key: "content2",
          align: "center",
          minWidth: 160
        },
         {
          title: "值",
          key: "value2",
          align: "center",
          minWidth: 160,
          render(h, params) {
            if(params.row.isNeedFormatAmount2) {
              return <format-cell justify='start'>{params.row.value2}</format-cell>
            } else {
              return <span>{params.row.value2}</span>
            }
          },
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