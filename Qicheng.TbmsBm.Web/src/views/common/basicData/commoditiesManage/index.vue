<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.name" :placeholder="$t('名称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.englishName" :placeholder="$t('英文名称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.code" :placeholder="$t('code')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.accountingName" :placeholder="$t('唯一标识')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('类型')"
              filterable
              clearable
              v-model="query.commodityTypeId"
            >
              <Option
                v-for="(item, index) in commonData.allCommodityCategories"
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
              >{{ item.text }}</Option>
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
          @click="addCommodityType"
          class="margin-right-3"
          v-if="isShow('H_CreateAcOtherPaymentRecord')"
        >添加品类
        </Button>
        <Button
          type="primary"
          icon="md-add"
          @click="onAdd"
          class="margin-right-3"
          v-if="isShow('H_CreateAcOtherPaymentRecord')"
        >添加品种
        </Button>
        <Button
          type="primary"
          icon="md-add"
          @click="addMaterialModal"
          v-if="isShow('H_CreateAcOtherPaymentRecord')"
        >添加物料
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
      row-key="id"
      :load-data="handleLoadData"
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
    <add-commodityType-modal ref="addCommodityTypeModal" :isEdit="isEdit" :form="item" :common-data="commonData"></add-commodityType-modal>
    <add-material-modal ref="addMaterialModal" :isEdit="isEdit" :form="item" :common-data="commonData"></add-material-modal>
    <view-commodity-type ref="viewCommodityType" :form="item" :common-data="commonData"></view-commodity-type>
    <view-material ref="viewMaterial" :form="item" :common-data="commonData"></view-material>
  </div>
</template>

<script>
/*global _ _*/
import enums from '@/utils/enums'
import { utils } from '@/utils/utils'
import api from './api'
const addCommodityTypeModal = () => import('./components/addCommodityTypesModal')
const addMaterialModal = () => import('./components/addMaterialModal')
const viewMaterial = () => import('./components/materialDetail')
const viewCommodityType = () => import('./components/commodityTypesDetail')

export default {
  components: { addCommodityTypeModal, addMaterialModal, viewMaterial, viewCommodityType },
  data () {
    return {
      enums,
      query: {
        friendlyName: '',
        isDisabled: '',
        code: ''
      },
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      listColumns: [
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth: 150,
          tree: true
        },
        {
          title: '英文名称',
          key: 'englishName',
          align: 'center',
          minWidth: 120
        },
        {
          title: 'code',
          key: 'code',
          align: 'center',
          minWidth: 120
        },
        {
          title: '唯一标识',
          key: 'accountingName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '类型',
          key: 'wfCommodityCategoryId',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.allCommodityCategories, row.wfCommodityCategoryId)}</span>
          }
        },
        {
          title: '是否启用',
          key: 'isDisabled',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            if (row.type === 3) {
              return h('span', row.isDeleted === true ? '否' : row.isDeleted === false ? '是' : '')
            } else {
              return h('span', row.isDisabled === true ? '否' : row.isDisabled === false ? '是' : '')
            }
          }
        },
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          minWidth: 120,
        },
        {
          title: '创建时间',
          key: 'creationTime',
          align: 'center',
          minWidth: 130,
          render: (h, {row}) => {
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
          key: 'lastUpdateTime',
          align: 'center',
          minWidth: 130,
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
                icon: 'md-add',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.type !== 3,
                event: () => {
                  this.onTreeAdd(row)
                },
                content: '添加'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-create',
                isShow: function () {
                  if (row.type === 3) {
                    return utils.hasPermission('HF_CreateExposureBalance') && !row.isDeleted
                  } else {
                    return utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled
                  }
                },
                event: () => {
                  this.onEdit()
                },
                content: '修改'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-eye',
                isShow: function () {
                  if (row.type === 3) {
                    return utils.hasPermission('HF_CreateExposureBalance') && !row.isDeleted
                  } else {
                    return utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled
                  }
                },
                event: () => {
                  this.onView(row)
                },
                content: '查看'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-lock',
                color: '#ed4014',
                isShow: row.type !== 1 ? (utils.hasPermission('HF_CreateExposureBalance') && !row.isDeleted) : (utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled),
                event: () => {
                  this.$Modal.confirm({
                    title: '停用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定停用该条数据？',
                    onOk: async () => {
                      if (row.type === 1) {
                        await api.setDisable({ id: row.wfCommodityTypeId, isDisable: !row.isDisable })
                        that.search()
                      } else if (row.type === 2) {
                        await api.setCommodityDisable({ id: row.wfCompanyId, isDisable: !row.isDisable })
                        that.search()
                      } else {
                        await api.setSpecificationDisable({ id: row.wfCompanyId, isDisable: !row.isDisable })
                        that.search()
                      }
                    }
                  })
                },
                content: '停用'
              },
              {
                name: 'Button',
                icon: 'md-unlock',
                color: '#19be6b',
                isShow: row.type !== 1 ? (utils.hasPermission('HF_CreateExposureBalance') && row.isDeleted) : (utils.hasPermission('HF_CreateExposureBalance') && row.isDisabled),
                event: () => {
                  this.$Modal.confirm({
                    title: '启用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定启用该条数据？',
                    onOk: () => {
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
        code: '',
        friendlyName: '',
        equityFatorType: '',
        subType: ''
      },
      item: {},
      commonData: {
        QuantityTypePhysicalCategory: [],
        QuantityKind: [],
        allCommodityCategories: [],
        allQuantityTypes: [],
        allUnits: []
      },
      id: 0
    }
  },
  async created () {
    let commonData = await api.getCommonData();
    this.commonData = commonData;
    this.search();
  },
  methods: {
    async handleLoadData (item, callback) {
      if (item.type === 1) {
        // 品类下级即为品种 获取品类下的品种
        const { list } = await api.wFCommodityList({ commodityTypeId: item.wfCommodityTypeId }, null)
        if (!list.length) {
          const index = this.list.findIndex(o => o.id === item.id)
          const obj = _.cloneDeep(this.list.find(o => o.id === item.id))
          delete obj._loading
          delete obj.children
          this.list[index] = obj
        }
        list.forEach(o => {
          o['_loading'] = false
          o['children'] = []
          o['type'] = 2
          o['id'] = this.id
          ++this.id
        })
        callback(list);
      } else {
        // 品种下级即为物料 获取品种下的物料
        const { list } = await api.wFSpecificationList({ commodityId: item.wfCommodityId }, null)
        list.forEach(o => {
          o['type'] = 3
          o['id'] = this.id
          ++this.id
        })
        callback(list);
      }
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      this.utils.saveQuery(this.query)
      let query = _.cloneDeep(this.query)
      let { list, pagination } = await api.list(query, this.pagination)
      this.pagination = pagination
      list.forEach(o => {
        o['_loading'] = false
        o['children'] = []
        o['type'] = 1
        o['id'] = this.id
        ++this.id
      })
      this.list = list
    },
    onAdd (row) {
      this.$router.push({
        name: 'CommoditiesAdd',
        query: {
          wfCommodityTypeId: row.wfCommodityTypeId
        }
      })
    },
    onView (row) {
      if (row.type === 1) {
        this.$router.push({
          name: 'CommoditiesView',
          query: {
            wfCommodityTypeId: row.wfCommodityTypeId
          }
        })
      } else if (row.type === 2) {
        this.$refs['viewCommodityType'].toggleShow()
      } else {
        this.$refs['viewMaterial'].toggleShow()
      }
    },
    onTreeAdd (row) {
      if (row.type === 1) {
        this.$router.push({
          name: 'CommoditiesAdd',
          query: {
            wfCommodityTypeId: row.wfCommodityTypeId
          }
        })
      } else {
        this.$refs['addMaterialModal'].form.commodityId = 1
        this.addMaterialModal()
      }
    },
    addCommodityType () {
      this.isEdit = false
      this.$refs['addCommodityTypeModal'].toggleShow()
    },
    addMaterialModal () {
      this.isEdit = false
      this.$refs['addMaterialModal'].toggleShow()
    },
    onEdit (row) {
      if (row.type === 1) {
        this.$router.push({
          name: 'CommoditiesEdit',
          query: {
            id: row.wfCommodityTypeId
          }
        })
      } else {
        this.$refs['addMaterialModal'].form.commodityId = 1
        this.addMaterialModal()
      }
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
