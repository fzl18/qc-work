<template>
  <div>
    <div>
      <qc-collapse>
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="资金账户" filterable clearable v-model="query.TradeAccountId">
              <Option
                      v-for="(item, index) in commonData.foreignTradeAccounts"
                      :label="item.name"
                      :value="item.wfTradeAccountId"
                      :key="index"
              >{{item.wfTradeAccountId}} - {{item.name}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="交易所" filterable clearable v-model="query.ExchangeId">
              <Option
                      v-for="(item, index) in commonData.foreignExchanges"
                      :label="item.shortName"
                      :value="item.wfCompanyId"
                      :key="index"
              >{{item.wfCompanyId}} - {{item.shortName}}
              </Option>
            </Select>
          </Col>
        </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcTradeSettlementDateConfig')">添加</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
              size="small"
              border
              class="margin-bottom-10"
              :loading="tableLoading"
              :columns="columns"
              :data="mapList"
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
  import { utils } from '@/utils/utils'
  import api from './api'

  export default {
    data () {
      return {
        commonData: {
          options: {},
          enums: {}
        },
        query: {
          TradeAccountId: '',
          ExchangeId: ''
        },
        mapList: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        columns: [
          {
            title: '资金账户',
            key: 'tradeAccountId',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h(
                "span",
                utils.showText(
                  this.commonData.foreignTradeAccounts,
                  params.row.tradeAccountId,
                  'name',
                  'wfTradeAccountId'
                )
              );
            }
          },
          {
            title: '交易所',
            key: 'exchangeId',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h(
                "span",
                utils.showText(
                  this.commonData.foreignExchanges,
                  params.row.exchangeId,
                  'shortName',
                  'wfCompanyId'
                )
              );
            }
          },
          {
            title: '今日/次日',
            key: 'type',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h(
                "span",
                utils.showText(
                  this.commonData.tradeSettlementDateConfigType,
                  params.row.type
                )
              );
            }
          },
          {
            title: '时间',
            key: 'confTime',
            minWidth: 100,
            align: 'center',
          },
          {
            title: '更新人',
            key: 'lastManipulatorName',
            minWidth: 80,
            align: 'center',
          },
          {
            title: '更新时间',
            key: 'lastManipulationTime',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.lastManipulationTime,"YYYY-MM-DD HH:mm:ss"))
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
                        display: this.isShow('H_UpdateAcTradeSettlementDateConfig') ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onEdit(params)
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
                        marginRight: '3px',
                        display: this.isShow('H_DeleteAcTradeSettlementDateConfig') ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onDelete(params)
                        }
                      }
                    })
                  ]
                )
              ])
            }
          }
        ]
      }
    },
    async created () {
      this.query = utils.saveQuery(this.query, 'get');
      this.commonData = await this.api.getCommonData('TradeSettlementDateConfig')
      this.search()
    },
    methods: {
      onAdd () {
        this.$router.push({
          name: 'ExternalSettlementTimeCreate'
        })
      },
      onSearch () {
        this.pagination.currentPage = 1
        this.search()
      },
      async search () {
        utils.saveQuery(this.query);
        let query = {
          ...this.query,
        }
        let { mapList, pagination } = await api.list(query, this.pagination)
        this.pagination = pagination
        this.mapList = mapList
      },
      resetQuery () {
        this.query = {}
      },
      onPageChange (page) {
        this.pagination.currentPage = page
        this.search()
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize
        this.search()
      },
      onDelete (params) {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>确认删除该条数据？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove()
            await api.delete(params.row.id)
            this.$Message.success(`删除成功!`)
            this.search()
          }
        })
      },
      onEdit (params) {
        this.$router.push({
          name: 'ExternalSettlementTimeEdit',
          query: { id: params.row.id }
        })
      },
      isShow (permission) {
        return utils.hasPermission(permission)
      }
    }
  }
</script>
