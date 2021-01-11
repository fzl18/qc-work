<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
             <Input v-model="query.nameContains" :placeholder="$t('名称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
             <Input v-model="query.accountingName" :placeholder="$t('唯一标识')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('隶属部门')"
              filterable
              clearable
              v-model="query.relationDepartmentId"
            >
              <Option
                v-for="(item, index) in commonData.Departments"
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
              :placeholder="$t('是否启用套保')"
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
              v-model="query.isETrading"
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
        <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcOtherPaymentRecord')">添加</Button>
      </Col>
      <Col class-name="margin-bottom-10">
        <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
        <Button type="primary" icon="md-search" @click="onSearch">搜索</Button>
      </Col>
    </Row>
    <Table
      row-key="wfAccountEntityId"
      size="small"
      v-maxHeight
      border
      class="margin-bottom-10"
      :loading="false"
      :columns="listColumns"
      :data="listData"
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
    <InfoModal ref="infoModal"></InfoModal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils'
import enums from '@/utils/enums'
import { listColumns } from './columns'
import InfoModal from './components/infoModal'
import api from './api';

export default {
  data () {
    return {
      query: {
        nameContains: ''
      },
      enums,
      commonData: {
        profitCenters: [],
        options: {},
        enums: {
          pnLAccountingMode: {}
        },
        tradeAccounts: [],
        instrumentCategories: [],
        commodityTypes: [],
        accountStrategies: [],
        strategies: []
      },
      LoadingExportState: false,
      listData: [],
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: listColumns(this)
    };
  },
  components: {
    InfoModal
  },
  created () {},
  async mounted () {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await api.getCommonData()
    this.onSearch()
  },
  methods: {
    onSearch () {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search () {
      utils.saveQuery(this.query)
      let data = await api.list(this.query, this.pagination)
      this.listData = _.forEach(data.list, data => {
        if(data.hasChildren) {
          data.children = []
          data._loading = false
        }
      })
      this.pagination = data.pagination
    },
    onAdd () {
      this.$router.push({name: 'accountingCreate'})
    },
    onEdit () {},
    onDelete () {},
    onExport () {},
    isShow (permission) {
      return utils.hasPermission(permission);
    },
    resetQuery () {
      this.query = {};
    },
    imported() {
      this.search();
    },
    async handleLoadData(row, callback) {
      let data = await api.list({ParentDepartmentId: row.wfAccountEntityId, IsAccounting: true, ParentDepartmentIdHasValue: true})
      _.forEach(data.list, data => {
        if(data.hasChildren) {
          data.children = []
          data._loading = false
        }
      })
      callback(data.list)
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    }
  }
};
</script>

<style scoped lang='less'>

</style>
