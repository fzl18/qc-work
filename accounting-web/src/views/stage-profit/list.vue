<template>
  <div>
    <div v-if="isShow('H_SearchAcStageProfitReport')">
      <qc-collapse>
      <Row type="flex" :gutter="48" class="searchBar">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <a-tree-select
            v-model="query.accountEntityId"
            style="width: 100%"
            :tree-data="commonData.permissionTreeProfits"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="利润中心"
            show-search
            allow-clear
            tree-default-expand-all
          ></a-tree-select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
                  type="date"
                  confirm
                  placement="bottom-start"
                  placeholder="日期"
                  :options="disabledDateOption"
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
      </qc-collapse>
      <Row type="flex" :gutter="24" class="chart">
        <Col :span="24" class-name="margin-bottom-10" v-if="!profitCenterData.length && !commodityTypeShow && !profitSummaryShow">
          <p class="noMsgWarning">当前查询结果无任何利润数据，请刷新页面或确认查询条件正确！</p>
        </Col>
        <Col :span="24" class-name="margin-bottom-10" v-show="profitSummaryShow">
          <Card>
            <p slot="title">{{profitName}}利润分析 报表日期：{{profitDate}}</p>
            <Row type="flex" :gutter="1" justify="space-between">
              <Col :lg="12" :sm="12" :xs="24">
                <div class="profit-year">
                  <p>今年利润：<span v-color-green="dataTotal.profitSummary.yearProfit" class="numStyle">{{utils.formatNum(dataTotal.profitSummary.yearProfit) || 0}}</span>万元
                  </p>
                </div>
                <div class="profit-month">
                  <p>本月利润：<span v-color-blue="dataTotal.profitSummary.monthProfit" class="numStyle">{{utils.formatNum(dataTotal.profitSummary.monthProfit) || 0}}</span>万元
                  </p>
                  <p>
                    <Row type="flex" :gutter="8" justify="space-between">
                      <Col>
                        同比：
                        <span v-color-blue="dataTotal.profitSummary.yearProportion" class="numStyle trangleWrap">
                            <div class="downTrangle" v-if="dataTotal.profitSummary.yearProportion<0"></div>
                            <div class="upTrangle" v-if="dataTotal.profitSummary.yearProportion>0"></div>
                            {{transNumber(dataTotal.profitSummary.yearProportion)}}%
                        </span>
                      </Col>
                      <Col>
                        环比：
                        <span v-color-blue="dataTotal.profitSummary.monthProportion" class="numStyle trangleWrap">
                            <div class="downTrangle" v-if="dataTotal.profitSummary.monthProportion<0"></div>
                            <div class="upTrangle" v-if="dataTotal.profitSummary.monthProportion>0"></div>
                            {{transNumber(dataTotal.profitSummary.monthProportion)}}%
                        </span>
                      </Col>
                    </Row>
                  </p>
                </div>
              </Col>
              <Col :lg="12" :sm="12" :xs="24">
                <ve-histogram :data="chartData" :settings="chartSettings" :colors="colors"
                              :title="{'text': '单位（万元）','left': 10}" @ready="initChart('monthProfitChart')"
                              ref="monthProfitChart" :data-empty="!chartData.rows.length"
                              :extend="histogramExtend"></ve-histogram>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col :span="24" class-name="margin-bottom-10" v-show="profitCenterData.length">
          <Card :bordered="false">
            <p slot="title">下属利润中心利润分布</p>
            <p slot="extra">单位(万元)</p>
            <Row type="flex" :gutter="8" justify="space-between">
              <Col :lg="12" :sm="12" :xs="24">
                <Table height="420" :columns="totalColumns" :data="profitCenterData" width="100%"></Table>
              </Col>
              <Col :lg="12" :sm="12" :xs="24">
                <ve-bar :data="chartDataBar" :settings="chartBarSettings" :colors="colors" :legend-visible="false"
                        ref="profitBarChart" @ready="initChart('profitBarChart')"
                        :data-empty="!chartDataBar.rows.length"></ve-bar>
                <div style="text-align: center">
                  <RadioGroup v-model="type">
                    <Radio label="当年"></Radio>
                    <Radio label="当月"></Radio>
                    <Radio label="同比"></Radio>
                    <Radio label="环比"></Radio>
                  </RadioGroup>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col :span="24" class-name="margin-bottom-10" v-show="dataTotal.profitCommodityTypeSummary.length">
          <Card :bordered="false">
            <p slot="title">品类利润分布</p>
            <p slot="extra">单位(万元)</p>
            <Row type="flex" :gutter="2" justify="space-between">
              <Col :lg="12" :sm="12" :xs="24">
                <Row type="flex" :gutter="2" justify="space-between">
                  <Col :lg="12" :sm="12" :xs="24" style="min-height: 240px;"
                       v-for="(item, index) in profitCommodityType.slice(0, 3)" :key="index">
                    <ring-chart :ringData="item" :ringColor="colorList[index]"
                                @changeType="getTypeData(index)"></ring-chart>
                  </Col>
                  <div v-if="profitCommodityType.length===0" style="text-align: center;width: 100%;line-height: 50px;">
                    暂无数据
                  </div>
                </Row>
              </Col>
              <Col :lg="12" :sm="12" :xs="24">
                <p style="border-bottom:solid #e9e9e9 2px;font-size: 26px;">
                  {{utils.showText(commonData.commodityTypes, commodityTypeShow.commodityTypeId)}}
                  <span v-if="!dataTotal.profitCommodityTypeSummary.length">无数据</span>
                  <span v-else>品类利润明细</span>
                </p>
                <p>
                  今年利润 <span v-color-green="commodityTypeShow.yearProfit" class="numStyle">{{utils.formatNum(commodityTypeShow.yearProfit) || 0}}</span>万元
                </p>
                <p>
                  本月利润 <span v-color-blue="commodityTypeShow.monthProfit" class="numStyle">{{utils.formatNum(commodityTypeShow.monthProfit) || 0}}</span>万元
                </p>
                <p>
                  <Row type="flex" :gutter="8" justify="space-between">
                    <Col>
                      同比：
                      <span v-color-blue="commodityTypeShow.yearProportion" class="numStyle trangleWrap">
                                            <div class="downTrangle" v-if="commodityTypeShow.yearProportion<0"></div>
                                            <div class="upTrangle" v-if="commodityTypeShow.yearProportion>0"></div>
                                            {{transNumber(commodityTypeShow.yearProportion)}}%
                                        </span>
                    </Col>
                    <Col>
                      环比：
                      <span v-color-blue="commodityTypeShow.monthProportion" class="numStyle trangleWrap">
                                            <div class="downTrangle" v-if="commodityTypeShow.monthProportion<0"></div>
                                            <div class="upTrangle" v-if="commodityTypeShow.monthProportion>0"></div>
                                            {{transNumber(commodityTypeShow.monthProportion)}}%
                                        </span>
                    </Col>
                  </Row>
                </p>
                <ve-histogram :data="chartData1" :settings="chartSettings1" :colors="colors" :legend-visible="false"
                              ref="profitTypeBarChart" @ready="initChart('profitTypeBarChart')"
                              :data-empty="!chartData1.rows.length" :extend="histogramExtend"></ve-histogram>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  import { utils } from '@/utils/utils';
  import api from './api';
  import RingChart from './components/RingChart';

  export default {
    components: { RingChart },
    data () {
      return {
        disabledDateOption: {
          disabledDate (date) {
            const disabledDay = date.getDay();
            return disabledDay === 6 || disabledDay === 0;
          }
        },
        type: '当年',
        profitName: '',
        profitDate: '',
        chartExtend: {
          'tooltip.trigger': 'none'
        },
        color1: '#43cf7c',
        color2: '#2a82e4',
        chartSettings: {
          dimension: ['月份'],
          metrics: ['利润'],
          digit: 4
        },
        histogramExtend: {
          series: {
            barMaxWidth: 30
          }
        },
        chartSettings1: {
          dimension: ['月份'],
          metrics: ['利润'],
          digit: 4
        },
        chartBarSettings: {
          dimension: ['利润中心'],
          metrics: ['利润'],
          xAxisType: ['normal']
        },
        colors: ['#2D8CF0', '#ff7051', '#43cf7c', '#7948ea', '#cf43c1'],
        commonData: {},
        query: {
          accountEntityId: '',
          date: utils.formatDate(new Date())
        },
        chartData: {
          columns: ['月份', '利润'],
          rows: []
        },
        chartData1: {
          columns: ['月份', '利润'],
          rows: []
        },
        chartDataBar: {
          columns: ['利润中心', '利润'],
          rows: []
        },
        chartDataRing: {
          columns: ['日期', '访问用户'],
          rows: []
        },
        totalColumns: [
          { type: 'index' },
          {
            title: '利润中心',
            key: 'accountEntityName',
          },
          {
            title: '今年利润',
            key: 'yearProfit',
            render: (h, params) => h('span', this.transNumber(params.row.yearProfit))
          },
          {
            title: '本月利润',
            key: 'monthProfit',
            render: (h, params) => h('span', this.transNumber(params.row.monthProfit))
          },
          {
            title: '同比',
            key: 'yearProportion',
            render: (h, params) => {
              return h('div', [
                h('div', {
                  class: 'downTrangle',
                  style: {
                    position: 'initial',
                    display: params.row.yearProportion > 0 ? 'none' : 'inline-block',
                    width: 0,
                    height: 0,
                    'border-width': '9px',
                    'border-style': 'solid',
                    'border-color': '#ec0a0a transparent transparent transparent',
                    'vertical-align': 'middle'
                  }
                }),
                h('div', {
                  class: 'upTrangle',
                  style: {
                    position: 'initial',
                    display: params.row.yearProportion > 0 ? 'inline-block' : 'none',
                    width: 0,
                    height: 0,
                    'border-width': '9px',
                    'border-style': 'solid',
                    'border-color': 'transparent transparent #6bec10 transparent'
                  }
                }),
                h('span', this.transNumber(params.row.yearProportion) + '%')
              ]);
            }
          },
          {
            title: '环比',
            key: 'monthProportion',
            render: (h, params) => {
              return h('div', [
                h('div', {
                  class: 'downTrangle',
                  style: {
                    position: 'initial',
                    display: params.row.monthProportion > 0 ? 'none' : 'inline-block',
                    width: 0,
                    height: 0,
                    'border-width': '9px',
                    'border-style': 'solid',
                    'border-color': '#ec0a0a transparent transparent transparent',
                    'vertical-align': 'middle'
                  }
                }),
                h('div', {
                  class: 'upTrangle',
                  style: {
                    position: 'initial',
                    display: params.row.monthProportion > 0 ? 'inline-block' : 'none',
                    width: 0,
                    height: 0,
                    'border-width': '9px',
                    'border-style': 'solid',
                    'border-color': 'transparent transparent #6bec10 transparent'
                  }
                }),
                h('span', this.transNumber(params.row.monthProportion) + '%')
              ]);
            }
          }
        ],
        profitCenterData: [],
        dataTotal: {
          profitSummary: {
            accountingId: '',
            accountingDate: '',
            yearProfit: '',
            monthProfit: '',
            yearProportion: '',
            monthProportion: '',
            profitOfMonths: []
          },
          profitCenterSummary: [],
          profitCommodityTypeSummary: []
        },
        profitCommodityType: [],
        colorList: ['#ff7051', '#43cf7c', '#7948ea', '#cf43c1'],
        commodityTypeShow: {
          commodityTypeId: ''
        },
        profitSummaryShow: false
      };
    },
    async created () {
      this.query = utils.saveQuery(this.query, 'get');
      let commonData = await api.getCommonData();
      function dealPermissionTreeProfits(list) {
        return list.map(item => {
          return {
            value: item.wfAccountEntityId,
            key: item.wfAccountEntityId,
            title: item.name,
            children: item.children? dealPermissionTreeProfits(item.children): []
          }
        })
      }
      commonData.permissionTreeProfits = dealPermissionTreeProfits(commonData.permissionTreeProfits)
      this.commonData = commonData
      this.query.accountEntityId = this.commonData.permissionTreeProfits.length && this.commonData.permissionTreeProfits[0].value;
      this.search();
    },
    watch: {
      'type': function (val) {
        this.chartDataBar.rows = [];
        if (val === '当年') {
          this.chartBarSettings.xAxisType = ['normal'];
          this.dataTotal.profitCenterSummary.map(item => {
            this.chartDataBar.rows.push({
              '利润中心': item.accountEntityName || '',
              '利润': this.transNumber(item.yearProfit)
            });
          });
        } else if (val === '当月') {
          this.chartBarSettings.xAxisType = ['normal'];
          this.dataTotal.profitCenterSummary.map(item => {
            this.chartDataBar.rows.push({
              '利润中心': item.accountEntityName || '',
              '利润': this.transNumber(item.monthProfit)
            });
          });
        } else if (val === '同比') {
          this.chartBarSettings.xAxisType = ['percent'];
          this.dataTotal.profitCenterSummary.map(item => {
            this.chartDataBar.rows.push({
              '利润中心': item.accountEntityName || '',
              '利润': utils.divide(item.yearProportion, 100)
            });
          });
        } else if (val === '环比') {
          this.chartBarSettings.xAxisType = ['percent'];
          this.dataTotal.profitCenterSummary.map(item => {
            this.chartDataBar.rows.push({
              '利润中心': item.accountEntityName || '',
              '利润': utils.divide(item.monthProportion, 100)
            });
          });
        }
      }
    },
    methods: {
      isShow (permission) {
        return utils.hasPermission(permission);
      },

      getTypeData (index) {
        this.commodityTypeShow = this.dataTotal.profitCommodityTypeSummary[index];
        this.chartData1.rows = [];
        this.commodityTypeShow.profitOfMonths.map(item => {
          this.chartData1.rows.push({
            '月份': item.month + '月',
            '利润': this.transNumber(item.profit)
          });
        });
      },

      initChart (name) {
        this.$nextTick(_ => {
          this.$refs[name].echarts.resize();
        });
      },

      onSearch () {
        this.profitSummaryShow = false
        this.search();
      },

      resetQuery () {
        this.query = {};
      },

      transNumber (num) {
        return num ? Number(num).toFixed(2) : 0;
      },

      clearData () {
        this.chartData.rows = [];
        this.chartDataBar.rows = [];
        this.chartData1.rows = [];
        this.profitCommodityType = [];
      },

      async search () {
        utils.saveQuery(this.query);
        this.clearData();
        this.query.date = utils.formatDate(this.query.date);
        let data = await api.search(this.query);
        this.dataTotal = data.result;
        this.dataTotal.profitSummary.monthProfit = Number(this.dataTotal.profitSummary.monthProfit).toFixed(2);
        this.dataTotal.profitSummary.yearProfit = Number(this.dataTotal.profitSummary.yearProfit).toFixed(2);
        this.profitName = utils.showText(this.commonData.accountingEntities, this.query.accountEntityId);
        this.profitDate = utils.formatDate(this.query.date);
        data.result.profitSummary.profitOfMonths.map(item => {
          this.chartData.rows.push({
            '月份': item.month + '月',
            '利润': this.transNumber(item.profit)
          });
          if(item.profit) this.profitSummaryShow = true
        });
        this.profitCenterData = data.result.profitCenterSummary;
        this.profitCenterData.map(item => {
          item.monthProfit = this.transNumber(item.monthProfit);
          item.yearProfit = this.transNumber(item.yearProfit);
        });
        data.result.profitCenterSummary.map(item => {
          this.chartDataBar.rows.push({
            '利润中心': item.accountEntityName || '',
            '利润': this.transNumber(item.yearProfit)
          });
        });
        this.commodityTypeShow = data.result.profitCommodityTypeSummary.length && data.result.profitCommodityTypeSummary[0];
        data.result.profitCommodityTypeSummary.map(item => {
          item.yearProfit = this.transNumber(item.yearProfit);
          item.monthProfit = this.transNumber(item.monthProfit);
          this.profitCommodityType.push([{
            value: this.transNumber(utils.multiply(item.proportion, 100)),
            name: utils.showText(this.commonData.commodityTypes, item.commodityTypeId)
          }, {
            value: this.transNumber(utils.multiply(1 - item.proportion, 100)),
            name: '其他'
          }]);
        });
        if (data.result.profitCommodityTypeSummary.length) {
          data.result.profitCommodityTypeSummary[0].profitOfMonths.map(item => {
            this.chartData1.rows.push({
              '月份': item.month + '月',
              '利润': this.transNumber(item.profit)
            });
          });
        }
      }
    }
  };
