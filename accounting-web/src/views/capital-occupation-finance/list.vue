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
            placeholder="日期"
            v-model="query.dateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="占用类型" filterable clearable v-model="query.acCapitalOccupationType">
            <Option
              v-for="(item, index) in (commonData.enumOptions && commonData.enumOptions.acCapitalOccupationType)"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
              v-for="(item, index) in commonData.porfitCenters"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId">
            <Option
              v-for="(item, index) in commonData.corporations"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
              v-for="(item, index) in commonData.commodityTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <!-- <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="交易策略" filterable clearable v-model="query.tradingStrategyId">
            <Option
              v-for="(item, index) in commonData.tradingStrategies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col> -->
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
            type="info"
            @click="onExport"
            icon="ios-cloud-download-outline"
            v-if="isShow('H_ExportAcCapitalOccupationSpot02')"
            :loading="LoadingExportState"
          >导出</Button>
        </Col>
         <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
        id="capital-occupation-cw"
        :hasPage="true"
        :rowData="rowData"
        :gridOptions="gridOptions"
        v-maxHeight
        :pagination="pagination"
        @on-page-change="onPageChange"
      ></qcgrid>
    </div>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
import moment from "moment";
export default {
  data() {
    return {
      commonData: {},
      isShowModal: false,
      query: {
        dateRange: []
      },
      marketData: [],
      tableLoading: false,
      rowData: [],
      gridOptions: {},
      current: null,
      LoadingExportState: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      columnDefs: [
        {
          headerName: "日期",
          field: "accountingDate",
          filter: "agSetColumnFilter",
          minWidth: 130,
          valueFormatter: params => {
            return this.utils.formatDate(params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "法人",
          field: "corporationId",
          filter: "agSetColumnFilter",
          minWidth: 130,
          valueFormatter: params => {
            return utils.showText(this.commonData.corporations, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "利润中心",
          field: "accountingEntityId",
          filter: "agSetColumnFilter",
          minWidth: 130,
          valueFormatter: params => {
            return utils.showText(
              this.commonData.porfitCenters,
              params.value
            );
          },
          enableRowGroup: true
        },
        // {
        //   headerName: "交易策略",
        //   field: "tradingStrategyText",
        //   filter: "agSetColumnFilter",
        //   minWidth: 130,
        //   valueFormatter: params => {
        //     return utils.showText(
        //       this.commonData.tradingStrategies,
        //       params.value
        //     );
        //   },
        //   enableRowGroup: true
        // },
        {
          headerName: "品类",
          field: "commodityTypeId",
          filter: "agSetColumnFilter",
          minWidth: 130,
          valueFormatter: params => {
            return utils.showText(this.commonData.commodityTypes, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "占用类型",
          field: "acCapitalOccupationTypeText",
          filter: "agSetColumnFilter",
          minWidth: 130,
          // valueFormatter: params => {
          //   return utils.showText(this.commonData.commodityTypes, params.value);
          // },
          enableRowGroup: true
        },
        {
          headerName: "清算币种",
          field: "homeCurrencyId",
          filter: "agSetColumnFilter",
          minWidth: 130,
          valueFormatter: params => {
            return utils.showText(this.commonData.currencies, params.value);
          },
          enableRowGroup: true
        },
        {
          headerName: "资金占用",
          field: "homeOccupyAmount",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "库存量",
          field: "inventoryVolume",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell justify='start'>{params.value}</format-cell>
          }
        },
        {
          headerName: "库存移动平均价",
          field: "currentAvgPrice",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "库存货值",
          field: "inventoryAmount",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell justify='start'>{params.value}</format-cell>
          }
        },
        {
          headerName: "采购预付款",
          field: "ptlBuyAdvancePaymentAmount",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "销售预发货折合资金",
          field: "sellNotPayAmount",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "其他应收",
          field: "otherPaidAmount",
          type: "numberColumn",
          aggFunc: "sum",
          minWidth: 100,
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "更新时间",
          field: "lastManipulationTime",
          type: "dateColumn",
          minWidth: 160,
          valueFormatter: params => {
            return utils.formatDate(params.value, "YYYY-MM-DD HH:mm:ss");
          },
          enableValue: true
        }
      ]
    };
  },
  async mounted(){
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await this.api.getCommonData("capitaloccupation");
    this.search();
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: false,
      paginationPageSize: 10000,
      rowData: this.rowData,
      autoFitScreen: true,
      rowGroupPanelShow: "always"
    };
  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query = {};
      this.current = null;
      this.query.dateRange = [];
    },
    async search() {
      utils.saveQuery(this.query);
      if (this.query.dateRange.length) {
        this.query.accountingDateQueryStart = utils.formatDate(this.query.dateRange[0]);
        this.query.accountingDateQueryEnd = utils.formatDate(this.query.dateRange[1]);
      }
      let data = await api.list({...this.query,pagination:this.pagination});
      this.rowData = data.list;
      this.pagination = data.pagination
    },
    onPageChange(page) {
      this.pagination.currentPage = page.currentPage;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      if (pageSize) {
        this.search();
      }
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `期货持仓${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    }
  }
};
</script>
<style>
.ivu-table-cell {
  padding-left: 4px !important;
  padding-right: 4px !important;
}
.red {
  color: red;
}
.ivu-table-row > td {
  position: relative;
}
.empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffa50085;
}
</style>

