<template>
  <div>
    <div>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
                  type="daterange"
                  confirm
                  placement="bottom-start"
                  placeholder="清算日期"
                  v-model="dateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId"
                  @on-clear="query.tradeAccountId = null">
            <Option
                    v-for="(item, index) in commonData.corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
                    v-for="(item, index) in tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <!-- <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
              v-for="(item, index) in commonData.porfitCenters"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col> -->

        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="外汇" filterable clearable v-model="query.wfCurrencyPairId">
            <Option
                    v-for="(item, index) in commonData.currencyPairs"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
                  type="daterange"
                  confirm
                  placement="bottom-start"
                  placeholder="合约日期"
                  v-model="contractDate"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
                    v-for="(item, index) in commonData.currencies"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option
                    v-for="(item, index) in [{ text: '采购', value: 'true' }, { text: '销售', value: 'false' }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" justify="end" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
          <Button
                  type="info"
                  @click="onExport"
                  icon="ios-cloud-download-outline"
                  class="margin-right-3"
                  v-if="isShow('H_ExportAcTAPositionForex')"
                  :loading="LoadingExportState"
          >导出
          </Button>
          <!-- 账户外汇持仓-导出  H_ExportAcTAPositionForex -->
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
              id="futures-capital-occupation"
              :hasPage="true"
              :rowData="rowData"
              :gridOptions="gridOptions"
              :pagination="pagination"
              height="calc(100vh - 300px)"
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
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    data () {
      return {
        commonData: {
          tradeAccounts: []
        },
        isShowModal: false,
        query: {},
        marketData: [],
        tableLoading: false,
        rowData: [],
        dateRange: [],
        contractDate: [],
        gridOptions: {},
        LoadingExportState: false,
        marketColumns: [
          {
            title: '清算日期',
            key: 'acFeedDate',
            align: 'center',
            render: (h, params) => h('span', utils.formatDate(params.row.acFeedDate))
          },
          {
            title: '外汇分类',
            key: 'forexCategoryText',
            align: 'center',
            // render: params => {
            //   return utils.showText(this.commonData.tradingStrategies, params.row.forexCategory);
            // },
          },
          {
            title: '外汇',
            key: 'currencyPairText',
            align: 'center',
            // render: params => {
            //   return utils.showText(this.commonData.currencyPairs, params.row.currencyPairId);
            // },
          },
          {
            title: '合约日期',
            key: 'contractDate',
            align: 'center',
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.contractDate));
            }
          },
          {
            title: '汇率类型',
            key: 'feedTypeText',
            align: 'center',
            // render: params => {
            //   return utils.showText(this.commonData.currencyPairs, params.row.FeedTypeId);
            // },
          },
          {
            title: '基础数量',
            key: 'baseUnitAmount',
            align: 'center',
            render: (h, params) => {
              return h(
                'div',
                { class: _.isNull(params.row.baseUnitAmount) ? 'empty' : '' },
                _.isNull(params.row.baseUnitAmount)
                  ? null
                  : utils.formatNum(params.row.baseUnitAmount.toFixed(4))
              );
            }
          },
          {
            title: '目标数量',
            key: 'counterAmount',
            align: 'center',
            render: (h, params) => {
              return h(
                'div',
                { class: _.isNull(params.row.counterAmount) ? 'empty' : '' },
                _.isNull(params.row.counterAmount)
                  ? null
                  : utils.formatNum(params.row.counterAmount.toFixed(4))
              );
            }
          },
          {
            title: '最后更新时间',
            key: 'lastModifiedTime',
            align: 'center',
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'));
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
            headerName: '清算日期',
            field: 'accountingDate',
            filter: 'agSetColumnFilter',
            valueFormatter: params => {
              return this.utils.formatDate(params.value);
            },
            enableRowGroup: true
          },
          {
            headerName: '资金账户',
            field: 'tradeAccountId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => {
              return utils.showText(
                this.commonData.tradeAccounts,
                params.value
              );
            },
            enableRowGroup: true
          },
          {
            headerName: '法人',
            field: 'corporationId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => {
              return utils.showText(this.commonData.corporations, params.value);
            },
            enableRowGroup: true
          },
          {
            headerName: '外汇',
            field: 'currencyPairText',
            filter: 'agSetColumnFilter',
            enableRowGroup: true
          },
          {
            headerName: '合约日期',
            field: 'contractDate',
            filter: 'agSetColumnFilter',
            valueFormatter: params => {
              return this.utils.formatDate(params.value);
            },
            enableRowGroup: true
          },
          {
            headerName: '币种',
            field: 'currencyId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => {
              return utils.showText(this.commonData.currencies, params.value);
            },
            enableRowGroup: true
          },
          {
            headerName: '方向',
            field: 'isBuyText',
            filter: 'agSetColumnFilter',
            // valueFormatter: params => {
            //   return params.value ? '买' : '卖';
            // },
            enableRowGroup: true
          },
          {
            headerName: '持仓数量',
            field: 'currentWeight',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '持仓均价',
            field: 'currentPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '市场价格',
            field: 'marketPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '浮动盈亏',
            field: 'positionPnL',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '平仓盈亏',
            field: 'closePnL',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '当日买量',
            field: 'todayBuyPosition',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '当日买价',
            field: 'todayBuyPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '当日卖量',
            field: 'todaySellPosition',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '当日卖价',
            field: 'todaySellPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true
          },
          {
            headerName: '最后更新时间',
            field: 'lastManipulationTime',
            filter: 'agSetColumnFilter',
            pinned: 'right',
            cellRenderer: params => {
              return utils.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            headerName: '操作',
            field: 'acTAPositionForexId',
            filter: 'agSetColumnFilter',
            pinned: 'right',
            cellRenderer: params => {
              var eDiv = document.createElement('div');
              eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看汇率明细</a>';
              var eButton = eDiv.querySelectorAll('.btn-simple')[0];
              eButton.addEventListener('click', () => {
                this.getMarketDetail(params.value);
              });
              return eDiv;
            }
          }
        ]
      };
    },
    async created () {
      this.commonData = await this.api.getCommonData('AcTAPositionForex');
      this.search();
      this.gridOptions = {
        columnDefs: this.columnDefs,
        rowData: this.rowData,
        autoFitScreen: false,
        rowGroupPanelShow: 'always',
        pagination: false,
        paginationPageSize: 10000
      };

    },
    computed: {
      tradeAccounts () {
        return this.query.corporationId ? this.commonData.tradeAccounts.filter(val => val.corporationId === this.query.corporationId) : this.commonData.tradeAccounts;
      }
    },
    watch: {
      dateRange (val) {
        this.query.accountingDateQueryStart = utils.formatDate(val[0], 'YYYY-MM-DD');
        this.query.accountingDateQueryEnd = utils.formatDate(val[1], 'YYYY-MM-DD');
      },
      contractDate (val) {
        this.query.contractDateQueryStart = utils.formatDate(val[0], 'YYYY-MM-DD');
        this.query.contractDateQueryEnd = utils.formatDate(val[1], 'YYYY-MM-DD');
      }
    },
    methods: {
      onSearch () {
        this.search();
      },
      resetQuery () {
        this.query = {};
        this.dateRange = [];
        this.contractDate = [];
      },
      async search () {
        this.query.pagination = this.pagination;
        let data = await api.list(this.query);
        this.rowData = data.list.map(val => {
          return (
            {
              ...val,
              isBuyText: val.isBuy ? '买' : '卖'
            }
          );
        });
        this.pagination = data.pagination;
      },
      onPageChange (page) {
        this.pagination.currentPage = page.currentPage;
        this.search();
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize;
        if (pageSize) {
          this.search();
        }
      },
      onExport () {
        this.LoadingExportState = true;
        api.exportExcel(
          this.query,
          `账户外汇持仓${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      async getMarketDetail (params) {
        let query = {
          acReportId: params,
          acReportType: this.commonData.acReportType.filter(val => val.text === '账户外汇持仓')[0].value
        };
        let marketData = await api.getMarketDetail(query);
        this.marketData = marketData.list;
        this.isShowModal = true;
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
