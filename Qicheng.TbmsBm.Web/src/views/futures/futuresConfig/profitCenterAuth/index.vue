<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('利润中心')"
              filterable
              clearable
              v-model="query.accountingEntityId"
            >
              <Option
                v-for="(item, index) in commonData.AccountEntityList"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <div class="flex-area">
              <Input v-model="query.budgetMin" :placeholder="$t('授权资金Min')"/>
              <span> - </span>
              <Input v-model="query.budgetMax" :placeholder="$t('授权资金Max')"/>
            </div>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <div class="flex-area">
              <Input v-model="query.stopLineMin" :placeholder="$t('止损线Min')"/>
              <span> - </span>
              <Input v-model="query.stopLineMax" :placeholder="$t('止损线Max')"/>
            </div>
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
    <Modal class="closePositionModal" v-model="isShowAddModal" :title="$t('利润中心授权') + (isEdit ? $t('修改') : $t('添加'))" width="700">
      <Form :model="addForm" label-position="right" :label-width="100" ref="addForm">
        <Row>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('利润中心')" prop="accountingEntityId" required>
              <Select
                :placeholder="$t('请选择')"
                filterable
                clearable
                transfer
                v-model="addForm.accountingEntityId"
              >
                <Option
                  v-for="(item, index) in commonData.AccountEntityList"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('币种')" prop="code">
              <span>{{commonData.CurrentFunctionalCurrency}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('授权资金')" prop="budget" required>
              <Input v-model="addForm.budget" type="number" :min="1" :step="1" number :placeholder="$t('授权资金')">
                <span slot="append">元</span>
              </Input>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('预警资金')" prop="shortName">
              <Input v-model="addForm.earlyWarningBudget" :placeholder="$t('预警资金')">
                <span slot="append">元</span>
              </Input>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('止损线')" prop="stopLine">
              <Input v-model="addForm.stopLine" :placeholder="$t('止损线')">
                <span slot="append">元</span>
              </Input>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('止损线预警')" prop="pledgeProportion">
              <Input v-model="addForm.earlyWarningStopLine" :placeholder="$t('止损线预警')" type="number">
                <span slot="append">元</span>
              </Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <span class="warning text-left">{{$t('利润中心的授权会实时同步修改期货端的授权信息！')}}</span>
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import api from './api';

export default {
  data() {
    return {
      isShowAddModal: false,
      isEdit: false,
      query: {
        accountingEntityId: '',
        budgetMin: '',
        budgetMax: '',
        stopLineMin: '',
        stopLineMax: '',
      },
      commonData: {
        AccountEntityList: [],
        CurrencyList: [],
        CurrentFunctionalCurrency: ''
      },
      LoadingExportState: false,
      listData: [],
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: [
        {
          title: this.$t('利润中心'),
          key: 'accountingEntityName',
          align: 'center',
          minWidth: 120,
        },
        {
          title: this.$t('币种'),
          key: 'currencyName',
          align: 'center',
          minWidth: 120,
        },
        {
          title: this.$t('授权资金'),
          key: 'budget',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => <format-cell fixed={4}>{row.budget}</format-cell>
        },
        {
          title: this.$t('预警资金'),
          key: 'earlyWarningBudget',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => <format-cell fixed={4}>{row.earlyWarningBudget}</format-cell>
        },
        {
          title: this.$t('止损线'),
          key: 'stopLine',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => <format-cell fixed={4}>{row.stopLine}</format-cell>
        },
        {
          title: this.$t('止损线风险预警'),
          key: 'earlyWarningStopLine',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => <format-cell fixed={4}>{row.earlyWarningStopLine}</format-cell>
        },
        {
          title: this.$t('修改人'),
          key: 'lastManipulatorName',
          align: 'center',
          minWidth: 120
        },
        {
          title: this.$t('最近修改时间'),
          key: 'lastManipulationTime ',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
        },
        {
          title: this.$t('操作'),
          fixed: 'right',
          align: 'center',
          minWidth: 150,
          render: (h, { row }) => {
            let buttonArr = [
              {
                name: 'Button',
                icon: 'md-create',
                href: '',
                isShow: utils.hasPermission('HF_CreateExposureBalance'),
                event: () => {
                  this.onEdit(row);
                },
                content: this.$t('修改'),
              }
            ]
            return utils.createButton(h, buttonArr)
          },
        },
      ],
      addForm: {
        accountingEntityId: '49',
        budget: '',
        stopLine: '',
      }
    };
  },
  async mounted() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await api.getCommonData()
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      let data = await api.list(this.query, this.pagination)
      this.listData = data.list
      this.pagination = data.pagination
    },
    onAdd() {
      this.isShowAddModal = true
      this.isEdit = false
      this.$refs['addForm'].resetFields()
    },
    onSave() {
      this.$refs['addForm'].validate(valid => {
        if(valid) {
          if(this.isEdit) {
            api.update(this.addForm).then(() => {
              this.$Message.success('操作成功！')
              this.isShowAddModal = false
              this.onSearch()
            })
          } else {
            api.save(this.addForm).then(() => {
              this.$Message.success('操作成功！')
              this.isShowAddModal = false
              this.onSearch()
            })
          }
        }
      })
    },
    async onEdit(row) {
      this.isShowAddModal = true
      this.isEdit = true
      let data = await api.get({id: row.id})
      this.addForm = data
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    resetQuery() {
      this.query = {};
      this.query.accountingDate = '';
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
.flex-area {
  display: flex;
  align-items: center;
  span {
    padding: 0 3px;
  }
}
.text-left {
  float: left;
  line-height: 32px;
}
</style>
