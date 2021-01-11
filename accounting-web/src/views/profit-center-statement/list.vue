<template>
  <div class="profitCenterStatement">
    <div>
      <qc-collapse>
      <Form  :model="query" ref='form'>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem required prop='queryDate'>
          <DatePicker
            type="date"
            placement="bottom-start"
            placeholder="清算日期"
            v-model="query.queryDate"
          ></DatePicker>
          </FormItem>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem required prop='accountingEntityId'>
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
              v-for="(item, index) in commonData.accountEntities"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
           </FormItem>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
         <FormItem required prop='defaultPnLClearMode'>
          <Select placeholder="清算模式" filterable clearable v-model="query.defaultPnLClearMode">
            <Option
              v-for="(item, index) in pnLAccountingMode"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
          </FormItem>
        </Col>
      </Row>
      </Form>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
            type="info"
            @click="onExport"
            icon="ios-cloud-download-outline"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcProfitCenterStatementReport')"
          >导出</Button>
          <!-- 期货资金占用-导出   H_ExportAcCapitalOccupation -->
        </Col>
         <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle"  class="margin-right-3" @click="clear">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <Tabs value="name1" v-model="tabname" v-if='showTab'>
        <TabPane label="每日汇总" name="name1">
          <Summary v-if='tabname =="name1"' :accountingEntityId='query.accountingEntityId' :clearMode='query.defaultPnLClearMode' :data='dailySummary' :commonData='commonData'/>
        </TabPane>
        <TabPane label="成交明细" name="name2">
          <deal-detail v-if='tabname =="name2"' :data='tradeDetail' :commonData='commonData'/>
        </TabPane>

        <TabPane label="持仓明细"  v-if='query.defaultPnLClearMode ==2 ||query.defaultPnLClearMode ==1' name="name3">
          <position-detail v-if='tabname =="name3"' :data='positionDetails' :commonData='commonData'/>
        </TabPane>
        <TabPane label="平仓明细" v-if='query.defaultPnLClearMode ==2 ||query.defaultPnLClearMode ==1' name="name4">
          <colse-position-detail v-if='tabname =="name4"' :data='closePositionDetails' :commonData='commonData'/>
        </TabPane>
    </Tabs>
    </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
import Summary from './summary'
import dealDetail from './dealDetail'
import positionDetail from './positionDetail'
import colsePositionDetail from './closePositionDetail'
import { FormItem } from 'view-design';
export default {
  components: {Summary, dealDetail, positionDetail,colsePositionDetail},
  data() {
    return {
       commonData: {
        accountEntities: [],
        financialInstrumentType: [],
        pnLAccountingMode: []
      },
      query: {
        queryDate: moment().format('YYYY-MM-DD'),
        defaultPnLClearMode: 1
      },
      tradeDetail: {},
      dailySummary: {},
      closePositionDetails: [],
      positionDetails: [],
      LoadingExportState: false,
      tabname: 'name1',
      showTab: false
    };
  },
  computed: {
    pnLAccountingMode() {
      let pnLAccountingMode = this.utils.filterDisable(this.commonData.pnLAccountingMode)
      this.query.defaultPnLClearMode = pnLAccountingMode[0] && pnLAccountingMode[0].value
      return pnLAccountingMode
    }
  },
  watch: {
    'query.defaultPnLClearMode'(v) {
      if((v!=1 && v!=2) && (this.tabname=='name3' || this.tabname == 'name4')) {
        this.tabname = 'name1'
      }
    }
  },
  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await api.getCommonData();
    this.query.defaultPnLClearMode = this.pnLAccountingMode[0] && this.pnLAccountingMode[0].value
    // this.onSearch()
  },
  methods: {
    clear() {
      this.query.queryDate = ''
      this.query.accountingEntityId = ''
      this.query.defaultPnLClearMode = ''
    },
    onSearch() {
      this.$refs["form"].validate(async valid => {
        if(valid) {
          utils.saveQuery(this.query);
          api.list(this.query).then(res => {
            if(res.result) {
              this.tradeDetail = res.result.tradeDetail || {}
              this.dailySummary = res.result.dailySummary || {}
              this.closePositionDetails = res.result.closePositionDetails || []
              this.positionDetails = res.result.positionDetails || []
              this.showTab = true
            }
          })
        }
      })

    },
    onExport() {
      this.$refs["form"].validate(async valid => {
        if(valid) {
          this.LoadingExportState = true
          api.exportExcel(
            this.query,
            `${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
          ).then(()=>{
            this.LoadingExportState = false
          })
         }
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    }
  }
};
</script>
<style lang="less">
.profitCenterStatement {
  .ant-table td { white-space: nowrap; }
  .ant-table th { white-space: nowrap; }
  .ant-table-body{
    overflow-x: auto !important;
  }
  .ivu-card-body {
    padding: 0px;
    // margin: -1px;
  }
  .ivu-card h3 {
    font-weight: 700;
    text-align: center;
    line-height: 35px;
  }

  .ivu-card {
    border-radius: 0;
    position: relative;
    height: 100%;
  }

  .ivu-card:hover {
    box-shadow: none;
  }

  .ivu-card-head p {
    font-size: 14px!important;
    height: auto;
  }

  .ivu-card::before {
    content: '';
    height: 2px;
    width: 100%;
    // background: orange;
    position: absolute;
    left: 0;
    top: 0;
  }

    .ivu-card {
    border-radius: 0;
    position: relative;
    height: 100%;
  }

  .ivu-card:hover {
    box-shadow: none;
  }

  .ivu-card-head p {
    font-size: 14px!important;
    height: auto;
  }

  .ivu-card::before {
    content: '';
    height: 2px;
    width: 100%;
    background: orange;
    position: absolute;
    left: 0;
    top: 0;
  }
  // .chart ul li {
  //   line-height: 35px;
  //   list-style: none;
  //   /* margin-left:15px; */
  //   font-size: 14px;
  //   font-weight: 500;
  // }
  // .forexPositions, .spotPositions, .futurePositions, .forexPositions{
  //   .ant-table-thead{
  //     background: #fafafa;
  //   }
  //   .ant-table-thead th{
  //     font-weight: bold;
  //   }
  // }
}
</style>

