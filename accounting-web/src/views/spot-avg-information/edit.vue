<template>
  <div>
    <Form
      :label-width="120"
      label-position="right"
      id="ManageForm"
      :model="modelForm"
      :rules="itemRules"
      ref="ManageForm"
    >
      <Row type="flex">
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="作价日期" prop="pricingDateRange" required>
            <DatePicker
              type="daterange"
              confirm
              placement="bottom-end"
              placeholder="请选择日期范围"
              clearable
              transfer
              @on-change="validateDateRange"
              v-model="modelForm.pricingDateRange"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="利润中心" prop="accountingEntityId" required>
            <Select
              placeholder="利润中心"
              filterable
              clearable
              v-model="modelForm.accountingEntityId"
              @on-change="changeProfitCenter"
            >
              <Option
                v-for="(item, index) in atomicProfitCenter.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="策略" prop="tradingStrategyId">
            <Select
              placeholder="策略"
              filterable
              clearable
              v-model="modelForm.tradingStrategyId"
            >
              <Option
                v-for="(item, index) in computedAccountStrategies.filter(data => !data.isDisabled)"
                :label="item.name"
                :value="item.tradingStrategyId"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="法人" prop="corporationId" required>
            <Select
              placeholder="法人"
              filterable
              clearable
              v-model="modelForm.corporationId"
            >
              <Option
                v-for="(item, index) in commonData.corporations.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="方向" prop="isBuy" required>
            <Select
              placeholder="方向"
              filterable
              clearable
              v-model="modelForm.isBuy"
            >
              <Option
                v-for="(item, index) in direction"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="品种" prop="commodityId" required>
            <Select
              placeholder="品种"
              filterable
              clearable
              v-model="modelForm.commodityId"
              @on-change="changeCommodity"
            >
              <Option
                v-for="(item, index) in commonData.commodities.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="品类" prop="commodityTypeId" required>
            <Select
              placeholder="品类"
              filterable
              clearable
              v-model="modelForm.commodityTypeId"
              @on-change="changeCommodityType"
            >
              <Option
                v-for="(item, index) in computedCommodityTypes.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="物料" prop="materialId" :required="mustMaterial===2">
            <Select
              placeholder="物料"
              filterable
              clearable
              v-model="modelForm.materialId"
            >
              <Option
                v-for="(item, index) in computedMaterials.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class="flex-item" class-name="margin-bottom-10">
          <FormItem class="inline-item width-70" label="货量" prop="cargoQuantity" required>
            <Input v-model="modelForm.cargoQuantity" placeholder="货量" type="number" />
          </FormItem>
          <FormItem class="inline-item width-30" prop="unitId" required>
            <Select filterable clearable v-model="modelForm.unitId">
              <Option
                v-for="(item, index) in computedUnits"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="升贴水" prop="premiumDiscount" required>
            <Input type="text" placeholder="升贴水" v-model="modelForm.premiumDiscount"/>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="币种" prop="currencyId">
            <Select
              placeholder="币种"
              filterable
              clearable
              v-model="modelForm.currencyId"
            >
              <Option
                v-for="(item, index) in commonData.currencies"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="作价市场" prop="marketId" required>
            <Select
              placeholder="作价市场"
              filterable
              clearable
              v-model="modelForm.marketId"
            >
              <Option
                v-for="(item, index) in commonData.exchanges"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="具体合约" prop="instrumentId">
            <InstrumentSelect
              :allDate="true"
              :filterQuery="filterInstrumentQuery"
              v-model="commonData.instrumentId"
            ></InstrumentSelect>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="行情价格类型" prop="feedTypeId" required>
            <Select
              placeholder="行情价格类型"
              filterable
              clearable
              v-model="modelForm.feedTypeId"
            >
              <Option
                v-for="(item, index) in commonData.feedTypes"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="贸易类型" prop="tradeType" required>
            <Select
              placeholder="贸易类型"
              filterable
              clearable
              v-model="modelForm.tradeType"
            >
              <Option
                v-for="(item, index) in commonData.simpleTradeType.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="税率" prop="taxRate">
            <Input type="text" placeholder="税率" v-model="modelForm.taxRate"/>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="合同编号" prop="contractCode">
            <Input type="text" placeholder="合同编号" v-model="modelForm.contractCode"/>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="客户" prop="customer">
            <Input type="text" placeholder="客户" v-model="modelForm.customer"/>
          </FormItem>
        </Col>
        <Col :lg="24" :md="24" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="备注" prop="notes">
            <Input type="textarea"  :rows="4" v-model="modelForm.notes"/>
          </FormItem>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button @click="backToList" class="margin-right-3">返回</Button>
          <Button type="primary" @click="save">保存</Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import api from './api'
import { utils } from '@/utils/utils'

