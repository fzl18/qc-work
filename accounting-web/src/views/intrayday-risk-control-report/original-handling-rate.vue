<template>
  <div>
    <div>
      <qc-collapse>
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
                    placeholder="法人"
                    filterable
                    clearable
                    v-model="query.corporation"
            >
              <Option
                      v-for="(item, index) in commonData.corporations"
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
                    v-model="query.tradeAccountQctKey"
            >
              <Option
                      v-for="(item, index) in allTradeAccounts"
                      :label="item.text"
                      :value="item.code"
                      :key="index"
              >{{ item.value }} - {{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
                    placeholder="标准合约"
                    filterable
                    clearable
                    v-model="query.instrumentCategoryQctKey"
            >
              <Option
                      v-for="(item, index) in commonData.instrumentCategories"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{ item.value }} - {{ item.text }}
              </Option
              >
            </Select>
          </Col>
        </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">

          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportOriginalFee')" class="margin-right-3">导出</Button>
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
  </div>
</template>
<script>
  import { utils } from '@/utils/utils'
  import api from './api'

  export default {
    data () {
      return {
        LoadingExportState: false,
        commonData: {
          options: {},
          enums: {},
          tradeAccounts: [],
          corporations: []
        },
        query: {
          corporation: '',
          contractCode: '',
          corporationName:'',
          instrumentCategoryQctKey:'',
          tradeAccountQctKey:''
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
            title: '法人',
            key: 'corporation',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h(
                'span',
                utils.showText(
                  this.commonData.corporations,
                  params.row.corporation,
                  null,
                  'code'
                )
              )
            }
          },
          {
            title: '资金账户',
            key: 'agentName',
            align: 'center',
            minWidth: 80
          },
          {
            title: '标准合约',
            key: 'contratId',
            align: 'center',
            minWidth: 80
          },
          {
            title: '具体合约',
            key: 'instrumentId',
            align: 'center',
            minWidth: 80
          },
          {
            title: '开仓手续费（按手数）',
            key: 'openCommissionByVolume',
            align: 'center',
            minWidth: 130,
            render: (h, params) =>{
              return <format-cell fixed={false}>{params.row.openCommissionByVolume}</format-cell>
            }
          },
          {
            title: '开仓手续费（按金额）',
            key: 'openCommissionByMoney',
            align: 'center',
            minWidth: 130,
             render: (h, params) =>{
              return <format-cell fixed={false}>{params.row.openCommissionByMoney}</format-cell>
            }
          },
          {
            title: '平今手续费（按手数）',
            key: 'closeTodayCommissionByVolume',
            align: 'center',
            minWidth: 130,
            render: (h, params) =>{
              return <format-cell fixed={false}>{params.row.closeTodayCommissionByVolume}</format-cell>
            }
          },
          {
            title: '平今手续费（按金额）',
            key: 'closeTodayCommissionByMoney',
            align: 'center',
            minWidth: 130,
            render: (h, params) =>{
              return <format-cell fixed={false}>{params.row.closeTodayCommissionByMoney}</format-cell>
            }
          },
          {
            title: '平仓手续费（按手数）',
            key: 'closeCommissionByVolume',
            align: 'center',
            minWidth: 130,
            render: (h, params) =>{
              return <format-cell fixed={false}>{params.row.closeCommissionByVolume}</format-cell>
            }
          },
          {
            title: '平仓手续费（按金额）',
            key: 'closeCommissionByMoney',
            align: 'center',
            minWidth: 130,
             render: (h, params) =>{
              return <format-cell fixed={false}>{params.row.closeCommissionByMoney}</format-cell>
            }
          },
          {
            title: '交易日',
            key: 'tradeDate',
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                utils.formatDate(
                    params.row.tradeDate,
                    "YYYY/MM/DD"
                )
              )
            },
            minWidth: 125
          }
        ],
        lastUpdateTime: null
      }
    },
    async created () {
      this.query = this.utils.saveQuery(this.query, 'get')
      let commonData = await this.api.getCommonData('IntraydayRiskControl')
      this.commonData = commonData
      this.search()
    },
    computed: {
      allTradeAccounts () {
        const corporation = this.commonData.corporations.find(val => val.code === this.query.corporation);
        const corporationId = corporation && corporation.value;
        return !this.query.corporation ? [] : this.commonData.tradeAccounts.filter(val => val.corporationId === corporationId)
      }
    },
    methods: {
      onSearch () {
        this.pagination.currentPage = 1
        this.search()
      },
      async search () {
        this.utils.saveQuery(this.query)
        let query = { ...this.query }
        let { list, pagination } = await api.getOriginalFeeReport(
          query,
          this.pagination
        )
        this.pagination = pagination
        this.list = list
        this.lastUpdateTime = new Date()
      },
      onExport () {
        this.LoadingExportState = true
        let query = { ...this.query };
        query.isUnpriced = false;
        api.exportExcel(
          query,
          `原始手续费率${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
        ).then(()=>{
          this.LoadingExportState = false
        })
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
      isShow(permission) {
        return utils.hasPermission(permission)
      }
    }
  }
</script>
