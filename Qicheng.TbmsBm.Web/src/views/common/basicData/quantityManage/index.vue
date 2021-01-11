<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.nameContain" :placeholder="$t('量名称')" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('量分类')"
              filterable
              clearable
              v-model="query.quantityKind"
            >
              <Option
                v-for="(item, index) in commonData.QuantityKind"
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
    <add-modal ref="addModal" :isEdit="isEdit" v-if="isInit" :commonData="commonData" @onSearch="search"></add-modal>
  </div>
</template>

<script>
import enums from '@/utils/enums'
import { utils } from '@/utils/utils'
import api from './api'
import addModal from './add'

export default {
  components: {addModal},
  data () {
    return {
      enums,
      query: {
        friendlyName: '',
        accountingSubjectId: '',
        businessTypeId: ''
      },
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      listColumns: [
        {
          title: '量名称',
          key: 'name',
          align: 'center',
          minWidth: 120
        },
        {
          title: '量英文名称',
          key: 'englishName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '量分类',
          key: 'quantityKind',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.QuantityKind, row.quantityKind)}</span>
          }
        },
        {
          title: '强度、广延',
          key: 'physicalCategory',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.QuantityTypePhysicalCategory, row.physicalCategory)}</span>
          }
        },
        {
          title: '是否关联成分',
          key: 'isRelateComponent',
          align: 'center',
          minWidth: 120,
          render(h, {row}) {
            return <span>{ row.isRelateComponent === true ? '是' : row.isRelateComponent === false? '否' : ''}</span>
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
          render: (h, {row}) => {
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
            let that = this
            let buttonArr = [
              {
                name: 'Button',
                icon: 'md-create',
                isShow: utils.hasPermission('HF_CreateExposureBalance'),
                event: () => {
                  this.onEdit(row)
                },
                content: '修改'
                // content: this.$t('confirmToDeleteExposureRecord'),
              },
              {
                name: 'Button',
                icon: 'md-trash',
                color: '#ed4014',
                isShow: utils.hasPermission('HF_CreateExposureBalance'),
                event: () => {
                  this.$Modal.confirm({
                    title: '删除',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定停用该条数据？',
                    onOk: async () => {
                      await api.delete({ id: row.wfQuantityTypeId, disabled: true })
                      that.$Message.success(that.$t('删除成功'));
                      that.search();
                    }
                  })
                },
                content: '删除'
              }
            ]
            return utils.createButton(h, buttonArr)
          }
        }
      ],
      list: [],
      isEdit: false,
      isInit: false,
      defaultItem: {
        code: '',
        friendlyName: '',
        equityFatorType: '',
        subType: ''
      },
      commonData: {
        QuantityTypePhysicalCategory: [],
        QuantityKind: []
      }
    }
  },
  async created () {
    let commonData = await api.getCommonData();
    this.commonData = commonData;
    this.isInit = true
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