export default {
  data() {
    const validateDateRangeRule = (rule, value, callback) => {
      if(!value[0] || !value[1]) {
        callback(new Error('不能为空'))
      }
      callback()
    }
    return {
      commonData: {
        accountingEntities: [],
        corporations: [],
        commodities: [],
        materials: [],
        currencies: [],
        exchanges: [],
        units: [],
        feedTypes: [],
        simpleTradeType: [],
        instrumentCategories: [],
        commodityTypes: [],
        strategies: [],
      },
      modelForm: {
        pricingDateRange: [],
        accountingEntityId: '',
        tradingStrategyId: '',
        corporationId: '',
        isBuy: '',
        commodityId: '',
        commodityTypeId: '',
        materialId: '',
        cargoQuantity: '',
        unitId: '',
        premiumDiscount: '',
        currencyId: '',
        marketId: '',
        instrumentId: '',
        feedTypeId: '',
        tradeType: '',
        taxRate: '',
        contractCode: '',
        customer: '',
        notes: ''
      },
      direction: [
        { value: 'true', text: '采购' },
        { value: 'false', text: '销售' }
      ],
      itemRules: {
        pricingDateRange: [{ type: 'array', validator: validateDateRangeRule, trigger: 'change' }]
      },
      atomicProfitCenter: [],
      isEdit: false,
    }
  },
  async beforeMount() {
    let commonData = await api.getCommonData()
    this.commonData = commonData
    this.atomicProfitCenter = _.filter(commonData.accountingEntities, data => data.isAtomicProfitCenter)
    if(this.$route.query.id) {
      let data = await api.get(this.$route.query.id)
      this.isEdit = true
      this.modelForm = data
      this.modelForm.pricingDateRange = [this.modelForm.pricingStartDate,this.modelForm.pricingEndDate]
      this.modelForm.isBuy += ''
    }
  },
  mounted() {
    this.$refs['ManageForm'].resetFields()
  },
  computed: {
    computedAccountStrategies() {
      return (_.find(this.commonData.accountStrategies, data => data.accountEntityId === this.modelForm.accountingEntityId) || {}).tradingStrategies || []
    },
    computedCommodityTypes() {
      let commodityTypeIds = (_.find(this.commonData.commodities, data => data.value === this.modelForm.commodityId) || {}).commodityTypes || []
      return _.filter(this.commonData.commodityTypes, data => commodityTypeIds.indexOf(data.value) !== -1)
    },
    computedUnits() {
      let units = (_.find(this.computedCommodityTypes, data => data.value === this.modelForm.commodityTypeId) || {}).unitis || []
      return _.filter(this.commonData.units, data => units.indexOf(data.value) !== -1)
    },
    computedMaterials() {
      return _.filter(this.commonData.materials, data => data.commodityId === this.modelForm.commodityId && data.commodityTypeId === this.modelForm.commodityTypeId)
    },
    mustMaterial() {
      let commodity = _.find(this.commonData.commodities, data => data.value === this.modelForm.commodityId) || {}
      return commodity.acGranularity
    },
    filterInstrumentQuery () {
      const exchangeText = utils.showText(this.commonData.exchanges, this.modelForm.marketId);
      const commodityTypeObj = this.commonData.commodityTypes.find(val => val.value === this.modelForm.commodityTypeId);
      const commodityTypeText = commodityTypeObj ? commodityTypeObj.text : '';
      const id = this.commonData.financialInstrumentType && this.commonData.financialInstrumentType.find(o => o.text === "期货");
      return [{
        key: 'marketId',
        text: '作价市场',
        id: this.modelForm.marketId,
        code: `${this.modelForm.marketId ? exchangeText : ''}`,
        required: true
      }, {
        key: 'commodityTypeId',
        text: '品类',
        id: this.modelForm.commodityTypeId,
        code: `${this.modelForm.commodityTypeId ? commodityTypeText : ''}`,
        required: true
      }, {
        key: 'financialInstrumentType',
        text: '合约类型',
        id: id && id.value,
        code: '期货',
        required: true
      }];
    },
  },
  methods: {
    save() {
      this.$refs['ManageForm'].validate(valid => {
        if(valid) {
          this.modelForm.pricingStartDate = this.modelForm.pricingDateRange[0]
          this.modelForm.pricingEndDate = this.modelForm.pricingDateRange[1]
          if(this.isEdit) {
            api.update(this.modelForm).then(result => {
              this.$Message.success(result.message || '保存成功！')
              this.$router.push({name: 'spotAvgInformationList'})
            })
          } else {
            api.create(this.modelForm).then(result => {
              this.$Message.success(result.message || '保存成功！')
              this.$router.push({name: 'spotAvgInformationList'})
            })
          }
        }
      })
    },
    changeProfitCenter() {
      this.modelForm.tradingStrategyId = ''
    },
    changeCommodity() {
      this.modelForm.commodityTypeId = ''
    },
    changeCommodityType() {
      this.modelForm.materialId = ''
      this.modelForm.unitId = ''
    },
    validateDateRange() {
      this.$refs['ManageForm'].validateField('pricingDateRange')
    },
    backToList() {
      this.$router.push({name: 'spotAvgInformationList'})
    }
  }
};
</script>

<style lang="less" scoped>
.flex-item {
  display: flex;
  .inline-item {
    display: inline-block;
  }
  .width-70 {
    width: 70%;
  }
  .width-30 {
    width: 30%;
    /deep/ .ivu-form-item-content {
      margin-left: 0!important;
    }
  }
}
</style>