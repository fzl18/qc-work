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
              <FormItem label="作价日期" prop="pricingDate" required>
                <DatePicker
                  type="date"
                  confirm
                  placement="bottom-end"
                  placeholder
                  v-model="item.pricingDate"
                  :options="tradeDateOptions"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!batch">
              <FormItem label="利润中心" prop="accountingEntityId" required>
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
                    v-for="(item, index) in corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!batch">
              <FormItem label="方向" prop="isBuy" required>
                <Select placeholder filterable clearable v-model="item.isBuy">
                  <Option
                    v-for="(item, index) in [{ text: '采购', value: 1 }, { text: '销售', value: 0 }]"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" v-if="!batch">
              <FormItem label="品种" prop="commodityId" required>
                <Select placeholder filterable clearable v-model="item.commodityId">
                  <Option
                    v-for="(item, index) in commonData && commonData.commodities.filter(val => !val.isDisabled)"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="品类" prop="commodityTypeId" required>
                <Select placeholder filterable clearable v-model="item.commodityTypeId" @on-clear="item.materialId=null;item.commodityTypeId=null">
                  <Option
                    v-for="(item, index) in commodityTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="物料" prop="materialId" :required="materials.length > 0">
                <Select placeholder filterable clearable v-model="item.materialId">
                  <Option
                    v-for="(item, index) in materials"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="作价重量" required>
                <Row>
                  <Col :span="12">
                    <FormItem prop="pricingCargoQuantity" required>
                      <InputNumber style="width: 100%;" :min="0" v-model="item.pricingCargoQuantity"></InputNumber>
                    </FormItem>
                  </Col>
                  <Col :span="12" style="text-align:right">
                    <FormItem prop="unitId" required>
                      <Select placeholder filterable clearable v-model="item.unitId" style="width: 90%;text-align:left">
                        <Option
                          v-for="(item, index) in commodityTypesUnits"
                          :label="item.text"
                          :value="item.value"
                          :key="index"
                        >{{item.value}} - {{item.text}}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="作价币种" prop="currencyId" required>
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
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="作价方式" prop="tradePricingType">
                <Select placeholder filterable clearable v-model="item.tradePricingType" >
                  <Option
                    v-for="(item, index) in commonData.tradePricingType"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="基价" prop="basePrice">
                <Input style="width: 100%;" type="number" v-model="item.basePrice">
                  <span slot="append">{{currency}} / {{unit}}</span>
                </Input>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="升贴水" prop="priceDiff" required>
                <Input style="width: 100%;" type="number" v-model="item.priceDiff">
                  <span slot="append">{{currency}} / {{unit}}</span>
                </Input>
              </FormItem>
            </Col>
            <template v-if="!batch">
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="贸易类型" prop="tradeType" required>
                <Select placeholder filterable v-model="item.tradeType">
                  <Option
                    v-for="(item, index) in commonData.simpleTradeType"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="税率" prop="taxRate">
                <InputNumber style="width: 100%;" :min="0" v-model="item.taxRate"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="客户" prop="taxRate">
                <Input style="width: 100%;"  v-model="item.customer"></Input>
              </FormItem>
            </Col>
          </template>
            <Col :lg="24" :md="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="备注" prop="remark">
                <Input type="textarea" :rows="3" v-model="item.notes" />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Divider/>
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
import { utils } from "@/utils/utils";
export default {
  name: "Spot-Trade-Record-Edit",
  props: ["id"],
  data() {
    return {
      commonData: {
        accountStrategies: [],
        accountingEntities: [],
        corporations: [],
        units: [],
        currencies: [],
        commodityTypes: [],
        materials: [],
        commodities: []
      },
      item:{
        pricingDate: null,
        pricingCargoQuantity: null,
        basePrice: null,
        taxRate: null,
        unitId: null,
        priceDiff: null,
        accountingEntityId: '',
        corporationId: '',
        isBuy: '',
        commodityTypeId: '',
        materialId: '',
        currencyId: '',
        tradePricingType: '',
        tradeType: '',
        customer: '',
        notes: '',
        tradingStrategyId: '',
        commodityId:''
      },
      materials:[],
      itemRules: {
        basePrice: [
          {
            required: true,
          },
          {
            min: 0
          }
        ]
      },
      instrumentCategories: [],
      accountingEntities: [],
      corporations:[],
      commodityTypes:[],
      commodityTypesUnits:[],
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
      batch: this.$route.query.batch === 'batch' ? true : false,
      unit:'',
      currency:'',
      isOver: false
    };
  },
  computed: {
    accountStrategies() {
      const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.item.accountingEntityId)
      return obj ? obj.tradingStrategies.filter(o => !o.isDisabled) : []
    }
  },
  async created() {
    let commonData = this.$store.state.cachedCommonData['tradepricing_getcommondata']
    if(!commonData) {
      if(this.$route.name != 'SpotTradeRecordList'){
        commonData = await this.api.getCommonData("TradePricing");
      }
    }
    this.commonData = commonData;
    this.accountingEntities = commonData && commonData.accountingEntities.filter(val => val.isAtomicProfitCenter == true && val.isDisabled != 1 && !val.isDisabled)
    this.corporations = commonData && commonData.corporations.filter(val =>!val.isDisabled)
    this.commodityTypes = commonData && commonData.commodityTypes.filter(val =>!val.isDisabled)
   if (this.isEdit) {
      let data = await api.getById(this.id);
      data.isBuy = utils.booleanToNumber(data.isBuy);
      data.isVirtual = utils.booleanToNumber(data.isVirtual);
      data.isClose = utils.booleanToNumber(data.isClose);
      data.isHistory = utils.booleanToNumber(data.isHistory);
      data.basePrice += '';
      this.item = data;
    }
  },
  watch: {
    "item.unitId"(value) {
      this.unit = value && this.commonData.units.filter(val => val.value == value )[0].text
    },
    "item.currencyId"(value) {
      this.currency = this.commonData.currencies.filter(val=>val.value == value)[0].displayText
    },
    "item.commodityId"(val){
      if(val){
        // this.item.materialId = null
        var obj = this.commonData.commodities.find(item=> item.value === val)
        this.commodityTypes = this.commonData.commodityTypes.filter(data => obj.commodityTypes.includes(data.value))

        this.materials = this.commonData.materials.filter(data => data.commodityId == val && !data.isDisabled)
        if(this.materials.length == 0){
          this.item.materialId = null
        }else{

        }
      }


    },
    "item.commodityTypeId"(data) {
      if(data) {
        let choose = this.commonData.commodityTypes.filter( val => val.value == data)[0].defaultUnitId;
        let chooseUnit = this.commonData.commodityTypes.filter( val => val.value == data)[0].unitis;
        this.commodityTypesUnits =  [];
        chooseUnit.forEach(item => {
          this.commonData.units.forEach(
            val=>{if(val.value == item){
              this.commodityTypesUnits.push(val)
            }}
          )
        });
        if(!this.isEdit || this.isOver ){
          let unitName = this.commonData.units.filter(val => val.value == choose )[0]
          this.item.unitId = choose
          this.unit = unitName ? unitName.text : ''
        }
        this.isOver = true
        // this.materials = this.commonData.materials.filter(val => val.commodityTypeId == data && !val.isDisabled)
        if(this.materials.length == 0){
          // this.item.materialId = null
        }
      }else{
        this.item.unitId = null
        // this.item.materialId = null
      }
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
      if(!this.batch){
        await api.save(data);
      }
      this.$Message.success('添加成功');
      this.backToList();
    },
    validate() {
      return this.$refs["ManageForm"].validate(valid => valid);
    },
    backToList() {
      this.$router.push({
        name: "SpotTradeRecordList"
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
  .unit{
    margin-left: 4%;
  }
</style>
