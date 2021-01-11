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
              v-for="(item, index) in accountStrategies"
              :label="item.name"
              :value="item.tradingStrategyId"
              :key="index"
            >{{item.tradingStrategyId}} - {{item.name}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="贸易类型" filterable clearable v-model="query.tradeType">
            <Option
              v-for="(item, index) in commonData.options.simpleTradeType"
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
          <Select placeholder="品种" filterable clearable v-model="query.commodityId">
            <Option
              v-for="(item, index) in commonData.commodities"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="物料" filterable clearable v-model="query.materialId">
            <Option
              v-for="(item, index) in commonData.material"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="单位" filterable clearable v-model="query.unitId">
            <Option
              v-for="(item, index) in commonData.units"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option value="true">采购</Option>
            <Option value="false">销售</Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="info" @click="onExport" icon="ios-cloud-download-outline" v-if="isShow('H_ExportAcSpotPosition')" :loading="LoadingExportState">导出</Button>
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
        v-maxHeight
        :rowData="rowData"
        :gridOptions="gridOptions"
        :pagination="pagination"
        @on-page-change="onPageChange"
      ></qcgrid>
    </div>
    <Modal v-model="isShowModal" title="行情明细" width="60%">
      <div class="plan-list">
        <Table
          size="small"
          border
          class="margin-bottom-10"
          :loading="false"
          :columns="marketColumns"
          :data="marketData"
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
        accountStrategies: [],
        strategies: [],
        profitCenters: [],
        options: {},
        enums: {}
      },
      isShowModal: false,
      query: {
        dateRange: [],
        tradingStrategyId: ''
      },
      marketData: [],
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
          cellRenderer: params=> {
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
          field: "tradingStrategyId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params => {
            return utils.showText(
              this.commonData.strategies,
              params.value,
              'name',
              'tradingStrategyId'
            );
          }
        },
        {
          headerName: "贸易类型",
          field: "tradeType",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params => {
            return utils.showText(
              this.commonData.options.simpleTradeType,
              params.value
            );
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
          headerName: "品种",
          field: "commodityId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params => {
            return utils.showText(
                this.commonData.commodities,
                params.value
              )
          }
        },
        {
          headerName: "物料",
          field: "materialId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter:params => {
            return utils.showText(this.commonData.material, params.value)
          }
        },
        {
          headerName: "单位",
          field: "unitId",
          filter: "agSetColumnFilter",
          enableRowGroup: true,
          valueFormatter: params => {
            return utils.showText(this.commonData.units, params.value)
          }
        },
        {
          headerName: "方向",
          field: "isBuyText",
          filter: "agSetColumnFilter",
          enableRowGroup: true
        },
        {
          headerName: "持仓数量",
          field: "currentWeight",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell > {params.value}</format-cell>
          }
        },
        {
          headerName: "持仓均价",
          field: "currentPrice",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell> {params.value} </format-cell>
          }
        },
        {
          headerName: "市场价格",
          field: "marketPrice",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell> {params.value} </format-cell>
          }
        },
        {
          headerName: "浮动盈亏",
          field: "positionPnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell> {params.value} </format-cell>
          }
        },
        {
          headerName: "平仓盈亏",
          field: "closePnL",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell> {params.value} </format-cell>
          }
        },
        {
          headerName: "当日买量",
          field: "todayBuyPosition",
          type: "numberColumn",
          aggFunc: "sum",
          enableValue: true,
          render: (h,params) => {
            return <format-cell fixed={4}> {params.value} </format-cell>
          }
        },
        {
          headerName: "当日买价",
          field: "todayBuyPrice",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell> {params.value} </format-cell>
          }
        },
        {
          headerName: "当日卖量",
          field: "todaySellPosition",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell fixed={4}> {params.value} </format-cell>
          }
        },
        {
          headerName: "当日卖价",
          field: "todaySellPrice",
          type: "numberColumn",
          aggFunc: "sum",
          width: 120,
          enableValue: true,
          render: (h,params) => {
            return <format-cell> {params.value} </format-cell>
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
          field: "acPositionSpotId",
          filter: "agSetColumnFilter",
          pinned: "right",
          cellRenderer: params => {
            var eDiv = document.createElement('div');
            eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看行情明细</a>';
            var eButton = eDiv.querySelectorAll('.btn-simple')[0];
            eButton.addEventListener('click', ()=> {
                this.getMarketDetail(params.value);
            });
            return eDiv;
          }
        }
      ],
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
      ]
    };
  },
  computed: {
    accountStrategies() {
      if (this.query.accountingEntityId) {
        const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.query.accountingEntityId)
        return obj ? obj.tradingStrategies : []
      }
      return this.commonData.strategies
    }
  },
  async created() {
    let commonData = await this.api.getCommonData("positionspot");
    let accountStrategies = [];
    _.forEach(commonData.accountStrategies, o => {
      accountStrategies.push(...o.tradingStrategies);
    });
    commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
    this.commonData = commonData;
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: true,
      rowData: this.rowData,
      autoFitScreen: false,
      rowGroupPanelShow: "always"
    };
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
      utils.saveQuery(this.query)
      if (this.query.dateRange.length) {
        this.query.accountingDateQueryStart = this.query.dateRange[0];
        this.query.accountingDateQueryEnd = this.query.dateRange[1];
      }
      let data = await api.search(this.query, this.pagination);
      this.rowData = data.list.map(val=>{
        return (
          {
            ...val,
            isBuyText: val.isBuy ? '买':'卖'
          }
        )
      })
      this.pagination = data.pagination;
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
        acReportType: this.commonData.enums.acReportType.acPositionSpot
      };
      let marketData = await api.getMarketDetail(query);
      this.marketData = marketData.list;
      this.isShowModal = true;
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `现货持仓${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
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
</style>

