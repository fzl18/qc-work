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
                    placeholder="生效日期"
                    v-model="query.dateRange"
            ></DatePicker>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="法人" filterable clearable v-model="query.CorporationId">
              <Option
                      v-for="(item, index) in commonData.alluserCorporations"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.value}} - {{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="资金账户" filterable clearable v-model="query.TradeAccountId">
              <Option
                      v-for="(item, index) in allTradeAccounts"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.value}} - {{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="标准合约" filterable clearable v-model="query.InstrumentCategoryId">
              <Option
                      v-for="(item, index) in commonData.allInstrumentCategories"
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
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_AddAcCommissionRate')">添加</Button>
          <file-upload
                  tempName="手续费率导入模板"
                  action="acCommissionRate/Preview"
                  import="acCommissionRate/Import"
                  download="acCommissionRate/DownLoadTemple"
                  :columns="importColumns"
                  @imported="imported"
                  v-if="isShow('H_ImportAcCommissionRate')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState"
                  v-if="isShow('H_ExportAcCommissionRate')">导出
          </Button>
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
  import { utils } from '@/utils/utils'
  import api from './api'

  export default {
    data () {
      return {
        commonData: {
          options: {},
          enums: {},
          allTradeAccounts: []
        },
        query: {
          dateRange: [],
          EffectiveStartDate: '',
          EffectiveEndDate: '',
          CorporationId: '',
          TradeAccountId: '',
          InstrumentCategoryId: ''
        },
        list: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        LoadingExportState: false,
        columns: [
          {
            title: '生效日期',
            key: 'effectiveDate',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.effectiveDate, 'YYYY-MM-DD'))
            }
          },
          {
            title: '资金账户',
            key: 'tradeAccountId',
            align: 'center',
            minWidth: 150,
            render: (h, params) => {
              return h(
                "span",
                utils.showText(
                  this.commonData.allTradeAccounts,
                  params.row.tradeAccountId
                )
              );
            }
          },
          {
            title: '标准合约',
            key: 'instrumentCategoryId',
            align: 'center',
            minWidth: 100,
            render: (h, params) => {
              return h(
                "span",
                utils.showText(
                  this.commonData.allInstrumentCategories,
                  params.row.instrumentCategoryId
                )
              );
            }
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            align: 'center',
            minWidth: 80
          },
          {
            title: '开仓手续费（按手数）',
            key: 'openPerLot',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
              return <format-cell fixed={false}>{params.row.openPerLot}</format-cell>
            }
          },
          {
            title: '开仓手续费（按金额）',
            key: 'openProportion',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
             return <format-cell fixed={false}>{params.row.openProportion}</format-cell>
            }
          },
          {
            title: '平今手续费（按手数）',
            key: 'closeTodayPerLot',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
             return <format-cell fixed={false}>{params.row.closeTodayPerLot}</format-cell>
            }
          },
          {
            title: '平今手续费（按金额）',
            key: 'closeTodayProportion',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
               return <format-cell fixed={false}>{params.row.closeTodayProportion}</format-cell>
            }
          },
          {
            title: '平仓手续费（按手数）',
            key: 'closePerLot',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
              return <format-cell fixed={false}>{params.row.closePerLot}</format-cell>
            }
          },
          {
            title: '平仓手续费（按金额）',
            key: 'closeProportion',
            align: 'center',
            minWidth: 130,
            render: (h, params) => {
              return <format-cell fixed={false}>{params.row.closeProportion}</format-cell>
            }
          },
          {
            title: '法人',
            key: 'corporationText',
            align: 'center',
            minWidth: 80
          },
          {
            title: '更新人',
            key: 'lastManipulationName',
            align: 'center',
            minWidth: 60
          },
          {
            title: '更新时间',
            align: 'center',
            minWidth: 125,
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
            }
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
                        display: this.isShow('H_EditAcCommissionRate') ? 'block' : 'none'
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
                        display: this.isShow('H_RemovecCommissionRate') ? 'block' : 'none'
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
        ],
        importColumns: [
          {
            title: '生效日期',
            key: 'effectiveDateShort',
            align: 'center',
            width: 160,
            render: (h, params) => {
              return h('span', utils.formatDate(params.row.effectiveDateShort, 'YYYY-MM-DD'))
            }
          },
          {
            title: '资金账户',
            key: 'tradeAccountText',
            align: 'center',
            width: 150
          },
          {
            title: '标准合约',
            key: 'instrumentCategoryText',
            align: 'center',
            width: 150
          },
          {
            title: '具体合约',
            key: 'instrumentText',
            align: 'center',
            width: 150
          },
          {
            title: '开仓手续费（按手数）',
            key: 'openPerLot',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.openPerLot < 0 ? 'red' : ''
                  }
                },
                utils.formatNum(params.row.openPerLot)
              )
            }
          },
          {
            title: '开仓手续费（按金额）',
            key: 'openProportion',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.openProportion < 0 ? 'red' : ''
                  }
                },
                utils.formatNum(params.row.openProportion)
              )
            }
          },
          {
            title: '平今手续费（按手数）',
            key: 'closeTodayPerLot',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.closeTodayPerLot < 0 ? 'red' : ''
                  }
                },
                utils.formatNum(params.row.closeTodayPerLot)
              )
            }
          },
          {
            title: '平今手续费（按金额）',
            key: 'closeTodayProportion',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.closeTodayProportion < 0 ? 'red' : ''
                  }
                },
                utils.formatNum(params.row.closeTodayProportion)
              )
            }
          },
          {
            title: '平仓手续费（按手数）',
            key: 'closePerLot',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.closePerLot < 0 ? 'red' : ''
                  }
                },
                utils.formatNum(params.row.closePerLot)
              )
            }
          },
          {
            title: '平仓手续费（按金额）',
            key: 'closeProportion',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.closeProportion < 0 ? 'red' : ''
                  }
                },
                utils.formatNum(params.row.closeProportion)
              )
            }
          }
        ]
      }
    },
    async created () {
      this.query = utils.saveQuery(this.query, 'get');
      this.commonData = await this.api.getCommonData('AcCommissionRate');
      this.search()
    },
    computed: {
      allTradeAccounts () {
        return !this.query.CorporationId ? [] : this.commonData.allTradeAccounts.filter(val => val.corp === this.query.CorporationId)
      }
    },
    methods: {
      onAdd () {
        this.$router.push({
          name: 'CommissionRateConfigurationCreate'
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
          EffectiveStartDate: this.query.dateRange[0],
          EffectiveEndDate: this.query.dateRange[1]
        };
        let { list, pagination } = await api.list(query, this.pagination)
        this.pagination = pagination
        this.list = list
      },
      resetQuery () {
        this.query = {}
        this.query.dateRange = []
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
          name: 'CommissionRateConfigurationEdit',
          query: { id: params.row.id }
        })
      },
      imported () {
        this.search()
      },
      onExport () {
        this.LoadingExportState = true;
        let query = {
          ...this.query,
          EffectiveStartDate: this.query.dateRange[0],
          EffectiveEndDate: this.query.dateRange[1]
        };
        api.exportExcel(
          query,
          `手续费率${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      isShow (permission) {
        return utils.hasPermission(permission)
      }
    }
  }
</script>
