<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('用户')"
              filterable
              clearable
              v-model="query.WFUserId"
            >
              <Option
                v-for="(item, index) in commonData"
                :label="item.name"
                :value="item.wfUserId"
                :key="index"
                >{{ item.name }}</Option
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
    <Edit ref="edit" :commonData="commonData" />
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import {listColumns} from './columns';
import Edit from './edit';
import api from "./api";

export default {
  components:{
    Edit
  },
  data() {
    return {
      isShowAddModal: false,
      isShowPassWordModal: false,
      isEdit: false,
      query: {
        WFUserId:''
      },
      enums,
      commonData: [],
      listData: [{}],
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: listColumns(this) ,
    };
  },
  created() {},
  mounted() {
    this.getCommonData()
    this.query = utils.saveQuery(this.query, 'get');
    this.onSearch()
  },
  methods: {
    getCommonData() {
      api.getUserList().then(res=>{
        this.commonData = res.list
      })
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    search() {
      utils.saveQuery(this.query);
      api.list(this.query,this.pagination).then(res=>{
        const list = []
        res.list.forEach(item => {
          const IP = []
          const Mac = []
          item.traderAddressBindings.forEach(val=>{
            if(val.bindingType == 1){
              IP.push(val.address)
            }
            if(val.bindingType == 2){
              Mac.push(val.address)
            }            
          })
          list.push({
            IPH: IP.join(' ; <br />'),
            IP: IP.join(' ; \n'),
            MacH: Mac.join(' ; <br />'),
            Mac: Mac.join(' ; \n'),
            ...item.user
          })          
        });

        this.listData = list
        this.pagination = res.pagination
      })
    },
    onAdd() {      
      this.$refs['edit'].onAdd()
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
    onDelete(data) {
      api.onDelete(data.wfUserId).then(res=>{
        this.onSearch()
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
