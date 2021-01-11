<template>
  <Modal
    v-model="showmodel"
    title="结算价引用"
    width='70%'
    :mask-closable= 'false'
   
    @on-cancel="showmodel=false"
    @on-ok="asyncOK">
    <Form
      label-position="left"
      :model="query"
      :label-width="15"
      :rules='rules'
      ref="ManageForm"
    >
     <Row type="flex" :gutter="16">
        <Col :span='8' class-name="margin-bottom-10">
        <FormItem  label=" " prop='pricingDateRange'> 
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="结算日期"
            transfer
            v-model="query.pricingDateRange"
            
          ></DatePicker>
          </FormItem>
        </Col>
         <Col :span='6' class-name="margin-bottom-10">
          <Select placeholder="资金账户" transfer title="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option v-for="(item, index) in commonData.tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Button type="primary" icon="md-search"  class="margin-right-3" @click="querySettlementPriceQuotationList()">搜索</Button>
      </Row>
        </Form>
       <Table
        size="small"
        border
        max-height= '65vh'
        class="margin-bottom-10"
        :columns="columns"
        :data="list"
        @on-selection-change="tableSelectHandle"
      ></Table>
       <div slot="footer">
            <div class="footer_tip">
             <svg t="1600163615246" style="margin-right:10px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2917" width="20" height="20"><path d="M512 14.208c274.56 0 497.792 223.168 497.792 497.792 0 274.56-223.168 497.792-497.792 497.792C237.44 1009.792 14.208 786.56 14.208 512 14.208 237.44 237.44 14.208 512 14.208z m0 71.104A427.072 427.072 0 0 0 85.312 512 427.072 427.072 0 0 0 512 938.688 427.072 427.072 0 0 0 938.688 512 427.072 427.072 0 0 0 512 85.312z m35.584 628.16v71.104H476.416v-71.04h71.168z m0-474.048v402.944H476.416V239.424h71.168z" p-id="2918" fill="#eb9c04"></path></svg>
              <div>
                 结算价引用将会将查询到的行情数据默认作为行情日期的结算价行情录入系统；<br>此功能只添加缺失行情，不做删除和修改；如果存在资金账户间行情冲突，系统默认取最近更新的资金账户的行情数据。
              </div>
             
            </div>
            <Button  size="large"  @click="showmodel=false">取消</Button>
            <Button type="primary" size="large" :disabled='!selection.length'  @click="save">确认</Button>
        </div>
  </Modal>
</template>
<script>
import api from "./api";
import { utils } from "@/utils/utils";
import { FormItem } from 'view-design';
let getNumOfMouthDays = () => {
  var curDate = new Date();
  /* 获取当前月份 */
  var curMonth = curDate.getMonth();
  /* 生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
  curDate.setMonth(curMonth + 1);
  /* 由curMouth 加了1，所以这个是 curDate 是下个月的，setDate(0)之后就是这个月的最后一天 */
  // setDate()方法用來設定日期物件中本地時間的日，也就是每個月中的幾號，傳入參數是一個1~31的整數。
  // 若是傳入的值超出當月份的正常範圍，setDate()方法也會依據超出的數值進行計算，
  // 譬如setDate(0)會讓日期變成前一個月的最後一天，setDate(-1)會讓日期變成前一個月的倒數第二天。
  // 若當月有31天，那setDate(32)會讓日期變成下個月的第一天。
  curDate.setDate(0);
  /* 返回当月的天数 */
   return curDate.getDate();
}
export default {
  props: {
    commonData:{
      type:Object,
      default: () =>{}
    }
  },
  data() {
    let validator= (rule, value, cb) => {
      if((new Date(value[1]).getTime() - new Date(value[0]).getTime()) >= 31 * 24 * 3600 * 1000) {
        cb(Error('最多选择一个月'))
      }
      cb()
    }
    return {
      query: {
        pricingDateRange: [],
        tradingStrategyId: ''
      },
      showmodel: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: "left",
          align: 'center',
        },
        {
          title: "行情/结算日期",
          key: "quoteDate",
          align: "center",
          minWidth: 160,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.quoteDate));
          }
        },
        {
          title: "资金账户",
          key: "tradeAccountName",
          align: "center",
          minWidth: 150
        },
        {
          title: "更新时间",
          key: "lastManipulationTime",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "span",
              utils.formatDate(
                params.row.lastManipulationTime,
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        },
        {
          title: "可用结算价合约",
          key: "instrumentCodes",
          align: "center",
          minWidth: 150
        },
      ],
      list: [],
      selection: [],
      rules: {
        pricingDateRange: [
          {
            required: true, validator: (rule, value, cb) => {
              if(!value[1] || !value[0]) {
                return cb(Error('请选择结算日期'))
              }
              cb()
            }
          },
          {
            validator: validator, trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    asyncOK() {

    },
    show(row) {
     this.query.pricingDateRange = [
      this.utils.formatDate(moment()),
      this.utils.formatDate(moment())
    ];
      this.showmodel = true
      this.querySettlementPriceQuotationList()
    },
    querySettlementPriceQuotationList() {
      this.$refs.ManageForm.validate(async validate => {
        if(validate) {
          this.selection = []
          this.query.statementDateBegin = this.utils.formatDate(this.query.pricingDateRange[0])
          this.query.statementDateEnd = this.utils.formatDate(this.query.pricingDateRange[1])
          
          let data = await api.querySettlementPriceQuotationList(this.query);
          this.list = data
        }
      })
    },
    tableSelectHandle(e) {
       this.selection= e.map(item => item.id)
    },
    async save() {
      let {failedCount, successCount, totalFeedCount} = await api.save(this.selection)
      this.$Modal.success({
        title: '提交结果',
        content: `总计${totalFeedCount}条行情记录，成功新增${successCount}条，${failedCount}条失败。可前往市场行情平台->合约行情查看明细`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          this.showmodel = false;
        }
      });
    }
  }
}
</script>

<style lang="less">
  .footer_tip{
    float: left;
    color:rgba(255, 141, 26, 1);
    text-align: left;
    display: flex;
    align-items: center;
  }
</style>