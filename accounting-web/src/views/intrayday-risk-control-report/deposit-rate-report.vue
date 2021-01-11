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
                      :value="item.qctKey"
                      :key="index"
              >{{ item.value }} - {{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
             <Select placeholder="标准合约" filterable clearable v-model="query.instrumentCategoryQctkey">
              <Option
                      v-for="(item, index) in commonData.instrumentCategories"
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
          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportMarginRate')" class="margin-right-3">导出</Button>
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
          enums: {}
        },
        query: {
          agentId: '',
          instrumentCode:'',
          instrumentCategoryId: ''
        },
        list: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        columns: [
          // {
          //   title: '法人',
          //   key: 'corporation',
          //   align: 'center',
          //   render: (h, params) => {
          //     return h(
          //       'span',
          //       utils.showText(
          //         this.commonData.corporations,
          //         params.row.corporation,
          //         null,
          //         'code'
          //       )
          //     )
          //   }
          // },
          {
            title: '资金账户',
            key: 'tradeAccountText',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '标准合约',
            key: 'instrumentCategoryCode',
            minWidth: 120,
            align: 'center'

          },
          {
            title: '具体合约',
            key: 'instrumentCode',
            minWidth: 120,
            align: 'center'

          },
          {
            title: '多头保证金率（按手数）',
            key: 'longMarginRatioByVolume',
            minWidth: 120,
            align: 'center',
            render:(h, params) => {
              return <format-cell fixed={false}>{params.row.longMarginRatioByVolume}</format-cell>
            },
          },
          {
            title: '多头保证金率（按金额）',
            key: 'longMarginRatioByMoney',
            minWidth: 120,
            align: 'center',
            render:(h, params) => {
              return <format-cell fixed={false}>{params.row.longMarginRatioByMoney}</format-cell>
            },
          },
          {
            title: '空头保证金率（按手数）',
            key: 'shortMarginRatioByVolume',
            minWidth: 120,
            align: 'center',
             render:(h, params) => {
              return <format-cell fixed={false}>{params.row.shortMarginRatioByVolume}</format-cell>
            },
          },
          {
            title: '空头保证金率（按金额）',
            key: 'shortMarginRatioByMoney',
            minWidth: 120,
            align: 'center',
            render:(h, params) => {
              return <format-cell fixed={false}>{params.row.shortMarginRatioByMoney}</format-cell>
            },
          },
          {
            title: '交易日',
            key: 'tradeDateShort',
            minWidth: 120,
            align: 'center'
          }
        ],
        lastUpdateTime: null
      }
    },
    async created () {
      this.query = this.utils.saveQuery(this.query, 'get')
      let commonData = await this.api.getCommonData('DepositRate')
      this.commonData = commonData
      this.search()
    },
    mounted () {
    },
    methods: {
      onSearch () {
        this.pagination.currentPage = 1
        this.search()
      },
      async search () {
        this.utils.saveQuery(this.query)
        let query = { ...this.query }
        let { list, pagination } = await api.DepositRateList(
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
        api.exportToExcel(
          query,
          `原始保证金率${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
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
