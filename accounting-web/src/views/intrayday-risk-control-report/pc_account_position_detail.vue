<template>
  <Modal
    v-model="showmodel"
    title="利润中心持仓明细"
    width='70%'
  >
    <p slot="header" style="text-align:center">
      <Icon type="ios-flash" style="color: orange"/>
      <span>利润中心持仓明细</span>
    </p>
    <Table
      size="small"
      border
      ref="table"
      class="margin-bottom-10"
      :loading="tableLoading"
      :columns="columns"
      :data="list"
      height="400"
    ></Table>
    <div slot="footer">
      <Button type="default" class="margin-right-3" @click="showmodel = false">返回</Button>
    </div>
  </Modal>
</template>
<script>
  import api from './api';
  import { utils } from '@/utils/utils';

  export default {
    data () {
      return {
        tableLoading: false,
        columns: [
          {
            title: '利润中心',
            key: 'accountName',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h(
                'span',
                utils.showText(
                  this.commonData.profitCenters,
                  params.row.accountId,
                  null,
                  'code'
                )
              );
            }
          },
          {
            title: '资金账户',
            key: 'agentCode',
            align: 'center',
            minWidth: 120,
            render: (h, params) => {
              return h(
                'span',
                utils.showText(
                  this.commonData.tradeAccounts,
                  params.row.agentId,
                  null,
                  'code'
                )
              );
            }
          },
          {
            title: '合约',
            key: 'instrumentCode',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '买卖',
            key: 'isPurchase',
            align: 'center',
            minWidth: 80,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    color: params.row.isPurchase
                      ? 'rgba(252, 2, 34, 1)'
                      : 'rgba(2, 248, 79, 1)'
                  }
                },
                params.row.isPurchase ? '买' : '卖'
              );
            }
          },
          {
            title: '手数',
            align: 'center',
            minWidth: 120,
            key: 'volume',
            render: (h, { row }) => h('format-cell', {
              props: {
                fixed: 0,
                num: utils.formatNum(Number(row.volume) - Number(row.closeVolume))
              }
            })
          },
          {
            title: '开仓价格',
            key: 'openPrice',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'FormatCell', {
                  props: {
                    num: params.row.openPrice
                  }
                },
              );
            }
          },
          {
            title: '开仓时间',
            key: 'openTime',
            minWidth: 120,
            align: 'center',
            render: (h, params) => h('span', utils.formatDate(params.row.openTime, 'YYYY-MM-DD HH:mm:ss')),
          },
          {
            title: '持仓类型',
            key: 'isHistory',
            minWidth: 120,
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                params.row.isHistory ? '昨仓' : '今仓'
              );
            }
          },
          {
            title: '投保',
            minWidth: 80,
            key: 'isHedge',
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                params.row.isHedge ? '保值' : '投机'
              );
            }
          },
          {
            title: '成交编号',
            minWidth: 120,
            key: 'openFillReference',
            align: 'center'
          },
          {
            title: '币种',
            key: 'currencyId',
            minWidth: 80,
            align: 'center',
          },
          {
            title: '交易所',
            key: 'exchangeName',
            minWidth: 120,
            align: 'center'
          }
        ],
        list: [],
        showmodel: false
      };
    },
    props: {
      commonData: {
        type: Object,
        default: () => {
        }
      }
    },
    methods: {
      async show (row) {
        this.showmodel = true;
        this.tableLoading = true;
        let { list } = await api.listAccountPositionDetail(
          {
            accountId: row.accountId,
            agentId: row.agentId,
            instrumentId: row.instrumentId,
            isPurchase: row.isPurchase,
            isHedge: row.isHedge
          }
        );
        this.tableLoading = false;
        this.list = list;
      }
    }
  };
</script>
