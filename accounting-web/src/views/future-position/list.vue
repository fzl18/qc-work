<template>
  <div>
    <div>
      <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem prop="accountingDate" required>
              <DatePicker
                type="date"
                confirm
                placement="bottom-start"
                placeholder="清算日期"
                v-model="query.accountingDate"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem prop="pnLAccountingMode" required>
              <Select placeholder="清算模式" filterable clearable v-model="query.pnLAccountingMode" @on-change="changeMode">
                <Option
                  v-for="(item, index) in commonData.options.pnLAccountingMode"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{item.text}}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
              <Option
                v-for="(item, index) in atomicProfitCenter"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="法人" filterable clearable v-model="query.corporationId" transfer>
              <Option
                v-for="(item, index) in commonData.corporations"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{item.value}} - {{item.text}}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
              <Option
                      v-for="(item, index) in commonData.tradeAccounts"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10" v-show="query.pnLAccountingMode === commonData.enums.pnLAccountingMode.avgPriceHedging">
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
            <Select placeholder="合约类型" filterable clearable v-model="query.financialInstrumentType">
              <Option
                v-for="(item, index) in commonData.financialInstrumentTypes && commonData.financialInstrumentTypes.financialInstrumentType.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="交易所" filterable clearable v-model="query.exchangeId">
              <Option
                      v-for="(item, index) in commonData.exchanges"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.value}} - {{item.text}}
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
          <!-- 具体合约 -->
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <InstrumentSelect
                    :allDate="true"
                    :filterQuery="instrumentQuery"
                    v-model="query.instrumentId"></InstrumentSelect>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="币种" filterable clearable v-model="query.currencyId">
              <Option
                      v-for="(item, index) in commonData.currenies"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="单位" filterable clearable v-model="query.unitId">
              <Option
                      v-for="(item, index) in commonData.units"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="方向" filterable clearable v-model="query.isBuy">
              <Option value="true">买</Option>
              <Option value="false">卖</Option>
            </Select>
          </Col>
        </Row>
      </Form>      
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button class="margin-right-3" type="info" @click="onExport" icon="ios-cloud-download-outline" :loading="LoadingExportState"
                  v-if="isShow('H_ExportAcFuturePosition')">导出
          </Button>
          <Button type="warning" @click="showErrorRecord" icon="md-eye" v-if="isShow('H_SearchAcFuturePositionExceptionLog') && query.pnLAccountingMode !== commonData.enums.pnLAccountingMode.avgPriceHedging">查看异常记录</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
        v-maxHeight
              id="futures-capital-occupation"
              :hasPage="false"
              :rowData="rowData"
              :gridOptions="gridOptions"
              :pagination="pagination"
              @on-page-change="onPageChange"
      ></qcgrid>
    </div>
    <Modal v-model="isShowModal" title="查看明细" width="60%">
      <div>
        <p class="title-border">行情明细</p>
        <Table
                size="small"
                border
                class="margin-bottom-10"
                :loading="false"
                :columns="marketColumns"
                :data="marketData"
                :max-height="300"
        ></Table>
        <p v-if="query.pnLAccountingMode !== commonData.enums.pnLAccountingMode.avgPriceHedging" class="title-border">{{showAccountingText}}-{{showPnlText}}-持仓明细</p>
        <Table
        v-if="query.pnLAccountingMode !== commonData.enums.pnLAccountingMode.avgPriceHedging"
                size="small"
                border
                class="margin-bottom-10"
                :loading="false"
                :columns="positionDetailsColumn"
                :data="positionDetails"
                :max-height="300"
        ></Table>
        <p v-if="query.pnLAccountingMode !== commonData.enums.pnLAccountingMode.avgPriceHedging" class="title-border">{{showAccountingText}}-{{showPnlText}}-平仓明细</p>
        <Table
        v-if="query.pnLAccountingMode !== commonData.enums.pnLAccountingMode.avgPriceHedging"
                size="small"
                border
                class="margin-bottom-10"
                :loading="false"
                :columns="closePositionDetailsColumn"
                :data="closePositionDetails"
                :max-height="300"
        ></Table>
      </div>
    </Modal>
    <Modal v-model="isShowExceptionModal" title="异常记录" width="60%">
      <div>
        <Table
          size="small"
          border
          :max-height="450"
          class="margin-bottom-10"
          :loading="false"
          :columns="exceptionDetailsColumn"
          :data="exceptionDetails"
        ></Table>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { utils } from '@/utils/utils';
  import api from './api';
  import moment from 'moment'

  export default {
    data () {
      return {
        commonData: {
          profitCenters: [],
          options: {},
          enums: {
            pnLAccountingMode: {}
          },
          tradeAccounts: [],
          instrumentCategories: [],
          commodityTypes: [],
          accountStrategies: [],
          strategies: []
        },
        isShowModal: false,
        isShowExceptionModal: false,
        query: {
          accountingEntityId: '',
          pnLAccountingMode: 1, //默认为逐笔对冲
          tradeAccountId: '',
          tradingStrategyId: '',
          commodityTypeId: '',
          InstrumentCategoryId: '',
          instrumentId: '',
          currencyId: '',
          unitId: '',
          isBuy: '',
          accountingDate: utils.formatDate(moment())
        },
        list: [],
        rowData: [],
        marketData: [],
        positionDetails: [],
        closePositionDetails: [],
        atomicProfitCenter: [], // 最小清算利润中心
        exceptionDetails: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        gridOptions: {},
        LoadingExportState: false,
        rowDetails:{},
        columnDefs: [
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
              return utils.showText(this.commonData.corporations, params.value);
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
            headerName: '策略',
            field: 'tradingStrategyText',
            filter: 'agSetColumnFilter',
            hide: true,
            enableRowGroup: true
          },
          {
            headerName: '具体合约',
            field: 'instrumentText',
            filter: 'agSetColumnFilter',
            enableRowGroup: true
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
            headerName: '方向',
            field: 'isBuyText',
            filter: 'agSetColumnFilter',
            width: 80,
            enableRowGroup: true
          },
          {
            headerName: '持仓手数',
            field: 'currentPosition',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            render: (h,params) => {
              return <format-cell fixed={0}> {params.value} </format-cell>
            }
          },
          {
            headerName: '持仓数量',
            field: 'currentWeight',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            render: (h,params) => {
              return <format-cell fixed={4}> {params.value} </format-cell>
            }
          },
          {
            headerName: '持仓均价',
            field: 'currentPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            render: (h,params) => {
              return <format-cell> {params.value} </format-cell>
            }
          },
          {
            headerName: '市场价格',
            field: 'marketPrice',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            render: (h,params) => {
              return <format-cell> {params.value} </format-cell>
            }
          },
          {
            headerName: '浮动盈亏',
            field: 'positionPnL',
            type: 'numberColumn',
            aggFunc: 'sum',
            width: 120,
            enableValue: true,
            render: (h,params) => {
              return <format-cell> {params.value} </format-cell>
            }
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
            width: 80,
            valueFormatter: params => {
              return utils.showText(
                this.commonData.commodityTypes,
                params.value
              );
            }
          },
          {
            headerName: '币种',
            field: 'currencyId',
            filter: 'agSetColumnFilter',
            width: 80,
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(this.commonData.currenies, params.value);
            }
          },
          {
            headerName: '单位',
            field: 'unitId',
            filter: 'agSetColumnFilter',
            width: 80,
            enableRowGroup: true,
            valueFormatter: params => {
              return utils.showText(this.commonData.units, params.value);
            }
          },
          {
            headerName: '投机/保值',
            field: 'hedgeFlagType',
            filter: 'agSetColumnFilter',
            width: 100,
            enableRowGroup: true
          },
          {
            headerName: '更新时间',
            field: 'lastManipulationTime',
            filter: 'agSetColumnFilter',
            pinned: 'right',
            cellRenderer: params => {
              return utils.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            headerName: '操作',
            field: 'acPositionFutureId',
            filter: 'agSetColumnFilter',
            pinned: 'right',
            cellRenderer: params => {
              var eDiv = document.createElement('div');
              eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看明细</a>';
              var eButton = eDiv.querySelectorAll('.btn-simple')[0];
              eButton.addEventListener('click', () => {
                this.getMarketDetail(params.value);
              });
              return eDiv;
            }
          }
        ],
        positionDetailsColumn: [
          {
            title: '资金账户',
            key: 'tradeAccountText',
            align: 'center',
            minWidth: 100
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            align: 'center',
            minWidth: 100
          },
          {
            title: '合约类型',
            align: 'center',
            minWidth: 100,
            render: (h, params) => h('span', utils.showText(
              this.commonData.financialInstrumentTypes.financialInstrumentType,
              params.row.financialInstrumentType
            ))
          },
          {
            title: '方向',
            align: 'center',
            minWidth: 80,
            render: (h, params) => h('span', _.isBoolean(params.row.isBuy) ? (params.row.isBuy ? '买' : '卖') : '')
          },
          {
            title: '持仓手数',
            align: 'center',
            minWidth: 100,
            render: (h, { row }) => {
              return <format-cell fixed={0}> {row.currentPosition} </format-cell>
            }
          },
          {
            title: '持仓量',
            align: 'center',
            minWidth: 100,
            render: (h, { row }) => {
              return <format-cell fixed={4}> {row.currentWeight} </format-cell>
            }
          },
          {
            title: '持仓价',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell fixed={2}> {row.currentPrice} </format-cell>
            }
          },
          {
            title: '市场价格',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell> {row.marketPrice} </format-cell>
            }
          },
          {
            title: '浮动盈亏',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell> {row.positionPnL} </format-cell>
            }
          },
          {
            title: '投机/套保',
            key: 'hedgeFlagType',
            align: 'center',
            minWidth: 100,
          },
          {
            title: '成交时间',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => h('span', utils.formatDate(row.tradeTime, 'HH:mm:ss'))
          },
          {
            title: '成交编号',
            key: 'tradeNumber',
            align: 'center',
            minWidth: 100
          },
          {
            title: '交易币种',
            key: 'currencyName',
            align: 'center',
            minWidth: 100
          }
        ],
        closePositionDetailsColumn: [
          {
            title: '资金账户',
            key: 'tradeAccountText',
            align: 'center',
            minWidth: 100
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            align: 'center',
            minWidth: 100
          },
          {
            title: '合约类型',
            align: 'center',
            minWidth: 100,
            render: (h, params) => h('span', utils.showText(
              this.commonData.financialInstrumentTypes.financialInstrumentType,
              params.row.financialInstrumentType
            ))
          },
          {
            title: '开仓方向',
            align: 'center',
            minWidth: 80,
            render: (h, params) => h('span', _.isBoolean(params.row.openIsBuy) ? (params.row.openIsBuy ? '买' : '卖') : '')
          },
          {
            title: '开仓价格',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell fixed={2}> {row.openPrice} </format-cell>
            }
          },
          {
            title: '平仓价格',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell fixed={2}> {row.closePrice} </format-cell>
            }
          },
          {
            title: '平仓数量',
            align: 'center',
            minWidth: 120,
            render: (h,{ row }) => {
              return <format-cell fixed={4}> {row.closeWeight} </format-cell>
            }
          },
          {
            title: '平仓盈亏',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell fixed={2}> {row.closeProfit} </format-cell>
            }
          },
          {
            title: '平仓时间',
            align: 'center',
            minWidth: 150,
            render: (h, { row }) => h('span', utils.formatDate(row.closeTime, 'YYYY-MM-DD HH:mm:ss'))
          },
          {
            title: '开成交编号',
            key: 'openTradeNumber',
            align: 'center',
            minWidth: 100
          },
          {
            title: '平成交编号',
            key: 'closeTradeNumber',
            align: 'center',
            minWidth: 100
          },
          {
            title: '交易币种',
            key: 'currencyName',
            align: 'center',
            minWidth: 100
          }
        ],
        exceptionDetailsColumn: [
           {
            title: '交易日期',
            align: 'center',
            minWidth: 120,
            render: (h, { row }) => h('span', utils.formatDate(row.tradeDate, 'YYYY-MM-DD'))
          },
          {
            title: '利润中心',
            align: 'center',
            minWidth: 120,
            render: (h, { row }) => h('span', utils.showText(this.commonData.porfigCenters, row.accountingEntityId))
          },
          {
            title: '法人',
            align: 'center',
            minWidth: 120,
            render: (h, { row }) => h('span', utils.showText(this.commonData.corporations, row.corporationId))
          },
          {
            title: '资金账户',
            key: 'tradeAccountText',
            align: 'center',
            minWidth: 100
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            align: 'center',
            minWidth: 100
          },
          {
            title: '合约类型',
            align: 'center',
            minWidth: 100,
            render: (h, params) => h('span', utils.showText(
              this.commonData.financialInstrumentTypes.financialInstrumentType,
              params.row.financialInstrumentType
            ))
          },
          {
            title: '成交手数',
            align: 'center',
            minWidth: 120,
            render: (h,{ row }) => {
              return <format-cell fixed={0}> {row.volume} </format-cell>
            }
          },
          {
            title: '成交价格',
            align: 'center',
            minWidth: 150,
            render: (h,{ row }) => {
              return <format-cell fixed={2}> {row.price} </format-cell>
            }
          },
          {
            title: '交易币种',
            key: 'currencyName',
            align: 'center',
            minWidth: 100
          },
          {
            title: '成交编号',
            key: 'tradeNumber',
            align: 'center',
            minWidth: 100
          },
          {
            title: '成交时间',
            align: 'center',
            minWidth: 120,
            render: (h, { row }) => h('span', utils.formatDate(row.tradeTime, 'HH:mm:ss'))
          },
          {
            title: '异常说明',
            key: 'remark',
            align: 'center',
            minWidth: 220
          },
          {
            title: '计算时间',
            align: 'center',
            minWidth: 150,
            render: (h, { row }) => h('span', utils.formatDate(row.calcTime, 'YYYY-MM-DD HH:mm:ss'))
          },
        ],
        marketColumns: [
          {
            title: '清算日期',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.acFeedDate));
            }
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '行情类型',
            key: 'feedTypeText',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '行情数值',
            minWidth: 150,
            align: 'center',
            render: (h, params) => {
              return _.isNil(params.row.feedValue) ? h('span',
                { 
                  class: 'empty',
                },
                '' ) : <format-cell fixed={2}> { params.row.feedValue } </format-cell>
            }
          },
          {
            title: '最后更新时间',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'));
            }
          }
        ]
      };
    },
    async mounted () {
      this.query = utils.saveQuery(this.query, 'get');
      let commonData = await this.api.getCommonData('positionfuture');
      let accountStrategies = [];
      _.forEach(commonData.accountStrategies, o => {
        accountStrategies.push(...o.tradingStrategies);
      });
      commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
      this.commonData = commonData;
      this.gridOptions = {
        columnDefs: this.columnDefs,
        pagination: false,
        // paginationPageSize: 10000,
        rowData: this.rowData,
        autoFitScreen: false,
        rowGroupPanelShow: 'always'
      };
      this.atomicProfitCenter = _.filter(this.commonData.porfigCenters, item => item.isAtomicProfitCenter)
      this.search();
    },
    computed: {
      showAccountingText() {
        return utils.showText(this.commonData.porfigCenters, this.rowDetails.accountingEntityId)
      },
      showPnlText() {
        return utils.showText(this.commonData.options.pnLAccountingMode, this.query.pnLAccountingMode)
      },
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
      },
      accountStrategies() {
        if (this.query.accountingEntityId) {
          const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.query.accountingEntityId)
          return obj ? obj.tradingStrategies : []
        }
        return this.commonData.strategies
      }
    },
    methods: {
      onSearch () {
        this.pagination.currentPage = 1;
        this.search();
      },
      resetQuery () {
        this.query = {
          accountingDate: this.query.accountingDate,
          pnLAccountingMode: this.query.pnLAccountingMode
        };
      },
      search () {
        this.$refs['queryForm'].validate((valid) => {
          if (valid) {
            utils.saveQuery(this.query);
            if (this.query.accountingDate) {
              this.query.accountingDateQueryStart = this.query.accountingDate;
              this.query.accountingDateQueryEnd = this.query.accountingDate;
            }
            api.search(this.query).then(data => {
              let list = data.list.map(val => {
                return ({
                  ...val,
                  isBuyText: val.isBuy ? '买' : '卖',
                  corporationText: val.corporationId == 78 ? '法人简称A' : utils.showText(this.commonData.corporations, val.corporationId),
                  tradeAccountText: utils.showText(this.commonData.tradeAccounts, val.tradeAccountId)
                });
              });
              // this.rowData = _.sortBy(list, function(o) {return o.accountingEntityText.toLocaleUpperCase()}, function(o) {return o.corporationText.toLocaleUpperCase()}, function(o) {return o.tradeAccountText.toLocaleUpperCase()})
              this.rowData = list
            });
          }
        })
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
      changeMode() {
        var index = _.findIndex(this.columnDefs, data=> data.headerName === '策略')
        if(this.query.pnLAccountingMode !== this.commonData.enums.pnLAccountingMode.avgPriceHedging) {
          this.columnDefs[index].hide = true
          this.query.tradingStrategyId = ''
        } else {
          this.columnDefs[index].hide = false
        }
        this.gridOptions = {
          columnDefs: this.columnDefs,
          pagination: false,
          rowData: this.rowData,
          autoFitScreen: false,
          rowGroupPanelShow: 'always'
        };
        // if(this.query.pnLAccountingMode) {
        //   this.search()
        // }
      },
      async getMarketDetail (params) {
        this.rowDetails = _.find(this.rowData, item => item.acPositionFutureId === params)
        let positionQuery = {
          FuturePositionId: params,
          AccountingEntityId: this.rowDetails.accountingEntityId,
          CorporationId: this.rowDetails.corporationId,
          TradeAccountId: this.rowDetails.tradeAccountId,
          InstrumentId: this.rowDetails.instrumentId,
          AccountingDate: this.query.accountingDate,
          PnLAccountingMode: this.query.pnLAccountingMode,
          AcReportType: this.commonData.enums.acReportType.acPositionFuture
        };
        let futurePositionData = await api.getPositionDetail(positionQuery);
        this.marketData = futurePositionData.result.instrumentFeedDetails;
        this.positionDetails = futurePositionData.result.positionDetails;
        this.closePositionDetails = futurePositionData.result.closePositionDetails;
        if( this.closePositionDetails.length ) {
          this.closePositionDetails.push({
            tradeAccountText: '合计',
            closeProfit: _.sumBy(this.closePositionDetails, 'closeProfit'),
            closeWeight: _.sumBy(this.closePositionDetails, 'closeWeight')
          })
        }
        if( this.positionDetails.length ) {
          this.positionDetails.push({
            tradeAccountText: '合计',
            currentPosition: _.sumBy(this.positionDetails, 'currentPosition'),
            currentWeight: _.sumBy(this.positionDetails, 'currentWeight'),
            positionPnL: _.sumBy(this.positionDetails, 'positionPnL')
          })
        }
        this.isShowModal = true;
      },
      onExport () {
        this.LoadingExportState = true;
        api.exportExcel(
          this.query,
          `期货持仓${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      },
      async showErrorRecord() {
        // if (this.query.accountingDate) {
        //   this.query.accountingDateQueryStart = this.query.accountingDate;
        //   this.query.accountingDateQueryEnd = this.query.accountingDate;
        // }

        let exceptionData = await api.getPositionExceptionRecords({ pnLAccountingMode: this.query.pnLAccountingMode });
        this.exceptionDetails = exceptionData.result
        this.isShowExceptionModal = true
      }
    }
  };
</script>
<style>
  .title-border {
    border: 1px solid #e8eaec;
    border-bottom: none;
    font-size: 14px;
    font-weight: 600;
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
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

