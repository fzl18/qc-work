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
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="利润中心" prop="accountingEntityId" :required="!editMore">
                <Select placeholder filterable clearable v-model="item.accountingEntityId" @on-change="accountingEntityChange">
                  <Option
                    v-for="(item, index) in (commonData.accountingEntities && commonData.accountingEntities.filter(val => val.isAtomicProfitCenter == true && !val.isDisabled))"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
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
                    v-for="(item, index) in commonData.tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="外汇" prop="wfCurrencyPairId" :required="!editMore">
                <Select placeholder filterable clearable v-model="item.wfCurrencyPairId">
                  <Option
                    v-for="(item, index) in commonData.currencyPairs"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="合约日期" prop="contractDate" :required="!editMore">
                <DatePicker
                  type="date"
                  confirm
                  placement="bottom-end"
                  placeholder
                  v-model="item.contractDate"
                  :options="contractDateOptions"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="成交数量" prop="baseAmount" :required="!editMore">
                <InputNumber style="width: 100%;" :min="0" v-model="item.baseAmount"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="成交价格" prop="price" :required="!editMore">
                <InputNumber style="width: 100%;" :min="0" v-model="item.price"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
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
              <FormItem label="开/平" prop="isClose">
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
              <FormItem label="备注" prop="remark">
                <Input type="textarea" :rows="2" v-model="item.remark" />
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
import filter from "lodash/filter";
import { utils } from "@/utils/utils";
export default {
  name: "Foreign-Exchange-Trade-Record-Edit",
  props: ["id","editMore"],
  data() {
    return {
      commonData: {
        accountStrategies: []
      },
      item: {
        baseAmount: null,
        tradingStrategyId: null,
        price: null,
        counterAmount: null,
        commission: null,
        tradeDate: this.id ? new Date() : null,
        isVirtual: 0
      },
      itemRules: {},
      instrumentCategories: [],
      tradeDateOptions: {
        disabledDate: date => {
          let initdate = new Date();
          return date > initdate;
        }
      },
      contractDateOptions: {
        disabledDate: date => {
          let initdate = new Date(this.item.tradeDate);
          return date < initdate;
        }
      },
      isEdit: !!this.id
    };
  },
  computed: {
    accountStrategies () {
      const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.item.accountingEntityId);
      return obj ? obj.tradingStrategies.filter(o => !o.isDisabled) : [];
    }
  },
  async created() {
    let commonData = this.$store.state.cachedCommonData['acforextraderecord_getcommondata']
    if(!commonData) {
      if(this.$route.name != 'foreignExchangeTradeRecordList'){
        commonData = await this.api.getCommonData("AcForexTradeRecord");
        this.commonData = commonData;
      }
    }else{
      this.commonData = commonData;
    }
    this.commonData.tradeAccounts =  commonData && commonData.tradeAccounts.filter(v => !v.isDisabled)

    if (this.isEdit) {
      let data = await api.getById(this.id);
      data.isBuy = utils.booleanToNumber(data.isBuy);
      data.isVirtual = utils.booleanToNumber(data.isVirtual);
      data.isClose = utils.booleanToNumber(data.isClose);
      data.isHistory = utils.booleanToNumber(data.isHistory);
      this.item = data;
    }
  },
  methods: {
    accountingEntityChange () {
      this.item.tradingStrategyId = '';
    },
    async onSave() {
      if (!(await this.validate())) {
        return;
      }
      let data = { ...this.item };
      await api.save(data);
      this.backToList();
    },
    validate() {
      return this.$refs["ManageForm"].validate(valid => valid);
    },
    backToList() {
      this.$router.push({
        name: "foreignExchangeTradeRecordList"
      });
    }
  }
};
</script>

