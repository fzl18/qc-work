<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.NameContains" :placeholder="$t('名称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.QctKeyContains" :placeholder="$t('唯一标识')"/>
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
            class="margin-right-3"
            @click="onAdd"
            v-if="isShow('H_CreateAcOtherPaymentRecord')"
            >{{$t('添加')}}</Button
          >
          <Button
            type="primary"
            icon="md-add"
            class="margin-right-3"
            @click="onBatchAdd"
            :disabled="(checkedList.length ? false : true)"
            v-if="isShow('H_CreateAcOtherPaymentRecord')"
            >{{$t('批量添加')}}</Button
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
      ref="table"
      class="margin-bottom-10"
      :loading="false"
      :columns="listColumns"
      :data="listData"
      row-key="wfTradingStrategyId"
      @on-selection-change="onSelect"
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
    <Detail ref="detail" />
    <ProfitCenterTree ref="profitCenterTree" :commonData="commonData" :checkedList="checkedList" @getChecked="getChecked" />
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums';
import {listColumns} from './columns';
import api from './api';
import Detail from './detail'
import ProfitCenterTree from './profitCenterTree'
export default {
  components: {
    Detail,
    ProfitCenterTree
  },
  data() {
    return {
      isShowAddModal: false,
      isShowPassWordModal: false,
      isEdit: false,
      query: {
        QctKeyContains: '',
        NameContains: '',
        IsETrading: '',
        IsDisabled: ''},
      enums,
      commonData: {

      },
      LoadingExportState: false,
      listData: [],
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: listColumns(this),
      checkedList: []
    };
  },
  created() {},
  watch: {
    // listData: {
    //   handler(val) {
    //   },
    //   deep: true
    // }
  },
  mounted() {
    api.getCommonData().then(res => {
      this.commonData = res
    })
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
      let IsDisabled = ''
      if(this.query.IsDisabled !== undefined){
        IsDisabled = this.query.IsDisabled == 'true' ? false : true
      }
      api.list({...this.query,IsDisabled}, this.pagination).then(res => {
        this.listData = res.list
        this.pagination = res.pagination
      })
    },
    onAdd() {
      this.$router.push({name: 'strategiesCreate', params: {isEdit: false,commonData: this.commonData, data: {}}})
    },
    onSave(data) {
      api.batchAttach(data).then(res => {

      })
    },
    onEdit() {
      this.isShowAddModal = true
      this.isEdit = true
      //请求数据填充
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
    setDisableStatus(data) {
      api.setDisableStatus({
        id: data.wfTradingStrategyId,
        isDisable: !data.isDisabled
      }).then(res => {
        this.onSearch()
      })
    },
    onBatchAdd() {
      this.$refs['profitCenterTree'].onShow()
    },
    onSelect(data) {
      this.checkedList = data;
      console.log(data)
    },
    getChecked(data) {
      console.log(data,this.checkedList)
      let strategyds = []
      this.checkedList.forEach(val => {
        strategyds.push(val.wfTradingStrategyId)
      })
      let strategyAccountingEntityRelations = []
      data.forEach(val => {
        strategyAccountingEntityRelations.push({
          wfAccountingEntityId: val.value
        })
      })
      this.onSave({
        strategyds,
        strategyAccountingEntityRelations
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
