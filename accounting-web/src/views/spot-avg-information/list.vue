<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <DatePicker
              type="daterange"
              confirm
              placement="bottom-start"
              placeholder="请选择日期范围"
              v-model="query.accountingDateRange"
            ></DatePicker>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="利润中心"
              filterable
              clearable
              v-model="query.accountingEntityId"
              @on-change="changeProfitCenter"
            >
              <Option
                v-for="(item, index) in commonData.accountingEntities.filter(data => data.isAtomicProfitCenter)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="策略"
              filterable
              clearable
              v-model="query.strategyId"
            >
              <Option
                v-for="(item, index) in accountStrategies"
                :label="item.name"
                :value="item.tradingStrategyId"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="法人"
              filterable
              clearable
              v-model="query.corporationId"
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
              placeholder="方向"
              filterable
              clearable
              v-model="query.isBuy"
            >
              <Option
                v-for="(item, index) in direction"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="品类"
              filterable
              clearable
              v-model="query.commodityId"
            >
              <Option
                v-for="(item, index) in commonData.commodities"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="品种"
              filterable
              clearable
              v-model="query.commodityTypeId"
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
              placeholder="币种"
              filterable
              clearable
              v-model="query.currencyId"
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
              placeholder="单位"
              filterable
              clearable
              v-model="query.unitId"
            >
              <Option
                v-for="(item, index) in commonData.units"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="作价市场"
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
          <!-- 具体合约 -->
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <InstrumentSelect
              
              v-model="query.instrumentId"
            ></InstrumentSelect>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="行情价格类型"
              filterable
              clearable
              v-model="query.feedTypeId"
            >
              <Option
                v-for="(item, index) in commonData.feedTypes"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="生成交易记录"
              filterable
              clearable
              v-model="query.generateStatus"
            >
              <Option
                v-for="(item, index) in hasTraderRecord"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input placeholder="合同编号" type="text" v-model="query.contractCode" />
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input placeholder="客户" type="text" v-model="query.customer" />
          </Col>
        </Row>
      </Form>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
            type="primary"
            icon="md-add"
            @click="onAdd"
            v-if="isShow('H_CreateAcSpotAveragePricingRecord')"
            >添加</Button
          >
          <file-upload
            tempName="现货均价信息导入模板"
            action="AcSpotAveragePricingInfo/Preview"
            import="AcSpotAveragePricingInfo/Import"
            download="AcSpotAveragePricingInfo/DownloadTemplate"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_ImportAcSpotAveragePricingRecord')"
          ></file-upload>
          <Button
            class="margin-right-3"
            type="info"
            @click="onExport"
            icon="ios-cloud-download-outline"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcSpotAveragePricingRecord')"
            >导出</Button
          >
        </Col>
        <Col class-name="margin-bottom-10">
          <Button
            icon="md-close-circle"
            @click="resetQuery"
            class="margin-right-3"
            >清空</Button
          >
          <Button type="primary" icon="md-search" @click="onSearch"
            >搜索</Button
          >
        </Col>
      </Row>
    </qc-collapse>
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
    <Modal
      v-model="isEditMore"
      title="手动确认均价现货交易记录信息"
      width="50%"
      @on-cancel="cancel"
    >
      <p>
        货量：<span>{{rowData.cargoQuantity + rowData.unitText}}</span>; 
        作价市场：<span>{{rowData.exchangeText}}</span>; 
        品类：<span>{{rowData.commodityTypeText}}</span>; 
        作价起止日期：<span>{{utils.formatDate(rowData.pricingStartDate) + '至' + utils.formatDate(rowData.pricingEndDate)}}</span>;
      </p>
      <Form :model="tableForm" ref="tradeRecordListDataForm">
        <Table
          size="small"
          max-height="400"
          border
          class="margin-bottom-10"
          :loading="false"
          :columns="tradeRecordListColumns"
          :data="tableForm.tradeRecordListData">
        </Table>
      </Form>
      <div slot="footer">
        <Button class="margin-right-3" @click="cancel">返回</Button>
        <Button type="primary" @click="saveMannualGenerateTradePricing">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from "@/utils/utils";
