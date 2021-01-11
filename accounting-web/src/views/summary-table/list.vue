<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16" class="searchBar">
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <a-tree-select
            v-model="query.tradingStrategyId"
            style="width: 100%"
            :tree-data = "treeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            show-search
            class="treeselect"
            allow-clear
            tree-default-expand-all
            treeNodeFilterProp='title'
            placeholder="选择策略"
            searchPlaceholder="策略筛选"
            :replaceFields="replaceFields"
          >

          </a-tree-select>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
                  type="date"
                  confirm
                  placement="bottom-start"
                  placeholder="报表日期"
                  v-model="query.date"
          ></DatePicker>
        </Col>
      </Row>
      </qc-collapse>
        <div style="height:32px;margin-bottom:10px">
            <Button type="primary" icon="md-search" class="margin-right-3  pull-right" @click="onSearch">搜索</Button>
           <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3  pull-right">清空</Button>
     </div>
    </div>
    <Row type="flex" :gutter="24" class="chart" v-if=" rowData">
      <Col :xl="6" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
        <Card :bordered="false">
          <p slot="title">{{tradingStrategieName}} - 利润汇总</p>
          <ul>
            <li :class="comReportBySummary.totalProfit <= comReportBySummary.stopLine ? 'ybg' : ''">总利润/止损线： <span :class="comReportBySummary.totalProfit < 0 ? 'red':''"> ¥ {{ utils.formatNum(comReportBySummary.totalProfit.toFixed(2))}}</span> / <span :class="comReportBySummary.stopLine < 0 ? 'red':''"> {{ utils.formatNum(comReportBySummary.stopLine.toFixed(2))}} </span></li>
            <li>总毛利： <span :class="comReportBySummary.totalGrossProfit < 0 ? 'red':''">¥ {{utils.formatNum(comReportBySummary.totalGrossProfit.toFixed(2))}}</span></li>
            <li>总费用： <span :class="comReportBySummary.totalCost < 0 ? 'red':''">¥ {{utils.formatNum(comReportBySummary.totalCost.toFixed(2))}}</span></li>
            <li :class="comReportBySummary.expropriation >= comReportBySummary.expropriationQuota ? 'ybg' : ''">资金占用/资金占用额度：<span :class="comReportBySummary.expropriation < 0 ? 'red':''">¥ {{utils.formatNum(comReportBySummary.expropriation.toFixed(2))}}</span> / <span :class="comReportBySummary.expropriationQuota < 0 ? 'red':''"> {{ utils.formatNum(comReportBySummary.expropriationQuota.toFixed(2))}}</span></li>
            <li style="margin-left:-15px;color:#eee">-----------------------------------------</li>
            <li>今日利润： <span :class="comReportBySummary.todayProfit < 0 ? 'red':''">¥ {{utils.formatNum(comReportBySummary.todayProfit.toFixed(2))}}</span></li>
            <li>今日毛利： <span :class="comReportBySummary.todayGrossProfit < 0 ? 'red':''">¥ {{utils.formatNum(comReportBySummary.todayGrossProfit.toFixed(2))}}</span></li>
            <li>今日费用： <span :class="comReportBySummary.todayCost < 0 ? 'red':''">¥ {{utils.formatNum(comReportBySummary.todayCost.toFixed(2))}}</span></li>
          </ul>
        </Card>
      </Col>
      <Col :xl="18" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
        <Card :bordered="false">
          <p slot="title">{{tradingStrategieName}} - 年度利润曲线</p>
          <p v-if="lineChartData.rows.length > 0">
            <ve-line :data="lineChartData" :extend="lineExtend" :settings="lineSetting"></ve-line>
          </p>                   
        </Card>
      </Col>

      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
        <Card :bordered="false">
          <p slot="title">利润分布 - 策略盈亏分布{{xx1 ? '明细':''}}</p>
          <p slot="extra">
            <a-radio-group default-value=0 v-model="xx1" button-style="solid" size="small">
              <a-radio-button v-for="(item,index) in radioArray" :key="index" :value="item.value">
                {{item.text}}
              </a-radio-button>
            </a-radio-group>
          </p>
          <p v-if="profitHistogramChartData.rows.length > 0 && !xx1">
            <ve-histogram :data="profitHistogramChartData" :extend="histogramExtend" :settings="profitHistogramSetting"
                          :data-empty="false" :colors="['#fa6e86','#2f4554', '#61a0a8',
        '#d48265', '#91c7ae','#fa6e86',
        '#ca8622', '#bda29a','#6e7074',
        '#546570', '#c4ccd3']"></ve-histogram>
          </p>
          <a-table v-if="xx1" size="small" :columns="profitColumns" :dataSource="rowData.strategyProfitSubs" :pagination="false" bordered>
            <span slot="todayCost" slot-scope="todayCost" :class="todayCost < 0 ? 'red' : ''"><format-cell>{{todayCost}}</format-cell> </span>
            <span slot="todayGrossProfit" slot-scope="todayGrossProfit" :class="todayGrossProfit < 0 ? 'red' : ''"><format-cell>{{todayGrossProfit}}</format-cell></span>
            <span slot="todayProfit" slot-scope="todayProfit" :class="todayProfit < 0 ? 'red' : ''"> <format-cell>{{todayProfit}}</format-cell></span>
            <span slot="totalCost" slot-scope="totalCost" :class="totalCost < 0 ? 'red' : ''">  <format-cell>{{totalCost}}</format-cell></span>
            <span slot="totalGrossProfit" slot-scope="totalGrossProfit" :class="totalGrossProfit < 0 ? 'red' : ''">  <format-cell>{{totalGrossProfit}}</format-cell></span>
            <span slot="totalProfit" slot-scope="totalProfit" :class="totalProfit < 0 ? 'red' : ''">   <format-cell>{{totalProfit}}</format-cell></span>
          </a-table>
        </Card>
      </Col>
      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
        <Card :bordered="false">
          <p slot="title">利润分布 - 业务类型盈亏分布{{xx2 ? '明细' : ''}}</p>
          <p slot="extra">
            <a-radio-group default-value=0 v-model="xx2" button-style="solid" size="small">
              <a-radio-button v-for="(item,index) in radioArray" :key="index" :value="item.value">
                {{item.text}}
              </a-radio-button>
            </a-radio-group>
          </p>
          <p v-if="businessProfitSubsChartData.rows.length > 0 && !xx2">
            <ve-histogram :data="businessProfitSubsChartData" :extend="histogramExtend" :settings="profitHistogramSetting"
                          :data-empty="false" :colors="['#fa6e86','#2f4554', '#61a0a8',
        '#d48265', '#91c7ae','#fa6e86',
        '#ca8622', '#bda29a','#6e7074',
        '#546570', '#c4ccd3']"></ve-histogram>
          </p>
          <a-table size="small" v-if="xx2" :columns="typeColumns" :dataSource="rowData.businessProfitSubs" :pagination="false" bordered>
            <span slot="todayCost" slot-scope="todayCost" :class="todayCost < 0 ? 'red' : ''"><format-cell>{{todayCost}}</format-cell></span>
            <span slot="todayGrossProfit" slot-scope="todayGrossProfit" :class="todayGrossProfit < 0 ? 'red' : ''"><format-cell>{{todayGrossProfit}}</format-cell></span>
            <span slot="todayProfit" slot-scope="todayProfit" :class="todayProfit < 0 ? 'red' : ''"><format-cell>{{todayProfit}}</format-cell></span>
            <span slot="totalCost" slot-scope="totalCost" :class="totalCost < 0 ? 'red' : ''"><format-cell>{{totalCost}}</format-cell></span>
            <span slot="totalGrossProfit" slot-scope="totalGrossProfit" :class="totalGrossProfit < 0 ? 'red' : ''"> <format-cell>{{totalGrossProfit}}</format-cell></span>
            <span slot="totalProfit" slot-scope="totalProfit" :class="totalProfit < 0 ? 'red' : ''">  <format-cell>{{totalProfit}}</format-cell></span>
          </a-table>
        </Card>
      </Col>

      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
        <Card :bordered="false">
          <p slot="title">利润分布 - 品类盈亏分布</p>
          <p v-if="categoryHistogramChartData.rows.length > 0">
            <ve-histogram :data="categoryHistogramChartData" :extend="histogramExtend"
                          :settings="categoryHistogramSetting" :data-empty="false"></ve-histogram>
          </p>
        </Card>
      </Col>
      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
        <Card :bordered="false">
          <p slot="title">利润分布 - 品类盈亏分布明细</p>
          <a-table size="small" :columns="categoryColumns" :dataSource="rowData.commodityProfitSubs" :pagination="false" bordered :scroll="{x:600}">
            <span slot="netExposure" slot-scope="netExposure" :class="netExposure < 0 ? 'red' : ''"><format-cell>{{netExposure}}</format-cell></span>
            <span slot="futureExposure" slot-scope="futureExposure" :class="futureExposure < 0 ? 'red' : ''"><format-cell>{{futureExposure}}</format-cell> </span>
            <span slot="spotExposure" slot-scope="spotExposure" :class="spotExposure < 0 ? 'red' : ''"> <format-cell>{{spotExposure}}</format-cell></span>
            <span slot="todayCost" slot-scope="todayCost" :class="todayCost < 0 ? 'red' : ''"> <format-cell>{{todayCost}}</format-cell></span>
            <span slot="todayGrossProfit" slot-scope="todayGrossProfit" :class="todayGrossProfit < 0 ? 'red' : ''"> <format-cell>{{todayGrossProfit}}</format-cell> </span>
            <span slot="todayProfit" slot-scope="todayProfit" :class="todayProfit < 0 ? 'red' : ''"><format-cell>{{todayProfit}}</format-cell></span>
            <span slot="totalCost" slot-scope="totalCost" :class="totalCost < 0 ? 'red' : ''"><format-cell>{{totalCost}}</format-cell></span>
            <span slot="totalGrossProfit" slot-scope="totalGrossProfit" :class="totalGrossProfit < 0 ? 'red' : ''"><format-cell>{{totalGrossProfit}}</format-cell></span>
            <span slot="totalProfit" slot-scope="totalProfit" :class="totalProfit < 0 ? 'red' : ''"><format-cell>{{totalProfit}}</format-cell></span>
          </a-table>
        </Card>
      </Col>
      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10" v-if="rowData.futurePositions.length > 0">
        <Card :bordered="false">
          <p slot="title">期货持仓</p>
          <p>
            <a-table key="futurePositions" size="small" :columns="futuresColumns" :dataSource="rowData.futurePositions"
                     class="components-table" :pagination="false" :scroll="{ x: 600}">
              <span slot="currentMarket" slot-scope="currentMarket" :class="currentMarket < 0 ? 'red' : ''"><format-cell>{{currentMarket}}</format-cell></span>
              <span slot="currentPosition" slot-scope="currentPosition" :class="currentPosition < 0 ? 'red' : ''"><format-cell fixed={0}>{{currentPosition}}</format-cell></span>
              <span slot="currentWeight" slot-scope="currentWeight" :class="currentWeight < 0 ? 'red' : ''"><format-cell>{{currentWeight}}</format-cell></span>
              <span slot="currentSum" slot-scope="currentSum" :class="currentSum < 0 ? 'red' : ''"><format-cell>{{currentSum}}</format-cell></span>
              <span slot="positionPnL" slot-scope="positionPnL" :class="positionPnL < 0 ? 'red' : ''"><format-cell>{{positionPnL}}</format-cell> </span>
              <a-table
                      slot="expandedRowRender"
                      slot-scope="record,index"
                      :columns="futuresInnerColumns"
                      :dataSource="rowData.futurePositions[index].detailList"
                      :pagination="false"
                      size="small"
              >
                <span slot="currentPosition" slot-scope="currentPosition" :class="currentPosition < 0 ? 'red' : ''"><format-cell>{{currentPosition}}</format-cell> </span>
                <span slot="currentPrice" slot-scope="currentPrice" :class="currentPrice < 0 ? 'red' : ''"> <format-cell>{{currentPrice}}</format-cell></span>
                <span slot="marketPrice" slot-scope="marketPrice" :class="marketPrice < 0 ? 'red' : ''"> <format-cell>{{marketPrice}}</format-cell></span>
                <span slot="positionPnL" slot-scope="positionPnL" :class="positionPnL < 0 ? 'red' : ''"><format-cell>{{positionPnL}}</format-cell> </span>
              </a-table>
            </a-table>
          </p>
        </Card>
      </Col>
      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10" v-if=" rowData.spotPositions.length > 0">
        <Card :bordered="false">
          <p slot="title">现货持仓</p>
          <p>
            <a-table key="spotPositions" size="small" :columns="spotColumns" :dataSource="rowData.spotPositions"
                     class="components-table" :pagination="false" :scroll="{x:600}">
              <span slot="currentWeight" slot-scope="currentWeight" :class="currentWeight < 0 ? 'red' : ''"><format-cell>{{currentWeight}}</format-cell> </span>
              <span slot="currentSum" slot-scope="currentSum" :class="currentSum < 0 ? 'red' : ''"><format-cell>{{currentSum}}</format-cell> </span>
              <span slot="currentMarket" slot-scope="currentMarket" :class="currentMarket < 0 ? 'red' : ''"><format-cell>{{currentMarket}}</format-cell></span>
              <span slot="positionPnL" slot-scope="positionPnL" :class="positionPnL < 0 ? 'red' : ''"><format-cell>{{positionPnL}}</format-cell> </span>
              <a-table
                      key="spotPositions"
                      slot="expandedRowRender"
                      slot-scope="record,index"
                      :columns="spotInnerColumns"
                      :dataSource="rowData.spotPositions[index].detailList"
                      :pagination="false"
                      size="small"
              >
                <span slot="currentMarket" slot-scope="currentMarket" :class="currentMarket < 0 ? 'red' : ''"> <format-cell>{{currentMarket}}</format-cell></span>
                <span slot="currentWeight" slot-scope="currentWeight" :class="currentWeight < 0 ? 'red' : ''"><format-cell>{{currentWeight}}</format-cell></span>
                <span slot="currentSum" slot-scope="currentSum" :class="currentSum < 0 ? 'red' : ''"> <format-cell>{{currentSum}}</format-cell></span>
                <span slot="positionPnL" slot-scope="positionPnL" :class="positionPnL < 0 ? 'red' : ''"> <format-cell>{{positionPnL}}</format-cell></span>
              </a-table>
            </a-table>
          </p>
        </Card>
      </Col>
      <Col :xl="12" :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10" v-if=" rowData.forexPositions.length > 0">
        <Card :bordered="false">
          <p slot="title">外汇持仓</p>
          <p>
            <a-table :columns="foreignExchangeColumns" size="small" :dataSource="rowData.forexPositions"
                     class="components-table" :pagination="false" :scroll="{ x: 600}">
              <span slot="currentPosition" slot-scope="currentPosition" :class="currentPosition < 0 ? 'red' : ''"><format-cell>{{currentPosition}}</format-cell></span>
              <span slot="currentSum" slot-scope="currentSum" :class="currentSum < 0 ? 'red' : ''"><format-cell>{{currentSum}}</format-cell></span>
              <span slot="currentMarket" slot-scope="currentMarket" :class="currentMarket < 0 ? 'red' : ''"><format-cell>{{currentMarket}}</format-cell></span>
              <span slot="positionPnL" slot-scope="positionPnL" :class="positionPnL < 0 ? 'red' : ''"><format-cell>{{positionPnL}}</format-cell> </span>
              <a-table
                      key="forexPositions"
                      slot="expandedRowRender"
                      slot-scope="record,index"
                      :columns="foreignExchangeInnerColumns"
                      :dataSource="rowData.forexPositions[index].detailList"
                      :pagination="false"
                      size="small"
              >
                <span slot="currentPrice" slot-scope="currentPrice" :class="currentPrice < 0 ? 'red' : ''"> <format-cell>{{currentPrice}}</format-cell> </span>
                <span slot="currentPosition" slot-scope="currentPosition" :class="currentPosition < 0 ? 'red' : ''"> <format-cell>{{currentPosition}}</format-cell> </span>
                <span slot="currentWeight" slot-scope="currentWeight" :class="currentWeight < 0 ? 'red' : ''"> <format-cell>{{currentcurrentWeightPrice}}</format-cell></span>
                <span slot="marketPrice" slot-scope="marketPrice" :class="marketPrice < 0 ? 'red' : ''"><format-cell>{{marketPrice}}</format-cell> </span>
                <span slot="positionPnL" slot-scope="positionPnL" :class="positionPnL < 0 ? 'red' : ''"><format-cell>{{positionPnL}}</format-cell> </span>
              </a-table>
            </a-table>
          </p>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import { utils } from '@/utils/utils';
  import api from './api';
  import isNumber from 'lodash/isNumber';
  import Radio from 'ant-design-vue/lib/radio'
  import Input from 'ant-design-vue/lib/input'
  export default {
    components:{[Radio.Button.name]:Radio.Button,[Radio.Group.name]:Radio.Group,[Input.name]:Input},
    data () {
      return {
        treeData:[],
        searchText:'',
        replaceFields:{
          children:'childrens', title:'name', key:'id', value: 'id' 
        },
        tradingStrategieName:'',
        isNumber,
        lineSetting: { yAxisName: ['单位：万元'] },
        commonData: {
          strategys: [],
          options: {},
          enums: {}
        },
        histogramExtend: {
          series: {
            label: { show: false, position: 'top' },
            barMaxWidth: 30,
          }
        },
        lineExtend: {
          'xAxis.0.axisLabel.rotate': 45,
        },
        profitHistogramSetting: {
          yAxisName: ['单位：万元'],

        },
        categoryHistogramSetting: {
          yAxisName: ['单位：万元']
        },
        profitHistogramChartData: {},
        categoryHistogramChartData: {},
        businessProfitSubsChartData: {},
        isShowModal: false,
        query:{
          tradingStrategyId: null,
          date: null
        },
        profitColumns: [],
        typeColumns: [],
        categoryColumns: [],
        foreignExchangeColumns: [],
        foreignExchangeInnerColumns: [],
        futuresColumns: [],
        futuresInnerColumns: [],
        spotColumns: [],
        spotInnerColumns: [],
        rowData: null,
        comReportBySummary: {
          totalProfit: 0,
          totalGrossProfit: 0,
          totalCost: 0,
          todayProfit: 0,
          todayGrossProfit: 0,
          todayCost: 0
        },
        annualProfits: {},
        lineChartData: {},
        soptData: [],
        radioArray:[{text:'图形',value:0},{text:'表格',value:1}],
        xx1:0,
        xx2:0
      };
    },
    async mounted () {
      this.query = utils.saveQuery(this.query, 'get');
      this.commonData = await api.getCommonData('report/getCommonData');
      this.treeData = this.commonData.permissionTradingStrategies      
      this.findTree(this.treeData,this.query.tradingStrategyId)          //this.treeData.filter(val => val.id == this.query.tradingStrategyId);
    },
    computed: {
      
    },
    watch: {
      'query.tradingStrategyId' (val){
        this.findTree(this.treeData,val)
      }
    },
    methods: {
      onSearch () {
        if (!this.query.date) {
          this.$Message.error('日期不能为空');
          return;
        }
        if (!this.query.tradingStrategyId) {
          this.$Message.error('请选择策略');
          return;
        }
        this.search();
      },
      resetQuery () {
        //this.query = {};
        this.query.date = null;
        this.query.tradingStrategyId = null;
      },
      initClear () {
        this.profitHistogramChartData.rows = [];
        this.categoryHistogramChartData.rows = [];
        this.lineChartData.rows = [];
        this.businessProfitSubsChartData.rows = [];
      },
      async search () {
        utils.saveQuery(this.query);
        this.initClear();
        let query = _.cloneDeep(this.query);
        query.date = utils.formatDate(this.query.date);
        let data = await api.search(query);
        this.rowData = data.result;
        _.forEach(this.rowData.futurePositions, function (o) {
          _.forEach(o.detailList, function (p) {
            p.instrumentHedgeFlagType = p.hedgeFlagType ? `${p.instrumentText}(${p.hedgeFlagType})` : p.instrumentText
          });
        });
        this.comReportBySummary = data.result.comReportBySummary;

        // 利润明细表
        this.profitColumns = [
          {
            title: '子策略',
            dataIndex: 'tradingStrategyId',
            key: 'tradingStrategyId',
            customRender: text => utils.showText(this.commonData.tradingStrategies, text)
          },
          { title: '今日利润', dataIndex: 'todayProfit', key: 'todayProfit', scopedSlots: { customRender: 'todayProfit' } },
          { title: '今日费用', dataIndex: 'todayCost', key: 'todayCost', scopedSlots: { customRender: 'todayCost' } },
          { title: '总利润', dataIndex: 'totalProfit', key: 'totalProfit', scopedSlots: { customRender: 'totalProfit' } },
          { title: '总费用', dataIndex: 'totalCost', key: 'totalCost', scopedSlots: { customRender: 'totalCost' } }
        ];
        // 业务类型盈亏分布
        this.typeColumns = [
          {
            title: '业务类型',
            dataIndex: 'businessTypeName',
            key: 'businessTypeName',
            // customRender: text => utils.showText(this.commonData.accountingEntities, text)
          },
          { title: '今日利润', dataIndex: 'todayProfit', key: 'todayProfit', scopedSlots: { customRender: 'todayProfit' } },
          { title: '今日费用', dataIndex: 'todayCost', key: 'todayCost', scopedSlots: { customRender: 'todayCost' } },
          { title: '总利润', dataIndex: 'totalProfit', key: 'totalProfit', scopedSlots: { customRender: 'totalProfit' } },
          { title: '总费用', dataIndex: 'totalCost', key: 'totalCost', scopedSlots: { customRender: 'totalCost' } }
        ];
        // 品类明细表
        this.categoryColumns = [
          {
            title: '品类',
            dataIndex: 'commodityTypeId',
            width:120,
            key: 'commodityTypeId',
            customRender: (text, record) => utils.showText(this.commonData.commodityTypes, text) + `(${utils.showText(this.commonData.units, record.defaultUnitId)})`
          },
          { title: '净敞口', width:120, dataIndex: 'netExposure', key: 'netExposure', scopedSlots: { customRender: 'netExposure' } },
          {
            title: '期货敞口',
            dataIndex: 'futureExposure',
            width:120,
            key: 'futureExposure',
            scopedSlots: { customRender: 'futureExposure' }
          },
          {
            title: '现货敞口',
            dataIndex: 'spotExposure',
            width:120,
            key: 'spotExposure',
            scopedSlots: { customRender: 'spotExposure' }
          },
          { title: '今日利润', width:120, dataIndex: 'todayProfit', key: 'todayProfit', scopedSlots: { customRender: 'todayProfit' } },
          { title: '今日费用', width:120, dataIndex: 'todayCost', key: 'todayCost', scopedSlots: { customRender: 'todayCost' } },
          { title: '总利润', width:120, dataIndex: 'totalProfit', key: 'totalProfit', scopedSlots: { customRender: 'totalProfit' } },
          { title: '总费用', width:120, dataIndex: 'totalCost', key: 'totalCost', scopedSlots: { customRender: 'totalCost' } },
        ];

        // 设置 本年度利润线
        if (data.result.annualProfits.length > 0) {
          let annualProfits = {};
          annualProfits.columns = ['日期', '总利润'];
          annualProfits.rows = [];
          data.result.annualProfits.map(data => {
              annualProfits.rows.push({
                '日期': utils.formatDate(data.date),
                '总利润': data.totalProfit / 10000
              });
            }
          );
          this.lineChartData = annualProfits;
        }

        // 设置 利润中心利润分布
        if (data.result.strategyProfitDis.length > 0) {
          let strategyProfitDis = {};
          strategyProfitDis.columns = ['部门', '利润'],
            strategyProfitDis.rows = [];
          data.result.strategyProfitDis.map(data => {
            strategyProfitDis.rows.push({
              '部门': utils.showText(this.commonData.tradingStrategies, data.tradingStrategyId),
              '利润': (data.totalProfit / 10000).toFixed(4)
            });
          });
          this.profitHistogramChartData = strategyProfitDis;
        }

        // 设置 业务类型盈亏分布
        if (data.result.businessProfitSubs.length > 0) {
          let businessProfitSubs = {};
          businessProfitSubs.columns = ['部门', '利润'],
            businessProfitSubs.rows = [];
          data.result.businessProfitSubs.map(data => {
            businessProfitSubs.rows.push({
              '部门': data.businessTypeName,
              '利润': (data.totalProfit / 10000).toFixed(4)
            });
          });
          this.businessProfitSubsChartData = businessProfitSubs;
        }


        // 设置 品种利润分布
        if (data.result.commodityProfitDis.length > 0) {
          let commodityProfitDis = {};
          commodityProfitDis.columns = ['品类', '利润'],
            commodityProfitDis.rows = [];
          data.result.commodityProfitDis.map(data => {
              commodityProfitDis.rows.push({
                '品类': utils.showText(this.commonData.commodityTypes, data.commodityTypeId),
                '利润': (data.totalProfit / 10000).toFixed(4)
              });
            }
          );
          this.categoryHistogramChartData = commodityProfitDis;
        }

        // 外汇
        this.foreignExchangeColumns = [
          {
            title: '外汇',
            dataIndex: 'wfCurrencyPairId',
            width:120,
            key: 'wfCurrencyPairId',
            customRender: text => utils.showText(this.commonData.currencyPairs, text)
          },
          {
            title: '合约日期',
            dataIndex: 'contractDate',
            width:120,
            key: 'contractDate',
            customRender: text => utils.formatDate(text)
          },
          {
            title: '持仓数量',
            key: 'currentWeight',
            width:120,
            dataIndex: 'currentWeight',
            scopedSlots: { customRender: 'currentPosition' }
          },
          {
            title: '今日头寸变动',
            key: 'positionalter',
            width:120,
            dataIndex: 'positionalter',
            scopedSlots: { customRender: 'positionalter' }
          },
          { title: '持仓金额', width:120, dataIndex: 'currentSum', key: 'currentSum', scopedSlots: { customRender: 'currentSum' } },
          {
            title: '持仓市值',
            dataIndex: 'currentMarket',
            width:120,
            key: 'currentMarket',
            scopedSlots: { customRender: 'currentMarket' }
          },
          { title: '浮动盈亏', width:120, dataIndex: 'positionPnL', key: 'positionPnL', scopedSlots: { customRender: 'positionPnL' } },
        ];
        //外汇子表
        this.foreignExchangeInnerColumns = [
          {
            title: '策略',
            dataIndex: 'tradingStrategyId',
            width:120,
            key: 'tradingStrategyId',
            customRender: text => utils.showText(this.commonData.tradingStrategies, text)
          },
          {
            title: '法人',
            dataIndex: 'corporationId',
            width:120,
            key: 'corporationId',
            customRender: text => utils.showText(this.commonData.corporations, text)
          },
          {
            title: '持仓数量',
            key: 'currentWeight',
            width:120,
            dataIndex: 'currentWeight',
            customRender: text => <format-cell fixed={false}>{text}</format-cell>
          },
          {
            title: '今日头寸变动',
            key: 'positionalter',
            width:120,
            dataIndex: 'positionalter',
            customRender: text => <format-cell >{text}</format-cell>
          },
          {
            title: '持仓均价',
            dataIndex: 'currentPrice',
            width:120,
            key: 'currentPrice',
           customRender: text => <format-cell >{text}</format-cell>
          },
          { title: '市场价格', width:120, dataIndex: 'marketPrice', key: 'marketPrice', customRender: text => <format-cell >{text}</format-cell>},
          { title: '浮动盈亏', width:120, dataIndex: 'positionPnL', key: 'positionPnL', customRender: text => <format-cell >{text}</format-cell> },
        ];
        // 期货
        this.futuresColumns = [
          {
            title: '品类',
            dataIndex: 'commodityTypeId',
            width:120,
            key: 'commodityTypeId',
            customRender: (text, record) => utils.showText(this.commonData.commodityTypes, text) + `(${utils.showText(this.commonData.units, record.defaultUnitId)})`
          },
          {
            title: '标准合约',
            dataIndex: 'wfInstrumentCategoryId',
            width:120,
            key: 'wfInstrumentCategoryId',
            customRender: text => utils.showText(this.commonData.instrumentCategories, text)
          },
          {
            title: '持仓手数',
            key: 'currentPosition',
            width:120,
            dataIndex: 'currentPosition',
            customRender: text => <format-cell fixed={0}>{text}</format-cell>
          },
          {
            title: '今日头寸变动',
            key: 'positionalter',
            width:120,
            dataIndex: 'positionalter',
            customRender: text => <format-cell>{text}</format-cell>
          },
          {
            title: '持仓数量',
            dataIndex: 'currentWeight',
            width:120,
            key: 'currentWeight',
            customRender: text => <format-cell fixed={false}>{text}</format-cell>
          },
          { title: '持仓金额', width:120, dataIndex: 'currentSum', key: 'currentSum', customRender: text => <format-cell>{text}</format-cell>},
          {
            title: '持仓市值',
            width:120,
            dataIndex: 'currentMarket',
            key: 'currentMarket',
            customRender: text => <format-cell>{text}</format-cell>
          },
          { title: '浮动盈亏',width:120, dataIndex: 'positionPnL', key: 'positionPnL', customRender: text => <format-cell>{text}</format-cell> },
        ];
        // 期货子表
        this.futuresInnerColumns = [
          {
            title: '策略',
            dataIndex: 'tradingStrategyId',
            width:120,
            key: 'tradingStrategyId',
            customRender: text => utils.showText(this.commonData.tradingStrategies, text)
          },
          {
            title: '资金账户',
            dataIndex: 'tradeAccountId',
            width:120,
            key: 'tradeAccountId',
            customRender: text => utils.showText(this.commonData.tradeAccounts, text)
          },
          {
            title: '具体合约',
            key: 'instrumentHedgeFlagType',
            width:120,
            dataIndex: 'instrumentHedgeFlagType'
          },
          {
            title: '持仓手数',
            dataIndex: 'currentPosition',
            width:120,
            key: 'currentPosition',
            customRender: text => <format-cell fixed={0}>{text}</format-cell>
          },
          {
            title: '今日头寸变动',
            width:120,
            key: 'positionalter',
            dataIndex: 'positionalter',
            customRender: text => <format-cell>{text}</format-cell>
          },
          {
            title: '持仓均价',
            width:120,
            dataIndex: 'currentPrice',
            key: 'currentPrice',
           customRender: text => <format-cell>{text}</format-cell>
          },
          { title: '市场价格', dataIndex: 'marketPrice', key: 'marketPrice',customRender: text => <format-cell>{text}</format-cell>},
          { title: '浮动盈亏', dataIndex: 'positionPnL', key: 'positionPnL', customRender: text => <format-cell >{text}</format-cell>},
        ];
        // 现货
        this.spotColumns = [
          {
            title: '品类',
            dataIndex: 'commodityTypeId',
            width:120,
            key: 'commodityTypeId',
            customRender: (text, record) => utils.showText(this.commonData.commodityTypes, text) + `(${utils.showText(this.commonData.units, record.defaultUnitId)})`
          },
          {
            title: '贸易类型',
            dataIndex: 'tradeType',
            width:120,
            key: 'tradeType',
            customRender: text => utils.showText(this.commonData.simpleTradeType, text)
          },
          {
            title: '币种',
            width:120,
            key: 'currencyId',
            dataIndex: 'currencyId',
            customRender: text => utils.showText(this.commonData.currencies, text)
          },
          {
            title: '持仓数量',
            dataIndex: 'currentWeight',
            width:120,
            key: 'currentWeight',
            customRender: text => <format-cell fixed={false}>{text}</format-cell>
          },
          {
            title: '今日头寸变动',
            key: 'positionalter',
            width:120,
            dataIndex: 'positionalter',
            customRender: text => <format-cell>{text}</format-cell>
          },
          { title: '持仓金额', width:120, dataIndex: 'currentSum', key: 'currentSum', customRender: text => <format-cell>{text}</format-cell> },
          {
            title: '持仓市值',
            width:120,
            dataIndex: 'currentMarket',
            key: 'currentMarket',
            customRender: text => <format-cell>{text}</format-cell>
          },
          { title: '浮动盈亏', width:120, dataIndex: 'positionPnL', key: 'positionPnL',customRender: text => <format-cell>{text}</format-cell> },
        ];
        // 现货子表
        this.spotInnerColumns = [
          {
            title: '策略',
            dataIndex: 'tradingStrategyId',
            width:120,
            key: 'tradingStrategyId',
            customRender: text => utils.showText(this.commonData.tradingStrategies, text)
          },
          {
            title: '法人',
            dataIndex: 'corporationId',
            width:120,
            key: 'corporationId',
            customRender: text => utils.showText(this.commonData.corporations, text)
          },
          {
            title: '持仓重量',
            dataIndex: 'currentWeight',
            width:120,
            key: 'currentWeight',
            customRender: text => <format-cell fixed={0}>{text}</format-cell>
          },
          {
            title: '今日头寸变动',
            key: 'positionalter',
            width:120,
            dataIndex: 'positionalter',
            customRender: text => <format-cell>{text}</format-cell>
          },
          { title: '持仓金额', width:120, dataIndex: 'currentSum', key: 'currentSum',customRender: text => <format-cell>{text}</format-cell>},
          {
            title: '持仓市值',
            width:120,
            dataIndex: 'currentMarket',
            key: 'currentMarket',
            customRender: text => <format-cell>{text}</format-cell>
          },
          { title: '浮动盈亏', width:120, dataIndex: 'positionPnL', key: 'positionPnL', customRender: text => <format-cell>{text}</format-cell>},
        ];

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
      async getMarketDetail (params) {
        let query = {
          acReportId: params,
          acReportType: this.commonData.enums.acReportType.acPositionSpot
        };
        let marketData = await api.getMarketDetail(query);
        this.marketData = marketData.list;
        this.isShowModal = true;
      },      
      findTree (tree,id) {
        tree.map(item => {
          if(item.childrens){
            this.findTree(item.childrens,id)
          }
          if(item.id == id){            
            this.tradingStrategieName = item.name
          }          
        })
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
<style lang="less" scoped>
  .searchBar {
    // margin: 20px 0;
    // padding-bottom: 20px;
    // border-bottom: 1px solid #f5f7f9
  }

  .chart {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 260px);
    padding-bottom: 120px;
  }

  .ivu-card h3 {
    font-weight: bold;
    text-align: center;
    line-height: 26px;
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
    font-size: 14px;
    font-weight: bold;
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

  .chart ul li {
    line-height: 26px;
    list-style: none;
    /* margin-left:15px; */
    font-size: 14px;
    font-weight: 500;
  }
  .treeselect{
    font-size: 12px;
    .ant-select-selection__rendered{
      margin-left:7px!important;
    }
  }
  .components-table{
    overflow: hidden;
  }
  .ybg{
    background-color: yellow;
  }
</style>

