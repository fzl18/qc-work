<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.fullNameContains" :placeholder="$t('全称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.shortNameContains" :placeholder="$t('简称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('是否启用期货')"
              filterable
              clearable
              v-model="query.isETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('是否启用')"
              filterable
              clearable
              v-model="query.isDisabled"
            >
              <Option
                v-for="(item, index) in enums.isDisabledOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </Col>
        </Row>
      </Form>
    </qc-collapse>
    <Row type="flex" justify="space-between" :gutter="5">
      <Col class-name="margin-bottom-10">
        <Button
          type="primary"
          icon="md-add"
          @click="onAdd"
          v-if="isShow('H_CreateAcOtherPaymentRecord')"
        >添加
        </Button>
      </Col>
      <Col class-name="margin-bottom-10">
        <Button
          icon="md-close-circle"
          @click="resetQuery"
          class="margin-right-3"
        >清空
        </Button>
        <Button type="primary" icon="md-search" @click="onSearch">搜索</Button>
      </Col>
    </Row>
    <Table
      size="small"
      v-maxHeight
      border
      class="margin-bottom-10"
      :loading="false"
      :columns="listColumns"
      :data="list"
    ></Table>
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
    <view-modal ref="viewModal" :detail="item" :commonData="commonData"></view-modal>
  </div>
</template>

<script>
import enums from '@/utils/enums'
import { utils } from '@/utils/utils'
import api from './api'
import ViewModal from './components/viewModal'

export default {
  components: {
    ViewModal
  },
  data () {
    return {
      enums,
      query: {
        fullNameContains: '',
        shortNameContains: '',
        isETrading: '',
        isDisabled: ''
      },
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      listColumns: [
        {
          title: '唯一标识',
          key: 'accountingName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '全称',
          key: 'fullName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '简称',
          key: 'shortName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '缩写',
          key: 'abbreviation',
          align: 'center',
          minWidth: 120
        },
        {
          title: '本位币',
          key: 'ourCorporationFunctionalCurrencyId',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.currencies, row.ourCorporationFunctionalCurrencyId)}</span>
          }
        },
        {
          title: '是否境内',
          key: 'isDomestic',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.isDomestic === true ? '是' : row.isDomestic === false ? '否' : '')
          }
        },
        {
          title: '是否启用期货',
          key: 'isETrading',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.isETrading === true ? '是' : row.isETrading === false ? '否' : '')
          }
        },
        {
          title: '是否启用',
          key: 'isDisabled',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.isDisabled === true ? '否' : row.isDisabled === false ? '是' : '')
          }
        },
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '创建时间',
          key: 'creationTime',
          align: 'center',
          minWidth: 130,
          render: (h, { row }) => {
            return h('span', row.creationTime && utils.formatDate(row.creationTime, 'YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '修改人',
          key: 'lastManipulatorName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '最近修改时间',
          key: 'lastManipulationTime',
          align: 'center',
          minWidth: 130,
          render: (h, { row }) => {
            return h('span', row.lastManipulationTime && utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '操作',
          fixed: 'right',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => {
            const that = this
            let buttonArr = [
              {
                name: 'Button',
                icon: 'md-create',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
                event: () => {
                  this.onEdit(row)
                },
                content: '修改'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-eye',
                isShow: utils.hasPermission('HF_CreateExposureBalance'),
                event: () => {
                  that.onView(row)
                },
                content: '查看'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-lock',
                color: '#ed4014',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
                event: () => {
                  this.$Modal.confirm({
                    title: '停用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定停用该条数据？',
                    onOk: async () => {
                      await api.setDisableStatus({ id: row.wfCompanyId, isDisable: true })
                      that.search()
                    }
                  })
                },
                content: '停用'
              },
              {
                name: 'Button',
                icon: 'md-unlock',
                color: '#19be6b',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDisabled,
                event: () => {
                  this.$Modal.confirm({
                    title: '启用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定启用该条数据？',
                    onOk: async () => {
                      await api.setDisableStatus({ id: row.wfCompanyId, isDisable: false })
                      that.search()
                    }
                  })
                },
                content: '启用'
              }
            ]
            return utils.createButton(h, buttonArr)
          }
        }
      ],
      list: [{
        accountingName: '12',
        fullName: '12',
        shortName: '12',
        abbreviation: '12',
        currencyId: '12',
        taxCode: '12',
        isDomestic: false,
        isETrading: true,
        list: []
      }],
      isEdit: false,
      defaultItem: {
        code: '',
        friendlyName: '',
        equityFatorType: '',
        subType: ''
      },
      item: {},
      commonData: {
        BankType: [],
        currencies: []
      }
    }
  },
  async created () {
    this.query = this.utils.saveQuery(this.query, 'get')
    let commonData = await api.getCommonData()
    this.commonData = commonData
    this.search()
  },
  methods: {
    onSearch () {
      this.pagination.currentPage = 1
      this.search()
    },
    async search () {
      this.utils.saveQuery(this.query)
      let query = _.cloneDeep(this.query)
      let { list, pagination } = await api.list(query, this.pagination)
      this.pagination = pagination || this.pagination
      this.list = list
    },
    onAdd () {
      this.$router.push({
        name: 'corporationAdd'
      })
    },
    onEdit (row) {
      this.$router.push({
        name: 'corporationEdit',
        query: {
          id: row.wfCompanyId
        }
      })
    },
    async onView (row) {
      let data = await api.getById(row.wfCompanyId)
      this.item = data
      this.$refs['viewModal'].toggleShow()
    },
    isShow (permission) {
      return utils.hasPermission(permission)
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
    }
  }
}
</script>
