<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.QctKeyContains" :placeholder="$t('唯一标识')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.NameContains" :placeholder="$t('名称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.UserNameContains" :placeholder="$t('账户号')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('结算币种')"
              filterable
              clearable
              v-model="query.AccountCurrencyId"
            >
              <Option
                v-for="(item, index) in commonData.currencies"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('法人')"
              filterable
              clearable
              v-model="query.CorporationId"
            >
              <Option
                v-for="(item, index) in commonData.corporations"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('经纪公司')"
              filterable
              clearable
              v-model="query.BrokerId"
            >
              <Option
                v-for="(item, index) in commonData.brokers"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('是否启用期货')"
              filterable
              clearable
              v-model="query.IsETrading"
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
              v-model="query.IsDisabled"
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

    <Settings ref="settings" />
    <Edit :commonData="commonData" ref="edit" />
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import api from "./api";
import Settings from "./settings";
import Edit from "./edit";
import { listColumns } from './columns';

export default {
  components:{
    Settings,
    Edit
  },
  data() {
    return {
      isShowAddModal: false,
      isShowPassWordModal: false,
      isEdit: false,
      query: {
        QctKeyContains: '',
        NameContains: '',
        UserNameContains: '',
        AccountCurrencyId: '',
        CorporationId: '',
        BrokerId: '',
        IsETrading: null,
        IsDisabled: null,
      },
      enums,
      commonData: {

      },
      listData: [{}],
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: listColumns(this),
      addForm: {
        code: '',
        fullName: '',
        shortName: '',
        isETrading: '',
        brokerId: '',
        pledgeProportion: '',
        pledgeInterestRate: ''
      }
    };
  },
  created() {
    api.getCommonData().then(res => {
      this.commonData = res
    })
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
    search() {
      utils.saveQuery(this.query);
      api.list(this.query,this.pagination).then(res => {
        this.listData = res.list
        this.pagination = res.pagination
      })
    },
    onAdd() {      
      this.$refs['edit'].onAdd()
    },
    onEdit(data) {      
      this.$refs['edit'].onEdit(data)
    },
    onSave() {},
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    resetQuery() {
      this.query = {}
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
    setDisableStatus(row) {
      api.setDisableStatus({
        id: row.wfTradeAccountId,
        isDisable: !row.isDisabled
      }).then(res => {
        this.search()
      })
    }
  },
};
</script>

<style scoped lang='less'>
.icoBtn{
  margin-top:5px;
  color:#2d8cf0;
  cursor: pointer;
}
</style>
