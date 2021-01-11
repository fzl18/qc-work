<template>
<div>
  <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
    <Row>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('唯一标识')" prop="qctKey" required>
          <Input v-model="addForm.qctKey" :disabled="isEdit" :placeholder="$t('唯一标识')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('名称')" prop="friendlyName" required>
          <Input v-model="addForm.friendlyName" :placeholder="$t('名称')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('合约代码')" prop="code" required>
          <Input v-model="addForm.code" :placeholder="$t('合约代码')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('交易所')" prop="marketId" required>
          <Select
            :placeholder="$t('交易所')"
            filterable
            clearable
            v-model="addForm.marketId"
          >
            <Option
              v-for="(item, index) in commonData.exchanges.filter(data => !data.isDisabled)"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('品类')" prop="wfCommodityTypeId">
          <Select
            :placeholder="$t('品类')"
            filterable
            clearable
            v-model="addForm.wfCommodityTypeId"
          >
            <Option
              v-for="(item, index) in commonData.commodityTypes.filter(data => !data.isDisabled)"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('合约类型')" prop="financialInstrumentType" required>
          <Select
            :placeholder="$t('合约类型')"
            filterable
            clearable
            v-model="addForm.financialInstrumentType"
          >
            <Option
              v-for="(item, index) in commonData.FinancialInstrumentType.filter(data => !data.isDisabled)"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('币种')" prop="wfCurrencyId" required>
          <Select
            :placeholder="$t('币种')"
            filterable
            clearable
            v-model="addForm.wfCurrencyId"
          >
            <Option
              v-for="(item, index) in commonData.currencies.filter(data => !data.isDisabled)"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('重量单位')" prop="wfUnitId" required>
          <Select
            :placeholder="$t('重量单位')"
            filterable
            clearable
            v-model="addForm.wfUnitId"
          >
            <Option
              v-for="(item, index) in commonData.units.filter(data => !data.isDisabled)"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('价格单位倍数')" prop="priceUnitMultiple" required>
          <Input v-model="addForm.priceUnitMultiple" type="number" :placeholder="$t('价格单位倍数')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('交易单位量')" prop="lotSize" required>
          <Input v-model="addForm.lotSize" type="number" :placeholder="$t('交易单位量')">
            <span slot="append">{{unitName + '/手'}}</span>
          </Input>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('合约格式')" prop="instrumentContractFormatId" required>
          <Select
            :placeholder="$t('合约格式')"
            filterable
            clearable
            v-model="addForm.instrumentContractFormatId"
          >
            <Option
              v-for="(item, index) in commonData.instrumentContractType"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('合约时段类型')" prop="instrumentPeriodType" required>
          <Select
            :placeholder="$t('合约时段类型')"
            filterable
            clearable
            v-model="addForm.instrumentPeriodType"
          >
            <Option
              v-for="(item, index) in commonData.InstrumentPeriodType"
              :label="item.text"
              :value="item.value"
              :key="index"
              >{{ item.text }}</Option
            >
          </Select>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('合约税率')" prop="instrumentTaxRate" required>
          <Input v-model="addForm.instrumentTaxRate" type="number" @on-change="addInstrumentTaxRate" :placeholder="$t('合约税率')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('保值比例')" prop="hedgingCoefficient" required>
          <Input v-model="addForm.hedgingCoefficient" type="number" :placeholder="$t('保值比例')"/>
        </FormItem>
      </Col>
      <Col :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('是否启用期货')" prop="isETrading">
          <i-switch v-model="addForm.isETrading" />
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('交割乘数')" prop="deliveryMultiple" :required="addForm.isETrading">
          <Input v-model="addForm.deliveryMultiple" type="number" :placeholder="$t('交割乘数')">
            <span slot="append">{{unitName + '/手'}}</span>
          </Input>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('最小变动价位')" prop="tickSize" :required="addForm.isETrading">
          <Input v-model="addForm.tickSize" type="number" :placeholder="$t('最小变动价位')">
            <span slot="append">{{(addForm.priceUnitMultiple === 1 ? '' : addForm.priceUnitMultiple) + currencyName + '/' + unitName}}</span>
          </Input>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('持仓限额')" prop="positionLimit" :required="addForm.isETrading">
          <Input v-model="addForm.positionLimit" type="number" :placeholder="$t('持仓限额')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('交易品种名称')" prop="tradingCommodityName" :required="addForm.isETrading">
          <Input v-model="addForm.tradingCommodityName" :placeholder="$t('交易品种名称')"/>
        </FormItem>
      </Col>
      <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
        <FormItem :label="$t('交易代码')" prop="code" :required="addForm.isETrading">
          <Input v-model="addForm.instrumentCategoryCode" :placeholder="$t('交易代码')"/>
        </FormItem>
      </Col>
    </Row>
  </Form>
  <div slot="footer">
    <Button class="margin-right-3" @click="backToList">{{$t('返回')}}</Button>
    <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
  </div>
</div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums';
import api from './api';

export default {
  data() {
    return {
      commonData: {
        units: []
      },
      isShowAddModal: false,
      isEdit: false,
      enums,
      addForm: {
        priceUnitMultiple: 1,
        instrumentTaxRate: 0,
        hedgingCoefficient: 1,
        isETrading: false
      },
    };
  },
  async mounted() {
    let commonData = await api.getCommonData()
    this.commonData = commonData
    if(this.$route.query.id) {
      // 请求get数据
      let data = await api.getById({id: this.$route.query.id})
      this.addForm = data
      this.isEdit = true
    }
  },
  computed: {
    unitName() {
      return utils.showText(this.commonData.units, this.addForm.wfUnitId)
    },
    currencyName() {
      return utils.showText(this.commonData.currencies, this.addForm.wfCurrencyId)
    }
  },
  methods: {
    onSave() {
      this.$refs['addForm'].validate(valid => {
        if(valid) {
          if(this.isEdit) {
            api.update(this.addForm).then(() => {
              this.$Message.success(this.$t('操作成功！'))
              this.$router.push({name: 'standerdInstrumentList'})
            })
          } else {
            api.save(this.addForm).then(() => {
              this.$Message.success(this.$t('操作成功！'))
              this.$router.push({name: 'standerdInstrumentList'})
            })
          }
        }
      })
    },
    backToList() {
      this.$router.push({name: 'standerdInstrumentList'})
    },
    addInstrumentTaxRate() {
      this.addForm.hedgingCoefficient = 1 + this.addForm.instrumentTaxRate
    }
  },
};
</script>

<style>
</style>