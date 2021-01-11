<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16" class="searchBar">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" title="法人" filterable clearable v-model="query.corporationId">
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
          <Select placeholder="资金账户" title="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option v-for="(item, index) in commonData.tradeAccounts"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="date"
            confirm
            placement="bottom-start"
            placeholder="复核日期"
            v-model="query.reportDate"
          ></DatePicker>
        </Col>
      </Row>
      </qc-collapse>
      <Row :gutter="48">
        <Col :lg="4" :sm="4" :xs="24">
          <Button icon="md-sync" type="primary" v-if="utils.hasPermission('H_CalculateStatementReviewReport')" @click="reCalculate()">重算</Button>
        </Col>
        <Col :lg="20" :xs="24">
          <Button icon="md-search" class="float-right margin-right-3" @click="search()" type="primary">搜索</Button>
          <Button icon="md-close-circle" class="float-right margin-right-3" @click="resetQuery()" type="default">清空</Button>
          <div class="float-right"  @click="lostStatementModal = !lostStatementModal" v-if="basicInfo.missingStatementCount > 0">
            <img class="float-icon" src="../../assets/imgs/alert.svg" alt="" srcset="" width="24px">
            <span class="float-span">当前需要复核的资金账户中存在{{basicInfo.missingStatementCount}}个账户缺失对应的结算单数据！</span>
          </div>
        </Col>
      </Row>
    </div>
    <template v-if="hasSearch">
      <statement-review reviewTitle="数据复核" :countErrorAccount="basicInfo.positionAbnormalAccount ? basicInfo.positionAbnormalAccount : 0" :countAllAccount="basicInfo.positionTotalCount ? basicInfo.positionTotalCount : 0" :reviewColumns="dataReviewColumns" :reviewData="positionItems"></statement-review>
      <statement-review reviewTitle="盈亏复核" :countErrorAccount="basicInfo.profitAbnormalAccount ? basicInfo.profitAbnormalAccount : 0" :countAllAccount="basicInfo.profitTotalCount ? basicInfo.profitTotalCount : 0" :reviewColumns="profitReviewColumns" :reviewData="profitItems"></statement-review>
      <statement-review reviewTitle="权益复核" :countErrorAccount="basicInfo.equityAbnormalAccount ? basicInfo.equityAbnormalAccount : 0" :countAllAccount="basicInfo.equityTotalCount ? basicInfo.equityTotalCount : 0" :reviewColumns="rightReviewColumns" :reviewData="equityItems"></statement-review>
    </template>
    <template v-else>
      <p style="color: red;margin: 20px 0">请输入查询条件，查询更多数据。</p>
    </template>
    <Modal width="60" v-model="lostStatementModal" :title="'缺失结算单数据的资金账户清单（' + utils.formatDate(query.reportDate) + '）'" @on-ok="modalConfirm" @on-cancel="modalCancel">
      <div class="modal-button">
          <Button type="primary" @click="goto('finalStatementList')">导入结算单</Button>
      </div>
      <Table size="small" class="lost-statement-table" border :columns="lostStatementColumns" maxHeight="500" :data="missingStatementDetails"></Table>
    </Modal>
    <Modal width="87" v-model="profitModal" @on-ok="modalConfirm" @on-cancel="modalCancel">
      <p slot="header">
        <span style="font-weight: bold;">{{modalBasicInfo.tradeAccountName}}（{{modalBasicInfo.tradeAccountUserName}}）{{utils.formatDate(query.reportDate)}}利润复核明细 </span>
        <span :class="modalBasicInfo.isDiff ? 'has-diff': 'no-diff'">{{modalBasicInfo.isDiff ? '有' : '无'}}差异</span>
      </p>
      <div class="table-title-content">
        <span class="table-title">资金账户利润明细</span>
        <Tooltip max-width="900" placement="bottom-start">
        <img class="float-icon" src="../../assets/imgs/alert.svg" alt="" srcset="" width="24px">
        <div slot="content">
          <p>资金账户利润说明：</p>
          <p>累计净利润 = 累计交易盈亏+累计其他盈亏-累计交易费用-累计其他费用</p>
          <p>累计交易盈亏 = 累计平仓盈亏+浮动盈亏</p>
          <p class="no-wrap">累计其他盈亏 = SUM（资金账户权益记录参与盈亏计算权益类型的金额）</p>
          <p>累计交易费用 = SUM（资金账户成交记录手续费）</p>
          <p>累计其他费用 = SUM（资金账户权益记录参与费用计算权益类型的金额）</p>
        </div>
      </Tooltip>
      </div>
      <!-- 成交记录 -->
      <Table size="small" border :columns="tradeAccountProfitColumns" :data="tradeAccountProfitData" :span-method="handleSpanfr"></Table>
      <div class="table-title-content review-table-se">
        <span class="table-title">利润中心利润明细</span>
        <Tooltip max-width="900" placement="bottom-start">
        <img class="float-icon" src="../../assets/imgs/alert.svg" alt="" srcset="" width="24px">
        <div slot="content">
          <p>利润中心利润说明：</p>
          <p>累计净利润 = 累计交易盈亏+累计其他盈亏-累计交易费用-累计其他费用</p>
          <p>累计交易盈亏 = 累计平仓盈亏+浮动盈亏</p>
          <p>累计其他盈亏 = SUM（其他收支记录参与盈亏计算收支类型的金额）</p>
          <p class="no-wrap">累计交易费用 = SUM（期货成交记录的手续费）</p>
          <p>累计其他费用 = SUM（其他收支记录参与费用计算的金额）</p>
        </div>
      </Tooltip>
      </div>
      <!-- 持仓记录 -->
      <Table size="small" border :columns="accountingEntityProfitColumns" :data="accountingEntityProfitData" :span-method="handleSpanse"></Table>
    </Modal>
    <Modal width="60" v-model="rightModal" @on-ok="modalConfirm" @on-cancel="modalCancel">
      <p slot="header">
        <span style="font-weight: bold;">{{modalBasicInfo.tradeAccountName}}（{{modalBasicInfo.tradeAccountUserName}}）{{utils.formatDate(query.reportDate)}}权益复核明细 </span>
        <span :class="modalBasicInfo.isDiff ? 'has-diff': 'no-diff'">{{modalBasicInfo.isDiff ? '有' : '无'}}差异</span>
      </p>
      <Form
        ref="form"
        label-position="right"
        :label-width="170"
        :model="detail"
        class="form-area"
      >
        <Row type="flex" :gutter="16">
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem label="结算单客户权益：">
              <format-cell class="inline-cell">{{(modalBasicInfo.customerEquity !== null ? modalBasicInfo.customerEquity + ' ' + modalBasicInfo.currencyShortName : '')}}</format-cell>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem label="上日结存：">
              <format-cell class="inline-cell">{{(modalBasicInfo.prevBalanceAmount !== null ? modalBasicInfo.prevBalanceAmount + ' ' + modalBasicInfo.currencyShortName : '')}}</format-cell>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem label="计算客户权益：">
              <format-cell class="inline-cell">{{(modalBasicInfo.calcCustomerEquity !== null ? modalBasicInfo.calcCustomerEquity + ' ' + modalBasicInfo.currencyShortName : '')}}</format-cell>
              <Tooltip max-width="900" placement="bottom-start">
                <img class="float-icon" src="../../assets/imgs/alert.svg" alt="" srcset="" width="24px">
                <div slot="content">
                  <p>客户权益计算公式：</p>
                  <p>客户权益 = 上日结存 + 交易盈亏 + 权益变动</p>
                  <p class="no-wrap">交易盈亏 = SUM（平仓盈亏 + 浮动盈亏 + 其他盈亏 - 手续费 - 其他费用）</p>
                  <p>平仓盈亏 = SUM（成交记录平仓盈亏）</p>
                  <p>浮动盈亏 = SUM（持仓记录浮动盈亏）</p>
                  <p>其他盈亏 = SUM（资金账户权益变动参与盈亏计算的金额）</p>
                  <p>手续费 = SUM（成交记录手续费）</p>
                  <p>其他费用 = SUM（资金账户权益变动参与费用计算的金额）</p>
                  <p>权益变动 = SUM（资金账户权益变动参与权益变动计算的金额）</p>
                </div>
              </Tooltip>
            </FormItem>
          </Col>
          <Col :lg="12" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem label="差异（计算-结算单）：">
              <format-cell class="inline-cell">{{(modalBasicInfo.diffValue !== null ? modalBasicInfo.diffValue  + ' ' + modalBasicInfo.currencyShortName : '')}}</format-cell>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="table-title-content">
        <span class="table-title">交易盈亏明细</span>
        <!-- <div class="table-title-info">
          <a>更多信息...</a>
        </div> -->
      </div>
      <!-- 成交记录 -->
      <Table size="small" border :columns="tradeProfitColumns" :data="tradeProfitData" maxHeight="250" :span-method="handleSpanTradefr"></Table>
      <div class="table-title-content review-table-se between">
        <span class="table-title">权益变动明细</span>
        <div class="table-title-info">
          <a @click="goto('StatementEquityRecordList')">更多信息...</a>
        </div>
      </div>
      <!-- 持仓记录 -->
      <Table size="small" border :columns="rightChangeColumns" :data="rightChangeData" maxHeight="250" :span-method="handleSpanRightse"></Table>
    </Modal>
  </div>
