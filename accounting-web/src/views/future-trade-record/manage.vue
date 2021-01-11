<template>
  <div>
    <Form
      :label-width="120"
      label-position="right"
      id="ManageForm"
      :model="item"
      :rules="itemRules"
      ref="ManageForm"
    >
      <Row type="flex" :gutter="4">
        <template v-if="batch">
          <Col :span="24"><h2>虚拟交易</h2></Col>
          <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
            <FormItem label="利润中心(买方)" prop="accountingEntityIdBuy" required>
              <Select placeholder filterable clearable v-model="item.accountingEntityIdBuy">
                <Option
                  v-for="(item, index) in accountingEntities"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{item.value}} - {{item.text}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
            <FormItem label="利润中心(卖方)" prop="accountingEntityIdSell" required>
              <Select placeholder filterable clearable v-model="item.accountingEntityIdSell">
                <Option
                  v-for="(item, index) in accountingEntities"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{item.value}} - {{item.text}}</Option>
              </Select>
            </FormItem>
          </Col>
        </template>
        <Col span="24" class-name="margin-bottom-10">
          <Row type="flex" :gutter="16">
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="交易日期" prop="tradeDate" :required="!editMore">
                <DatePicker
                  type="date"
                  confirm
                  placement="bottom-end"
                  placeholder
                  v-model="item.tradeDate"
                  :options="tradeDateOptions"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!batch">
              <FormItem label="利润中心" prop="accountingEntityId" :required="!editMore">
                <Select placeholder filterable clearable v-model="item.accountingEntityId" @on-change="accountingEntityChange">
                  <Option
                    v-for="(item, index) in accountingEntities"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!batch">
              <FormItem label="策略" prop="tradingStrategyId">
                <Select placeholder filterable clearable v-model="item.tradingStrategyId">
                  <Option
                    v-for="(item, index) in accountStrategies"
                    :label="item.name"
                    :value="item.tradingStrategyId"
                    :key="index"
                  >{{item.tradingStrategyId}} - {{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="资金账户" prop="tradeAccountId" :required="!editMore">
                <Select placeholder filterable clearable v-model="item.tradeAccountId">
                  <Option
                    v-for="(item, index) in tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="子账户" prop="tradeAccountId">
                <Input type="text" :rows="2" v-model="item.subAccount"/>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!editMore">
              <FormItem label="标准合约" prop="instrumentCategoryId" :required="!editMore">
                <Select placeholder filterable clearable v-model="item.instrumentCategoryId">
                  <Option
                    v-for="(item, index) in (commonData.instrumentCategories && commonData.instrumentCategories.filter(val => !val.isDisabled))"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!editMore">
              <FormItem label="具体合约" prop="instrumentId" :required="!editMore">
                <InstrumentSelect :filterQuery="instrumentQuery" v-model="item.instrumentId"></InstrumentSelect>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="成交手数" prop="volume" :required="!editMore">
                <InputNumber style="width: 100%;" :min="0" v-model="item.volume"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="成交价格" prop="price" :required="!editMore">
                <InputNumber style="width: 100%;" :min="0" v-model="item.price"></InputNumber>
              </FormItem>
            </Col>
            <template v-if="!batch">
            <Col :lg="8" :md="12" :sm="24" :xs="24" :min="0" class-name="margin-bottom-10">
              <FormItem label="手续费" prop="commission" :required="!editMore">
                <InputNumber style="width: 100%;" v-model="item.commission"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!batch">
              <FormItem label="方向" prop="isBuy" :required="!editMore">
                <Select placeholder filterable clearable v-model="item.isBuy">
                  <Option
                    v-for="(item, index) in [{ text: '买', value: 1 }, { text: '卖', value: 0 }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="开/平" prop="isClose" :required="currentExchange ? currentExchange.isAllowOpenClose : false">
                <Select placeholder filterable clearable v-model="item.isClose">
                  <Option
                    v-for="(item, index) in [{ text: '开', value: 0 }, { text: '平', value: 1 }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="今/昨" prop="isHistory" :required="(item.isClose === 0) ? false : (currentExchange && currentExchange.isAllowToday ) ? true : false">
                <Select placeholder filterable clearable v-model="item.isHistory">
                  <Option
                    v-for="(item, index) in [{ text: '今', value: 0 }, { text: '昨', value: 1 }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <!-- <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="利润中心开/平" prop="isClose2">
                <Select placeholder filterable clearable v-model="item.isClose2">
                  <Option
                    v-for="(item, index) in [{ text: '开', value: 'false' }, { text: '平', value: 'true' }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col> -->
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="是否虚拟" prop="isVirtual">
                <Select placeholder filterable v-model="item.isVirtual">
                  <Option
                    v-for="(item, index) in [{ text: '是', value: 1 }, { text: '否', value: 0 }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="业务员" prop="trader">
                <Input type="text" :rows="2" v-model="item.trader" />
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="下单员" prop="operator">
                <Input type="text" :rows="2" v-model="item.operator" />
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="投机/保值" prop="hedgeFlagType" :required="currentExchange ? currentExchange.isAllowHedge : false">
                <Select placeholder filterable v-model="item.hedgeFlagType">
                  <Option
                    v-for="(item, index) in [{ text: '投机', value: '投机' }, { text: '保值', value: '保值' }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="结算日期" prop="settlementDate">
                <DatePicker
                        type="date"
                        confirm
                        placement="bottom-end"
                        placeholder
                        v-model="item.settlementDate"
                        :options="settlementDateOptions"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="是否移仓">
                <Select placeholder filterable v-model="item.isMovePosition">
                  <Option
                    v-for="(item, index) in [{ text: '是', value: 1 }, { text: '否', value: 0 }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!editMore">
              <FormItem label="成交时间" prop="tradeTime">
                <DatePicker
                  type="datetime"
                  confirm
                  placement="bottom-end"
                  placeholder
                  v-model="item.tradeTime"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!editMore">
              <FormItem label="成交编号" prop="tradeNumber">
                <Input type="text" v-model="item.tradeNumber" />
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="委托单号" prop="requestNumber">
                <Input type="text" v-model="item.requestNumber" />
              </FormItem>
            </Col>
          </template>
            <Col :lg="24" :md="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="备注" prop="remark">
                <Input type="textarea" :rows="3" v-model="item.remark" />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Divider v-if="!editMore"/>
        <Col span="24" v-if="!editMore">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="backToList">返回</Button>
            <Button type="primary"  @click="onSave">保存</Button>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import api from "./api";
import { utils } from "@/utils/utils";
export default {
  name: "Future-Trade-Record-Edit",
  props: ["id","editMore"],
  data() {
    return {
      commonData: {
        instrumentCategories: [],
        accountStrategies: []
      },
      item: {
        volume: null,
        price: null,
        totalAmount: null,
        commission: null,
        tradeDate: this.id ? new Date() : null,
        isVirtual: null,
        isMovePosition: null,
        acFutureTradeRecordId: '',
        settlementDate: '',
        accountingEntityId: '',
        accountingEntity: '',
        corporationId: '',
        corporation: '',
        tradeAccountId: '',
        tradeAccount: '',
        instrumentCategoryId: '',
        instrumentId: '',
        exchange: '',
        commodityType: '',
        instrumentCode: '',
        isBuy: '',
        isClose: '',
        isHistory: '',
        isClose2: '',
        trader: null,
        operator: null,
        tradingStrategyId: '',
        tradingStrategy: '',
        tradeNumber: '',
        requestNumber: null,
        remark: null,
        lastManipulationTime: '',
        lastManipulationBy: '',
        isLocked: '',
        isDeleted: '',
        dataSourceType: '',
        fillId: '',
        hedgeFlagType: null,
        exchangeId: '',
      },
      itemRules: {},
      instrumentCategories: [],
      accountingEntities: [],
      tradeAccounts: [],
      tradeDateOptions: {
        disabledDate: date => {
          let initdate = new Date();
          return date > initdate;
        }
      },
      settlementDateOptions: {
        disabledDate: date => {
          let initdate = new Date(this.item.tradeDate);
          return date < initdate;
        }
      },
      isEdit: !!this.id,
      batch: this.$route.query.batch === 'batch'
    };
  },
  async created() {
    let commonData = this.$store.state.cachedCommonData['futuretraderecord_getcommondata'];
    if(!commonData) {
      if(this.$route.name != 'FutureTradeRecordList'){
        commonData = await this.api.getCommonData("FutureTradeRecord");
        this.commonData = commonData;
      }
    }else{
      this.commonData = commonData;
    }
    this.accountingEntities = commonData && commonData.accountingEntities.filter(val => val.isAtomicProfitCenter == true && val.isDisabled != 1 && !val.isDisabled)
    this.tradeAccounts = commonData && commonData.tradeAccounts.filter(val => !val.isDisabled);
    if (this.isEdit) {
      let data = await api.getById(this.id);
      data.isBuy = utils.booleanToNumber(data.isBuy);
      data.isVirtual = utils.booleanToNumber(data.isVirtual);
      data.isMovePosition = utils.booleanToNumber(data.isMovePosition);
      data.isClose = utils.booleanToNumber(data.isClose);
      data.isClose2 = data.isClose2 + '';
      data.isHistory = utils.booleanToNumber(data.isHistory);
      this.item = data;
    }
  },
  computed:{
    instrumentQuery () {
      const instrumentCategoryObj = this.commonData.instrumentCategories.find(val => val.value === this.item.instrumentCategoryId);
      const instrumentCategoryText = instrumentCategoryObj ? instrumentCategoryObj.text : '';
      return [{
        key: 'instrumentCategoryId',
        text: '标准合约',
        id: this.item.instrumentCategoryId,
        code: `${this.item.instrumentCategoryId ? instrumentCategoryText : ''}`,
        required: true
      }];
    },
    accountStrategies() {
      const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.item.accountingEntityId)
      return obj ? obj.tradingStrategies.filter(o => !o.isDisabled) : []
    },

    currentExchange(){
      if(this.item.instrumentCategoryId){
        var marketId = this.commonData.instrumentCategories.find(data => data.value == this.item.instrumentCategoryId).marketId
        return this.commonData.exchanges.find(item => item.value == marketId )
      }else{
        return false
      }
    }
  },
  methods: {
    accountingEntityChange () {
      this.item.tradingStrategyId = '';
    },
    async onSave() {
      let instrumentCategory = this.item.instrumentCategoryId;
      const exchangeData = this.commonData.instrumentCategories.find((data)=>{return data.value === instrumentCategory && !data.isDisabled})
      let exchangeId = exchangeData && exchangeData.marketId
      if (!(await this.validate())) {
        return;
      }
      this.item.isClose2 = this.item.isClose
      let data = { ...this.item,exchangeId};
      if(!this.batch){
        await api.save(data);
      }else{
        let pamas = [
          {...this.item,isVirtual:1,isBuy:1,accountingEntityId:this.item.accountingEntityIdBuy,commission:0},
          {...this.item,isVirtual:1,isBuy:0,accountingEntityId:this.item.accountingEntityIdSell,commission:0}
        ]
        await api.addDoubleData(pamas);
      }
      this.backToList();
    },
    validate() {
      return this.$refs["ManageForm"].validate(valid => valid);
    },
    backToList() {
      this.$router.push({
        name: "FutureTradeRecordList"
      });
    }
  }
};
</script>

<style scoped>
  h2{
    border-left: 5px solid orange;
    padding-left: 15px;
    margin: 15px;
  }
</style>
