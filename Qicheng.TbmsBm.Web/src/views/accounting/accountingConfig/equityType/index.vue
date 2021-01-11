<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.code" :placeholder="$t('唯一标识')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.friendlyName" :placeholder="$t('名称')"/>
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
    <add-modal ref="addModal" :isEdit="isEdit" :form="item"></add-modal>
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
        isDisabled: '',
        code: ''
      },
      pagination: {},
      listColumns: [
        {
          title: '唯一标识',
          key: 'code',
          align: 'center',
          minWidth: 120
        },
        {
          title: '名称',
          key: 'friendlyName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '权益系数',
          key: 'equityFatorType',
          align: 'center',
          minWidth: 120
        },
        {
          title: '科目',
          key: 'subType',
          align: 'center',
          minWidth: 120
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
          title: '最后更新人',
          key: 'lastUpdateByText',
          align: 'center',
          minWidth: 120
        },
        {
          title: '最后更新时间',
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
                icon: 'md-lock',
                color: '#ed4014',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDisabled,
                event: () => {
                  this.$Modal.confirm({
                    title: '停用',
                    // content: this.$t('confirmToDeleteExposureRecord'),
                    content: '确定停用该条数据？',
                    onOk: () => {
                    }
                  })
                },
                content: '停用'
              },
              {
                name: 'Button',
                icon: 'md-unlock',
                color: '#19be6b',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
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
        equityFatorTypes: [],
        subTypes: []
      }
    }
  },
  async created () {
    let commonData = await api.getCommonData('IntraydayRiskControl');
    this.commonData = commonData;
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
      this.item = _.cloneDeep(this.defaultItem)
      this.$refs['addModal'].toggleShow()
    },
    onEdit (row) {
      this.isEdit = true
      this.item = _.cloneDeep(row)
      this.$refs['addModal'].toggleShow()
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
