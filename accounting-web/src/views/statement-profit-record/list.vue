<template>
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
        <DatePicker type="daterange"
                    placement="bottom-start"
                    placeholder="复核日期"
                    title="复核日期"
                    v-model="query.dateRange"
        />
      </Col>
      
    </Row>
    </qc-collapse>
    <div style="height:35px">
        <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3 pull-right">搜索</Button>
        <Button icon="md-close-circle" @click="doResetQuery" class="margin-right-3 pull-right">清空</Button>

    </div>
    <Table
      :span-method="handleSpan"
      border
      :columns="columns"
      :data="statementProfitDetails"
      size="small"
      v-maxHeight
      :bottomDistance="150"
      disabled-hover>
    </Table>
    <Divider></Divider>
    <p class="content vT hL" style="color: #ff8d1a">备注：<br>1.&nbsp;区间盈亏&nbsp;=&nbsp;区间平仓盈亏&nbsp;+&nbsp;期末浮动盈亏&nbsp;-&nbsp;期初浮动盈亏&nbsp;-&nbsp;区间费用&nbsp;<br>2.&nbsp;当前报表的统计币种为交易币种</p>
  </div>
</template>

<script>
  import api from './api';
  import moment from 'moment';
  import { utils } from '@/utils/utils'

  export default {
    data () {
      return {
        columns: [
          {
            title: '资金账户',
            key: 'tradeAccountName',
            minWidth: 120,
            align: 'center',
            render: (h, param) => {
              if(param.row.tradeAccountId) return h('div', param.row.tradeAccountName + '(' + utils.showText(this.commonData.currency,param.row.currencyId) + ')')
              return h('div', param.row.tradeAccountName)
            }
          },
          {
            title: '品类',
            key: 'commodityTypeName',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '交易所',
            key: 'exchangeName',
            minWidth: 100,
            align: 'center'
          },
          {
            title: '区间平仓盈亏',
            key: 'intervalClosePnL',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.intervalClosePnL
              }
            })
          },
          {
            title: '区间费用',
            key: 'intervalTradeCost',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.intervalTradeCost
              }
            })
          },
          {
            title: '期初浮动盈亏',
            key: 'startPositionPnL',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.startPositionPnL
              }
            })
          },
          {
            title: '期末浮动盈亏',
            key: 'endPositionPnL',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.endPositionPnL
              }
            })
          },
          {
            title: '区间盈亏',
            key: 'intervalProfit',
            minWidth: 120,
            align: 'right',
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.intervalProfit
              }
            })
          }
        ],
        dataList: [],
        query: {
          corporationId: '',
          tradeAccountId: '',
          dateRange: moment().format('D') < 15 ? [moment().subtract(1, 'months').set('date', 1).format('yyyy-MM-DD'), moment().startOf('month').subtract(1, 'day').format('yyyy-MM-DD')] : [moment().set('date', 1).format('yyyy-MM-DD'), moment().format('yyyy-MM-DD')],
        },
        defaultQuery: {
          corporationId: '',
          tradeAccountId: '',
          dateRange: moment().format('D') < 15 ? [moment().subtract(1, 'months').set('date', 1).format('yyyy-MM-DD'), moment().startOf('month').subtract(1, 'day').format('yyyy-MM-DD')] : [moment().set('date', 1).format('yyyy-MM-DD'), moment().format('yyyy-MM-DD')],
        },
        commonData: {
          corporations: [],
          tradeAccounts: []
        },
        statementProfitDetails: [],
        statementProfitSummaries: []
      };
    },
    async mounted () {
      this.query = this.utils.saveQuery(this.query, 'get');
      await this.getCommonData();
      // await this.search();
    },
    methods: {
      handleSpan ({ row, column, rowIndex, columnIndex }) {
        if(columnIndex <3) {
          let length = 0;
          let preItems = [];
          for (let key in this.group1) {
            let groupByAccountIdItem = this.group1[key]
            for (let keySe in groupByAccountIdItem) {
              let item = groupByAccountIdItem[keySe];
              length += item.length;
              let start = preItems.length;
              preItems.push(...item);
              for (let i = start; i < length; i++) {
                if (rowIndex == i && columnIndex === 0) {
                  if (i == start) {
                    return [item.length, 1];
                  } else {
                    return [0, 0];
                  }
                }
                if (rowIndex === length - 1 && columnIndex === 1) {
                  return [1, 2];
                }
                if (rowIndex === length - 1 && columnIndex === 2) {
                  return [0, 0];
                }
              }
            }
          }
          if (rowIndex === length && columnIndex === 0) {
            return [this.statementProfitSummaries.length, 2]
          }

          if (rowIndex > length && columnIndex === 0) {
            return [0, 0]
          }

          if (rowIndex > length-1 && columnIndex === 1) {
            return [0, 0]
          }
        }
      },
      doResetQuery() {
        this.query = Object.assign({}, this.defaultQuery);
      },
      async getCommonData () {
        this.commonData = await api.getCommonData();
      },
      onSearch() {
        this.search();
      },
      async search () {
        this.statementProfitSummaries = []
        this.statementProfitDetails = []
        this.utils.saveQuery(this.query);
        const query = Object.assign({}, this.query);
        query.reportStartDate = this.query.dateRange[0];
        query.reportEndDate = this.query.dateRange[1];
        if(query.reportStartDate || query.reportEndDate) {
          this.isLoading = true;
          let { statementProfitDetails, statementProfitSummaries, tradeAccountTotalCount } = await api.list({ ...query, dateRange: '' }).finally(() => {
            this.isLoading = false;
          });
          let groupList = _.cloneDeep(statementProfitDetails).map(item => {
            item.tradeAccountId = 'qc_' + item.tradeAccountId;
            return item;
          });
          let arr = [];
          let group = _.groupBy(groupList, 'tradeAccountId');
          for(let key in group) {
            let groupByCurrencyId = _.groupBy(group[key], 'currencyId')
            group[key] = groupByCurrencyId
          }
          _.forEach(Object.keys(group), tradeAccountIdkey => {
            _.forEach(Object.keys(group[tradeAccountIdkey]), o => { //currencyIdkey
            console.log(group[tradeAccountIdkey])
              let item = group[tradeAccountIdkey][o][0]
              arr.push(...group[tradeAccountIdkey][o]);
              const obj = {
                commodityTypeId: "",
                commodityTypeName: `小计（共${group[tradeAccountIdkey][o].length}项）`,
                currencyId: item.currencyId,
                currencyName:  item.currencyName,
                endClosePnL: item.endClosePnL,
                endPositionPnL: _.sumBy(group[tradeAccountIdkey][o], 'endPositionPnL'),
                endTradeCost: item.endTradeCost,
                exchangeId: "",
                exchangeName: "",
                intervalClosePnL: _.sumBy(group[tradeAccountIdkey][o], 'intervalClosePnL'),
                intervalPositionPnL: item.intervalPositionPnL,
                intervalProfit: _.sumBy(group[tradeAccountIdkey][o], 'intervalProfit'),
                intervalTradeCost: _.sumBy(group[tradeAccountIdkey][o], 'intervalTradeCost'),
                startClosePnL: item.startClosePnL,
                startPositionPnL: _.sumBy(group[tradeAccountIdkey][o], 'startPositionPnL'),
                startTradeCost: item.startTradeCost,
                tradeAccountId: item.tradeAccountId,
                tradeAccountName: "",
              };
              group[tradeAccountIdkey][o].push(obj);
              arr.push(obj);
            })
          })
          _.forEach(statementProfitSummaries, o => {
            o.commodityTypeId = '';
            o.commodityTypeName = '';
            o.endClosePnL = 0;
            o.endTradeCost = 0;
            o.exchangeId = 0;
            o.exchangeName = utils.showText(this.commonData.currency, o.currencyId);
            o.intervalPositionPnL = null;
            o.startClosePnL = 0;
            o.startTradeCost = 0;
            o.tradeAccountId = 0;
            o.tradeAccountName = `总计（共${tradeAccountTotalCount}个资金账户）`;
          });
          this.statementProfitSummaries = statementProfitSummaries;
          this.statementProfitDetails = arr.concat(statementProfitSummaries);
          this.group1 = group;
        } else {
          this.$Message.warning('复核日期不能为空')
        }
      }
    }
  };
</script>

<style lang="less" scoped>
.float-right {
  float: right;
  margin-left: 5px;
}
</style>
