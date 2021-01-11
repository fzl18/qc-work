<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="清算日期"
            v-model="query.dateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
              v-for="(item, index) in commonData.porfigCenters"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="业务类型" filterable clearable v-model="query.businessTypeId">
            <Option
              v-for="(item, index) in commonData.businessTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId">
            <Option
              v-for="(item, index) in commonData.corporations"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="策略" filterable clearable v-model="query.tradingStrategyId">
            <Option
              v-for="(item, index) in commonData.tradingStrategies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
              v-for="(item, index) in commonData.commodityTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
              v-for="(item, index) in commonData.currenies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="info" @click="onExport" icon="ios-cloud-download-outline" v-if="isShow('H_ExportAcPnL')" :loading="LoadingExportState">导出</Button>
        </Col>

         <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
        v-maxHeight
        id="futures-capital-occupation"
        :hasPage="true"
        :rowData="rowData"
        :gridOptions="gridOptions"
        :pagination="pagination"
        @on-page-change="onPageChange"
      ></qcgrid>
    </div>
    <Modal v-model="isShowModal" title="汇率明细" width="60%">
      <div>
        <Table
          size="small"
          border
          :loading="false"
          :columns="foreignExchangeColumns"
          :data="excahngeData"
        ></Table>
      </div>
    </Modal>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
export default {
  data() {
    return {
      commonData: {
        profitCenters: [],
        options: {},
        enums: {}
      },
      isShowModal: false,
      query: {
        dateRange: [],
      },
      list: [],
      excahngeData: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      rowData: [],
      gridOptions: {},
      LoadingExportState: false,
      columnDefs: [
        {
          headerName: "清算日期",
          field: "accountingDate",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params=> {
            return utils.formatDate(params.value)
          }
        },
        {
          headerName: "利润中心",
          field: "accountingEntityId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter:  params => {
            return utils.showText(this.commonData.porfigCenters,params.value)
          }
        },
        {
          headerName: "业务类型",
          field: "businessTypeId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params => {
            return  utils.showText(
                this.commonData.businessTypes,
                params.value
              )
          }
        },
        {
          headerName: "法人",
          field: "corporationId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params=> {
            return utils.showText(
                this.commonData.corporations,
                params.value
              )
          }
        },
        {
          headerName: "策略",
          field: "tradingStrategyText",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
        },
        {
          headerName: "品类",
          field: "commodityTypeId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params=> {
            return utils.showText(
                this.commonData.commodityTypes,
                params.value
              )
          }
        },
        {
          headerName: "币种",
          field: "currencyId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params => {
            return utils.showText(this.commonData.currenies, params.value)
          }
        },
        {
          headerName: "浮动盈亏",
          field: "positionPnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "平仓盈亏",
          field: "closePnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "其他盈亏",
          field: "otherPnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "实现盈亏",
          field: "realizationPnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总平仓盈亏",
          field: "totalClosePnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总其他盈亏",
          field: "totalOtherPnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总实现盈亏",
          field: "totalRealizationPnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总毛利",
          field: "totalTradePnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总毛利(本币)",
          field: "homeTotalTradePnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 130,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "最后更新时间",
          field: "lastManipulationTime",
          filter: "agSetColumnFilter",
          pinned: "right",
          cellRenderer:  params => {
            return utils.formatDate(params.value,"YYYY-MM-DD HH:mm:ss")
          }
        },
        {
          headerName: "操作",
          field: "acPnLId",
          filter: "agSetColumnFilter",
          pinned: "right",
          cellRenderer: params => {
            var eDiv = document.createElement('div');
            eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看汇率明细</a>';
            var eButton = eDiv.querySelectorAll('.btn-simple')[0];
            eButton.addEventListener('click', ()=> {
                this.getMarketDetail(params.value);
            });
            return eDiv;
          }
        }
      ],
      foreignExchangeColumns: [
        {
          title: "清算日期",
          key: "acFeedDate",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.acFeedDate));
          }
        },
        {
          title: "外汇分类",
          key: "forexCategoryText",
          align: "center"
        },
        {
          title: "外汇",
          key: "currencyPairText",
          align: "center",
        },
        {
          title: "合约日期",
          key: "contractDate",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.contractDate));
          }
        },
        {
          title: "汇率类型",
          key: "feedTypeText",
          align: "center",
          // render: params => {
          //   return utils.showText(this.commonData.currencyPairs, params.row.FeedTypeId);
          // },
        },
        {
          title: "基础数量",
          key: "baseUnitAmount",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              { class: _.isNull(params.row.baseUnitAmount) ? "empty" : "" },
              _.isNull(params.row.baseUnitAmount)
                ? null
                : utils.formatNum(params.row.baseUnitAmount.toFixed(4))
            );
          }
        },
        {
          title: "目标数量",
          key: "counterAmount",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              { class: _.isNull(params.row.counterAmount) ? "empty" : "" },
              _.isNull(params.row.counterAmount)
                ? null
                : utils.formatNum(params.row.counterAmount.toFixed(4))
            );
          }
        },
        {
          title: "最后更新时间",
          key: "lastModifiedTime",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.lastManipulationTime,"YYYY-MM-DD HH:mm:ss"));
          }
        }
      ]
    };
  },
  async beforeCreate() {
    this.commonData = await this.api.getCommonData("profit");
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: true,
      // paginationPageSize: 10000,
      rowData: this.rowData,
      autoFitScreen: false,
      rowGroupPanelShow: "always"
    }
  },
  created() {
    this.query = utils.saveQuery(this.query, 'get');
    this.search();
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    resetQuery() {
      this.query = {};
      this.query.dateRange = [];
    },
    async search() {
      utils.saveQuery(this.query);
      if (this.query.dateRange.length) {
        this.query.accountingDateQueryStart = this.query.dateRange[0];
        this.query.accountingDateQueryEnd = this.query.dateRange[1];
      }
      let data = await api.search(this.query, this.pagination);
      this.rowData = data.list;
      this.pagination = data.pagination;
    },
    onPageChange(page) {
      this.pagination.currentPage = page.currentPage;
      this.search();
    },
    async getMarketDetail(params) {
      let query = {
        acReportId: params,
        acReportType: this.commonData.enums.acReportType.acPnL
      };
      let excahngeData = await api.getExcahngeDetail(query);
      this.excahngeData = excahngeData.list;
      this.isShowModal = true;
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `利润${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>
<style scoped>
.ivu-table-cell {
  padding-left: 4px !important;
  padding-right: 4px !important;
}
.red {
  color: red;
}
.ivu-table-row > td {
  position: relative;
}
.empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffa50085;
}
.plan-list:last-child{
  margin-top: 50px;
}
h3{
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 36px;
}

</style>

