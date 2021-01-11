<template>
  <div>
    <div>
        <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
                  type="daterange"
                  confirm
                  format="yyyy-MM-dd"
                  placement="bottom-start"
                  placeholder="清算日期"
                  v-model="query.dateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.profitCenterId">
            <Option
                    v-for="(item, index) in commonData.profitCenters"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId">
            <Option
                    v-for="(item, index) in commonData.corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
                    v-for="(item, index) in commonData.commodityTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
                    v-for="(item, index) in commonData.currencies"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
                  type="info"
                  @click="onExport"
                  icon="ios-cloud-download-outline"
                  v-if="isShow('H_ExportAcPurchasingCost')"
                  :loading="LoadingExportState"
          >导出
          </Button>
        </Col>
         <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
              id="futures-capital-occupation"
              :hasPage="true"
              :rowData="rowData"
              :gridOptions="gridOptions"
              :pagination="pagination"
              v-maxHeight
              @on-page-change="onPageChange"
      ></qcgrid>
    </div>
  </div>
</template>
<script>
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    data () {
      return {
        commonData: {},
        isShowModal: false,
        query: {
          accountingDateQueryStart: '',
          accountingDateQueryEnd: '',
          profitCenterId: '',
          corporationId: '',
          commodityTypeId: '',
          dateRange: [],
          currencyId: ''
        },
        marketData: [],
        tableLoading: false,
        rowData: [],
        gridOptions: {},
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        LoadingExportState: false,
        columnDefs: [
          {
            headerName: '清算日期',
            field: 'accountingDate',
            filter: 'agSetColumnFilter',
            valueFormatter: params => this.utils.formatDate(params.value),
            enableRowGroup: true
          },
          {
            headerName: '利润中心',
            field: 'profitCenterId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => utils.showText(this.commonData.profitCenters, params.value),
            enableRowGroup: true
          },
          {
            headerName: '法人',
            field: 'corporationId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => utils.showText(this.commonData.corporations, params.value),
            enableRowGroup: true
          },
          {
            headerName: '品类',
            field: 'commodityTypeId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => utils.showText(this.commonData.commodityTypes, params.value),
            enableRowGroup: true
          },
          {
            headerName: '币种',
            field: 'currencyId',
            filter: 'agSetColumnFilter',
            valueFormatter: params => utils.showText(this.commonData.currencies, params.value),
            enableRowGroup: true
          },

          {
            headerName: '持仓数量',
            field: 'spotPositionQuantity',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true,
            width: 130,
            render: (h, params) => {
              return <format-cell>{params.value}</format-cell>
            }
          },
          {
            headerName: '采购成本',
            field: 'purchasingCost',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true,
            width: 130,
            render: (h, params) => {
              return <format-cell>{params.value}</format-cell>
            }
          },
          {
            headerName: '现货持仓均价',
            field: 'spotPositionAveragePrice',
            type: 'numberColumn',
            enableValue: true,
            width: 140,
            render: (h, params) => {
              return <format-cell>{params.value}</format-cell>
            }
          },
          {
            headerName: '期货总盈亏',
            field: 'futuresTotalProfit',
            type: 'numberColumn',
            aggFunc: 'sum',
            enableValue: true,
            width: 130,
            render: (h, params) => {
              return <format-cell>{params.value}</format-cell>
            }
          },
          {
            headerName: '更新时间',
            field: 'lastManipulationTime',
            type: 'dateColumn',
            width: 200,
            valueFormatter: params => utils.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss'),
            enableValue: true
          }
        ]
      };
    },
    async created () {
      this.query = utils.saveQuery(this.query, 'get');
      this.commonData = await this.api.getCommonData('AcPurchasingCost');
      this.search();
      this.gridOptions = {
        columnDefs: this.columnDefs,
        pagination: false,
        paginationPageSize: 10000,
        rowData: this.rowData,
        autoFitScreen: true,
        rowGroupPanelShow: 'always'
      };

    },
    methods: {
      onSearch () {
        this.search();
      },
      resetQuery () {
        this.query = {};
        this.query.dateRange = [];
      },
      async search () {
        utils.saveQuery(this.query);
        if (this.query.dateRange.length) {
          this.query.accountingDateQueryStart = utils.formatDate(this.query.dateRange[0]);
          this.query.accountingDateQueryEnd = utils.formatDate(this.query.dateRange[1]);
        }
        this.query.pagination = this.pagination;
        let data = await api.list(this.query);
        this.rowData = data.list;
        this.pagination = data.pagination;
      },
      onPageChange (page) {
        this.pagination.currentPage = page.currentPage;
        this.search();
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize;
        if (pageSize) {
          this.search();
        }
      },
      onExport () {
        this.LoadingExportState = true;
        this.query.accountingDateQueryStart = this.query.dateRange[0];
        this.query.accountingDateQueryEnd = this.query.dateRange[1];
        api.exportExcel(
          this.query,
          `采购成本${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
