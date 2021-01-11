<template>
  <div>
    <div class="header">
      <p class="title-info">{{item.tradeAccountName}}（{{item.tradeAccountUserName}}）{{utils.formatDate(item.reportDate)}}结算单数据复核结果明细</p>
      <div class="header-oper">
        <span>仅显示差异：</span>
        <i-switch class="switch-button" v-model="isDiff" @on-change="change" />
        <Tooltip max-width="900" placement="bottom-start">
          <!-- <Icon class="float-icon" type="ios-alert-outline" /> -->
          <img src="../../assets/imgs/alert.svg" alt="" srcset="" width="24px">
          <!-- <Icon type="md-help-circle" color="orange" style="font-size: 20px;"/>         -->
          <div slot="content">
            <p>复核要点说明：</p>
            <p class="no-wrap">* 成交复核：按照合约、方向汇总结算日的资金账户成交记录和利润中心的成交记录，对比当日总手数、成交均价和手续费</p>
            <p>* 持仓复核：按照合约汇总资金账户持仓明细和利润中心持仓明细，对比持仓数量</p>
          </div>
        </Tooltip>
      </div>
      <div class="err-info">
        <p>成交对比结果：按合约、方向汇总，资金账户成交记录总计{{accountTradeCounts}}笔，利润中心成交数据总计{{profitCenterTradeCounts}}笔，存在差异{{errTradeCounts}}笔</p>
        <p>持仓对比结果：按合约汇总，资金账户持仓记录总计{{accountPositionCounts}}笔，利润中心持仓数据总计{{profitCenterPositionCounts}}笔，存在差异{{errPositionCounts}}笔</p>
      </div>
      <data-review-result-table :reviewColumns="tradeRecordReviewColumns" :reviewData="tradeRecordReviewData" reviewTitle="成交记录复核结果"></data-review-result-table>
      <data-review-result-table :reviewColumns="holdPositionReviewColumns" :reviewData="holdPositionReviewData" reviewTitle="持仓复核结果"></data-review-result-table>
    </div>
    <Modal width="60" v-model="reviewModal" @on-ok="modalConfirm" @on-cancel="modalCancel">
      <p slot="header">
        <span style="font-weight: bold;">{{item.tradeAccountName}}（{{item.tradeAccountUserName}}）{{utils.formatDate(item.reportDate)}}{{isTradeRecord ? '成交记录' : '持仓'}}复核明细 </span>
        <span :class="contractDiff ? 'has-diff': 'no-diff'">{{contractDiff ? '有' : '无'}}差异</span>
        </p>
        <div class="table-title-content">
          <span class="table-title">资金账户{{isTradeRecord ? '成交' : '持仓'}}记录</span>
          <div class="table-title-info">
            <span>更新人：<span>{{lastManipulationName}}</span></span>
            <span>更新时间：<span>{{utils.formatDate(lastManipulationTime, 'YYYY-MM-DD HH:mm:ss')}}</span></span>
            <a v-show="isTradeRecord" @click="goto('StatementFutureTradeList')">更多信息...</a>
            <a v-show="!isTradeRecord" @click="gotoByPath('/final-statement/info/')">更多信息...</a>
          </div>
        </div>
        <!-- 成交记录 -->
        <Table class="diff-table" size="small" border :columns="tradeOrPositionAccountColumns" maxHeight="300" :data="tradeOrPositionAccountingEntityData"></Table>
        <div class="table-title-content review-table">
          <span class="table-title">利润中心{{isTradeRecord ? '成交' : '持仓'}}记录</span>
          <div class="table-title-info">
            <a v-show="isTradeRecord" @click="goto('FutureTradeRecordList')">更多信息...</a>
          </div>
        </div>
        <!-- 持仓记录 -->
        <Table class="diff-table" size="small" border :columns="tradeOrPositionAccountingEntityColumns" maxHeight="300" :data="tradeOrPositionAccountData" :span-method="handleSpan"></Table>
    </Modal>
  </div>
