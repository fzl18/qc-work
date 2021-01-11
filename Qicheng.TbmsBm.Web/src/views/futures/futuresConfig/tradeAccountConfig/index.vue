<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.friendlyName" :placeholder="$t('名称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.accountingNumber" :placeholder="$t('账户号')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('法人')"
              filterable
              clearable
              v-model="query.corporationId"
            >
              <Option
                v-for="(item, index) in commonData.corporations"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('经纪公司')"
              filterable
              clearable
              v-model="query.businessTypeId"
            >
              <Option
                v-for="(item, index) in commonData.accountingUnits"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('服务通道')"
              filterable
              clearable
              v-model="query.currencyId"
            >
              <Option
                v-for="(item, index) in commonData.currencies"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('通道类型')"
              filterable
              clearable
              v-model="query.currencyId"
            >
              <Option
                v-for="(item, index) in commonData.currencies"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('是否净持仓')"
              filterable
              clearable
              v-model="query.isDisabled"
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
              :placeholder="$t('是否已配置')"
              filterable
              clearable
              v-model="query.isDisabled"
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
        </Row>
      </Form>
    </qc-collapse>
    <Row type="flex" justify="end" :gutter="5">
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
    <adjust-modal ref="adjustModal"></adjust-modal>
    <edit-password ref="editPassword"></edit-password>
  </div>
</template>

<script>
import enums from '@/utils/enums'
import { utils } from '@/utils/utils'
import api from './api'
import AdjustModal from './components/adjust'
import EditPassword from './components/editPassword'

export default {
  components: { EditPassword, AdjustModal },
  data () {
    return {
      enums,
      query: {
        friendlyName: '',
        accountingSubjectId: '',
        businessTypeId: ''
      },
      pagination: {},
      listColumns: [
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth: 120
        },
        {
          title: '账户号',
          key: 'englishName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '法人',
          key: 'businessTypeId',
          align: 'center',
          minWidth: 120
        },
        {
          title: '账户类型',
          key: 'accountingSubjectId',
          align: 'center',
          minWidth: 120
        },
        {
          title: '经纪公司',
          key: 'accountingSubjectId',
          align: 'center',
          minWidth: 120
        },
        {
          title: '服务通道',
          key: 'businessTypeId',
          align: 'center',
          minWidth: 120
        },
        {
          title: '通道类型',
          key: 'businessTypeId',
          align: 'center',
          minWidth: 120
        },
        {
          title: '是否净持仓',
          key: 'isETrading',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.isETrading === true ? '是' : row.isETrading === false ? '否' : '')
          }
        },
        {
          title: '修改人',
          key: 'lastUpdateByText',
          align: 'center',
          minWidth: 120
        },
        {
          title: '最近修改时间',
          key: 'lastUpdateTime',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.lastUpdateTime && utils.formatDate(row.lastUpdateTime, 'YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '操作',
          fixed: 'right',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => {
            let buttonArr = [
              {
                name: 'Button',
                icon: 'md-settings',
                isShow: utils.hasPermission('HF_CreateExposureBalance'),
                event: () => {
                  this.onConfig(row)
                },
                content: '配置'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-key',
                color: '#ff9900',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDisabled,
                event: () => {
                  this.editPassword()
                },
                content: '修改密码'
              },
              {
                name: 'Button',
                icon: 'md-warning',
                color: '#ff9900',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
                event: () => {
                  this.adjust()
                },
                content: '授权调整'
              }
            ]
            return utils.createButton(h, buttonArr)
          }
        }
      ],
      list: [{}],
      isEdit: false,
      defaultItem: {
        code: '',
        friendlyName: '',
        equityFatorType: '',
        subType: ''
      },
      item: {},
      commonData: {
        accountingUnits: []
      }
    }
  },
  async created () {
    // let commonData = await api.getCommonData();
    // this.commonData = commonData;
    // this.search();
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      this.utils.saveQuery(this.query)
      let query = _.cloneDeep(this.query)
      let { list, pagination } = await api.list(query, this.pagination)
      this.pagination = pagination
      this.list = list
    },
    onAdd () {
      this.$router.push({
        name: 'TradeAccountConfigAdd'
      })
    },
    onConfig (row) {
      this.$router.push({
        name: 'TradeAccountConfigEdit',
        query: {
          id: row.id
        }
      })
    },
    editPassword () {
      this.$refs['editPassword'].toggleShow()
    },
    adjust () {
      this.$refs['adjustModal'].toggleShow()
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
