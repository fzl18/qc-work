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
              <FormItem label="交易日期" prop="tradeDate" required>
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
              <FormItem label="利润中心" prop="accountingEntityId" required>
                <Select placeholder filterable clearable v-model="item.accountingEntityId" @on-change="accountingEntityChange">
                  <Option
                    v-for="(item, index) in (commonData.accountingEntities && commonData.accountingEntities.filter(val => val.isAtomicProfitCenter == 1 && !val.isDisabled))"
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
              <FormItem label="法人" prop="corporationId" required>
                <Select placeholder filterable clearable v-model="item.corporationId">
                  <Option
                    v-for="(item, index) in commonData.corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="资金账户" prop="tradeAccountId" >
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
              <FormItem label="品类" prop="commodityTypeId" required>
                <Select placeholder filterable clearable v-model="item.commodityTypeId">
                  <Option
                    v-for="(item, index) in commonData.commodityTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="收支类型" prop="paymentTypeId" required>
                <Select placeholder filterable clearable v-model="item.paymentTypeId">
                  <Option
                    v-for="(item, index) in commonData.paymentTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="币种" prop="currencyId" required>
                <Select placeholder filterable clearable v-model="item.currencyId">
                  <Option
                    v-for="(item, index) in commonData.currencies"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10 custom-error">
              <FormItem label="含税金额" prop="amount" required>
                <Input type="number" v-model="item.amount">
                  <span slot="append">{{utils.showText(commonData.currencies, item.currencyId, 'displayText')}}</span>
                </Input>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10 custom-error">
              <FormItem label="不含税金额" prop="amountAfterTax" required>
                <Input type="number" v-model="item.amountAfterTax">
                  <span slot="append">{{utils.showText(commonData.currencies, item.currencyId,  'displayText')}}</span>
                </Input>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="备注" prop="remark">
                <Input type="textarea" :rows="2" v-model="item.remark" />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Divider />
        <Col span="24">
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
  name: "Other-Payment-Record-Edit",
  props: ["id"],
  data() {
    return {
      commonData: {
        accountStrategies: []
      },
      item: {
        tradingStrategyId: '',
        volume: null,
        price: null,
        totalAmount: null,
        commission: null,
        tradeDate: new Date(),
        settlementDate: new Date()
      },
      itemRules: {},
      instrumentCategories: [],
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
      isEdit: !!this.id
    };
  },
  computed: {
    accountStrategies() {
      const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.item.accountingEntityId)
      return obj ? obj.tradingStrategies.filter(o => !o.isDisabled) : []
    }
  },
  async created() {
    let commonData = await this.api.getCommonData("OtherPaymentRecord");
    this.commonData = commonData;
    this.commonData.corporations = commonData.corporations.filter(v => !v.isDisabled)
    this.commonData.commodityTypes = commonData.commodityTypes.filter(v => !v.isDisabled)
    if (this.isEdit) {
      let data = await api.getById(this.id);
      data.isBuy = utils.booleanToNumber(data.isBuy);
      data.isVirtual = utils.booleanToNumber(data.isVirtual);
      data.isClose = utils.booleanToNumber(data.isClose);
      data.isHistory = utils.booleanToNumber(data.isHistory);
      this.item = data;
    }
  },
  watch: {
    "item.corporationId" (val) {
      this.tradeAccounts = this.commonData.tradeAccounts.filter( value => value.cid === val && !value.isDisabled)
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
        name: "OtherPaymentRecordList"
      });
    }
  }
};
</script>