</template>

<script>
import dataReviewResultTable from './components/data-review-result-table'
import {utils} from '@/utils/utils'
import api from './api'
import _ from 'lodash'

export default {
  components: {
    dataReviewResultTable
  },
  data() {
    return {
      startLine: 0,
      groupByObj: {},
      item: {},
      isDiff: false,
      id: '',
      reviewModal: false,
      isTradeRecord: true,
      acStatementRecordId: '',
      lastManipulationName: '',
      lastManipulationTime: '',
      tradeRecordReviewDataDeep: {},
      holdPositionReviewDataDeep: {},
      params: {},
      basicInfo: {},
      tradeRecordReviewColumns: [
        {
          title: '合约',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h("a", {
              style: {
                textDecoration: 'underline',
              },
              on: {
                click: () => {
                  this.basicInfo = row
                  this.reviewModal = true
                  this.isTradeRecord = true
                  api.listDataDetailReview({
                    corporationId: this.item.corporationId,
                    tradeAccountId: this.item.tradeAccountId,
                    reportDate: utils.formatDate(this.item.reportDate),
                    instrumentId: row.instrumentId,
                    isBuy: row.isBuy
                  }).then(result => {
                    this.params = row
                    this.lastManipulationName = result.lastManipulationName
                    this.lastManipulationTime = result.lastManipulationTime
                    this.tradeOrPositionAccountData = result.reviewTradeRecordDetails
                    this.tradeOrPositionAccountingEntityData = result.reviewStatementRecordDetails
                  })
                }
              }
            },
            row.instrumentText
            )
          }
        },{
          title: '合约类型',
          align: 'center',
          minWidth: 120,
          key: 'financialInstrumentTypeName'
        },{
          title: '方向',
          align: 'center',
          minWidth: 80,
          render: (h, {row}) => h('span', row.isBuy ? '买' : '卖')
        },{
          title: '资金账户数据',
          align: 'center',
          children: [
            {
              title: '手数',
              align: 'center',
              minWidth: 120,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.tradeAccountPosition,
                  fixed: 0
                }
              })
            },{
              title: '成交均价',
              align: 'center',
              minWidth: 150,
              render: (h, {row,index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.tradeAccountPrice
                }
              })
            },{
              title: '成交金额',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.tradeAccountAmount
                }
              })
            },{
              title: '手续费',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.tradeAccountCommission
                }
              })
            }
          ]
        },{
          title: '利润中心数据',
          align: 'center',
          children: [
            {
              title: '手数',
              align: 'center',
              minWidth: 120,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.profitCenterPosition,
                  fixed: 0
                }
              })
            },{
              title: '成交均价',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.profitCenterPrice
                }
              })
            },{
              title: '成交金额',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.profitCenterAmount
                }
              })
            },{
              title: '手续费',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.profitCenterCommission
                }
              })
            }
          ]
        },{
          title: '差异',
          align: 'center',
          children: [
            {
              title: '手数',
              align: 'center',
              minWidth: 120,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.diffPosition,
                  fixed: 0
                }
              })
            },{
              title: '成交金额',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.diffAmount
                }
              })
            },{
              title: '手续费',
              align: 'center',
              minWidth: 150,
              render: (h, {row, index}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.diffCommission
                }
              })
            }
          ]
        }
      ],
      holdPositionReviewColumns: [
        {
          title: '合约',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            return h("a", {
              style: {
                textDecoration: 'underline',
              },
              on: {
                click: () => {
                  this.basicInfo = row
                  this.startLine = 0
                  this.reviewModal = true
                  this.isTradeRecord = false
                  this.acStatementRecordId = ''
                  api.listPositionDetailReview({
                    corporationId: this.item.corporationId,
                    tradeAccountId: this.item.tradeAccountId,
                    reportDate: utils.formatDate(this.item.reportDate),
                    instrumentId: row.instrumentId,
                  }).then(result => {
                    this.params = row
                    this.acStatementRecordId = result.acStatementRecordId
                    this.lastManipulationName = result.lastManipulatorName
                    this.lastManipulationTime = result.lastManipulationTime
                    this.tradeOrPositionAccountData = this.getDataGroup(result.tradePositionDetails)
                    this.tradeOrPositionAccountingEntityData = result.statementPositionDetails
                  })
                }
              }
            },
            row.instrumentText
            )
          }
        },{
          title: '合约类型',
          align: 'center',
          minWidth: 120,
          key: 'financialInstrumentTypeName'
        },{
          title: '资金账户净持数据',
          align: 'center',
          children: [
            {
              title: '方向',
              align: 'center',
              minWidth: 80,
              render: (h, {row}) => h('span', row.tradeAccountIsBuy ? '买' : '卖')
            },{
              title: '手数',
              align: 'center',
              minWidth: 120,
              render: (h, {index, row}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.tradeAccountPosition,
                  fixed: 0
                }
              })
            },{
              title: '数量',
              align: 'center',
              minWidth: 120,
              render: (h, {index, row}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.tradeAccountWeight,
                  fixed: 0
                }
              })
            }
          ]
        },{
          title: '利润中心净持记录',
          align: 'center',
          children: [
            {
              title: '方向',
              align: 'center',
              minWidth: 80,
              render: (h, {row}) => h('span', row.profitCenterIsBuy ? '买' : '卖')
            },{
              title: '手数',
              align: 'center',
              minWidth: 120,
              render: (h, {index, row}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.profitCenterPosition,
                  fixed: 0
                }
              })
            },{
              title: '数量',
              minWidth: 120,
              align: 'center',
              render: (h, {index, row}) => h('format-cell', {
                props: {
                  uniqKey: row.instrumentText + index,
                  num: row.profitCenterWeight,
                  fixed: 0
                }
              })
            }
          ]
        },{
          title: '差异',
          align: 'center',
          minWidth: 150,
          render: (h, {row, index}) => h('format-cell', {
            props: {
              uniqKey: row.instrumentText + index,
              num: row.diffPosition
            }
          })
        }
      ],
      tradeRecordReviewData: [],
      holdPositionReviewData: [],
      tradeOrPositionAccountData: [],
      tradeOrPositionAccountingEntityData: [],
    }
  },
  beforeMount() {
    this.item = JSON.parse(sessionStorage.getItem('setDataStatementRow'))
    this.isDiff = this.item.isDiff
    api.listDataReview({
      corporationId: this.item.corporationId,
      tradeAccountId: this.item.tradeAccountId,
      reportDate: utils.formatDate(this.item.reportDate)
    }).then(result => {
      this.tradeRecordReviewDataDeep = _.clone(result.reviewRecords)
      this.holdPositionReviewDataDeep = _.clone(result.reviewPositions)
      if(this.isDiff) {
        this.tradeRecordReviewData = result.reviewRecords.filter(item => item.isDiff)
        this.holdPositionReviewData = result.reviewPositions.filter(item => item.isDiff)
      } else {
        this.tradeRecordReviewData = result.reviewRecords
        this.holdPositionReviewData = result.reviewPositions
      }
    })
  },
  computed: {
    errTradeCounts() {
      let arr = this.tradeRecordReviewData.filter(item => item.isDiff)
      return arr.length
    },
    errPositionCounts() {
      let arr = this.holdPositionReviewData.filter(item => item.isDiff)
      return arr.length
    },
    accountTradeCounts() {
      let arr = this.tradeRecordReviewData.filter(item => item.tradeAccountPosition != 0)
      return arr.length
    },
    profitCenterTradeCounts() {
      let arr = this.tradeRecordReviewData.filter(item => item.profitCenterPosition != 0)
      return arr.length
    },
    accountPositionCounts() {
      let arr = this.holdPositionReviewData.filter(item => item.tradeAccountPosition != 0)
      return arr.length
    },
    profitCenterPositionCounts() {
      let arr = this.holdPositionReviewData.filter(item => item.profitCenterPosition != 0)
      return arr.length
    },
    contractDiff() {
      if(this.isTradeRecord) {
        return this.basicInfo.diffPosition || this.basicInfo.diffAmount || this.basicInfo.diffCommission
      } else {
        return this.basicInfo.diffPosition
      }
    },
    tradeOrPositionAccountColumns() {
      return this.isTradeRecord ? [
        {
          title: '合约',
          align: 'center',
          minWidth: 120,
          key: 'instrumentText'
        },{
          title: '合约类型',
          align: 'center',
          minWidth: 80,
          key: 'financialInstrumentTypeName'
        },{
          title: '方向',
          align: 'center',
          minWidth: 80,
          render: (h, {row}) => h('span', row.isBuy ? '买' : '卖')
        },{
          title: '成交价',
          align: 'center',
          minWidth: 150,
          className: this.params.profitCenterPrice - this.params.tradeAccountPrice !== 0 ? 'showDiff' : '',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.price
            }
          })
        },{
          title: '手数',
          align: 'center',
          key: 'position',
          minWidth: 120,
          className: this.params.diffPosition ? 'showDiff' : '',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.position,
              fixed: 0
            }
          })
        },{
          title: '成交金额',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.amount
            }
          })
        },{
          title: '手续费',
          align: 'center',
          minWidth: 150,
          className: this.params.diffCommission ? 'showDiff' : '',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.commission
            }
          })
        },{
          title: '成交时间',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => h('span', utils.formatDate(row.tradeTime, 'YYYY-MM-DD HH:mm:ss'))
        },{
          title: '操作',
          align: 'center',
          minWidth: 60,
          render: (h, {row}) => h("div", [
            h(
              "Tooltip",
              {
                props: {
                  content: "编辑",
                  placement: "top",
                  transfer: true
                }
              },
              [
                h("Button", {
                  props: {
                    size: "small",
                    icon: "md-create",

                  },
                  style: {
                    marginRight: "3px",
                    display: this.isShow('H_UpdateAcStatementFutureTradeRecord') && row.dataSourceType === 0 ? 'block' : 'none'
                  },
                  on: {
                    click: () => {
                      const {href} = this.$router.resolve({name: 'StatementFutureTradeEdit', query: {id: row.id}})
                      window.open(href, '_blank')
                      // this.$router.resolve('StatementFutureTradeEdit', row)
                    }
                  }
                })
              ]
            )
          ])
        }
      ] : [
        {
          title: '合约',
          align: 'center',
          minWidth: 120,
          key: 'instrumentText'
        },{
          title: '合约类型',
          align: 'center',
          minWidth: 80,
          key: 'financialInstrumentTypeName'
        },{
          title: '买持仓',
          align: 'center',
          key: 'buyPosition',
          minWidth: 80,
          render: (h, {row}) => _.isNil(row.buyPosition) ? '' : h('format-cell', {
            props: {
              fixed: 0,
              num: row.buyPosition
            }
          })
        },{
          title: '买均价',
          align: 'center',
          key: 'buyAveragePrice',
          minWidth: 150,
          render: (h, {row}) => _.isNil(row.buyAveragePrice) ? '' : h('format-cell', {
            props: {
              fixed: 0,
              num: row.buyAveragePrice
            }
          })
        },{
          title: '卖持仓',
          align: 'center',
          key: 'salePosition',
          minWidth: 120,
          render: (h, {row}) => _.isNil(row.salePosition) ? '' : h('format-cell', {
            props: {
              fixed: 0,
              num: row.salePosition
            }
          })
        },{
          title: '卖均价',
          align: 'center',
          minWidth: 150,
          key: 'saleAveragePrice',
          render: (h, {row}) => _.isNil(row.saleAveragePrice) ? '' : h('format-cell', {
            props: {
              fixed: 0,
              num:  row.saleAveragePrice
            }
          })
        },{
          title: '净持仓',
          align: 'center',
          minWidth: 120,
          key: 'netPosition',
          render: (h, {row}) => _.isNil(row.netPosition) ? '' : h('format-cell',  {
            props: {
              fixed: 0,
              num: row.netPosition
            }
          })
        }
      ]
    },
    tradeOrPositionAccountingEntityColumns() {
      return this.isTradeRecord ? [
        {
          title: '合约',
          align: 'center',
          minWidth: 120,
          key: 'instrumentText'
        },{
          title: '合约类型',
          align: 'center',
          minWidth: 80,
          key: 'financialInstrumentTypeName'
        },{
          title: '方向',
          align: 'center',
          minWidth: 80,
          render: (h, {row}) => h('span', row.isBuy ? '买' : '卖')
        },{
          title: '成交价',
          align: 'center',
          key: 'price',
          minWidth: 150,
          className: this.params.profitCenterPrice - this.params.tradeAccountPrice !== 0 ? 'showDiff' : '',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.price
            }
          })
        },{
          title: '手数',
          align: 'center',
          key: 'position',
          minWidth: 120,
          className: this.params.diffPosition ? 'showDiff' : '',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.position,
              fixed: 0
            }
          })
        },{
          title: '成交金额',
          align: 'center',
          minWidth: 150,
          key: 'amount',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.amount
            }
          })
        },{
          title: '手续费',
          align: 'center',
          minWidth: 150,
          key: 'commission',
          className: this.params.diffCommission ? 'showDiff' : '',
          render: (h, {row}) => h('format-cell', {
            props: {
              num: row.commission
            }
          })
        },{
          title: '利润中心',
          align: 'center',
          minWidth: 120,
          key: 'accountingEntityName'
        },{
          title: '成交时间',
          align: 'center',
          minWidth: 150,
          render: (h, {row}) => h('span', utils.formatDate(row.tradeTime, 'YYYY-MM-DD HH:mm:ss'))
        },{
          title: '更新人',
          align: 'center',
          minWidth: 80,
          key: 'lastManipulationName'
        },{
          title: '更新时间',
          align: 'center',      
          minWidth: 150,  
          render: (h, {row}) => h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
        },{
          title: '操作',
          align: 'center',
          minWidth: 60,
          render: (h, {row}) => h("div", [
            h(
              "Tooltip",
              {
                props: {
                  content: "编辑",
                  placement: "top",
                  transfer: true
                }
              },
              [
                h("Button", {
                  props: {
                    size: "small",
                    icon: "md-create",

                  },
                  style: {
                    marginRight: "3px",
                    display: this.isShow('H_UpdateAcFutureTradeRecord') && row.dataSourceType === 0 ? 'block' : 'none'
                  },
                  on: {
                    click: () => {
                      // this.$router.resolve('FutureTradeRecordEdit', row)
                      const {href} = this.$router.resolve({name: 'FutureTradeRecordEdit', query: {id: row.id}})
                      window.open(href, '_blank')
                    }
                  }
                })
              ]
            )
          ])
        }
      ] : [
        {
          title: '合约',
          align: 'center',
          minWidth: 120,
          key: 'instrumentText'
        },{
          title: '合约类型',
          align: 'center',
          minWidth: 80,
          key: 'financialInstrumentTypeName'
        },{
          title: '持仓方向',
          align: 'center',
          minWidth: 80,
          render: (h, {row}) => h('span', row.isBuy ? '买' : '卖')
        },{
          title: '持仓手数',
          align: 'center',
          minWidth: 80,
          key: 'position',
          render: (h, {row}) => h('format-cell', {
            props: {
              fixed: 0,
              num: utils.formatNum(row.position)
            }
          })
        },{
          title: '利润中心',
          align: 'center',
          minWidth: 120,
          key: 'accountingEntityName'
        },{
          title: '更新时间',
          align: 'center',
          minWidth: 150,   
          render: (h, {row}) => h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))

          
        },{
          title: '净持仓',
          align: 'center',
          minWidth: 120,
          key: 'netPosition',
          render: (h, {row}) => h('format-cell', {
            props: {
              fixed: 0,
              num: utils.formatNum(row.netPosition)
            }
          })
        }
      ]
    }
  },
  methods: {
    change() {
      this.tradeRecordReviewData = []
      this.holdPositionReviewData = []
      if(this.isDiff) {
        this.tradeRecordReviewData = this.tradeRecordReviewDataDeep.filter(item => item.isDiff)
        this.holdPositionReviewData = this.holdPositionReviewDataDeep.filter(item => item.isDiff)
      } else {
        this.tradeRecordReviewData = this.tradeRecordReviewDataDeep
        this.holdPositionReviewData = this.holdPositionReviewDataDeep
      }
    },
    modalConfirm() {
      this.tradeOrPositionAccountData = []
      this.tradeOrPositionAccountingEntityData = []
    },
    modalCancel() {
      this.tradeOrPositionAccountData = []
      this.tradeOrPositionAccountingEntityData = []
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      if(!this.isTradeRecord){
        let currencyGroup = this.groupByObj[row.instrumentId]
        let length = currencyGroup.length
        if(this.startLine + length === rowIndex) this.startLine += length - 1
        if(rowIndex === this.startLine && columnIndex === 6) {
          return {
            rowspan: length,
            colspan: 1
          }
        } else if (rowIndex > this.startLine && rowIndex < this.startLine + length && columnIndex === 6) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    gotoByPath(route){
      if(this.acStatementRecordId) {
        const {href} = this.$router.resolve({path: route + this.acStatementRecordId})
        window.open(href, '_blank')
      }
    },
    goto(routeName) {
      const {href} = this.$router.resolve({name: routeName, query: {
        tradeAccountId: this.item.tradeAccountId,
        reportDate: utils.formatDate(this.item.reportDate),
        isBuy: this.params.isBuy,
        instrumentId: this.params.instrumentId,
        if: this.params.acStatementRecordId
      }})
      window.open(href, '_blank')
    },
    getRed(val) {
      return val < 0 ? '#ff0000' : '#000000'
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    getDataGroup(arr) {
      let result = []
      this.groupByObj = _.groupBy(arr, 'instrumentId')
      for (let key in this.groupByObj) {
        result.push(...this.groupByObj[key])
      }
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  font-size: 14px;
  p.title-info {
    margin-top: 25px;
    font-size: 17px;
    font-weight: 600;
  }
  .header-oper {
    display: flex;
    align-items: center;
    margin: 20px 0;
    span {
      margin-right: 10px;
    }
    .switch-button {
      margin: 0 12px;
    }
  }
}
.float-icon {
  font-size: 22px;
  color: rgba(255, 141, 26, 1);
  font-weight: 600;
}
.err-info {
  color: #ff0000;
  margin-bottom: -10px;
  p {
    margin: 5px 0;
  }
}
.has-diff {
  display: inline-block;
  background-color: rgba(255, 141, 26, 1);
}
.no-diff {
  display: inline-block;
  background-color: rgba(67, 207, 124, 1);
}
.table-title-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  .table-title-info > span {
    margin: 0 7px;
  }
  span, a {
    font-size: 14px;
  } 
  > span {
   font-size: 17px;
   font-weight: bold; 
  }
  a {
    text-decoration: underline;
  }
}
.review-table {
  margin-top: 15px;
}
.no-wrap {
  white-space: nowrap;
}
.diff-table /deep/ td.showDiff {
  background-color: rgba(255, 141, 26, 1);
  color: #fff;
}
</style>