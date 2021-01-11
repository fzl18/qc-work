<template>
  <div>
    <div>
      <qc-collapse>
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
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
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
                    placeholder="资金账户"
                    filterable
                    clearable
                    v-model="query.agentIds"
            >
              <Option
                      v-for="(item, index) in commonData.tradeAccounts"
                      :label="item.text"
                      :value="item.code"
                      :key="index"
              >{{ item.value }} - {{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <InstrumentSelect
                    @change="instrumentChange"
                    :allDate="true"
                    :filterQuery="[]"
                    v-model="query.instrumentCode"></InstrumentSelect>
          </Col>
        </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <span style="line-height: 32px; color: #2d8cf0; margin-left:10px;">
            最后刷新时间：{{
            utils.formatDate(
            lastUpdateTime,
            'YYYY-MM-DD HH:mm:ss'
            )
            }}
          </span>
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
    <pc-account-position-detail :commonData='commonData' @save='search' ref="pcAccountPositionDetail" />
  </div>
</template>
<script>
  import FormatCell from '../../components/FormatCell';
  import { utils } from '@/utils/utils';
  import api from './api';
  import pcAccountPositionDetail from './pc_account_position_detail'
  export default {
    components: { FormatCell, pcAccountPositionDetail },
    data () {
      return {
        commonData: {
        options: {},
        enums: {}
        },
        instrumentCode: '',
        query: {
          accountIds: '',
          agentIds: '',
          instrumentCode: '',
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
            key: 'accountName',
            align: 'center',
            minWidth: 120
          },
          {
            title: '资金账户',
            key: 'agentCode',
            align: 'center',
            minWidth: 120
          },
          {
            title: '合约',
            key: 'instrumentCode',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '买卖',
            key: 'isPurchase',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.isPurchase
                      ? 'rgba(252, 2, 34, 1)'
                      : 'rgba(2, 248, 79, 1)'
                  }
                },
                params.row.isPurchase ? '买' : '卖'
              );
            }
          },
          {
            title: '投保',
            minWidth: 80,
            key: 'isHedge',
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                params.row.isHedge ? '保值' : '投机'
              );
            }
          },
          {
            title: '总仓',
            minWidth: 80,
            key: 'totalLots',
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.totalLots,
                    fixed: 0
                  }
                },
              );
            }
          },
          {
            title: '昨仓',
            minWidth: 80,
            key: 'previousLots',
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.previousLots,
                    fixed: 0
                  }
                },
              );
            }
          },
          {
            title: '今仓',
            minWidth: 80,
            key: 'todayLots',
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.todayLots,
                    fixed: 0
                  }
                },
              );
            }
          },
          {
            title: '最新价',
            key: 'price',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.price
                  }
                },
              );
            }
          },
          {
            title: '开仓均价',
            key: 'averageByDate',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.averageByDate
                  }
                },
              );
            }
          },
          {
            title: "浮动盈亏",
            key: "positionPnLByDate",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.positionPnLByDate
                  }
                },
              )
            }
          },
          {
            title: "浮动盈亏（本币）",
            key: "positionPnLByDateByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.positionPnLByDateByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: '可平量',
            align: 'center',
            minWidth: 120,
            key: 'offsetLots',
            render: (h, { row }) => h('format-cell', {
              props: {
                num: utils.formatNum(row.offsetLots)
              }
            })
          },
          {
            title: '可平今量',
            align: 'center',
            minWidth: 120,
            key: 'todayOffsetLots',
            render: (h, { row }) => h('format-cell', {
              props: {
                num: utils.formatNum(row.todayOffsetLots)
              }
            })
          },
          {
            title: '平仓冻结',
            align: 'center',
            minWidth: 120,
            key: 'pending',
            render: (h, { row }) => h('format-cell', {
              props: {
                num: utils.formatNum(row.pending)
              }
            })
          },
          {
            title: '行权冻结',
            align: 'center',
            minWidth: 120,
            key: 'strikePending',
            render: (h, { row }) => h('format-cell', {
              props: {
                num: utils.formatNum(row.strikePending)
              }
            })
          },
          {
            title: '放弃行权冻结',
            align: 'center',
            minWidth: 120,
            key: 'abandonStrikePending',
            render: (h, { row }) => h('format-cell', {
              props: {
                num: utils.formatNum(row.abandonStrikePending)
              }
            })
          },
          {
            title: '今买',
            key: 'buys',
            minWidth: 80,
            align: 'center',
            render: (h, { row }) => h('format-cell', {
              props: {
                fixed: 0,
                num: utils.formatNum(row.buys)
              }
            })
          },
          {
            title: '今卖',
            key: 'sells',
            minWidth: 80,
            align: 'center',
            render: (h, { row }) => h('format-cell', {
              props: {
                fixed: 0,
                num: utils.formatNum(row.sells)
              }
            })
          },
          {
            title: '占用保证金',
            minWidth: 120,
            key: 'usedMargin',
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.usedMargin
                  }
                },
              );
            }
          },
          {
            title: '占用保证金（本币）',
            minWidth: 120,
            key: 'usedMarginByFuncCurrency',
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
            title: '币种',
            key: 'currencyId',
            minWidth: 80,
            align: 'center',
          },
          {
            title: '汇率',
            align: 'center',
            key: 'exchangeRate',
            minWidth: 120,
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.exchangeRate
                  }
                },
              );
            }
          },
          {
            title: '交易所',
            key: 'exchangeName',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (h, params) => {
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
                        display: this.isShow('H_SearchProfitCenterAccountPositionReport') ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onShowDetail(params);
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
    mounted () {
    },
    methods: {
      instrumentChange (data) {
        this.instrumentCode = data && data.code
      },
      onSearch () {
        this.pagination.currentPage = 1;
        this.search();
      },
      async search () {
        this.utils.saveQuery(this.query);
        let query = _.assign({}, this.query, { instrumentCode: this.instrumentCode }, {
          accountIds: this.query.accountIds ? [this.query.accountIds] : [],
          agentIds: this.query.agentIds ? [this.query.agentIds] : []
        });
        let { list, pagination } = await api.listAccountPositionList(
          query,
          this.pagination
        );
        this.list = list;
        this.pagination = pagination;
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
      onShowDetail (params) {
        this.$refs.pcAccountPositionDetail.show(params.row);
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
