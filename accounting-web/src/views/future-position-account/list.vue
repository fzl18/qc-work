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
                  v-model="accountingDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
                    v-for="(item, index) in commonData.porfigCenters"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId">
            <Option
                    v-for="(item, index) in commonData.corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
                    v-for="(item, index) in (commonData.tradeAccounts && commonData.tradeAccounts.filter(val => val.corporationId == query.corporationId))"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
                    v-for="(item, index) in commonData.commodityTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="标准合约" filterable clearable v-model="query.InstrumentCategoryId">
            <Option
                    v-for="(item, index) in commonData.instrumentCategories"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <InstrumentSelect
                  :allDate="true"
                  :filterQuery="instrumentQuery"
                  v-model="query.instrumentId"></InstrumentSelect>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option value="true">买</Option>
            <Option value="false">卖</Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" justify="end" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
          <Button type="info" @click="onExport" icon="ios-cloud-download-outline" :loading="LoadingExportState"
                  v-if="isShow('H_ExportPositionFutureAccount')">导出
          </Button>
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
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    data () {
      return {
        commonData: {
          profitCenters: [],
          options: {},
          enums: {},
          instrumentCategories: [],
          commodityTypes: []
        },
        isShowModal: false,
        query: {
          accountingDateQueryStart: '',
          accountingDateQueryEnd: '',
          accountingEntityId: '',
          corporationId: '',
          tradeAccountId: '',
          commodityTypeId: '',
          InstrumentCategoryId: '',
          instrumentId: '',
          isBuy: ''
        },
        list: [],
        rowData: [],
        marketData: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        accountingDateRange: [],
        gridOptions: {},
        LoadingExportState: false,
        columnDefs: [
          {
            headerName: '清算日期',
            field: 'accountingDate',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            cellRenderer: params => {
              return utils.formatDate(params.value);
            }
          },
          {
            headerName: '利润中心',
            field: 'accountingEntityId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(this.commonData.porfigCenters, params.value);
            }
          },
          {
            headerName: '法人',
            field: 'corporationId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.corporations,
                params.value
              );
            }
          },
          {
            headerName: '资金账户',
            field: 'tradeAccountId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.tradeAccounts,
                params.value
              );
            }
          },
          {
            headerName: '子账户',
            field: 'subAccount',
            filter: 'agSetColumnFilter',
            enableRowGroup: true
          },
          {
            headerName: '交易所',
            field: 'exchangeId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.exchanges,
                params.value
              );
            }
          },
          {
            headerName: '品类',
            field: 'commodityTypeId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.commodityTypes,
                params.value
              );
            }
          },
          {
            headerName: '合约类型',
            field: 'financialInstrumentType',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.financialInstrumentTypes.financialInstrumentType,
                params.value
              );
            }
          },
          {
            headerName: '标准合约',
            field: 'instrumentCategoryId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.instrumentCategories,
                params.value
              );
            }
          },
          {
            headerName: '具体合约',
            field: 'instrumentId',
            filter: 'agSetColumnFilter',
            enableRowGroup: true
          },
          {
            headerName: '投机/保值',
            field: 'hedgeFlagType',
            filter: 'agSetColumnFilter',
            enableRowGroup: true
          },
          {
            headerName: '方向',
            field: 'isBuyText',
            filter: 'agSetColumnFilter',
            enableRowGroup: true
          },
          {
            headerName: '持仓手数',
            field: 'currentPosition',
            align: 'center',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            cellRenderer: params => _.isNil(params.value) ? '' : `<span class=${params.value >= 0 ? '' : 'text-danger'}>${utils.formatNum(params.value.toFixed(4))}</span>`
          },
          {
            headerName: '市场价格',
            field: 'marketPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            cellRenderer: params => _.isNil(params.value) ? '' : `<span class=${params.value >= 0 ? '' : 'text-danger'}>${utils.formatNum(params.value.toFixed(4))}</span>`
          },
          {
            headerName: '持仓均价',
            field: 'currentPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            cellRenderer: params => _.isNil(params.value) ? '' : `<span class=${params.value >= 0 ? '' : 'text-danger'}>${utils.formatNum(params.value.toFixed(4))}</span>`
          },
          {
            headerName: '最后更新时间',
            field: 'lastManipulationTime',
            filter: 'agSetColumnFilter',
            pinned: 'right',
            cellRenderer: params => utils.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss')
          },
          {
            headerName: '操作',
            field: 'acPositionFutureAccId',
            filter: 'agSetColumnFilter',
            pinned: 'right',
            cellRenderer: params => {
              var eDiv = document.createElement('div');
              eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看行情明细</a>';
              var eButton = eDiv.querySelectorAll('.btn-simple')[0];
              eButton.addEventListener('click', () => {
                this.getMarketDetail(params.value);
              });
              return eDiv;
            }
          }
        ],
        marketColumns: [
          {
            title: '清算日期',
            key: 'acFeedDate',
            align: 'center',
            render: (h, params) => h('span', utils.formatDate(params.row.acFeedDate))
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            align: 'center'
          },
          {
            title: '行情类型',
            key: 'feedTypeText',
            align: 'center'
          },
          {
            title: '行情数值',
            key: 'feedValue',
            align: 'center',
            render: (h, params) => {
              return h(
                'div',
                { class: _.isNil(params.row.feedValue) ? 'empty' : '' },
                _.isNil(params.row.feedValue) ? null : utils.formatNum(params.row.feedValue.toFixed(4))
              );
            }
          },
          {
            title: '最后更新时间',
            key: 'lastManipulationTime',
            align: 'center',
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'));
            }
          }
        ]
      };
    },
    async beforeCreate () {
      this.commonData = await this.api.getCommonData('positionfutureaccount');
      this.gridOptions = {
        columnDefs: this.columnDefs,
        pagination: true,
        rowData: this.rowData,
        autoFitScreen: false,
        rowGroupPanelShow: 'always'
      };
      this.search();
    },
    watch: {
      accountingDateRange (val) {
        this.query.accountingDateQueryStart = val[0];
        this.query.accountingDateQueryEnd = val[1];
      }
    },
    computed: {
      instrumentQuery () {
        const instrumentCategoryObj = this.commonData.instrumentCategories.find(val => val.value === this.query.InstrumentCategoryId);
        const instrumentCategoryText = instrumentCategoryObj ? instrumentCategoryObj.text : '';
        const commodityTypeObj = this.commonData.commodityTypes.find(val => val.value === this.query.commodityTypeId);
        const commodityTypeText = commodityTypeObj ? commodityTypeObj.text : '';
        return [{
          key: 'instrumentCategoryId',
          text: '标准合约',
          id: this.query.InstrumentCategoryId,
          code: `${this.query.InstrumentCategoryId ? instrumentCategoryText : ''}`,
          required: false
        }, {
          key: 'commodityTypeId',
          text: '品类',
          id: this.query.commodityTypeId,
          code: `${this.query.commodityTypeId ? commodityTypeText : ''}`,
          required: false
        }];
      }
    },
    methods: {
      onSearch () {
        this.pagination.currentPage = 1;
        this.search();
      },
      resetQuery () {
        this.query = {};
        this.accountingDateRange = [];
      },
      async search () {
        let data = await api.search(this.query, this.pagination);
        this.rowData = data.list.map(val => {
          return ({
            ...val,
            isBuyText: val.isBuy ? '买' : '卖'
          });
        })
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
      async getMarketDetail (params) {
        let query = {
          acReportId: params,
          acReportType: this.commonData.enums.acReportType.acPositionFutureAccount
        };
        let marketData = await api.getMarketDetail(query);
        this.marketData = marketData.list;
        this.isShowModal = true;
      },
      onExport () {
        this.LoadingExportState = true;
        api.exportExcel(
          this.query,
          `期货持仓(账户)${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      isShow (permission) {
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
</style>

