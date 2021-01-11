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
              placeholder="作价日期"
              v-model="query.pricingDate"
            ></DatePicker>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="利润中心"
              filterable
              clearable
              v-model="query.accountingEntityId"
            >
              <Option
                v-for="(item, index) in commonData.accountEntities.filter(o => o.isAtomicAccounting)"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="策略"
              filterable
              clearable
              v-model="query.tradingStrategyId"
            >
              <Option
                v-for="(item, index) in commonData.tradingStrategies"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option
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
              >{{ item.text }}
              </Option
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
                v-for="(item, index) in [{ text: '采购', value: 1 }, { text: '销售', value: 0 }]"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="品类"
              filterable
              clearable
              v-model="query.commodityTypeId"
            >
              <Option
                v-for="(item, index) in commonData.commodityTypes"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="品种"
              filterable
              clearable
              v-model="query.commodityId"
            >
              <Option
                v-for="(item, index) in commonData.comodities"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option
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
              >{{ item.text }}
              </Option
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
              >{{ item.text }}
              </Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              placeholder="贸易类型"
              filterable
              clearable
              v-model="query.simpleTradeType"
            >
              <Option
                v-for="(item, index) in commonData.simpleTradeType"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input placeholder="合同编号" type="text" v-model="query.contractCode" clearable/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input placeholder="客户" type="text" v-model="query.customer" clearable/>
          </Col>
        </Row>
      </Form>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
            type="primary"
            icon="md-add"
            @click="onAdd"
            v-if="isShow('H_CreateAcSpotPricingRecord')"
          >添加
          </Button
          >
          <file-upload
            tempName="现货点价信息导入模板"
            action="AcSpotPricingRecord/Preview"
            import="AcSpotPricingRecord/Import"
            download="AcSpotPricingRecord/download-template"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_ImportAcSpotPricingRecord')"
          ></file-upload>
          <Button
            class="margin-right-3"
            type="info"
            @click="onExport"
            icon="ios-cloud-download-outline"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcSpotPricingRecord')"
          >导出
          </Button
          >
        </Col>
        <Col class-name="margin-bottom-10">
          <Button
            icon="md-close-circle"
            @click="resetQuery"
            class="margin-right-3"
          >清空
          </Button
          >
          <Button type="primary" icon="md-search" @click="onSearch"
          >搜索
          </Button
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
      :data="list"
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
  import { utils } from '@/utils/utils'
  import api from './api'
  import { listColumns, importColumns } from './column'

  export default {
    data () {
      return {
        query: {
          pricingDate: '',
          accountingEntityId: '',
          tradingStrategyId: '',
          corporationId: '',
          isBuy: '',
          commodityTypeId: '',
          commodityId: '',
          currencyId: '',
          unitId: '',
          contractCode: '',
          customer: ''
        },
        commonData: {
          simpleTradeType: [],
          profitCenters: [],
          options: {},
          enums: {},
          accountEntities: [],
          tradingStrategies: [],
          corporations: [],
          commodityTypes: [],
          comodities: [],
          currencies: [],
          units: [],
          customers: []
        },
        LoadingExportState: false,
        list: [],
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        }
      }
    },
    computed: {
      listColumns() {
        return listColumns(this.commonData, this)
      },
      importColumns() {
        return importColumns(this.commonData, this)
      }
    },
    async created () {
      this.query = utils.saveQuery(this.query, 'get')
      let commonData = this.$store.state.cachedCommonData['spotpricing_getcommondata']
      if (!commonData) {
        commonData = await this.api.getCommonData('AcSpotPricingRecord')
      }
      this.commonData = commonData
      this.search()
    },
    methods: {
      isShow(permission) {
        return utils.hasPermission(permission)
      },
      onSearch () {
        this.pagination.currentPage = 1
        this.search()
      },
      async search () {
        utils.saveQuery(this.query)
        let query = _.cloneDeep(this.query)
        if (this.query.pricingDate.length) {
          query.pricingDateStart = this.query.pricingDate[0]
          query.pricingDateEnd = this.query.pricingDate[1]
        }
        let { result, pagination } = await api.list(query, this.pagination)
        this.pagination = pagination
        this.list = result
      },
      onAdd () {
        this.$router.push({ name: 'spotPricingInfoCreate' })
      },
      onEdit (row) {
        this.$router.push({
          name: 'spotPricingInfoEdit',
          query: { id: row.acSpotPricingRecordId }
        })
      },
      onDelete (row) {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>确认删除该条数据？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove()
            await api.delete(row.acSpotPricingRecordId)
            this.$Message.success(`删除成功!`)
            this.search()
          }
        })
      },
      onExport () {
        this.LoadingExportState = true;
        let query = {
          ...this.query,
          pricingDateStart: this.query.pricingDate[0],
          pricingDateEnd: this.query.pricingDate[1]
        };
        api.exportExcel(
          query,
          `现货点价信息${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      resetQuery () {
        this.query = {}
        this.query.pricingDate = ''
      },
      imported () {
        this.search()
      },
      onPageChange (page) {
        this.pagination.currentPage = page
        this.search()
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize
        this.search()
      },
    },
  }
</script>

<style scoped lang="less">
</style>
