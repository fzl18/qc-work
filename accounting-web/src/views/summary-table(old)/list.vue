<template>
  <div>
    <Row type="flex" :gutter="48" class="searchBar">
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="date"
            confirm
            placement="bottom-start"
            placeholder="日期"
            v-model="query.date"
          ></DatePicker>
        </Col>
        <Col :lg="8" :sm="12" :xs="24">
          <Col>
            <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
            <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
          </Col>
        </Col>
      </Row>
    <Row type="flex" :gutter="24" class="chart">
      <Col :span="24" class-name="margin-bottom-10">
        <Card :bordered="false">
            <p slot="title">总收益曲线图</p>
            <p><ve-line :data="lineChartData" ref="vline" :extend="lineExtend" :settings="{yAxisName: ['单位万元']}"></ve-line></p>
        </Card>
      </Col>
      <Col :span="24" class-name="margin-bottom-10">
        <Card :bordered="false">
            <p slot="title">汇总表</p>
            <p>
              <a-table :columns="totalColumns" :dataSource="data" :pagination="false" bordered>
                <span slot="todayProfit" slot-scope="todayProfit" :class="todayProfit < 0 ? 'red' : ''"> {{utils.formatNum(todayProfit.toFixed(2))}}</span>
                <span slot="monthProfit" slot-scope="monthProfit" :class="monthProfit < 0 ? 'red' : ''"> {{utils.formatNum(monthProfit.toFixed(2))}}</span>
                <span slot="yearProfit" slot-scope="yearProfit" :class="yearProfit < 0 ? 'red' : ''"> {{utils.formatNum(yearProfit.toFixed(2))}}</span>
                <span slot="capitalOccupation" slot-scope="capitalOccupation" :class="capitalOccupation < 0 ? 'red' : ''"> {{utils.formatNum(capitalOccupation.toFixed(2))}}</span>
              </a-table>
            </p>
        </Card>
      </Col>
      <Col :span="24" class-name="margin-bottom-10">
        <Card :bordered="false">
            <p slot="title">分策略子表</p>

              <Col class-name="margin-bottom-10" v-for="(item,index) in strategySummary" :key="index">
                <h3> {{tit(item.firstStrategy)}} </h3>
                <a-table :columns="subColumns" :dataSource="item.details" :pagination="false" bordered>
                  <a href="javascript:;" slot="option" slot-scope="text,recode" @click="seeMore(recode)">查看详情</a>
                  <span :class="text < 0 ? 'red':''" slot="totalProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <span :class="text < 0 ? 'red':''" slot="capitalOccupation" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <span :class="text < 0 ? 'red':''" slot="positionPnL" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <span :class="text < 0 ? 'red':''" slot="totalClosePnL" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <!-- <a-table
                    :key="index"
                    slot="expandedRowRender"
                    slot-scope="record,index"
                    :columns="childColumns"
                    :dataSource="item.details[index].list"
                    :pagination="false"
                    size="small"
                  >
                  </a-table> -->
                </a-table>
              </Col>
        </Card>
      </Col>
    </Row>
    <Modal v-model="isShowModal" title="查看详情" width="70%">
      <div style="text-align:center" v-if="curShowList.spotPositionsData.length == 0 && curShowList.futurePositionsData.length == 0 && curShowList.forexPositionsData.length == 0">暂无数据</div>
      <div class="colList" v-if="curShowList.spotPositionsData.length > 0">
        <h3>现货持仓</h3>
        <a-table
          size="small"
          :pagination="false" bordered
          class="margin-bottom-10"
          :loading="false"
          :columns="spotPositionsColumns"
          :dataSource="curShowList.spotPositionsData"
        >
          <span :class="text < 0 ? 'red':''" slot="currentWeight" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="marketPrice" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="currentPrice" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="positionPnL" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
        </a-table>
      </div>
      <div class="colList" v-if="curShowList.futurePositionsData.length > 0">
        <h3>期货持仓</h3>
        <a-table
          size="small"
          :pagination="false" bordered
          class="margin-bottom-10"
          :loading="false"
          :columns="futurePositionsColumns"
          :dataSource="curShowList.futurePositionsData"
        >
          <span :class="text < 0 ? 'red':''" slot="currentWeight" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="marketPrice" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="currentPrice" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="positionPnL" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
        </a-table>
      </div>
      <div class="colList" v-if="curShowList.forexPositionsData.length > 0">
        <h3>外汇持仓</h3>
        <a-table
          size="small"
          :pagination="false" bordered
          class="margin-bottom-10"
          :loading="false"
          :columns="forexPositionsColumns"
          :dataSource="curShowList.forexPositionsData"
        >
          <span :class="text < 0 ? 'red':''" slot="currentWeight" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="marketPrice" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="currentPrice" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="positionPnL" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
        </a-table>
      </div>
    </Modal>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";

