<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.fullNameContains" clearable :placeholder="$t('全称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.shortNameContains" :placeholder="$t('简称')"/>
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
                >{{ item.text }}</Option
              >
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
                >{{ item.text }}</Option
              >
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
          >{{$t('添加')}}</Button
        >
      </Col>
      <Col class-name="margin-bottom-10">
        <Button
          icon="md-close-circle"
          @click="resetQuery"
          class="margin-right-3"
          >{{$t('清空')}}</Button
        >
        <Button type="primary" icon="md-search" @click="onSearch"
          >{{$t('搜索')}}</Button
        >
      </Col>
    </Row>
    <Table
      size="small"
      v-maxHeight
      border
      class="margin-bottom-10"
      :loading="false"
      :columns="listColumns"
      :data="listData"
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
    <Modal class="closePositionModal" v-model="isShowAddModal" :rules="rules" :title="isEdit ? $t('修改') : $t('新增')" width="500">
      <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
        <Row>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="accountingName" required>
              <Input v-model="addForm.accountingName" :disabled="isEdit" :placeholder="$t('唯一标识')"/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('全称')" prop="fullName" required>
              <Input v-model="addForm.fullName" :placeholder="$t('全称')"/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('简称')" prop="shortName" required>
              <Input v-model="addForm.shortName" :placeholder="$t('简称')"/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('是否启用期货')" prop="corporationTypeConfigurationDto.isETrading" required>
              <Select
                :placeholder="$t('是否启用期货')"
                filterable
                clearable
                v-model="addForm.corporationTypeConfigurationDto.isETrading"
              >
                <Option
                  v-for="(item, index) in enums.yONOptions"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('BrokerId')" :required="addForm.corporationTypeConfigurationDto.isETrading === 'true'">
              <Input v-model="addForm.corporationTypeConfigurationDto.tsBrokerId" :placeholder="$t('BrokerId')"/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('质押率')">
              <Input v-model="addForm.corporationTypeConfigurationDto.pledgeProportion" :placeholder="$t('质押率')" type="number" />
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('质押利率')">
              <Input v-model="addForm.corporationTypeConfigurationDto.pledgeInterestRate" :placeholder="$t('质押利率')" type="number" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import api from './api';

export default {
  data() {
    return {
      isShowAddModal: false,
      isEdit: false,
      query: {
        fullNameContains: '',
        shortNameContains: '',
        isDisabled: '',
        isETrading: ''
      },
      enums,
      commonData: {
        profitCenters: [],
        options: {},
        enums: {
          pnLAccountingMode: {},
        },
        tradeAccounts: [],
        instrumentCategories: [],
        commodityTypes: [],
        accountStrategies: [],
        strategies: [],
      },
      LoadingExportState: false,
      listData: [{}],
      pagination: {},
      listColumns: [
        {
          title: this.$t('唯一标识'),
          key: 'accountingName',
          align: 'center',
          minWidth: 120,
        },
        {
          title: this.$t('全称'),
          key: 'fullName',
          align: 'center',
          minWidth: 120,
        },
        {
          title: this.$t('简称'),
          key: 'shortName',
          align: 'center',
          minWidth: 100,
        },
        {
          title: this.$t('BrokerId'),
          key: 'tsBrokerId',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => h('span', row.corporationTypeConfigurationDto && row.corporationTypeConfigurationDto.tsBrokerId)
        },
        {
          title: this.$t('是否启用期货'),
          key: 'isETrading',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ row.corporationTypeConfigurationDto &&
              (row.corporationTypeConfigurationDto.isETrading === true ? this.$t('是') :
                row.corporationTypeConfigurationDto.isETrading === false ? this.$t('否') : '')}</span>
          }
        },
        {
          title: this.$t('是否启用'),
          key: 'isDisabled ',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ row.corporationTypeConfigurationDto &&
              (row.corporationTypeConfigurationDto.isDisabled === true ? this.$t('是') :
                row.corporationTypeConfigurationDto.isDisabled === false ? this.$t('否') : '')}</span>
          }
        },
        {
          title: this.$t('创建人'),
          key: 'creatorName',
          align: 'center',
          minWidth: 100,
        },
        {
          title: this.$t('创建时间'),
          key: 'createTime',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => {
            return h('span', row.creationTime && utils.formatDate(row.creationTime, 'YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: this.$t('修改人'),
          key: 'lastManipulatorName',
          align: 'center',
          minWidth: 100,
        },
        {
          title: this.$t('最近修改时间'),
          key: 'tsBrokerId',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => {
            return h('span', row.lastManipulationTime && utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: this.$t('操作'),
          fixed: 'right',
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            let buttonArr = [
              {
                name: 'Button',
                icon: 'md-create',
                href: '',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.corporationTypeConfigurationDto && row.corporationTypeConfigurationDto.isDisabled,
                event: () => {
                  this.onEdit(row);
                },
                content: this.$t('修改'),
              },
              {
                name: 'Button',
                icon: 'md-lock',
                href: '',
                color: '#ed4014',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.corporationTypeConfigurationDto && row.corporationTypeConfigurationDto.isDisabled,
                event: () => {
                  this.$Modal.confirm({
                    title: this.$t('停用'),
                    content: this.$t('确定停用该条数据？'),
                    onOk: () => {
                      api.setDisableStatus({isDisable: row.corporationTypeConfigurationDto && !row.corporationTypeConfigurationDto.isDisabled, id: row.wfCompanyId}).then(() => {
                        this.$Message.success(this.$t('操作成功！'))
                        this.onSearch()
                      })
                    }
                  })
                },
                content: this.$t('停用'),
              },
              {
                name: 'Button',
                icon: 'md-unlock',
                href: '',
                color: '#19be6b',
                isShow: utils.hasPermission('HF_CreateExposureBalance') && row.corporationTypeConfigurationDto && !row.corporationTypeConfigurationDto.isDisabled,
                event: () => {
                  this.$Modal.confirm({
                    title: this.$t('启用'),
                    content: this.$t('确定启用用该条数据？'),
                    onOk: () => {
                      api.setDisableStatus({isDisable: row.corporationTypeConfigurationDto && !row.corporationTypeConfigurationDto.isDisabled, id: row.wfCompanyId}).then(() => {
                        this.$Message.success(this.$t('操作成功！'))
                        this.onSearch()
                      })
                    }
                  })
                },
                content: this.$t('启用'),
              },
            ]
            return utils.createButton(h, buttonArr)
          },
        },
      ],
      rules: {
        'corporationTypeConfigurationDto.isETrading': [{required: true, trigger: 'change'}]
      },
      addForm: {
        wfCompanyId: '',
        accountingName: '',
        fullName: '',
        shortName: '',
        corporationTypeConfigurationDto: {
          isETrading: '',
          tsBrokerId: '',
          pledgeProportion: '',
          pledgeInterestRate: '',
        }
      }
    };
  },
  async created() {
    let commonData = api.getCommonData()
  },
  mounted() {
    this.query = utils.saveQuery(this.query, 'get');
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      let data = await api.list(this.query)
      this.listData = data
    },
    onAdd() {
      this.isShowAddModal = true
      this.isEdit = false
      this.$refs['addForm'].resetFields()
    },
    async onSave() {
      this.$refs['addForm'].validate(valid => {
        if(valid) {
          if(this.isEdit) {
            api.update(this.addForm).then(() => {
              this.$Message.success(this.$t('操作成功！'))
              this.onSearch()
            })
          } else {
            delete this.addForm.wfCompanyId
            api.save(this.addForm).then(() => {
              this.$Message.success(this.$t('操作成功！'))
              this.onSearch()
            })
          }
        }
      })
    },
    async onEdit(row) {
      this.isShowAddModal = true
      this.isEdit = true
      let data = await api.getById({id: row.wfCompanyId})
      data.corporationTypeConfigurationDto.isETrading += ''
      this.addForm = data
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    resetQuery() {
      this.query = {};
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
  },
};
</script>

<style scoped lang='less'>
</style>