</script>
<style scoped lang="less">
  .numStyle {
    font-size: 26px;
    margin: 0 4px;
  }

  .profit-year {
    background: #faf8f8;
    height: 86px;
    line-height: 86px;
    width: 100%;
    margin-bottom: 10px;

    p {
      padding-left: 10px;
    }
  }

  .profit-month {
    background: #e5e3e3;
    line-height: 30px;
    width: 100%;

    p {
      padding: 10px;
    }
  }

  .searchBar {
    margin: 20px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #f5f7f9
  }

  .chart {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 242px);
    padding-bottom: 150px;
  }

  .ivu-card h3 {
    font-weight: 700;
    text-align: center;
    line-height: 35px;
    margin-top: 20px;
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
    font-size: 16px;
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

  .upTrangle {
    margin-left: 10px;
    float: left;
    width: 0;
    height: 0;
    border-width: 9px;
    border-style: solid;
    border-color: transparent transparent #6bec10 transparent;
    position: absolute;
    top: 0px;
    left: -15px;
  }

  .downTrangle {
    margin-left: 10px;
    float: left;
    width: 0;
    height: 0;
    border-width: 9px;
    border-style: solid;
    border-color: #ec0a0a transparent transparent transparent;
    position: absolute;
    top: 16px;
    left: -15px;
  }

  .trangleWrap {
    position: relative;
    padding-left: 21px;
  }

  .colList {
    margin-bottom: 50px;
  }

  a {
    text-decoration: none;
  }
  .noMsgWarning {
    color: red;
    margin-bottom: 10px;
  }
</style>

