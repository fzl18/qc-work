<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="date"
            placement="bottom-start"
            placeholder="交易日期"
            :clearable=false
            v-model="query.TradeDate"            
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <!-- <a-tree-select
            v-model="query.AccountingEntityId"
            style="width: 100%"
            :tree-data="commonData.permissionTreeProfits"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="利润中心"
            searchPlaceholder="利润中心筛选"
            class="treeselect"
            show-search
            allow-clear
            treeNodeFilterProp='title'
            tree-default-expand-all
            :replaceFields="replaceFields2"
          ></a-tree-select> -->
          <Select placeholder="利润中心" filterable clearable v-model="query.AccountingEntityId">
            <Option
              v-for="(item, index) in commonData.permissionProfits && commonData.permissionProfits.filter(val => val.isAtomicProfitCenter)"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.CorporationId">
            <Option
              v-for="(item, index) in commonData.permissionCorporations"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
        <!-- <a-tree-select
            v-model="query.TradingStrategyId"
            style="width: 100%"
            :tree-data = "treeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            show-search
            class="treeselect"
            allow-clear
            tree-default-expand-all
            treeNodeFilterProp='title'
            placeholder="策略"
            searchPlaceholder="策略筛选"
            :replaceFields="replaceFields"
          >
          </a-tree-select> -->
          <Select placeholder="策略" filterable clearable v-model="query.TradingStrategyId">
            <Option
              v-for="(item, index) in commonData.permissionNoTreeTradingStrategies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.CommodityTypeId">
            <Option
              v-for="(item, index) in commonData.commodityTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.CurrencyId">
            <Option
              v-for="(item, index) in commonData.currencies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
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
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcPnLReport')"
          >导出</Button>
          <!-- 期货资金占用-导出   H_ExportAcCapitalOccupation -->
          <span class="updateTime">最后更新时间：{{searchTime}}</span>
        </Col>
         <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
      
    </div>
    
    <div class="plan-list2">
      <div class="tabBar">
      <ul>
        <template v-for="(item,key) in tabBar" >
          <li :key="key" :class="{'cur':item.key == currentTab}" @click="selectTab(item.key)">{{item.text}}</li>
        </template>
      </ul>
    </div>
      <qcgrid
        id="futures-profit"
        :hasPage="false"
        :rowData="rowData"
        :gridOptions="gridOptions"
        v-maxHeight        
      ></qcgrid>
      <div class="tips">
      本页共{{rowData.length}}行  总计（{{currentCurrency}}）： <template v-if="currentTab == 2 ">   今盯市盈亏：<span>{{sumMarketPnL}}</span> </template>   <template v-if="currentTab !=2 "> 浮动盈亏：<span>{{sumPositionPnL}}</span> 今平仓盈亏：<span>{{sumClosePnL}}</span> </template>净利润：<span>{{sumNetPnL}}</span>
    </div>
    </div>
    
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import _ from "lodash"
import api from "./api";
import { Cell } from 'view-design';
export default {
  data() {
    return {
      commonData: {},
      isShowModal: false,
      treeData:[],
      searchText:'',
      replaceFields:{
        children:'childrens', title:'name', key:'id', value: 'id' 
      },
      replaceFields2:{
        children:'children', title:'name', key:'wfAccountEntityId', value: 'wfAccountEntityId' 
      },
      query: {
        TradeDate: moment().format("YYYY-MM-DD"),
        AccountingEntityId: null,
        CorporationId: null,
        TradingStrategyId: null,
        CommodityTypeId: null,
        CurrencyId: null,
      },
      currentTab: 1,      
      tableLoading: false,
      sumMarketPnL:0,
      sumNetPnL:0,
      sumPositionPnL:0,
      sumClosePnL:0,
      tabBar:[],
      currentCurrency:'',
      rowData: [],
      reportList: {},
      gridOptions: {},
      searchTime:'',
      LoadingExportState: false,
      // pagination: {
      //   currentPage: 1,
      //   totalCount: 0,
      //   pageSize: 15
      // },
      
    };
  },

  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    let commonData = this.$store.state.cachedCommonData['report_getcommondata'];
    if (!commonData) {
      commonData = await this.api.getCommonData('Report');
    }
    this.commonData = commonData;
    this.currentCurrency = this.commonData.currencies.find(val => val.value == this.commonData.functionalCurrencyId).text
    this.treeData = this.commonData.permissionTradingStrategies
    if(this.commonData.effectivePnLClearMode){
      this.commonData.pnLAccountingModes.forEach(data => {
        if ((data.value & this.commonData.effectivePnLClearMode) > 0) {
          switch (data.text) {
            case "逐笔对冲":
              data.key = 1
              break;
            case "逐日盯市":
              data.key = 2
              break;
            case "均价对冲":
              data.key = 3
              break;
            default:
              break;
          }
          this.tabBar.push(data)
        }
      });
    }else{
      this.tabBar = []
    }
  },
  mounted(){
    this.search()
  },
  computed:{
    tabColumns() {      
      return  ([
        {
          headerName: "利润中心",
          field: "accountEntity",
          minWidth: 100,
          filter: "agSetColumnFilter",
          // valueFormatter: params => {
          //   return this.utils.formatDate(params.value);
          // },
          enableRowGroup: true
        },
        {
          headerName: "法人",
          field: "corporation",
          minWidth: 100,
          filter: "agSetColumnFilter",
          // valueFormatter: params => {
          //   return this.utils.formatDate(params.value);
          // },
          enableRowGroup: true
        },
        {
          headerName: "策略",
          field: "tradingStrategy",
          minWidth: 100,
          filter: "agSetColumnFilter",
          // valueFormatter: params => {
          //   return this.utils.formatDate(params.value);
          // },
          enableRowGroup: true
        },
        {
          headerName: "品类",
          field: "commodityType",
          minWidth: 100,
          filter: "agSetColumnFilter",
          // valueFormatter: params => {
          //   return this.utils.formatDate(params.value);
          // },
          enableRowGroup: true
        },
        {
          headerName: "币种",
          field: "currency",
          minWidth: 100,
          filter: "agSetColumnFilter",
          // valueFormatter: params => {
          //   return this.utils.formatDate(params.value);
          // },
          enableRowGroup: true
        },
        {
          headerName: "浮动盈亏",
          field: "positionPnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "今平仓盈亏",
          field: "closePnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总平仓盈亏",
          field: "totalClosePnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "今盯市盈亏",
          field: "marketPnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总盯市盈亏",
          field: "totalMarketPnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "今其他盈亏",
          field: "otherPnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总其他盈亏",
          field: "totalOtherPnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "今费用",
          field: "cost",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总费用",
          field: "totalCost",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          },
        },
        {
          headerName: "总毛利",
          field: "totalTradePnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "总净利",
          field: "totalNetPnL",
          minWidth: 100,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        {
          headerName: "外汇汇率",
          field: "exchangeRate",
          minWidth: 100,
          filter: "agSetColumnFilter",
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          },
          enableRowGroup: true
        },
        {
          headerName: `总毛利（${this.currentCurrency}）`,
          field: "totalTradePnLHomeCur",
          minWidth: 150,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          },
        },
        {
          headerName: `净利润（${this.currentCurrency}）`,
          field: "totalNetPnLHomeCur",
          minWidth: 150,
          type: "numberColumn",
          aggFunc: 'sum',
          enableValue: true,
          render: (h, params) => {
            return <format-cell>{params.value}</format-cell>
          }
        },
        // {
        //   headerName: "操作",
        //   field: "acCapitalOccupationId",
        //   filter: "agSetColumnFilter",
        //   pinned: "right",
        //   cellRenderer: params => {
        //     var eDiv = document.createElement('div');
        //     eDiv.innerHTML = '<a href="javascript:;" class="btn-simple">查看明细</a>';
        //     var eButton = eDiv.querySelectorAll('.btn-simple')[0];
        //     eButton.addEventListener('click', ()=> {
        //         this.getMarketDetail(params.value);
        //     });
        //     return eDiv;
        //   }
        // }
      ])
    }
  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query.AccountingEntityId = null;
      this.query.CorporationId = null;
      this.query.TradingStrategyId = null;
      this.query.CommodityTypeId = null;
      this.query.CurrencyId = null;
    },
    async search() {
      utils.saveQuery(this.query);
      // this.query.pagination = this.pagination
      let data = await api.list(this.query);
      let effectivePnLClearMode = this.commonData.effectivePnLClearMode
      this.reportList = data
      this.rowData = this.reportList.individualHedgingReport.individualHedgings
      this.searchTime = utils.formatDate(new Date(), "YYYY-MM-DD HH:mm:ss")
      this.selectTab(1)
      // this.pagination = data.pagination
    },
    // onPageChange(page) {
    //   this.pagination.currentPage = page.currentPage;
    //   this.search();
    // },
    // onPageSizeChange(pageSize) {
    //   this.pagination.pageSize = pageSize;
    //   if (pageSize) {
    //     this.search();
    //   }
    // },
    selectTab(tab) {
      this.currentTab = tab      
      switch(tab) {
        case 1:
          this.rowData = this.reportList.individualHedgingReport.individualHedgings
          this.sumPositionPnL = utils.formatAmount(this.reportList.individualHedgingReport.sumPositionPnL)
          this.sumClosePnL = utils.formatAmount(this.reportList.individualHedgingReport.sumClosePnL)
          this.sumNetPnL = utils.formatAmount(this.reportList.individualHedgingReport.sumNetPnL)
          this.gridOptions={
            columnDefs: _.filter(this.tabColumns, val => val.headerName !== "策略" && val.headerName !== "今盯市盈亏" && val.headerName !== "总盯市盈亏"),
            pagination: false,
            paginationPageSize: 10000,
            rowData: this.rowData,
            autoFitScreen: true,
            rowGroupPanelShow: "always"
          }
          break;
        case 2:
          this.rowData = this.reportList.markToMarketReport.markToMarkets
          this.sumMarketPnL = utils.formatAmount(this.reportList.markToMarketReport.sumMarketPnL)
          this.sumNetPnL = utils.formatAmount(this.reportList.markToMarketReport.sumNetPnL)
          this.gridOptions={
            columnDefs: _.filter(this.tabColumns, val => val.headerName !== "策略" && val.headerName !== "今平仓盈亏" && val.headerName !== "总平仓盈亏" && val.headerName !== "浮动盈亏"),
            pagination: false,
            paginationPageSize: 10000,
            rowData: this.rowData,
            autoFitScreen: true,
            rowGroupPanelShow: "always"
          }
          break;
        case 3:
          this.rowData = this.reportList.avgPriceHedgingReport.avgPriceHedgings
          this.sumPositionPnL = utils.formatAmount(this.reportList.avgPriceHedgingReport.sumPositionPnL)
          this.sumClosePnL = utils.formatAmount(this.reportList.avgPriceHedgingReport.sumClosePnL)
          this.sumNetPnL = utils.formatAmount(this.reportList.avgPriceHedgingReport.sumNetPnL)
          this.gridOptions={
            columnDefs: _.filter(this.tabColumns, val => val.headerName !== "今盯市盈亏" && val.headerName !== "总盯市盈亏"),
            pagination: false,
            paginationPageSize: 10000,
            rowData: this.rowData,
            autoFitScreen: true,
            rowGroupPanelShow: "always"
          }
          break;
      }
    },

    // async getMarketDetail(params) {
    //   let query = {
    //     acReportId: params,
    //     acReportType: this.commonData.acReportType && this.commonData.acReportType.filter(val=>val.text =='期货资金占用')[0].value
    //   };
    //   let marketData = await api.getMarketDetail(query);
    //   let excahngeData = await api.getExcahngeDetail(query);
    //   this.marketData = marketData.list;
    //   this.excahngeData = excahngeData.list;
    //   this.isShowModal = true;
    // },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query
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
<style lang="less" scoped>
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
.plan-list:last-child{
  margin-top: 50px;
}
h3{
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 36px;
}
.updateTime{
  color: rgb(45, 140, 240);
  margin-left: 10px;
}
.tabBar{
  overflow: hidden;
  height: 32px;
  padding-top: 10px;
  &::before{
      content: '';
      width: 100%;
      display: block;
      border-bottom: 1px solid #ddd;
      position: relative;
      top: 20px;
    }
  ul{overflow: hidden;}
  li{
    float: left;
    list-style: none;
    margin-right: 40px;
    cursor: pointer;
    &.cur{
      border-bottom: 3px solid  rgb(45, 140, 240);
      position: relative;
    } 
  }
}
.tips{
  text-align: right;
  span{background:orange;padding: 0 5px;display: inline-block;margin: 0 5px;}
}
.treeselect{
    font-size: 12px!important;
    .ant-select-selection__rendered{
      margin-left:7px!important;
    }
  }
</style>
