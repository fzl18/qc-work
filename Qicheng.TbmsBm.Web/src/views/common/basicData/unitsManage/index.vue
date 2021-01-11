<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.nameContain" :placeholder="$t('名称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.enligshNameContain" :placeholder="$t('英文名称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.symbolContain" :placeholder="$t('符号')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('类别')"
              filterable
              clearable
              v-model="query.quantityKind"
            >
              <Option
                v-for="(item, index) in commonData.enumOptions.QuantityKind"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
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
          type="text"
          @click="viewUnionConfig"
          class="margin-right-3"
        >查看关联配置结果
        </Button>
        <Button
          type="primary"
          @click="toQuanlity"
          class="margin-right-3"
        >量管理
        </Button>
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
    <add-modal ref="addModal" :isEdit="isEdit" :commonData="commonData" @onSearch="search" v-if="initSuccess"></add-modal>
    <view-modal ref="viewModal" :commonData="commonData" v-if="initSuccess"></view-modal>
  </div>
</template>

<script>
import enums from '@/utils/enums'
import { utils } from '@/utils/utils'
import api from './api'
import addModal from './add'
import expandRow from './expandRow'
import viewModal from './components/viewModal'

export default {
  components: { addModal, expandRow, viewModal },
  data () {
    return {
      enums,
      initSuccess: false,
      query: {
        nameContain: '',
        enligshNameContain: '',
        symbolContain: '',
        quantityKind: '',
        isDisabled: ''
      },
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      listColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, {row}) => {
            return h(expandRow, {
              props: {
                commonData: this.commonData,
                item: row.wfUnitConversionDtos
              }
            })
          }
        },
        {
          title: '唯一标识',
          key: 'accountingName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth: 120
        },
        {
          title: '英文名称',
          key: 'englishName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '符号',
          key: 'symbol',
          align: 'center',
          minWidth: 120
        },
        {
          title: '显示名',
          key: 'informalName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '显示英文名',
          key: 'informalEnglishName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '显示符号',
          key: 'informalSymbol',
          align: 'center',
          minWidth: 90
        },
        {
          title: '类别',
          key: 'quantityKind',
          align: 'center',
          minWidth: 200,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.enumOptions.QuantityKind, row.quantityKind)}</span>
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
          key: 'createTime',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.createTime && utils.formatDate(row.createTime, 'YYYY-MM-DD HH:mm:ss'))
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
            const that = this
            let buttonArr = [
              {
                name: 'Button',
                icon: 'md-create',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDeleted,
                event: () => {
                  this.onEdit(row)
                },
                content: '修改'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-lock',
                color: '#ed4014',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDeleted,
                event: () => {
                  this.$Modal.confirm({
                    title: '停用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定停用该条数据？',
                    onOk: async () => {
                      await api.setDisabled({ id: row.wfUnitId, isDisable: true })
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
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDeleted,
                event: () => {
                  this.$Modal.confirm({
                    title: '启用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定启用该条数据？',
                    onOk: async () => {
                      await api.setDisabled({ id: row.wfUnitId, isDisable: false })
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
      list: [],
      isEdit: false,
      defaultItem: {
        accountingName: '',
        name: '',
        englishName: '',
        informalName: '',
        symbol: '',
        informalEnglishName: '',
        informalSymbol: '',
        quantityKind: '',
        data: [{}]
      },
      commonData: {
        allUnits: [],
        enumOptions: {
          QuantityKind: []
        }
      }
    }
  },
  async created () {
    this.query = this.utils.saveQuery(this.query, 'get')
    let commonData = await api.getCommonData();
    this.commonData = commonData;
    this.initSuccess = true
    this.search();
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
      this.isEdit = false
      this.$refs['addModal'].add()
    },
    onEdit (row) {
      this.isEdit = true
      this.$refs['addModal'].edit(row)
    },
    isShow (permission) {
      return utils.hasPermission(permission)
    },
    resetQuery () {
      this.query = {}
    },
    toQuanlity () {
      this.$router.push({
        name: 'QuantityList'
      })
    },
    onPageChange (page) {
      this.pagination.currentPage = page
      this.search()
    },
    onPageSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.search()
    },
    viewUnionConfig () {
      this.$refs['viewModal'].toggleShow()
    }
  }
}
</script>
