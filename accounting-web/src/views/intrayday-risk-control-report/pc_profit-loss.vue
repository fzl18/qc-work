<template>
  <div>
    <div>
      <qc-collapse>
        <Row type="flex" :gutter="16">
          <Col :zlg="3" :sm="6" :xs="12" class-name="margin-bottom-10">
            <Select
              placeholder="利润中心"
              filterable
              clearable
              v-model="query.accountIds"
            >
              <Option
                v-for="(item, index) in commonData.profitCenters"
                :label="item.text"
                :value="item.code"
                :key="index"
              >{{ item.code }} - {{ item.text }}
              </Option
              >
            </Select>
          </Col>
        </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <p style="line-height: 32px; color: #2d8cf0;">
            最后刷新时间：{{
            utils.formatDate(
            lastUpdateTime,
            'YYYY-MM-DD HH:mm:ss'
            )
            }}
          </p>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button
            icon="md-close-circle"
            @click="resetQuery"
            class="margin-right-3"
          >清空
          </Button
          >
          <Button
            type="primary"
            icon="md-search"
            class="margin-right-3"
            @click="onSearch"
          >搜索
          </Button
          >
        </Col>
      </Row>
    </div>
    <div>
      <Table
        size="small"
        border
        ref="table"
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
        v-maxHeight
      ></Table>
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
      ></QcPage>
    </div>
    <pc-profit-loss-detail :commonData='commonData' @search='search' ref='pcProfitLossDetail'/>
  </div>
</template>
<script>
  import { utils } from '@/utils/utils';
  import api from './api';
  import FormatCell from '../../components/FormatCell';
  import pcProfitLossDetail from './pc_profit_loss_detail';

  export default {
    components: { FormatCell, pcProfitLossDetail },
    data () {
      return {
        commonData: {
          options: {},
          enums: {}
        },
        query: {
          accountIds: ''
        },
        list: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        columns: [
          {
            title: '利润中心',
            key: 'name',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '授权资金',
            key: 'budget',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.budget
                  }
                },
              );
            }
          },
          {
            title: '可用资金',
            key: 'available',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.available
                  }
                },
              );
            }
          },
          {
            title: '保证金',
            key: 'usedMarginByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.usedMarginByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '冻结保证金',
            key: 'frozenMarginByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.frozenMarginByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '权利金',
            key: 'cashInByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.cashInByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '冻结权利金',
            key: 'frozenCashInByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.frozenCashInByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '止损线',
            key: 'stopLine',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.stopLine
                  }
                },
              );
            }
          },
          {
            title: '浮动盈亏',
            key: 'postionPnLByTradeByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.postionPnLByTradeByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '平仓盈亏',
            key: 'todayCloseProfitByTradeByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.todayCloseProfitByTradeByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '历史平仓盈亏',
            key: 'historyCloseProfitByTradeByFuncCurrency',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.historyCloseProfitByTradeByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '总盈亏',
            key: 'totalPnLByTradeByFuncCurrency ',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.totalPnLByTradeByFuncCurrency
                  }
                },
              );
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (h, params) => {
              let self = this;
              return h('div', [
                h(
                  'Tooltip',
                  {
                    props: {
                      content: '查看',
                      placement: 'top',
                      transfer: true
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        size: 'small',
                        icon: 'md-eye'
                      },
                      style: {
                        marginRight: '3px',
                        display: this.isShow('H_SearchProfitCenterPnLReport') ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          self.$refs.pcProfitLossDetail.show(params.row);
                        }
                      }
                    })
                  ]
                )
              ]);
            }
          }
        ],
        lastUpdateTime: null
      };
    },
    async created () {
      this.query = this.utils.saveQuery(this.query, 'get');
      let commonData = await this.api.getCommonData('IntraydayRiskControl');
      this.commonData = commonData;
      this.search();
    },
    methods: {
      onSearch () {
        this.pagination.currentPage = 1;
        this.search();
      },
      async search () {
        this.utils.saveQuery(this.query);
        let query = { accountIds: this.query.accountIds ? [this.query.accountIds] : [] };
        let { list, pagination } = await api.listPC_ProfitLoss(
          query,
          this.pagination
        );
        this.pagination = pagination;
        this.list = list;
        this.lastUpdateTime = new Date();
      },
      resetQuery () {
        this.query = {};
      },
      onPageChange (page) {
        this.pagination.currentPage = page;
        this.search();
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize;
        this.search();
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
