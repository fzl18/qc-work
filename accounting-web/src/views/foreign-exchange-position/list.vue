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
          <Select placeholder="外汇" filterable clearable v-model="query.wfCurrencyPairId">
            <Option
              v-for="(item, index) in commonData.currencyPairs"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="合约日期"
            v-model="query.contractDate"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
              v-for="(item, index) in commonData.currencies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option
              v-for="(item, index) in [{ text: '买', value: 'true' }, { text: '卖', value: 'false' }]"
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
            class="margin-right-3"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcPositionForex')"
          >导出</Button>
          <!-- 外汇持仓-导出  H_ExportAcPositionForex -->
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
          <!-- 外汇持仓-导出  H_ExportAcPositionForex -->
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
        strategies: []
      },
      isShowModal: false,
      query: {
        dateRange: [],
        contractDate: []
      },
      marketData: [],
      tableLoading: false,
      rowData: [],
      gridOptions: {},
      LoadingExportState: false,
      marketColumns: [
         {
          title: "清算日期",
          key: "acFeedDate",
          align: "center",
          render: (h, params) => h("span", utils.formatDate(params.row.acFeedDate))
        },
        {
          title: "外汇分类",
          key: "forexCategoryText",
          align: "center"
        },
        {
          title: "外汇",
          key: "currencyPairText",
          align: "center"
        },
        {
          title: "合约日期",
          key: "contractDate",
          align: "center",
          render: (h, params) => h("span", utils.formatDate(params.row.contractDate))
        },
        {
          title: "汇率类型",
          key: "feedTypeText",
          align: "center"
        },
        {
          title: "基础数量",
          key: "baseUnitAmount",
          align: "center",
          render: (h, params) => {
            return h('span', { class: _.isNil(params.row.baseUnitAmount) ? 'empty' : '' },
              _.isNil(params.row.baseUnitAmount) ? '' : utils.formatNum(params.row.baseUnitAmount.toFixed(4))
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
              { class: _.isNil(params.row.counterAmount) ? "empty" : "" },
              _.isNil(params.row.counterAmount) ? '' : utils.formatNum(params.row.counterAmount.toFixed(4))
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
      ],
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      columnDefs: [
        {
          headerName: "清算日期",
          field: "accountingDate",
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return this.utils.formatDate(params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "利润中心",
          field: "accountingEntityId",
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
          headerName: "法人",
          field: "corporationId",
          filter: "agSetColumnFilter",
          valueFormatter: params => {
            return utils.showText(this.commonData.corporations, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: '策略',
          field: 'tradingStrategyId',
          filter: 'agSetColumnFilter',
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
          headerName: "外汇",
          field: "currencyPairText",
          filter: "agSetColumnFilter",
          enableRowGroup: true
        },
        {
          headerName: "合约日期",
          field: "contractDate",
          filter: "agSetColumnFilter",
          valueFormatter: params => this.utils.formatDate(params.value),
          enableRowGroup: true
        },
        {
          headerName: "币种",
          field: "currencyId",
          filter: "agSetColumnFilter",
          valueFormatter: params => utils.showText(this.commonData.currencies, params.value),
          enableRowGroup: true
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
          enableValue: true,
          render: (h,params) => {
            return <format-cell fixed={4}> {params.value} </format-cell>
          }
        },
        {
          headerName: "持仓均价",
          field: "currentPrice",
          type: "numberColumn",
          aggFunc: "sum",
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
          field: "acPositionForexId",
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
    this.query = utils.saveQuery(this.query, 'get');

    let accountStrategies = [];
    let commonData = await this.api.getCommonData("AcPositionForex");
    _.forEach(commonData.accountStrategies, o => {
      accountStrategies.push(...o.tradingStrategies);
    });
    commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
    this.commonData = commonData;
    this.search();
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: false,
      rowData: this.rowData,
      paginationPageSize: 10000,
      autoFitScreen: false,
      rowGroupPanelShow: "always",
      columnTypes: {
        numberColumn: {
          width: 90
        }
      }
    };
  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query = {};
      this.query.dateRange = [];
      this.query.contractDate = [];
    },
    async search() {
      utils.saveQuery(this.query);
      if (this.query.dateRange.length) {
        this.query.accountingDateQueryStart = this.query.dateRange[0];
        this.query.accountingDateQueryEnd = this.query.dateRange[1];
      }
      if (this.query.contractDate.length) {
        this.query.contractDateQueryStart = this.query.contractDate[0];
        this.query.contractDateQueryEnd = this.query.contractDate[1];
      }
      this.query.pagination = this.pagination
      let data = await api.list(this.query);
      this.rowData = data.list.map(val=>{
        return (
          {
            ...val,
            isBuyText: val.isBuy ? '买':'卖'
          }
        )
      });
      this.pagination = data.pagination
    },
    onPageChange(page) {
      this.pagination.currentPage = page.currentPage;
      this.search();
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `外汇持仓${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    async getMarketDetail(params) {
      let query = {
        acReportId: params,
        acReportType: this.commonData.acReportType.filter(val=>val.text==='外汇持仓')[0].value
      };
      let marketData = await api.getMarketDetail(query);
      this.marketData = marketData.list;
      this.isShowModal = true;
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    }
  }
};
</script>
