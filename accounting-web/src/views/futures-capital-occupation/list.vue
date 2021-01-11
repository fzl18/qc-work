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
              v-for="(item, index) in commonData.porfitCenters"
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
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
              v-for="(item, index) in (query.corporationId ? commonData.tradeAccounts && commonData.tradeAccounts.filter( val => val.corporationId == query.corporationId) : [])"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
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
          <Select placeholder="原始币种" filterable clearable v-model="query.originalCurrencyId">
            <Option
              v-for="(item, index) in commonData.currencies"
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
          <Button
            type="info"
            @click="onExport"
            icon="ios-cloud-download-outline"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcCapitalOccupation')"
          >导出</Button>
          <!-- 期货资金占用-导出   H_ExportAcCapitalOccupation -->
        </Col>
         <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
        id="futures-capital-occupation"
        :hasPage="true"
        :rowData="rowData"
        :gridOptions="gridOptions"
        v-maxHeight
        :pagination="pagination"
        @on-page-change="onPageChange"
      ></qcgrid>
    </div>
    <Modal v-model="isShowModal" title="查看明细" width="60%">
      <div class="plan-list">
        <h3>行情明细</h3>
        <Table
          size="small"
          border
          class="margin-bottom-10"
          :loading="false"
          :columns="marketColumns"
          :data="marketData"
        ></Table>
      </div>
      <div class="plan-list">
        <h3>汇率明细</h3>
        <Table
          size="small"
          border
          class="margin-bottom-10"
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
      commonData: {},
      isShowModal: false,
      query: {
        dateRange: []
      },
      marketData: [],
      excahngeData: [],
      tableLoading: false,
      rowData: [],
      gridOptions: {},
      LoadingExportState: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      marketColumns: [
        {
          title: "清算日期",
          key: "acFeedDate",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.acFeedDate));
          }
        },
        {
          title: "具体合约",
          key: "instrumentText",
          align: "center"
        },
        {
          title: "行情类型",
          key: "feedTypeText",
          align: "center"
        },
        {
          title: "行情数值",
          key: "feedValue",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              { class: _.isNull(params.row.feedValue) ? "empty" : "" },
              _.isNull(params.row.feedValue)
                ? null
                : utils.formatNum(params.row.feedValue.toFixed(4))
            );
          }
        },
        {
          title: "最后更新时间",
          key: "lastManipulationTime",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.lastManipulationTime,"YYYY-MM-DD HH:mm:ss"));
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
          align: "center",
          // render: params => {
          //   return utils.showText(this.commonData.tradingStrategies, params.row.forexCategory);
          // },
        },
        {
          title: "外汇",
          key: "currencyPairText",
          align: "center",
          // render: params => {
          //   return utils.showText(this.commonData.currencyPairs, params.row.currencyPairId);
          // },
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
        },
        {
          title: "目标数量",
          key: "counterAmount",
          align: "center",
        },
        {
          title: "最后更新时间",
          key: "lastModifiedTime",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.lastManipulationTime,"YYYY-MM-DD HH:mm:ss"));
          }
        }
      ],
      columnDefs: [
        {
          headerName: "清算日期",
          field: "accountingDate",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return this.utils.formatDate(params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "法人",
          field: "corporationId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(this.commonData.corporations, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "资金账户",
          field: "tradeAccountId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(this.commonData.tradeAccounts, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "利润中心",
          field: "accountingEntityId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(
              this.commonData.porfitCenters,
              params.value
            );
          },
          enableRowGroup: true
        },
        {
          headerName: "策略",
          minWidth: 100,
          field: "tradingStrategyText",
          filter: "agSetColumnFilter",
          enableRowGroup: true
        },
        {
          headerName: "业务类型",
          field: "businessTypeId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(
              this.commonData.businessTypes,
              params.value
            );
          },
          enableRowGroup: true
        },
        {
          headerName: "品类",
          field: "commodityTypeId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(this.commonData.commodityTypes, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "清算币种",
          field: "homeCurrencyId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(this.commonData.currencies, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "占用金额(本币)",
          field: "homeOccupyAmount",
          minWidth: 120,
          type: "numberColumn",
          aggFunc: "sum",
          enableValue: true,
          width:250,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "原始币种",
          field: "originalCurrencyId",
          minWidth: 100,
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(this.commonData.currencies, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "占用金额(原币)",
          field: "originalOccupyAmount",
          minWidth: 120,
          type: "numberColumn",
          aggFunc: "sum",
          enableValue: true,
          width:250,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "更新时间",
          field: "lastManipulationTime",
          minWidth: 100,
          type: "dateColumn",
          pinned: "right",
          valueFormatter: params => {
            return utils.formatDate(params.value, "YYYY-MM-DD HH:mm:ss");
          },
          enableValue: true
        },
        {
          headerName: "操作",
          field: "acCapitalOccupationId",
          filter: "agSetColumnFilter",
          pinned: "right",
          cellRenderer: params => {
            var eDiv = document.createElement('div');
            eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看明细</a>';
            var eButton = eDiv.querySelectorAll('.btn-simple')[0];
            eButton.addEventListener('click', ()=> {
                this.getMarketDetail(params.value);
            });
            return eDiv;
          }
        }
      ]
    };
  },

  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await this.api.getCommonData("capitaloccupationfuture");
    this.search();
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: false,
      paginationPageSize: 10000,
      rowData: this.rowData,
      autoFitScreen: true,
      rowGroupPanelShow: "always"
    };
  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query = {};
      this.query.dateRange = [];
    },
    async search() {
      utils.saveQuery(this.query);
      if (this.query.dateRange.length) {
        this.query.accountingDateQueryStart = utils.formatDate(this.query.dateRange[0], "YYYY-MM-DD");
        this.query.accountingDateQueryEnd = utils.formatDate(this.query.dateRange[1], "YYYY-MM-DD");
      }
      this.query.pagination = this.pagination
      let data = await api.list(this.query);
      this.rowData = data.list;
      this.pagination = data.pagination
    },
    onPageChange(page) {
      this.pagination.currentPage = page.currentPage;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      if (pageSize) {
        this.search();
      }
    },
    async getMarketDetail(params) {
      let query = {
        acReportId: params,
        acReportType: this.commonData.acReportType && this.commonData.acReportType.filter(val=>val.text =='期货资金占用')[0].value
      };
      let marketData = await api.getMarketDetail(query);
      let excahngeData = await api.getExcahngeDetail(query);
      this.marketData = marketData.list;
      this.excahngeData = excahngeData.list;
      this.isShowModal = true;
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `期货资金占用${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    }
  }
};
</script>
<style>
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
