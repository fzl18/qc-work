<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input
            placeholder="合同编号"
            v-model="query.contractCode"
          ></Input>
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
          <Select placeholder="方向" filterable clearable v-model="isBuy">
            <Option
              v-for="(item, index) in [{text:'采购',value:1},{text:'销售',value:0}]"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="合同类型" filterable clearable v-model="query.priceMakingType">
            <Option
              v-for="(item, index) in (commonData.priceMakingTypes && commonData.priceMakingTypes.tradePricingType)"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <!-- <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
              v-for="(item, index) in commonData.commodityTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="交易币种" filterable clearable v-model="query.currencyId">
            <Option
              v-for="(item, index) in commonData.currencies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col> -->
      </Row>
      </qc-collapse>
      <Row type="flex" justify="end" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
          <Button
            type="info"
            @click="onExport"
            icon="ios-cloud-download-outline"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcSpotInventoryAdjustment')"
          >导出</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list2">
      <qcgrid
        id="spot-inventory-regulation"
        :hasPage="false"
        :rowData="rowData"
        height="calc(100vh - 350px)"
        :gridOptions="gridOptions"
      ></qcgrid>
    </div>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
export default {
  data() {
    return {
      commonData: {},
      isShowModal: false,
      query: {},
      marketData: [],
      tableLoading: false,
      rowData: [],
      // dateRange: [],
      gridOptions: {},
      isBuy: null,
      LoadingExportState: false,
      columnDefs: [
        {
          headerName: "合同信息",
          children: [
            {
            headerName: "合同编号",
            field: "contractCode",
            filter: "agSetColumnFilter",
            // filter: "agSetColumnFilter",
            // valueFormatter: params => {
            //   return this.utils.formatDate(params.value);
            // },
            enableRowGroup: true
          },
          {
            headerName: "法人",
            field: "corporation",
            filter: "agSetColumnFilter",
            enableRowGroup: true
          },
          {
            headerName: "方向",
            field: "isBuyText",
            filter: "agSetColumnFilter",
            // cellRenderer: (params) =>{
            //   if(params.value === '1'){
            //     return '采购'
            //   }else{
            //     return '销售'
            //   }
            // },
            // valueFormatter: params => {
            //   return params.value == 1 ? "采购" : "销售"
            // },
            enableRowGroup: true
          },
          {
            headerName: "合同类型",
            field: "priceMakingType",
            filter: "agSetColumnFilter",
            valueFormatter: params => {
              return utils.showText(
                this.commonData.priceMakingTypes.tradePricingType,
                params.value
              );
            },
            enableRowGroup: true
          },
          {
            headerName: "合同币种",
            field: "currency",
            filter: "agSetColumnFilter",
            enableRowGroup: true
          },
          {
            headerName: "合同单位",
            field: "unit",
            filter: "agSetColumnFilter",
            enableRowGroup: true
          }]
        },
        {
          headerName: "价格信息",
          children:[
            {
              headerName: "数量",
              field: "quantity",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
            {
              headerName: "金额",
              field: "amount",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
          ]
        },
        {
          headerName: "货物信息",
          children:[
            {
              headerName: "数量",
              field: "cargoQuantity",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
            {
              headerName: "金额",
              field: "cargoAmount",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
          ]
        },
        {
          headerName: "发票信息",
          children:[
            {
              headerName: "数量",
              field: "invoiceQuantity",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
            {
              headerName: "金额",
              field: "invoiceAmount",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
          ]
        },
        {
          headerName: "价&票的差异",
          children:[
            {
              headerName: "量(价票差异)",
              field: "diffPriceInvoiceQuantity",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
            {
              headerName: "额(价票差异)",
              field: "diffPriceInvoiceAmount",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
          ]
        },
        {
          headerName: "货&票的差异",
          children:[
            {
              headerName: "量(货票差异)",
              field: "diffCargoInvoiceQuantity",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
            {
              headerName: "额(货票差异)",
              field: "diffCargoInvoiceAmount",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
          ]
        },
        {
          headerName: "价&货的差异",
          children:[
            {
              headerName: "量(价货差异)",
              field: "diffPriceCargoQuantity",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
            {
              headerName: "额(价货差异)",
              field: "diffPriceCargoAmount",
              type: "numberColumn",
              aggFunc: "sum",
              enableValue: true
            },
          ]
        },
        // {
        //   headerName: "更新时间",
        //   field: "lastManipulationTime",
        //   type: "dateColumn",
        //   valueFormatter: params => {
        //     return utils.formatDate(params.value, "YYYY-MM-DD HH:mm:ss");
        //   },
        //   enableValue: true
        // }
      ]
    };
  },
  async created() {
    this.commonData = await this.api.getCommonData("SpotInventoryAdjustmentController")
    this.search();
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: false,
      paginationPageSize: 10000,
      rowData: this.rowData,
      autoFitScreen: false,
      rowGroupPanelShow: "always"
    };

  },
  watch: {
    dateRange(val) {
      this.query.accountingDateQueryStart = utils.formatDate(val[0], "YYYY-MM-DD");
      this.query.accountingDateQueryEnd = utils.formatDate(val[1], "YYYY-MM-DD");
    }
  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query = {};
      this.isBuy = null
      // this.dateRange = []
    },
    async search() {
      if(this.isBuy != null){
        this.query.isBuy = this.isBuy ? true : false
      }else{
        this.query.isBuy = ''
      }
      let data = await api.list(this.query);
      this.rowData = data.list;
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `现货库存调节表${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
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
