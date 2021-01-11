<template>
  <div>
     <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="作价日期"
            v-model="query.pricingDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="策略" filterable clearable v-model="query.tradingStrategyId">
            <Option
              v-for="(item, index) in []"
              :label="item.name"
              :value="item.tradingStrategyId"
              :key="index"
            >{{item.tradingStrategyId}} - {{item.name}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="贸易类型" filterable clearable v-model="query.tradeType">
            <Option
              v-for="(item, index) in  []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品种" filterable clearable v-model="query.commodityId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="物料" filterable clearable v-model="query.materialId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input placeholder="合同编号" type="text" v-model="query.contractCode" />
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="作价单位" filterable clearable v-model="query.unitId">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option
              v-for="(item, index) in [{text: '销售', value: 0},{text: '采购', value: 1}]"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="操作类型" filterable clearable v-model="query.tradePricingCategory">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="数据来源" filterable clearable v-model="query.sourceType">
            <Option
              v-for="(item, index) in []"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
      </Row>
     </qc-collapse>
      <Table
        size="small"
        border
        v-maxHeight
        class="margin-bottom-10"
        isDisabledKey='IsDeleted'
        :loading="tableLoading"
        :columns="columns"
        :data="list"
      ></Table>
      <QcPage
        size="small"
        show-total
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

import {column} from './column'
export default {
  data() {
    return {
      list: [],
      tableLoading: true,
      pagination: {},
      query: {}
      // columns: colume({}, this)
    }
  },
  computed: {
    columns() {
      return column({}, this)
    }
  },
  mounted () {
    setTimeout(() => {
      this.list = [{
        tradeAccountText: '上海-广发-启用',
        instrumentText: 'a2103	',
        isBuy: false,
        currentPosition: 100,
        currentWeight: 1000,
        currentPrice: 5000,
        hedgeFlagType: '投机',
        status: false,
        tradeTime: '2020-11-27T00:00:00+08:00',
        IsDeleted: false
      }, {
        tradeAccountText: '上海-广发-停用',
        instrumentText: 'a2103	',
        isBuy: true,
        currentPosition: 100,
        currentWeight: 1000,
        currentPrice: 5000,
        hedgeFlagType: '投机',
        status: true,
        tradeTime: '2020-11-27T00:00:00+08:00',
        IsDeleted: true
      }, {
        tradeAccountText: '上海-广发-停用',
        instrumentText: 'a2103	',
        isBuy: true,
        currentPosition: 100,
        currentWeight: 1000,
        currentPrice: 6000,
        hedgeFlagType: '投机',
        status: true,
        tradeTime: '2020-11-27T00:00:00+08:00',
        IsDeleted: true
      }]
      this.tableLoading = false
    }, 2000)
  },
  methods: {
    rowClassName(e) {
      console.log(e)
    },
    onPageChange() {

    },
    onPageSizeChange() {}
  }
}
</script>
