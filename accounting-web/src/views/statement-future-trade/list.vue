<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker type="daterange"
                      placement="bottom-start"
                      placeholder="结算单日期"
                      title="结算单日期"
                      v-model="query.accountingDateRange"
          />
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" title="法人" filterable clearable v-model="query.corporationId">
            <Option v-for="(item, index) in commonData.corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" title="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option v-for="(item, index) in tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" title="方向" filterable clearable v-model="query.isBuy">
            <Option v-for="(item, index) in directions"
                    :label="item.text"
                    :value="item.value"
                    :key="index">{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="交易所" title="交易所" filterable clearable v-model="query.exchangeId">
            <Option v-for="(item, index) in commonData.exchanges"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <InstrumentSelect
            placeholder="合约"
            :allDate="true"
            :filterQuery="instrumentQuery"
            v-model="query.instrumentId"></InstrumentSelect>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            placement="bottom-start"
            placeholder="成交日期"
            title="成交日期"
            v-model="query.tradeDateRange"
          />
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select
            placeholder="数据来源"
            title="数据来源"
            filterable
            clearable
            v-model="query.dataSourceType">
            <Option
              v-for="(item, index) in commonData.acDataSourceType"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" class="margin-right-3" icon="md-add" v-if="isShow('H_CreateAcStatementFutureTradeRecord')" @click="onAdd">添加</Button>
          <file-upload
              class="margin-right-3"
              tempName="结算单交易记录导入模板"
              action="AcStatementFutureTradeRecord/Preview"
              import="AcStatementFutureTradeRecord/Import"
              download="AcStatementFutureTradeRecord/DownLoadTemple"
              v-if="isShow('H_CreateAcStatementFutureTradeRecord')"
              :columns="importColumns"
              @imported="search"
          />
            <Button type="info" icon="ios-cloud-download-outline" v-if="isShow('H_ExportAcStatementFutureTradeRecord')" :loading="isExporting"
                  @click="onExport">导出
          </Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="doResetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="margin-bottom-10">
      <Table size="small" border
             :loading="isLoading"
             :columns="columns"
             :data="list"
             @on-selection-change="onSelectionChange"
             v-maxHeight
      />
    </div>
    <div>
      <QcPage
          size="small"
          show-total
          show-elevator
          show-sizer
          :current="pagination.currentPage"
          :total="pagination.totalCount"
          :page-size="pagination.pageSize"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script>
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    name: 'StatementFutureTradeList',
    props: [ 'settlementDate', 'tradeAccountId', 'commodityTypeId', 'instrumentCategoryId', 'instrumentId', 'isBuy', 'reportDate' ],
    async created() {
      this.query = utils.saveQuery(this.query, 'get');
      let {  statementDate, tradeAccountId } = this.$route.params
      if(statementDate) {
        this.query.accountingDateRange =  [statementDate, statementDate]
      }
      if(tradeAccountId) {
        this.query.tradeAccountId = tradeAccountId
      }
      await this.getCommonData();
      await this.search();
    },
    data() {
      return {
        formName: 'batchEditForm',
        model: {
          id: '',
          tradeDate: '',
          settlementDate: '',
          accountingEntityId: '',
          accountingEntity: '',
          corporationId: '',
          corporation: '',
          tradeAccountId: '',
          tradeAccount: '',
          instrumentCategoryId: '',
          instrumentId: '',
          exchange: '',
          commodityType: '',
          commodityTypeId: '',
          instrumentCode: '',
          volume: '',
          price: '',
          totalAmount: '',
          commission: '',
          isBuy: '',
          isClose: '',
          isHistory: '',
          isVirtual: '',
          trader: '',
          operator: '',
          tradingStrategyId: '',
          tradingStrategy: '',
          tradeTime: '',
          tradeNumber: '',
          requestNumber: '',
          remark: '',
          lastManipulationTime: '',
          lastManipulationBy: '',
          isLocked: '',
          isDeleted: '',
          dataSourceType: '',
          fillId: '',
          hedgeFlagType: '',
          subAccount: '',
          isBuyText: '',
          isCloseText: '',
          isHistoryText: '',
          isVirtualText: '',
          dataSourceTypeText: '',
          lastManipulationByText: ''
        },
        defaultModel: {
          id: '',
          tradeDate: '',
          settlementDate: '',
          accountingEntityId: '',
          accountingEntity: '',
          corporationId: '',
          corporation: '',
          tradeAccountId: '',
          tradeAccount: '',
          instrumentCategoryId: '',
          instrumentId: '',
          exchange: '',
          commodityType: '',
          commodityTypeId: '',
          instrumentCode: '',
          volume: '',
          price: '',
          totalAmount: '',
          commission: '',
          isBuy: '',
          isClose: '',
          isHistory: '',
          isVirtual: '',
          trader: '',
          operator: '',
          tradingStrategyId: '',
          tradingStrategy: '',
          tradeTime: '',
          tradeNumber: '',
          requestNumber: '',
          remark: '',
          lastManipulationTime: '',
          lastManipulationBy: '',
          isLocked: '',
          isDeleted: '',
          dataSourceType: '',
          fillId: '',
          hedgeFlagType: '',
          subAccount: '',
          isBuyText: '',
          isCloseText: '',
          isHistoryText: '',
          isVirtualText: '',
          dataSourceTypeText: '',
          lastManipulationByText: ''
        },
        modelRules: {},
        isLoading: false,
        isExporting: false,
        isBatchEditModalShow: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        columns: [
          // {
          //   type: 'selection',
          //   minWidth: 60,
          //   align: 'center'
          // },
          {
            title: '结算日期',
            key: 'settlementDate',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.settlementDate))
          },
          {
            title: '成交日期',
            key: 'tradeDate',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.tradeDate))
          },
          {
            title: '资金账户',
            key: 'tradeAccount',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '合约',
            key: 'instrumentText',
            minWidth: 150,
            align: 'center'
          },
          {
            title: '方向',
            key: 'isBuyText',
            minWidth: 50,
            align: 'center'
          },
          {
            title: '手数',
            key: 'volume',
            minWidth: 80,
            align: 'center',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.volume,
                fixed: 0
              }
            })
          },
          {
            title: '成交价',
            key: 'price',
            minWidth: 120,
            align: 'center',
            render(h, param) {
              return <format-cell>{param.row.price}</format-cell>
            },

          },
          {
            title: '成交额',
            key: 'totalAmount',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.totalAmount
              }
            })
          },
          {
            title: '开/平',
            key: 'isCloseText',
            minWidth: 50,
            align: 'center'
          },
          {
            title: '投/保',
            key: 'hedgeFlagType',
            minWidth: 50,
            align: 'center'
          },
          {
            title: '手续费',
            key: 'commission',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.commission
              }
            })
          },
          {
            title: '平仓盈亏',
            key: 'closingProfitLoss',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.closingProfitLoss
              }
            })
          },
          {
            title: '成交时间',
            key: 'tradeTime',
            minWidth: 140,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.tradeTime, 'HH:mm:ss'))
          },
          {
            title: '成交序号',
            key: 'tradeNumber',
            minWidth: 150,
            align: 'center',
          },
          {
            title: '法人',
            key: 'corporation',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '交易所',
            key: 'exchange',
            minWidth: 100,
            align: 'center',
          },
          {
            title: '数据来源',
            key: 'dataSourceType',
            minWidth: 100,
            align: 'center',
            render: (h, param) => {
              return h(
                'span',
                {
                  class: param.row.dataSourceType !== 1 ? 'orange' : 'blue'
                },
                utils.showText(
                  this.commonData.acDataSourceType,
                  param.row.dataSourceType
                )
              );
            }
          },
          {
            title: '更新人',
            key: 'lastManipulationByText',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'lastManipulationTime',
            minWidth: 140,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 100,
            fixed: 'right',
            render: (h, param) => {
              return h('div', [
                h(
                  'Tooltip',
                  {
                    props: {
                      content: '编辑',
                      placement: 'top',
                      transfer: true
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        size: 'small',
                        icon: 'md-create'
                      },
                      style: {
                        marginRight: '3px',
                        display: this.isShow('H_UpdateAcStatementFutureTradeRecord') && param.row.dataSourceType === 0  ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onEdit(param);
                        }
                      }
                    })
                  ]
                ),
                h(
                  'Tooltip',
                  {
                    props: {
                      content: '删除',
                      placement: 'top',
                      transfer: true
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        size: 'small',
                        icon: 'md-trash'
                      },
                      style: {
                        display: this.isShow('H_DeleteAcStatementFutureTradeRecord') && param.row.dataSourceType === 0 ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onDelete(param);
                        }
                      }
                    })
                  ]
                )
              ]);
            }
          }
        ],
        importColumns: [
          {
            title: '结算日期',
            key: 'settlementDate',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.settlementDate))
          },
          {
            title: '成交日期',
            key: 'tradeDate',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.tradeDate))
          },
          // {
          //   title: '法人',
          //   key: 'corporation',
          //   minWidth: 120,
          //   align: 'center',
          // },
          {
            title: '资金账户',
            key: 'tradeAccount',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '合约',
            key: 'instrumentCode',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '方向',
            key: 'isBuy',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.showText(this.directions, param.row.isBuy + ''))
          },
          {
            title: '手数',
            key: 'volume',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.volume
              }
            })
          },
          {
            title: '成交价',
            key: 'price',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.price
              }
            })
          },
          {
            title: '成交额',
            key: 'totalAmount',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.totalAmount
              }
            })
          },
          {
            title: '开/平',
            key: 'isClose',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.showText(this.openCloseList, param.row.isClose + ''))
          },
          {
            title: '投/保',
            key: 'hedgeFlagType',
            minWidth: 100,
            align: 'center',
          },
          {
            title: '手续费',
            key: 'commission',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.commission
              }
            })
          },
          {
            title: '平仓盈亏',
            key: 'closingProfitLoss',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.closingProfitLoss
              }
            })
          },
          {
            title: '成交时间',
            key: 'tradeTime',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.tradeTime, 'HH:mm:ss'))
          },
          {
            title: '成交序号',
            key: 'tradeNumber',
            minWidth: 120,
            align: 'center',
          }
        ],
        list: [],
        query: {
          accountingDateRange: [],
          exchangeId: '',
          instrumentCategoryId: '',
          corporationId: '',
          tradeAccountId: '',
          commodityTypeId: '',
          instrumentId: '',
          isBuy: '',
          isClose: '',
          tradeDateRange: '',
          dataSourceType: '',
        },
        defaultQuery: {
          accountingDateRange: [],
          exchangeId: '',
          instrumentCategoryId: '',
          corporationId: '',
          tradeAccountId: '',
          commodityTypeId: '',
          instrumentId: '',
          isBuy: '',
          isClose: '',
          tradeDateRange: [],
          dataSourceType: '',
        },
        commonData: {
          commodityTypes: [],
          instrumentCategories: [],
          corporations: [],
          tradeAccounts: [],
          users: []
        },
        selections: [],
        directions: [ { text: '买', value: 'true' }, { text: '卖', value: 'false' } ],
        openCloseList: [ { text: '开', value: 'false' }, { text: '平', value: 'true' } ],
        hedgeFlagTypes: [ { text: '投机', value: '投机' }, { text: '保值', value: '保值' } ]
      };
    },
    computed: {
      instrumentCategoriesFilterByCommodityTypeInModal() {
        return this.commonData.instrumentCategories.filter(t => t.commodityTypeId === this.model.commodityTypeId);
      },
      tradeAccounts() {
        if (this.query.corporationId) {
          return this.commonData.tradeAccounts.filter(t => t.corporation === this.query.corporationId);
        } else {
          return this.commonData.tradeAccounts;
        }
      },
      instrumentQuery () {
        const exchangeText = utils.showText(this.commonData.exchanges, this.query.exchangeId);
        return [{
          key: 'marketId',
          text: '交易所',
          id: this.query.exchangeId,
          code: `${this.query.exchangeId ? exchangeText : ''}`,
          required: false
        }];
      },
      instrumentQueryModal () {
        const instrumentCategoryObj = this.instrumentCategoriesFilterByCommodityTypeInModal.find(val => val.value === this.model.instrumentCategoryId);
        const instrumentCategoryText = instrumentCategoryObj ? instrumentCategoryObj.text : '';
        const commodityTypeObj = this.commonData.commodityTypes.find(val => val.value === this.model.commodityTypeId);
        const commodityTypeText = commodityTypeObj ? commodityTypeObj.text : '';
        return [{
          key: 'instrumentCategoryId',
          text: '标准合约',
          id: this.model.instrumentCategoryId,
          code: `${this.model.instrumentCategoryId ? instrumentCategoryText : ''}`,
          required: true
        }, {
          key: 'commodityTypeId',
          text: '品类',
          id: this.model.commodityTypeId,
          code: `${this.model.commodityTypeId ? commodityTypeText : ''}`,
          required: true
        }];
      }
    },
    mounted() {
      let query = this.$route.query
      if(Object.keys(query).length){
        if(query.tradeAccountId) {
          this.query.tradeAccountId = query.tradeAccountId*1
        }
        this.query.instrumentId = query.instrumentId
        this.query.isBuy = query.isBuy
        if(query.reportDate) {
          this.query.accountingDateRange[0] = query.reportDate
          this.query.accountingDateRange[1] = query.reportDate
        }
      }
    },
    methods: {
      onSearch() {
        this.pagination.currentPage = 1;
        this.search();
      },

      async search() {
        utils.saveQuery(this.query);
        const query = Object.assign({}, this.query, {
          settlementDateBegin: this.query.accountingDateRange[0],
          settlementDateEnd: this.query.accountingDateRange[1],
          tradeDateBegin: this.query.tradeDateRange[0],
          tradeDateDateEnd: this.query.tradeDateRange[1]
        });
        query.accountingDateRange = utils.dateRangeToKebabCase(query.accountingDateRange);
        query.tradeDateRange = utils.dateRangeToKebabCase(query.tradeDateRange);
        this.isLoading = true;
        let { list, pagination } = await api.list(query, this.pagination).finally(() => {
          this.isLoading = false;
        });
        this.pagination = pagination;
        this.list = list;
      },

      async getCommonData() {
        this.commonData = await api.getCommonData();
      },

      onAdd() {
        this.$router.push({
          name: 'StatementFutureTradeCreate'
        });
      },

      doCancel() {
        this.$refs[this.formName].resetFields();
        this.model = Object.assign({}, this.defaultModel);
        this.toggleBatchEditModal();
      },

      doBatchEdit() {
        this.$refs[this.formName].validate(async (valid) => {
          if (valid) {
            if (this.selections.length === 0) {
              this.$Message.info('请至少选择一条数据');
              return;
            }
            this.model.objectIds = this.selections.map(t => t.id);
            await api.batchEdit(this.model);
            this.$Message.success('批量编辑成功');
            this.search();
          }
        });
      },

      toggleBatchEditModal() {
        if (this.selections.length === 0) {
          this.$Message.info('请至少选择一条数据');
          return;
        }
        this.isBatchEditModalShow = !this.isBatchEditModalShow;
      },

      async doBatchDelete() {
        this.$Modal.confirm({
          title: '批量删除',
          content: `<p>将删除所选中数据，确认继续？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            this.$Message.success('批量删除成功');
            const ids = this.selections.map(t => t.id);
            await api.batchDelete(ids);
            this.search();
          }
        });
      },

      async onExport() {
        this.isExporting = true;
        const query = Object.assign({}, this.query, {
          settlementDateBegin: this.query.accountingDateRange[0],
          settlementDateEnd: this.query.accountingDateRange[1],
          tradeDateBegin: this.query.tradeDateRange[0],
          tradeDateDateEnd: this.query.tradeDateRange[1]
        });
        query.accountingDateRange = utils.dateRangeToKebabCase(query.accountingDateRange);
        query.tradeDateRange = utils.dateRangeToKebabCase(query.tradeDateRange);
        await api.exportExcel(query, `结算单交易记录${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`).finally(() => {
          this.isExporting = false;
        });
      },

      doResetQuery() {
        this.query = Object.assign({}, this.defaultQuery);
      },

      onEdit(param) {
        this.$router.push({
          name: 'StatementFutureTradeEdit',
          query: {
            id: param.row.id
          }
        });
      },

      onDelete(param) {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>您确认需要删除此条结算单交易记录？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            api.delete(param.row.id).then(res => {
              if (res && res.message) {
                this.$Message.error(res.message);
              } else {
                this.$Message.success('删除成功');
              }
              this.search();
            })
              .catch(() => {});
          }
        });
      },

      onPageChange(currentPage) {
        this.pagination.currentPage = currentPage;
        this.search();
      },

      onPageSizeChange(pageSize) {
        this.pagination.pageSize = pageSize;
        this.search();
      },

      isShow(permission) {
        return utils.hasPermission(permission);
      },

      onSelectionChange(selections) {
        this.selections = selections;
      }
    }
  };
</script>
