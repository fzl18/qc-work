<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.qctKeyContains" clearable :placeholder="$t('唯一标识')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.friendlyNameContains" clearable :placeholder="$t('名称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.instrumentCodeContains" clearable :placeholder="$t('合约代码')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('合约类型')"
              filterable
              clearable
              v-model="query.financialInstrumentType"
            >
              <Option
                v-for="(item, index) in commonData.FinancialInstrumentType"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('交易所')"
              filterable
              clearable
              v-model="query.marketId"
            >
              <Option
                v-for="(item, index) in commonData.exchanges"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('品类')"
              filterable
              clearable
              v-model="query.wfCommodityTypeId"
            >
              <Option
                v-for="(item, index) in commonData.commodityTypes"
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
    <closePositionModal ref="closePositionModal" :commonData="commonData"></closePositionModal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import { listColumns } from './columns'
import api from './api';
import closePositionModal from './components/closePositionModal'

export default {
  components: {
    closePositionModal
  },
  data() {
    return {
      query: {},
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
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: listColumns(this),
      listData: []
    };
  },
  created() {},
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
      this.$router.push({name: 'tradingStrategiesCreate'})
    },
    onEdit(row) {
      this.$router.push({name: 'tradingStrategiesCreate', query: { id: row.wfInstrumentCategoryId }})
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
    }
  },
};
</script>

<style scoped lang='less'>
.width100 {
  width: 100%;
}
</style>
