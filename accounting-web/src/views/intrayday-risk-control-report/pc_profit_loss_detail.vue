<template>
  <Modal
    v-model="showmodel"
    title="利润中心资金明细"
    width="70%"
    @on-ok="asyncOK">
    <p slot="header">
      <span>利润中心资金明细</span>
    </p>
    <Form
      :model="formItem"
      ref="EditForm" :label-width="100">
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
      <Row type="flex" :gutter="4">
        <Col span="12" class-name="margin-bottom-10">
          <FormItem label="修改原因" prop='note' required>
            <Input v-model="formItem.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <p class="warning">提示：利润中心历史平仓盈亏和历史平仓盈亏（本币）为实时修改，修改后会影响交易端的总盈亏。</p>
    <div slot="footer">
      <Button type="default" class="margin-right-3" @click="showmodel = false">返回</Button>
      <Button type="primary" @click="onSave">保存</Button>
    </div>
  </Modal>
</template>
<script>
  import api from './api';
  import { utils } from '@/utils/utils';

  export default {
    data () {
      return {
        showmodel: false,
        formItem: {
          note: '',
          totalHistoryCloseProfit: null

        },
        itemRules: {
          totalHistoryCloseProfit: [
            { required: true }
          ],
          note: [
            { required: true }
          ],
        },
        columns: [
          {
            title: "币种",
            key: "currencyId",
            align: "center",
            minWidth: 80
          },
          {
            title: "保证金",
            key: "usedMargin",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.usedMargin
                  }
                },
              )
            }
          },
          {
            title: "冻结保证金",
            key: "frozenMargin",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.frozenMargin
                  }
                },
              )
            }
          },
          {
            title: "浮动盈亏",
            key: "postionPnLByTrade ",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.postionPnLByTrade
                  }
                },
              )
            }
          },
          {
            title: "平仓盈亏",
            key: "todayCloseProfitByTrade",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.todayCloseProfitByTrade
                  }
                },
              )
            }
          },
          {
            title: "历史平仓盈亏",
            key: "historyCloseProfitByTrade",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              let self = this;
              return h("div", {
                style: {
                  textAlign: 'right'
                }
              }, [
                h("FormatCell", {
                  props:{
                    num: params.row.oldHistoryCloseProfitByTrade
                  },
                  style: {
                    display: params.row.isEdit ? 'none' : 'block'
                  }
                }),
                h("Input", {
                  style: {
                    display: !params.row.isEdit ? 'none' : 'block'
                  },
                  props: {
                    type: 'number',
                    value: params.row.historyCloseProfitByTrade
                  },
                  on: {
                    input: function (value) {
                      self.$set(self.list[params.row._index], 'historyCloseProfitByTrade', value);
                    }
                  }
                })
              ])
            }
          },
          {
            title: "总盈亏",
            key: "totalPnLByTrade",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.totalPnLByTrade
                  }
                },
              )
            }
          },
          {
            title: "权利金",
            key: "cashIn",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.cashIn
                  }
                },
              )
            }
          },
          {
            title: "冻结权利金",
            key: "frozenCashIn",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.frozenCashIn
                  }
                },
              )
            }
          },
          {
            title: "保证金（本币）",
            key: "usedMarginByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.usedMarginByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "冻结保证金（本币）",
            key: "frozenMarginByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.frozenMarginByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "浮动盈亏（本币）",
            key: "postionPnLByTradeByFuncCurrency ",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.postionPnLByTradeByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "平仓盈亏（本币）",
            key: "todayCloseProfitByTradeByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.todayCloseProfitByTradeByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "历史平仓盈亏（本币）",
            key: "historyCloseProfitByTradeByFuncCurrency",
            minWidth: 150,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.historyCloseProfitByTradeByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "总盈亏（本币）",
            key: "totalPnLByTradeByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.totalPnLByTradeByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "权利金（本币）",
            key: "cashInByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.cashInByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: "冻结权利金（本币）",
            key: "frozenCashInByFuncCurrency",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "FormatCell",{
                  props:{
                    num: params.row.frozenCashInByFuncCurrency
                  }
                },
              )
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (h, params) => {
              let self = this
              return h('div', [
                h(
                  'Tooltip',
                  {
                    props: {
                      content: params.row.isEdit ? '取消编辑' : '编辑',
                      placement: 'top',
                      transfer: true
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        size: 'small',
                        icon: params.row.isEdit ? 'md-undo' : 'md-create'
                      },
                      style: {
                        marginRight: '3px',
                        display: this.isShow('H_UpdateProfitCenterPnLReport') ? 'block' : 'none'
                      },
                      on: {
                        click: (e) => {
                          if (params.row.isEdit) {
                            params.row.historyCloseProfitByTradeByFuncCurrency = null;
                            params.row.historyCloseProfitByTrade = null;
                          } else {
                            params.row.historyCloseProfitByTradeByFuncCurrency = params.row.oldHistoryCloseProfitByTradeByFuncCurrency;
                            params.row.historyCloseProfitByTrade = params.row.oldHistoryCloseProfitByTrade;
                          }
                          params.row.isEdit = !params.row.isEdit;
                          self.list[params.row._index] = params.row;
                        }
                      }
                    })
                  ]
                )
              ]);
            }
          }
        ],
        tableLoading: false,
        list: [],
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
      asyncOK () {

      },
      isShow (permission) {
        return utils.hasPermission(permission);
      },
      async onSave () {
        if (!(await this.validate())) {
          return;
        }
        try {
          await api.savePC_ProfitLossDetails({ PC_ProfitLossDetailViewModels: _.filter(this.list, o => o.isEdit), note: this.formItem.note });
          this.showmodel = false;
          this.$emit('search');
        } catch (e) {
        }
      },
      validate () {
        return this.$refs['EditForm'].validate(valid => valid);
      },
      async show (row) {
        this.$refs['EditForm'].resetFields();
        this.showmodel = true;
        this.tableLoading = true;
        let { list } = await api.listPC_ProfitLossDetail(
          {
            accountId: row.accountId,
            currencyId: row.currencyId
          }
        );
        // let list = [
        //   {
        //     currency: 'dscxdsz',
        //     usedMargin: -474,
        //     frozenMargin: 471,
        //     totalPostionPnL: 275,
        //     todayCloseProfitByTrade: 47,
        //     historyCloseProfitByTrade: 8888,
        //     totalCloseProfitByTrade: 474,
        //     cashIn: 47,
        //     frozenCashIn: 474,
        //     usedMarginByFuncCurrency: 2585,
        //     frozenMarginByFuncCurrency: 575,
        //     totalPostionPnLByFuncCurrency: 7687,
        //     todayCloseProfitByTradeByFuncCurrency: 78,
        //     historyCloseProfitByTradeByFuncCurrency: 57,
        //     totalCloseProfitByTradeByFuncCurrency: 7578,
        //     cashInByFuncCurrency: 75,
        //     frozenCashInByFuncCurrency: 768,
        //     oldHistoryCloseProfitByTradeByFuncCurrency: 7425,
        //     oldHistoryCloseProfitByTrade: 455
        //   }
        // ];
        this.tableLoading = false;
        _.forEach(list, o => {
          o.oldHistoryCloseProfitByTrade = o.historyCloseProfitByTrade;
          o.isEdit = false
        });
        this.list = list;
      }
    }
  };
</script>
<style lang="less" scoped>
  .warning {
    color: red
  }
</style>
