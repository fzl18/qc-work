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
              v-model="query.wfUserId"
            >
              <Option
                v-for="(item, index) in userlist"
                :label="item.name"
                :value="item.wfUserId"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <DatePicker type="daterange" v-model="query.daterange" :placeholder="$t('登录时间范围')"></DatePicker>
          </Col>
        </Row>
      </Form>
    </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col></Col>
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
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import api from "./api";

export default {
  data() {
    return {
      query: {
        daterange:[],
        wfUserId:''
      },
      commonData:{},
      listData: [{}],
      userlist: [],
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: [
        {
          title: this.$t('用户名'),
          key: 'loginName',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.userlist,row.wfUserId,'loginName','wfUserId')}</span>
          }
        },
        {
          title: this.$t('姓名'),
          key: 'name',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.userlist,row.wfUserId,'name','wfUserId') }</span>
          }
        },
        {
          title: this.$t('登录时间'),
          key: 'loginTime',
          align: 'center',
          minWidth: 100,
          render: (h, {row}) => {
            return <span>{ utils.formatDate(row.loginTime) }</span>
          }
        },
        {
          title: this.$t('登录IP'),
          key: 'ip',
          align: 'center',
          width: 160,
        },
        {
          title: this.$t('是否成功'),
          key: 'isSuccess',
          align: 'center',
          width: 100,
          render: (h, {row}) => {
            return <span>{ row.isSuccess === true ? this.$t('是') : row.isSuccess === false ? this.$t('否') : '' }</span>
          }
        },
        {
          title: this.$t('设备信息'),
          key: 'deviceInfo',
          align: 'center',
          minWidth: 120,          
        }
      ],
    };
  },
  created() {},
  mounted() {
    if(this.$route.params.data){
      let { wfUserId } = (this.$route.params.data)
      if(wfUserId) { 
        this.query.wfUserId = wfUserId
      }
    }    
    api.userlist().then(res=> this.userlist = res.list)
    api.getCommonData().then(res=> this.commonData = res)
    this.query = utils.saveQuery(this.query, 'get');
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    search() {
      if(this.query.daterange.length){
        this.query.LoginTimeBegin = utils.formatDate(this.query.daterange[0])
        this.query.LoginTimeEnd = utils.formatDate(this.query.daterange[1])
      }
      // api.list(this.query,this.pagination)
      api.list(this.query,this.pagination).then(res=>{
        this.listData = res.list
        this.pagination = res.pagination
      })
      utils.saveQuery(this.query);
    },
    resetQuery() {
      this.query.userName = '';
      this.query.daterange = [];
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
