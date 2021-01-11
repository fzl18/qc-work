<template>
  <div>
    <div>
      <qc-collapse>
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
                    placeholder="资金账户"
                    filterable
                    clearable
                    v-model="query.agentId"
            >
              <Option
                      v-for="(item, index) in commonData.tradeAccounts"
                      :label="item.text"
                      :value="item.code"
                      :key="index"
              >{{ item.code }} - {{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <InstrumentSelect @change="instrumentChange" :filterQuery="instrumentQuery" v-model="query.instrumentCode" placeholder="组合合约"></InstrumentSelect>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
                    placeholder="买卖"
                    filterable
                    clearable
                    v-model="query.isBuy"
            >
              <Option
                      v-for="(item, index) in [
                                  { text: '买', value: 'true' },
                                  { text: '卖', value: 'false' }
                              ]"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{ item.text }}</Option
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
            "YYYY-MM-DD HH:mm:ss"
            )
            }}
          </p>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button
                  icon="md-close-circle"
                  @click="resetQuery"
                  class="margin-right-3"
          >清空</Button
          >
          <Button
                  type="primary"
                  icon="md-search"
                  class="margin-right-3"
                  @click="onSearch"
          >搜索</Button
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
  </div>
</template>
<script>
  import { utils } from "@/utils/utils";
  import api from "./api";
  import FormatCell from "../../components/FormatCell";

  export default {
    components: { FormatCell },
    data () {
      return {
        commonData: {
          options: {
            financialInstrumentType: []
          },
          enums: {}
        },
        query: {},
        list: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        lastUpdateTime: null,
        columns: [
          {
            title: '资金账户',
            key: 'agentId',
            align: 'center',
            minWidth: 140,
            render: (h, params) => {
              return h(
                'span',
                utils.showText(
                  this.commonData.tradeAccounts,
                  params.row.agentId,
                  null,
                  'code'
                )
              );
            }
          },
          {
            title: '交易所',
            key: 'exchange',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h(
                'span',
                utils.showText(
                  this.commonData.exchanges,
                  params.row.exchange,
                  null,
                  'code'
                )
              );
            }
          },
          {
            title: '组合合约',
            key: 'combineContract',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '买卖',
            key: 'isBuy',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h('span', params.row.isBuy ? '买' : '卖');
            }
          },
          {
            title: '今昨',
            key: 'history',
            minWidth: 80,
            align: 'center'
          },
          {
            title: '投保',
            key: 'hedge',
            minWidth: 80,
            align: 'center'
          },
          {
            title: '持仓',
            key: 'position',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.position
                  }
                },
              );
            }
          },
          {
            title: '持仓均价',
            key: 'positionAverage',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.positionAverage
                  }
                },
              );
            }
          },
          {
            title: '占用保证金',
            key: 'usedMargin',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.usedMargin
                  }
                },
              );
            }
          }
        ],
        instrumentCode: ''
      };
    },
    async created () {
      this.query = this.utils.saveQuery(this.query, 'get')
      let commonData = await this.api.getCommonData('IntraydayRiskControl');
      this.commonData = commonData;
      this.search();
    },
    computed: {
      instrumentQuery () {
        const id = this.commonData.options.financialInstrumentType.find(o => o.text === "组合");
        return [{
          key: 'financialInstrumentType',
          text: '合约类型',
          id: id && id.value,
          code: '组合合约',
          required: true
        }];
      }
    },
    methods: {
      instrumentChange (data) {
        this.instrumentCode = data && data.code;
      },
      onSearch () {
        this.pagination.currentPage = 1;
        this.search();
      },
      async search () {
        this.utils.saveQuery(this.query)
        let query = { ...this.query, instrumentCode: this.instrumentCode };
        let { list, pagination } = await api.listPortfolioContractPosition(
          query,
          this.pagination
        );
        this.pagination = pagination;
        this.list = list;
        this.lastUpdateTime = new Date();
      },
      resetQuery () {
        this.query = {};
        this.tradingDateRange = [];
      },
      onPageChange (page) {
        this.pagination.currentPage = page;
        this.search();
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize;
        this.search();
      }
    }
  };
</script>