</template>

<script>
import statementReview from './components/statement-review'
import { utils } from '@/utils/utils'
import api from './api'
import _ from 'lodash'

export default {
  components: {
    statementReview
  },
  data() {
    return {
      hasSearch: false,
      totalPrice: 0,
      startLine: 0,
      lostStatementModal: false,
      profitModal: false,
      rightModal: false,
      query: {
        reportDate: new Date(),
        corporationId: '',
        tradeAccountId: ''
      },
      pagenation: {
      },
      commonData: {
        corporations: [],
        tradeAccounts: []
      },
      detail: {},
      modalBasicInfo: {
        businessTypeId: '',
        commodityTypeId: '',
        currencyId: '',
        currencyShortName: '',
        isDiff: false,
        isReview: '',
        netProfitDiff: '',
        profitCenterNetProfit: '',
        profitCenterTodayCost: '',
        profitCenterTotalCost: '',
        profitCenterTradeProfit: '',
        tradeAccountId: '',
        tradeAccountName: '',
        tradeAccountNetProfit: '',
        tradeAccountTodayCost: '',
        tradeAccountTotalCost: '',
        tradeAccountTradeProfit: '',
        tradeAccountUserName: '',
        tradeProfitDiff: '',
      },
      lostStatementColumns: [
        {
          title: '资金账户',
          align: 'center',
          minWidth: 120,
          key: 'tradeAccountName',
        },{
          title: '账户号',
          align: 'center',
          minWidth: 120,
          key: 'tradeAccountUserName',
        },{
          title: '经纪公司',
          align: 'center',
          minWidth: 120,
          key: 'brokerName',
        },{
          title: '账户类型',
          align: 'center',
          minWidth: 120,
          key: 'tradeAccountTypeName',
        },{
          title: '结算币种',
          align: 'center',
          minWidth: 100,
          key: 'currencyShortName',
          render: (h, { row }) => h('span', utils.showText(this.commonData.currency, row.currencyId))
        },{
          title: '最近一次结算单日期',
          align: 'center',
          minWidth: 140,
          key: 'lastestSettlementDate',
          render: (h, { row }) => h('span', utils.formatDate(row.lastestSettlementDate))
        }
      ],
      dataReviewColumns: [
        {
          title: '资金账户',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h("a", {
              style: {
                textDecoration: 'underline',
              },
              on: {
                click: () => {
                  row.corporationId = this.query.corporationId
                  row.reportDate = this.query.reportDate
                  sessionStorage.setItem('setDataStatementRow', JSON.stringify(row))
                  const {href} = this.$router.resolve({name: 'dataReviewResult'})
                  window.open(href, '_blank')
                }
              }
            },
            row.tradeAccountName
            )
          }
        },{
          title: '账户号',
          align: 'center',
          minWidth: 120,
          key: 'tradeAccountUserName'
        },{
          title: '复核结果',
          align: 'center',
          minWidth: 80,
          filters: [
              {
                  label: '正常',
                  value: false
              },
              {
                  label: '异常',
                  value: true
              }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
              if (value) {
                  return row.isDiff;
              } else {
                  return !row.isDiff;
              }
          },
          render: (h, { row }) => h('span',{
            style: {
              color: !row.isDiff ? '#000000' : '#ff0000'
              }
            },
          row.isDiff ? '异常' : '正常')
        },{
          title: '成交数据复核（差异数）',
          align: 'center',
          children: [
            {
              title: '期货成交明细',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  fixed: 0,
                  num: utils.formatNum(row.futureRecordCount)
                }
              }),
            },{
              title: '期权成交明细',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  fixed: 0,
                  num: utils.formatNum(row.optionRecordCount)
                }
              }),
            }
          ]
        },{
          title: '持仓数据复核（差异数）',
          align: 'center',
          children: [
            {
              title: '期货持仓',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  fixed: 0,
                  num: utils.formatNum(row.futurePositionCount)
                }
              }),
            },{
              title: '期权持仓',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  fixed: 0,
                  num: utils.formatNum(row.optionPositionCount)
                }
              }),
            }
          ]
        }
      ],
      profitReviewColumns: [
        {
          title: '资金账户',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h("a", {
              style: {
                textDecoration: 'underline',
              },
              on: {
                click: () => {
                  this.tradeAccountProfitData = []
                  this.accountingEntityProfitData = []
                  this.profitModal = true
                  let params = utils.cleanEmpty({
                    reportDate: utils.formatDate(this.query.reportDate),
                    corporationId: this.query.corporationId,
                    tradeAccountId: row.tradeAccountId,
                    currencyId: row.currencyId
                  });
                  params.tradeAccountId = row.tradeAccountId
                  this.modalBasicInfo = row
                  api.listStatementPnLReviewDetail(params).then(result => {
                    this.tradeAccountProfitData = result.tradeAccountPnLDetails
                    let sum = {
                      totalNetPnL: 0,
                      totalTradePnL: 0,
                      totalOtherPnL: 0,
                      totalTradeCost: 0,
                      totalOtherCost: 0,
                      closePnL: 0,
                      prevPositionPnL: 0,
                      positionPnL: 0,
                      tradeCost: 0,
                      otherCost: 0,

                    }
                    result.tradeAccountPnLDetails.forEach(item => {
                      sum.totalNetPnL += item.totalNetPnL
                      sum.totalTradePnL += item.totalTradePnL
                      sum.totalOtherPnL += item.totalOtherPnL
                      sum.totalTradeCost += item.totalTradeCost
                      sum.totalOtherCost += item.totalOtherCost
                      sum.closePnL += item.closePnL
                      sum.prevPositionPnL += item.prevPositionPnL
                      sum.positionPnL += item.positionPnL
                      sum.tradeCost += item.tradeCost
                      sum.otherCost += item.otherCost
                    })
                    if(this.tradeAccountProfitData.length) {
                      this.tradeAccountProfitData.push({
                        commodityTypeText: '合计',
                        totalNetPnL: sum.totalNetPnL,
                        totalTradePnL: sum.totalTradePnL,
                        totalOtherPnL: sum.totalOtherPnL,
                        totalTradeCost: sum.totalTradeCost,
                        totalOtherCost: sum.totalOtherCost,
                        closePnL: sum.closePnL,
                        prevPositionPnL: sum.prevPositionPnL,
                        positionPnL: sum.positionPnL,
                        tradeCost: sum.tradeCost,
                        otherCost: sum.otherCost,
                      })
                    }
                    this.accountingEntityProfitData = result.profitCenterPnLDetails
                    let sum2 = {
                      totalNetPnL: 0,
                      totalTradePnL: 0,
                      totalOtherPnL: 0,
                      totalTradeCost: 0,
                      totalOtherCost: 0,
                      closePnL: 0,
                      prevPositionPnL: 0,
                      positionPnL: 0,
                      tradeCost: 0,
                      otherCost: 0,
                      otherPnL: 0
                    }
                    result.profitCenterPnLDetails.forEach(item => {
                      sum2.totalNetPnL += item.totalNetPnL
                      sum2.totalTradePnL += item.totalTradePnL
                      sum2.totalOtherPnL += item.totalOtherPnL
                      sum2.totalTradeCost += item.totalTradeCost
                      sum2.totalOtherCost += item.totalOtherCost
                      sum2.closePnL += item.closePnL
                      sum2.prevPositionPnL += item.prevPositionPnL
                      sum2.positionPnL += item.positionPnL
                      sum2.tradeCost += item.tradeCost
                      sum2.otherCost += item.otherCost
                      sum2.otherPnL += item.otherPnL
                    })
                    if(this.accountingEntityProfitData.length) {
                      this.accountingEntityProfitData.push({
                        accountingEntityName: '合计',
                        totalNetPnL: sum2.totalNetPnL,
                        totalTradePnL: sum2.totalTradePnL,
                        totalOtherPnL: sum2.totalOtherPnL,
                        totalTradeCost: sum2.totalTradeCost,
                        totalOtherCost: sum2.totalOtherCost,
                        closePnL: sum2.closePnL,
                        prevPositionPnL: sum2.prevPositionPnL,
                        positionPnL: sum2.positionPnL,
                        tradeCost: sum2.tradeCost,
                        otherCost: sum2.otherCost,
                        otherPnL: sum2.otherPnL,
                      })
                    }
                  })
                }
              }
            },
            row.tradeAccountName
            )
          }
        },{
          title: '账户号',
          align: 'center',
          minWidth: 120,
          key: 'tradeAccountUserName'
        },{
          title: '币种',
          align: 'center',
          minWidth: 100,
          key: 'currencyShortName',
          render: (h, { row }) => h('span', utils.showText(this.commonData.currency, row.currencyId))
        },{
          title: '复核结果',
          align: 'center',
          minWidth: 80,
          filters: [
              {
                  label: '正常',
                  value: false
              },
              {
                  label: '异常',
                  value: true
              }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
              if (value) {
                  return row.isDiff;
              } else {
                  return !row.isDiff;
              }
          },
          render: (h, { row }) => h('span',{
            style: {
              color: !row.isDiff ? '#000000' : '#ff0000'
              }
            },
            row.isDiff ? '异常' : '正常')
        },{
          title: '差异（利润中心-资金账户）',
          align: 'center',
          children: [
            {
              title: '净利润',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.netProfitDiff
                }
              }),
            },{
              title: '交易盈亏',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.tradeProfitDiff
                }
              }),
            }
          ]
        },{
          title: '资金账户盈亏',
          align: 'center',
          children: [
            {
              title: '净利润',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.tradeAccountNetProfit
                }
              })
            },{
              title: '交易盈亏',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.tradeAccountTradeProfit
                }
              })
            },{
              title: '总费用',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.tradeAccountTotalCost
                }
              })
            },{
              title: '当日费用',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.tradeAccountTodayCost
                }
              })
            }
          ]
        },{
          title: '利润中心盈亏',
          align: 'center',
          children: [
            {
              title: '净利润',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.profitCenterNetProfit
                }
              })
            },{
              title: '交易盈亏',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.profitCenterTradeProfit
                }
              })
            },{
              title: '总费用',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.profitCenterTotalCost
                }
              })
            },{
              title: '当日费用',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.profitCenterTodayCost
                }
              })
            }
          ]
        }
      ],
      rightReviewColumns: [
        {
          title: '资金账户',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h("a", {
              style: {
                textDecoration: 'underline',
              },
              on: {
                click: () => {
                  this.rightChangeData = []
                  this.tradeProfitData = []
                  this.totalPrice = 0
                  this.startLine = 0
                  this.rightModal = true
                  this.modalBasicInfo = row
                  let params = utils.cleanEmpty({
                    settlementDate: utils.formatDate(this.query.reportDate),
                    corporationId: this.query.corporationId,
                    tradeAccountId: row.tradeAccountId
                  });
                  api.listStatementEquityCompareDetail(params).then(result => {
                    let sum = {
                      closePnl: 0,
                      positionPnl: 0,
                      otherPnl: 0,
                      commission: 0,
                      otherFee: 0
                    }
                    result.statementReviewTradePnlDetails.forEach(item => {
                      if(item.currencyId === row.currencyId) {
                        sum.closePnl += item.closePnl
                        sum.positionPnl += item.positionPnl
                        sum.otherPnl += item.otherPnl
                        sum.commission += item.commission
                        sum.otherFee += item.otherFee
                        item.exchangeRate = ''
                      } else {
                        sum.closePnl += item.closePnl * item.exchangeRate
                        sum.positionPnl += item.positionPnl * item.exchangeRate
                        sum.otherPnl += item.otherPnl * item.exchangeRate
                        sum.commission += item.commission * item.exchangeRate
                        sum.otherFee += item.otherFee * item.exchangeRate
                        item.exchangeRate = utils.showText(this.commonData.currency,item.currencyId) + '-' + utils.showText(this.commonData.currency,row.currencyId) + ':' + item.exchangeRate.toFixed(2)
                      }
                    })
                    this.totalPrice = sum.closePnl + sum.positionPnl +sum.otherPnl - sum.commission - sum.otherFee
                    this.tradeProfitData = this.getDataGroup(result.statementReviewTradePnlDetails)
                    if(this.tradeProfitData.length) {
                      this.tradeProfitData.push({
                        commodityTypeName: '合计（总盈亏：' + utils.formatNum(this.totalPrice.toFixed(2)) + row.currencyShortName +'）',
                        closePnl: sum.closePnl,
                        positionPnl: sum.positionPnl,
                        otherPnl: sum.otherPnl,
                        commission: sum.commission,
                        otherFee: sum.otherFee,
                      })
                    }
                    this.rightChangeData = result.statementReviewTaEquityChangeDetails
                    // let sum2 = {
                    //   amount: 0
                    // }
                    // result.statementReviewTaEquityChangeDetails.forEach(item => {
                    //   sum2.amount += item.amount
                    // })
                    if(this.rightChangeData.length) {
                      this.rightChangeData.push({
                        happenDate: '合计',
                        amount: this.modalBasicInfo.equityChange
                      })
                    }
                  })
                }
              }
            },
            row.tradeAccountName
            )
          }
        },{
          title: '账户号',
          align: 'center',
          minWidth: 120,
          key: 'tradeAccountUserName'
        },{
          title: '结算币种',
          align: 'center',
          minWidth: 100,
          key: 'currencyShortName',
          render: (h, { row }) => h('span', utils.showText(this.commonData.currency, row.currencyId))
        },{
          title: '复核结果',
          align: 'center',
          minWidth: 80,
          filters: [
              {
                  label: '正常',
                  value: false
              },
              {
                  label: '异常',
                  value: true
              }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
              if (value) {
                  return row.isDiff;
              } else {
                  return !row.isDiff;
              }
          },
          render: (h, { row }) => h('span',{
            style: {
              color: !row.isDiff ? '#000000' : '#ff0000'
              }
            },
            row.isDiff ? '异常' : '正常')
        },{
          title: '差异（计算-结算单）',
          align: 'center',
          minWidth: 140,
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.diffValue
            }
          })
        },{
          title: '资金账户权益',
          align: 'center',
          children: [
            {
              title: '上日结存',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.prevBalanceAmount
                }
              })
            },{
              title: '客户权益',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.customerEquity
                }
              })
            }
          ]
        },{
          title: '计算权益结果',
          align: 'center',
          children: [
            {
              title: '客户权益',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.calcCustomerEquity
                }
              })
            },{
              title: '盈亏变动',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.profit
                }
              })
            },{
              title: '费用变动',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.cost
                }
              })
            },{
              title: '权益变动',
              align: 'center',
              minWidth: 140,
              render: (h, {row}) => h('format-cell', {
                props: {
                  num: row.equityChange
                }
              })
            }
          ]
        }
      ],
      tradeAccountProfitColumns: [
        {
          title: '品类',
          align: 'center',
          key: 'commodityTypeText',
          minWidth: 120
        },{
          title: '业务类型',
          align: 'center',
          key: 'businessTypeId',
          render: (h, {row}) => h('span', utils.showText(this.commonData.businessType, row.businessTypeId)),
          minWidth: 120
        },{
          title: '累计净利润',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalNetPnL
            }
          }),
          minWidth: 120
        },{
          title: '累计交易盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalTradePnL
            }
          }),
          minWidth: 120
        },{
          title: '累计其他盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalOtherPnL
            }
          }),
          minWidth: 120
        },{
          title: '累计交易费用',
          align: 'center',
          key: 'totalTradeCost',
          minWidth: 120,
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalTradeCost
            }
          })
        },{
          title: '累计其他费用',
          align: 'center',
          key: 'totalOtherCost',
          minWidth: 120,
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalOtherCost
            }
          })
        },{
          title: '今日平仓盈亏变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.closePnL
            }
          }),
          minWidth: 120
        },{
          title: '今日浮动盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.positionPnL
            }
          }),
          minWidth: 120
        },{
          title: '昨日浮动盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.prevPositionPnL
            }
          }),
          minWidth: 120
        },{
          title: '今日其他盈亏变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.otherPnL
            }
          }),
          minWidth: 120
        },{
          title: '今日交易费用变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.tradeCost
            }
          }),
          minWidth: 120
        },{
          title: '今日其他费用变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.otherCost
            }
          }),
          minWidth: 120
        },{
          title: '重算时间',
          align: 'center',
          render: (h, {row}) => h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss')),
          minWidth: 160
        }
      ],
      accountingEntityProfitColumns: [
        {
          title: '利润中心',
          align: 'center',
          key: 'accountingEntityName',
          minWidth: 120
        },{
          title: '品类',
          align: 'center',
          key: 'commodityTypeText',
          minWidth: 120
        },{
          title: '业务类型',
          align: 'center',
          key: 'businessTypeId',
          render: (h, {row}) => h('span', utils.showText(this.commonData.businessType, row.businessTypeId)),
          minWidth: 120
        },{
          title: '累计净利润',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalNetPnL
            }
          }),
          minWidth: 120
        },{
          title: '累计交易盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalTradePnL
            }
          }),
          minWidth: 120
        },{
          title: '累计其他盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalOtherPnL
            }
          }),
          minWidth: 120
        },{
          title: '累计交易费用',
          align: 'center',
          key: 'totalTradeCost',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalTradeCost
            }
          }),
          minWidth: 120
        },{
          title: '累计其他费用',
          align: 'center',
          key: 'totalOtherCost',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.totalOtherCost
            }
          }),
          minWidth: 120
        },{
          title: '今日平仓盈亏变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.closePnL
            }
          }),
          minWidth: 120
        },{
          title: '今日浮动盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.positionPnL
            }
          }),
          minWidth: 120
        },{
          title: '昨日浮动盈亏',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.prevPositionPnL
            }
          }),
          minWidth: 120
        },{
          title: '今日其他盈亏变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.otherPnL
            }
          }),
          minWidth: 120
        },{
          title: '今日交易费用变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.tradeCost
            }
          }),
          minWidth: 120
        },{
          title: '今日其他费用变动',
          align: 'center',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.otherCost
            }
          }),
          minWidth: 120
        },{
          title: '重算时间',
          align: 'center',
          render: (h, {row}) => h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss')),
          minWidth: 160
        }
      ],
      tradeProfitColumns: [
        {
          title: '品类',
          align: 'center',
          key: 'commodityTypeName',
          minWidth: 120
        },
        {
          title: '币种',
          align: 'center',
          key: 'currencyShortName',
          minWidth: 100,
          render: (h, { row }) => h('span', utils.showText(this.commonData.currency, row.currencyId))
        },
        {
          title: '业务类型',
          align: 'center',
          key: 'businessType',
          render: (h, {row}) => h('span', utils.showText(this.commonData.businessType, row.businessType)),
          minWidth: 120
        },
        {
          title: '今日平仓盈亏',
          align: 'center',
          key: 'closePnl',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: _.isNil(row.closePnl) ? null : row.closePnl
            }
          }),
          minWidth: 120
        },
        {
          title: '浮动盈亏',
          align: 'center',
          key: 'positionPnl',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: _.isNil(row.positionPnl) ? null : row.positionPnl
            }
          }),
          minWidth: 120
        },
        {
          title: '今日其他盈亏',
          align: 'center',
          key: 'otherPnl',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: _.isNil(row.otherPnl) ? null : row.otherPnl
            }
          }),
          minWidth: 120
        },
        {
          title: '今日手续费',
          align: 'center',
          key: 'commission',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: _.isNil(row.commission) ? null : row.commission
            }
          }),
          minWidth: 120
        },
        {
          title: '今日其他费用',
          align: 'center',
          key: 'otherFee',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: _.isNil(row.otherFee) ? null : row.otherFee
            }
          }),
          minWidth: 120
        },
        {
          title: '汇率',
          align: 'center',
          key: 'exchangeRate',
          // render: (h, {row}) => h('format-cell', {
          //   props: {
          //     num: row.exchangeRate
          //   }
          // }),
          minWidth: 120
        }
      ],
      rightChangeColumns: [
        {
          title: '发生日期',
          align: 'center',
          key: 'happenDate',
          render: (h, {row}) => h('span', utils.formatDate(row.happenDate)),
          minWidth: 120
        },
        {
          title: '权益类型',
          align: 'center',
          key: 'taEquityType',
          render: (h, {row}) => h('span', utils.showText(this.commonData.equityType, row.taEquityType)),
          minWidth: 120
        },
        {
          title: '金额',
          align: 'center',
          key: 'amount',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.amount
            }
          }),
          minWidth: 120
        },{
          title: '品类',
          align: 'center',
          key: 'commodityTypeName',
          minWidth: 120
        },
        {
          title: '业务类型',
          align: 'center',
          key: 'businessTypeId',
          render: (h, {row}) => h('span', utils.showText(this.commonData.businessType, row.businessTypeId)),
          minWidth: 120
        },
        {
          title: '备注',
          align: 'center',
          key: 'note',
          minWidth: 120
        },
        {
          title: '更新人',
          align: 'center',
          key: 'lastManipulatorName',
          minWidth: 120
        },
        {
          title: '更新时间',
          align: 'center',
          key: 'lastManipulationTime',
          render: (h, {row}) => h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss')),
          minWidth: 160
        }
      ],
      tradeAccountProfitData: [],
      accountingEntityProfitData: [],
      tradeProfitData: [],
      rightChangeData: [],
      basicInfo: {
        missingStatementCount: 0,
        positionTotalCount: 0,
        positionAbnormalAccount: 0,
        profitTotalCount: 0,
        profitAbnormalAccount: 0,
        equityTotalCount: 0,
        equityAbnormalAccount: 0
      },
      positionItems: [],
      profitItems: [],
      equityItems: [],
      missingStatementDetails: [],
      rateFlag: '',
      groupByObj: {}
    }
  },
  mounted() {
    api.getCommonData().then(result => {
      this.commonData = result
    })
  },
  methods: {
    goto(routeName) {
      const {href} = this.$router.resolve({name: routeName, query: {
        tradeAccountId: this.modalBasicInfo.tradeAccountId || '',
        reportDate: utils.formatDate(this.query.reportDate),
      }})
      window.open(href, '_blank')
    },
    modalConfirm() {
      this.tradeAccountProfitData = []
      this.accountingEntityProfitData = []
      this.tradeProfitData = []
      this.rightChangeData = []
    },
    modalCancel() {
      this.tradeAccountProfitData = []
      this.accountingEntityProfitData = []
      this.tradeProfitData = []
      this.rightChangeData = []
    },
    reCalculate() {
      api.calcStatementReview({reportDate: utils.formatDate(this.query.reportDate)}).then(result => {
        this.search()
        this.$Message.success(result)
      }).catch(err => {
        // alert(err)
      })
    },
    getRed(val) {
      return val < 0 ? '#ff0000' : '#000000'
    },
    search() {
      this.positionItems = []
      this.profitItems = []
      this.equityItems = []
      if(this.query.reportDate) {
        this.hasSearch = true
        let query = {
          reportDate: utils.formatDate(this.query.reportDate),
          corporationId: this.query.corporationId,
          tradeAccountId: this.query.tradeAccountId
        }
        api.list(query).then(result => {
          this.positionItems = result.positionItems
          this.profitItems = result.profitItems
          this.equityItems = result.equityItems
          this.missingStatementDetails = result.missingStatementDetails.sort((a,b) => a.tradeAccountName.localeCompare(b.tradeAccountName,'zh-CN'))
          delete result.positionItems
          delete result.profitItems
          delete result.equityItems
          delete result.missingStatementDetails
          this.basicInfo = result
        })
      } else {
        this.$Message.warning('复核日期必填！')
      }
    },
    resetQuery() {
      this.query = {
        reportDate: new Date(),
        corporationId: '',
        tradeAccountId: ''
      }
    },
    handleSpanfr({ row, column, rowIndex, columnIndex }) { //盈亏
      if (rowIndex === this.tradeAccountProfitData.length-1 && columnIndex === 0) {
        return [1, 2];
      } else if (rowIndex === this.tradeAccountProfitData.length-1 && columnIndex === 1){
        return [0, 0]
      }
    },
    handleSpanse({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.accountingEntityProfitData.length-1 && columnIndex === 0) {
        return [1, 3];
      } else if (rowIndex === this.accountingEntityProfitData.length-1 && (columnIndex === 1 || columnIndex === 2)){
        return [0, 0]
      }
    },
    handleSpanTradefr({ row, column, rowIndex, columnIndex }) { //权益
      if(rowIndex === this.tradeProfitData.length-1) {
        if (columnIndex === 0) {
          return [1, 3];
        } else if (columnIndex === 1 || columnIndex === 2){
          return [0, 0]
        }
      } else {
        let currencyGroup = this.groupByObj[row.commodityTypeId]
        let length = currencyGroup[row.currencyId].length
        if(this.startLine + length === rowIndex) this.startLine += length - 1
        if(rowIndex === this.startLine && columnIndex === 8) {
          return {
            rowspan: length,
            colspan: 1
          }
        } else if (rowIndex > this.startLine && rowIndex < this.startLine + length && columnIndex === 8) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleSpanRightse({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.rightChangeData.length-1 && columnIndex === 0) {
        return [1, 2];
      } else if (rowIndex === this.rightChangeData.length-1 && columnIndex === 1){
        return [0, 0]
      }
    },
    getDataGroup(arr) {
      let result = []
      let arrby = _.groupBy(arr, 'commodityTypeId')
      for (let key in arrby) {
        let arrbyNew = _.groupBy(arrby[key], 'currencyId')
        for (let keyNew in arrbyNew) {
          result.push(...arrbyNew[keyNew])
          Object.assign(this.groupByObj, { //品类id 对应的 币种分组对象
            [key]: arrbyNew
          })
        }
      }
      return result
    }
      // return arr
    // }
  }
}
</script>

<style lang="less" scoped>
.float-right {
  float: right;
  margin-left: 5px;
}
.float-span {
  line-height: 32px;
  color: rgba(255, 141, 26, 1);
}
.float-icon {
  line-height: 32px;
  height: 32px;
  margin: 0 10px;
}
.lost-statement-table {
  margin-top: 20px;
}
.table-title-content {
  display: flex;
  align-items: center;
  span {
    font-size: 17px;
    font-weight: bold;
  }
}
.between {
  justify-content: space-between;
}
.form-area {
  margin-left: -42px;
  /deep/ .ivu-form-item-label {
    font-size: 14px!important;
  }
  /deep/ .ivu-form-item-content {
    font-size: 14px!important;
  }
}
.review-table-se {
  margin-top: 15px;
}
.has-diff {
  display: inline-block;
  background-color: rgba(255, 141, 26, 1);
}
.no-diff {
  display: inline-block;
  background-color: rgba(67, 207, 124, 1);
}
.no-wrap {
  white-space: nowrap;
}
.inline-cell {
  display: inline-block;
}
</style>