export default {
  data() {
    return {
      commonData: {
        profitCenters: [],
        options: {},
        enums: {}
      },
      strategySummary:[],
      riskSummary:[],
      lineExtend:{
        'xAxis.0.axisLabel.rotate': 45
      },
      lineChartData:{},
      isShowModal: false,
      query: {
        date: utils.formatDate(new Date())
      },
      // pagination: {
      //   currentPage: 1,
      //   totalCount: 0,
      //   pageSize: 15
      // },
      data:[],
      totalColumns:[],
      subColumns:[],
      childColumns:[],
      forexPositionsData:[],
      futurePositionsData:[],
      spotPositionsData:[],
      spotPositionsColumns:[],
      forexPositionsColumns:[],
      futurePositionsColumns:[],
      curShowList:{
        spotPositionsData: [],
        futurePositionsData: [],
        forexPositionsData: [],
      }
    };
  },

  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await this.api.getCommonData("report");
    this.search();
  },
  watch: {
    lineChartData() {
      this.$nextTick(_ => {
        this.$refs[`vline`].echarts.resize()
      })
    }
  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query = {};
    },
    async search() {
      utils.saveQuery(this.query);
      let lengthList = [];
      this.data = [];
      let query = _.cloneDeep(this.query);
      query.date = utils.formatDate(this.query.date);
      let data = await api.search(query);
      this.strategySummary = data.result.strategySummary;

      // 总收益曲线图
      let lineDate = {}
      lineDate.columns = ['日期', '总利润']
      lineDate.rows = data.result.totalProfitSummary.map( val => {
        return ({
          '日期': utils.formatDate(val.accountingDate),
          '总利润': val.totalProfit / 10000,
        })
      })
      this.lineChartData = lineDate

      // 汇总表
      this.totalColumns = [
        {
          title: '一级交易策略',
          dataIndex: 'firstStrategy',
          key: 'firstStrategy',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            if (index < lengthList.reduce((prev,cur)=> prev + cur)) {
              obj.attrs.rowSpan = 0;
            }
            if (index === 0) {
              obj.attrs.rowSpan = lengthList[0];
            }
            lengthList.forEach((val,i)=>{
              let newArray = lengthList.slice(0,i+1)
              if (index === newArray.reduce((prev, cur)=> prev + cur)) {
                obj.attrs.rowSpan = lengthList[i+1]
              }
            })

            return obj;
          },
        },
        { title: '利润中心', dataIndex: 'accountingEntity', key: 'accountingEntity'},
        { title: '当日利润', dataIndex: 'todayProfit', key: 'todayProfit',scopedSlots: { customRender: 'todayProfit' }},
        { title: '当月利润', dataIndex: 'monthProfit', key: 'monthProfit',scopedSlots: { customRender: 'monthProfit' }},
        { title: '当年利润', dataIndex: 'yearProfit', key: 'yearProfit',scopedSlots: { customRender: 'yearProfit' }},
        { title: '资金占用', dataIndex: 'capitalOccupation', key: 'capitalOccupation',scopedSlots: { customRender: 'capitalOccupation' }},
      ]

      data.result.riskSummary.map(val =>{
        lengthList.push(val.details.length)
        val.details.map(data =>{
          this.data.push({
            ...data,
            firstStrategy: val.firstStrategy ? utils.showText(this.commonData.tradingStrategies,val.firstStrategy) : '合计' ,
            accountingEntity: data.accountingEntity ? utils.showText(this.commonData.accountingEntities,data.accountingEntity) : val.firstStrategy ? '合计' : '',
          })
        })
      })


      // 分策略子表
      this.subColumns = [
        { title: '最小利润中心', dataIndex: 'minAccountingEntity', key: 'minAccountingEntity',customRender: text => utils.showText(this.commonData.accountingEntities, text) },
        { title: '总利润', dataIndex: 'totalProfit', key: 'totalProfit',scopedSlots: { customRender: 'totalProfit' }  },
        { title: '已实现利润', dataIndex: 'totalClosePnL', key: 'totalClosePnL',scopedSlots: { customRender: 'totalClosePnL' }  },
        { title: '浮动盈亏', dataIndex: 'positionPnL', key: 'positionPnL',scopedSlots: { customRender: 'positionPnL' }  },
        { title: '资金占用', dataIndex: 'capitalOccupation', key: 'capitalOccupation',scopedSlots: { customRender: 'capitalOccupation' }  },
        { title: '操作', dataIndex: 'option', key: 'option',scopedSlots: { customRender: 'option' } },
      ];

      this.spotPositionsColumns=[
        { title: '法人', dataIndex: 'corporationId', key: 'corporationId',customRender: text => utils.showText(this.commonData.corporations, text)},
        { title: '品类', dataIndex: 'commodityTypeId', key: 'commodityTypeId',customRender: text => utils.showText(this.commonData.commodityTypes, text) },
        { title: '贸易类型', dataIndex: 'tradeType', key: 'tradeType' ,customRender: text => utils.showText(this.commonData.simpleTradeType, text)},
        { title: '币种', dataIndex: 'currencyId', key: 'currencyId' ,customRender: text => utils.showText(this.commonData.currencies, text)},
        { title: '单位', dataIndex: 'unitId', key: 'unitId' ,customRender: text => utils.showText(this.commonData.units, text)},
        { title: '品种', dataIndex: 'commodityId', key: 'commodityId' ,customRender: text => utils.showText(this.commonData.commodities, text)},
        { title: '物料', dataIndex: 'materialId', key: 'materialId',customRender: text => utils.showText(this.commonData.material, text)},
        { title: '持仓重量', dataIndex: 'currentWeight', key: 'currentWeight',scopedSlots: { customRender: 'currentWeight'}},
        { title: '持仓价格', dataIndex: 'currentPrice', key: 'currentPrice',scopedSlots: { customRender: 'currentPrice' }},
        { title: '市场价格', dataIndex: 'marketPrice', key: 'marketPrice',scopedSlots: { customRender: 'marketPrice' }},
        { title: '浮动盈亏', dataIndex: 'positionPnL', key: 'positionPnL',scopedSlots: { customRender: 'positionPnL' }},
      ],
      this.forexPositionsColumns=[
        { title: '法人', dataIndex: 'corporationId', key: 'corporationId',customRender: text => utils.showText(this.commonData.corporations, text)},
        { title: '外汇', dataIndex: 'wfCurrencyPairId', key: 'wfCurrencyPairId',customRender: text => utils.showText(this.commonData.currencyPairs, text)},
        { title: '合约日期', dataIndex: 'contractDate', key: 'contractDate',customRender: text => utils.formatDate(text)},
        { title: '持仓重量', dataIndex: 'currentWeight', key: 'currentWeight',scopedSlots: { customRender: 'currentWeight'}},
        { title: '持仓价格', dataIndex: 'currentPrice', key: 'currentPrice',scopedSlots: { customRender: 'currentPrice'}},
        { title: '市场价格', dataIndex: 'marketPrice', key: 'marketPrice',scopedSlots: { customRender: 'marketPrice' }},
        { title: '浮动盈亏', dataIndex: 'positionPnL', key: 'positionPnL',scopedSlots: { customRender: 'positionPnL' }}
      ],
      this.futurePositionsColumns=[
        { title: '资金账户', dataIndex: 'tradeAccountId', key: 'tradeAccountId',customRender: text => utils.showText(this.commonData.tradeAccounts, text)},
        { title: '品类', dataIndex: 'commodityTypeId', key: 'commodityTypeId',customRender: text => utils.showText(this.commonData.commodityTypes, text) },
        { title: '币种', dataIndex: 'currencyId', key: 'currencyId' ,customRender: text => utils.showText(this.commonData.currencies, text)},
        { title: '单位', dataIndex: 'unitId', key: 'unitId' ,customRender: text => utils.showText(this.commonData.units, text)},
        { title: '标准合约', dataIndex: 'wfInstrumentCategoryId', key: 'wfInstrumentCategoryId',customRender: text => utils.showText(this.commonData.instrumentCategories, text)},
        { title: '具体合约', dataIndex: 'instrumentId', key: 'instrumentText'},
        { title: '投机/保值', dataIndex: 'hedgeFlagType', key: 'hedgeFlagType',scopedSlots: { customRender: 'hedgeFlagType' }},
        { title: '持仓重量', dataIndex: 'currentWeight', key: 'currentWeight',scopedSlots: { customRender: 'currentWeight'}},
        { title: '持仓价格', dataIndex: 'currentPrice', key: 'currentPrice',scopedSlots: { customRender: 'currentPrice' }},
        { title: '市场价格', dataIndex: 'marketPrice', key: 'marketPrice',scopedSlots: { customRender: 'marketPrice' }},
        { title: '浮动盈亏', dataIndex: 'positionPnL', key: 'positionPnL',scopedSlots: { customRender: 'positionPnL' }},
      ]

    },

    tit(id) {
      return utils.showText(this.commonData.tradingStrategies,id)
    },
    seeMore(data) {
      this.isShowModal = true
      this.curShowList = {
        forexPositionsData : data.forexPositions,
        futurePositionsData : data.futurePositions,
        spotPositionsData : data.spotPositions
      }
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>
<style scoped>
.searchBar{
  margin:20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f7f9
}
.ivu-card h3{
  font-weight: 700;
  text-align: center;
  line-height: 35px;
  margin-top:20px;
}
.ivu-card{
  border-radius: 0;
  position: relative;
  height:100%;
}
.ivu-card:hover{
  box-shadow: none;
}
.ivu-card-head p{
  font-size:16px;
}
.ivu-card::before{
  content: '';
  height: 2px;
  width: 100%;
  background: orange;
  position:absolute;
  left:0;
  top:0;
}
ul li{
  line-height: 35px;
  list-style: none;
  margin-left:15px;
  font-size:16px;
  font-weight:500;
}
.colList{
  margin-bottom: 50px;
}
a{
  text-decoration: none;
}
</style>

