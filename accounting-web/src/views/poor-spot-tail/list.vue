<template>
  <div>
    <div>
     <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="结算日期"
            v-model="query.settlementDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
              v-for="(item, index) in commonData.commodityTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
              v-for="(item, index) in commonData.currencies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
         
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="作价单位" filterable clearable v-model="query.unitId">
            <Option
              v-for="(item, index) in commonData.units"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input placeholder="合同编号" type="text" v-model="query.contractCode" />
        </Col>
      </Row>
     </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcSpotTradeRecord')">添加</Button>
          <file-upload
            tempName="现货交易记录导入模板"
            action="ac-spot-tail-diffrence/preview"
            import="ac-spot-tail-diffrence/import"
            download="ac-spot-tail-diffrence/download-template"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_ImportAcSpotTailDiffrenceInfo')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportAcSpotTailDiffrenceInfo')" class="margin-right-3">导出</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
        size="small"
        border
        v-maxHeight
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
      ></Table>
    </div>
    <div>
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
    <!-- 批量编辑 -->
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
import {colume, importColumns} from "./colume";
export default {
  data() {
    return {
      commonData: {
        options: {},
        enums: {},
        accountStrategies: [],
        strategies: []
      },
      query: {
        settlementDateRange: [],
        tradingStrategyId: ''
      },
      list: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      isEditMore:false,
      selectList:[],
      LoadingExportState: false,
      columns: colume(this.commonData, this),
      importColumns: importColumns(this.commonData, this),
    };
  },
  computed: {
    accountStrategies() {
      if (this.query.accountingEntityId) {
        const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.query.accountingEntityId)
        return obj ? obj.tradingStrategies : []
      }
      return this.commonData.strategies
    }
  },
  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    let commonData = this.$store.state.cachedCommonData['tradepricing_getcommondata'];
    if(!commonData) {
      commonData = await this.api.getCommonData("TradePricing");
    }
    let accountStrategies = [];
    _.forEach(commonData.accountStrategies, o => {
      accountStrategies.push(...o.tradingStrategies);
    });
    commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
    this.commonData = commonData;
    this.search();
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: "poorSpotTailEdit"
      });
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      this.selectList = []
      utils.saveQuery(this.query);
      let query = { ...this.query };
      if (this.query.settlementDateRange.length) {
        query.settlementDateStart = this.query.settlementDateRange[0];
        query.settlementDateEnd = this.query.settlementDateRange[1];
      }
      delete query.settlementDateRange
      let { list, pagination } = await api.list(query, this.pagination);
      this.pagination = pagination;
      let newList = list.map(val=> { return  {...val,_disabled: val.sourceType ==1 ? true : false}})
      this.list = newList;
    },
    resetQuery() {
      this.query = {};
      this.query.settlementDateRange = []
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
    onDelete(params) {
      this.$Modal.confirm({
        title: "删除",
        content: `<p>确认删除该条数据？</p>`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          await api.delete(params.row.acSpotTailDifferenceInfoId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit(params) {
      this.$router.push({
        name: "poorSpotTailEdit",
        query: { id: params.row.acSpotTailDifferenceInfoId }
      });
    },
    imported() {
      this.search();
    },
    onExport() {
       this.LoadingExportState = true
      let query = { ...this.query };
      if (query.settlementDateRange.length) {
        query.pricingDateBegin = query.settlementDateRange[0];
        query.pricingDateEnd = query.settlementDateRange[1];
      }
      delete query.settlementDateRange
      query.isUnpriced = false;
       api.exportExcel(
          query,
        `现货尾差信息${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>

<style>
.ivu-table .blue{
  color: blue
}
.ivu-table .orange{
  color: orange
}
</style>
