<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.fullName" :placeholder="$t('唯一标识')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.shortName" :placeholder="$t('代码')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('交易所')"
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
              :placeholder="$t('交易所')"
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
              :placeholder="$t('特殊合约类型')"
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
              :placeholder="$t('合约类型')"
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
              v-model="query.disabled"
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
    <Modal class="closePositionModal" v-model="isShowInfoModal" :title="$t('配置作价市场类型')" width="900">
      <Form :model="infoForm" label-position="right" :label-width="120" ref="infoForm">
        <Card>
          <p slot="title">{{$t('基本信息')}}</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')" prop="code">
                <span v-text="infoForm.code"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('代码')" prop="shortName">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('名称')" prop="fullName">
                <span v-text="infoForm.fullName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('交易所')" prop="shortName">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('标准合约')" prop="shortName">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('税率')" prop="shortName">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('合约类型')" prop="shortName">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('合约周期')" prop="shortName">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('特殊合约类型')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('第一个交易日')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('最后交易日')" prop="isETrading">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('交割日')" prop="isETrading">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('是否启用期货')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card>
          <p slot="title">{{$t('期权合约')}}</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('标的合约ID')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('行价权')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('期权权利方向')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card>
          <p slot="title">{{$t('组合合约')}}</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('合约腿数')" prop="code">
                <span v-text="infoForm.shortName"></span>
              </FormItem>
            </Col>
            <template v-for="(item, index) in []">
              <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10" :key="'col' + index">
                <FormItem :label="$t('最小变动单位')" prop="code" :key="'instrument' + index">
                  <span v-text="infoForm.shortName"></span>
                </FormItem>
              </Col>
            </template>
          </Row>
        </Card>
      </Form>
      <div slot="footer">
        <Button @click="isShowInfoModal = false">{{$t('返回')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import { listColumns } from './columns'
import api from './api';

export default {
  data() {
    return {
      isShowInfoModal: false,
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
      listData: [{
        id: 1
      }],
      infoForm: {}
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
    search() {
      utils.saveQuery(this.query);
      api.list()
    },
    onAdd() {
      this.$router.push({name: 'specificInstrumentCreate'})
    },
    onEdit(row) {
      this.$router.push({name: 'specificInstrumentUpdate', query: { id: row.id }})
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