import api from "./api";
import { importColumns, listColumns } from './column'

export default {
  data() {
    return {
      query: {
        accountingDateRange: [],
        accountingEntityId: '',
        strategyId: '',
        corporationId: '',
        isBuy: '',
        commodityId: '',
        commodityTypeId: '',
        unitId: '',
        currencyId: '',
        marketId: '',
        instrumentId: '',
        feedTypeId: '',
        generateStatus: '',
        contractCode: '',
        customer: ''
      },
      rowData: {},
      isEditMore: false,
      commonData: {
        accountingEntities: [],
        corporations: [],
        commodities: [],
        materials: [],
        exchanges: [],
        units: [],
        feedTypes: [],
        simpleTradeType: [],
        instrumentCategories: [],
        commodityTypes: [],
        strategies: [],
      },
      atomicProfitCenter: [],
      LoadingExportState: false,
      listData: [{
        name: 1
      }],
      tableForm: {
        tradeRecordListData: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      listColumns: listColumns(this),
      tradeRecordListColumns: [{
        title: "开始作价日",
        key: "pricingStartDate",
        align: "center",
        minWidth: 120,
        renderHeader: () => <span><span class="text-danger">*</span>开始作价日</span>,
        render: (h, { row, index }) => {
          let that = this
            return  h('FormItem', { props: {
              prop: 'tradeRecordListData['+ index +'].pricingStartDate',
              required: true
              }
            },
            [
              h("DatePicker", {
                props: {
                  value: row.pricingStartDate,
                  confirm: true,
                  type: "date",
                  transfer: true,
                  options: that.banDateRules,
                  placeholder: "请选择开始作价日"
                },
                on: {
                  input(val) {
                    that.tableForm.tradeRecordListData[index].pricingStartDate = utils.formatDate(val)
                  }
                }
              })
            ])
        }
      },
      {
        title: "结束作价日",
        key: "pricingEndDate",
        align: "center",
        minWidth: 120,
        renderHeader: () => <span><span class="text-danger">*</span>结束作价日</span>,
        render: (h, { row, index }) => {
          let that = this
          return h('FormItem', { props: {
              prop: 'tradeRecordListData['+ index +'].pricingEndDate',
              required: true
              }
            },
            [
              h("DatePicker", {
                props: {
                  value: row.pricingEndDate,
                  confirm: true,
                  type: "date",
                  transfer: true,
                  options: that.banDateRules,
                  placeholder: "请选择结束作价日"
                },
                on: {
                  input(val) {
                    that.tableForm.tradeRecordListData[index].pricingEndDate = utils.formatDate(val)
                  }
                }
              })
            ]
          )
        }
      },
      {
        title: "合约",
        key: "instrumentId",
        align: "center",
        minWidth: 120,
        renderHeader: () => <span><span class="text-danger">*</span>合约</span>,
        render: (h, { row, index }) => {
          let that = this
          return h('FormItem', { props: {
              prop: 'tradeRecordListData['+ index +'].instrumentId',
              required: true
              }
            },
            [
              h("InstrumentSelect", {
                props: {
                  value: row.instrumentId,
                  allDate: true,
                  placeholder: "请选择具体合约",
                  filterQuery: that.filterInstrumentQuery
                },
                on: {
                  input(val) {
                    that.tableForm.tradeRecordListData[index].instrumentId = val
                  }
                }
              })
            ]
          )
        }
      },{
        type: 'hetml',
        align: "center",
        width: 60,
        renderHeader: (h) => {
          let that = this
          return h('Button', {
            props: {
              size: "small",
              type: "primary",
              icon: "md-add"
            },
            on: {
              click() {
                that.tableForm.tradeRecordListData.push({
                  pricingStartDate: '',
                  pricingEndDate: '',
                  instrumentId: '',
                })
              }
            }
          })
        },
        render: (h, { index }) => {
          let that = this
          return h('Button', {
            props: {
              size: "small",
              type: "warning",
              icon: "md-close",
            },
            style: {
              margin: 'auto',
              display: 'block'
            },
            on: {
              click() {
                that.tableForm.tradeRecordListData.splice(index, 1)
              }
            }
          })
        }
      }],
      hasTraderRecord: [
        { value: 'true', text: '成功' },
        { value: 'false', text: '失败' }
      ],
      direction: [
        { value: 'true', text: '采购' },
        { value: 'false', text: '销售' }
      ],
      importColumns: importColumns(this.commonData)
    };
  },
  created() {},
  async mounted () {
    this.query = utils.saveQuery(this.query, 'get');
    let commonData = await api.getCommonData()
    this.commonData = commonData
    this.search();
  },
  computed: {
    accountStrategies() {
      return (_.find(this.commonData.accountStrategies, data => data.accountEntityId === this.query.accountingEntityId) || {}).tradingStrategies || []
    },
    banDateRules () {
      let that = this
      return {
        disabledDate (date) {
          return date && (date.valueOf() < new Date(that.rowData.pricingStartDate) || date.valueOf() > new Date(that.rowData.pricingEndDate));
        }
      }
    },
    filterInstrumentQuery () {
      const exchangeText = utils.showText(this.commonData.exchanges, this.rowData.marketId);
      const commodityTypeObj = this.commonData.commodityTypes.find(val => val.value === this.rowData.commodityTypeId);
      const commodityTypeText = commodityTypeObj ? commodityTypeObj.text : '';
      const id = this.commonData.financialInstrumentType && this.commonData.financialInstrumentType.find(o => o.text === "期货");
      return [{
        key: 'marketId',
        text: '作价市场',
        id: this.rowData.marketId,
        code: `${this.rowData.marketId ? exchangeText : ''}`,
        required: true
      }, {
        key: 'commodityTypeId',
        text: '品类',
        id: this.rowData.commodityTypeId,
        code: `${this.rowData.commodityTypeId ? commodityTypeText : ''}`,
        required: true
      }, {
        key: 'financialInstrumentType',
        text: '合约类型',
        id: id && id.value,
        code: '期货',
        required: true
      }];
    }
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1
      this.search()
    },
    async search() {
      utils.saveQuery(this.query)
      this.query.pricingStartDate = this.query.accountingDateRange[0] || ''
      this.query.pricingEndDate = this.query.accountingDateRange[1] || ''
      let data = await api.list(this.query, this.pagination)
      this.listData = data.list
      this.pagination = data.pagination
    },
    onAdd() {
      this.$router.push({name: 'spotAvgInformationCreate'})
    },
    onEdit(row) {
      this.$router.push({name: 'spotAvgInformationEdit', query: {id: row.acSpotAveragePricingRecordId}})
    },
    onDelete(row) {
      this.$Modal.confirm({
        title: "删除",
        content: `<p>确认删除该数据？</p>`,
        loading: true,
        onOk: async () => {
          await api.delete(row.acSpotAveragePricingRecordId);
          this.$Modal.remove();
          this.$Message.success(`删除成功!`);
          this.onSearch();
        }
      })
    },
    onExport() {
      this.query.pricingStartDate = this.query.accountingDateRange[0] || ''
      this.query.pricingEndDate = this.query.accountingDateRange[1] || ''
      api.exportExcel(this.query, `现货均价信息${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`).then(result => {
        this.LoadingExportState = false
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    resetQuery() {
      this.query = {};
      this.query.accountingDateRange = [];
    },
    imported() {
      this.search();
    },
    cancel() {
      this.tableForm.tradeRecordListData = []
      this.isEditMore = false
    },
    saveMannualGenerateTradePricing() {
      this.$refs['tradeRecordListDataForm'].validate(valid => {
        if(valid) {
          let form = this.tableForm.tradeRecordListData.map(data => {
            return Object.assign({}, this.rowData, data)
          })
          api.mannualGenerateTradePricing(form).then(result => {
            this.$Message.success(result.message || '保存成功！')
            this.tableForm.tradeRecordListData = []
            this.onSearch()
            this.isEditMore = false
          })
        }
      })
    },
    changeProfitCenter() {
      this.query.strategyId = ''
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

<style scoped lang="less">
</style>
