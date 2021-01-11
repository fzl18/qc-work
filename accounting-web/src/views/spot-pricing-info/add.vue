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
      <Row type="flex">
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="作价日期" prop="pricingDate" required>
            <DatePicker
              type="date"
              confirm
              placement="bottom-end"
              placeholder
              v-model="item.pricingDate"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="利润中心" prop="accountingEntityId" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.accountingEntityId"
              @on-change="accountingEntityIdChange"
            >
              <Option
                v-for="(item, index) in commonData.accountEntities.filter(o => o.isAtomicAccounting && !o.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="策略" prop="tradingStrategyId" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.tradingStrategyId"
            >
              <Option
                v-for="(v, index) in accountStrategies"
                :label="v.name"
                :value="v.tradingStrategyId"
                :key="index"
              >{{ v.name }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="法人" prop="corporationId" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.corporationId"
            >
              <Option
                v-for="(item, index) in commonData.corporations.filter(o => !o.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="方向" prop="isBuy" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.isBuy"
            >
              <Option
                v-for="(item, index) in [{ text: '采购', value: 'true' }, { text: '销售', value: 'false' }]"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="品种" prop="commodityId" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.commodityId"
              @on-change="commodityChange"
            >
              <Option
                v-for="(item, index) in commonData.comodities"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="品类" prop="commodityTypeId" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.commodityTypeId"
            >
              <Option
                v-for="(item, index) in commodityTypes"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="物料" prop="materialId" :required="acGranularity === 2 ? true : false">
            <Select filterable clearable v-model="item.materialId" placeholder>
              <Option
                v-for="(item, index) in materials"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="货量" required>
            <Row>
              <Col :span="12">
                <FormItem prop="cargoQuantity" required>
                  <InputNumber style="width: 100%;" :min="0" v-model="item.cargoQuantity"></InputNumber>
                </FormItem>
              </Col>
              <Col :span="12" style="text-align:right">
                <FormItem prop="unitId" required>
                  <Select placeholder filterable clearable v-model="item.unitId" style="width: 90%;text-align:left">
                    <Option
                      v-for="(item, index) in units"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
                    >{{item.text}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="币种" prop="currencyId" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.currencyId"
            >
              <Option
                v-for="(item, index) in commonData.currencies"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="基准价" prop="basePrice" required>
            <Input v-model="item.basePrice" clearable type="number">
              <Button slot="append">{{currencyText}}/{{unitText}}</Button>
            </Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="升贴水" prop="premiumDiscount">
            <Input v-model="item.premiumDiscount" clearable type="number">
              <Button slot="append">{{currencyText}}/{{unitText}}</Button>
            </Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="贸易类型" prop="simpleTradeType" required>
            <Select
              placeholder
              filterable
              clearable
              v-model="item.simpleTradeType"
            >
              <Option
                v-for="(item, index) in commonData.simpleTradeType"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="税率" prop="taxRate" required>
            <InputNumber style="width: 100%;" :min="0" v-model="item.taxRate"></InputNumber>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="合同编号" prop="contractCode">
            <Input v-model="item.contractCode" clearable></Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="客户" prop="customer">
            <Input type="text" v-model="item.customer" clearable></Input>
          </FormItem>
        </Col>
        <Col :lg="24" :md="24" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="备注" prop="remark">
            <Input type="textarea" :rows="4" v-model="item.remark"/>
          </FormItem>
        </Col>
        <Divider/>
        <Col span="24">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="backToList">返回</Button>
            <Button type="primary" @click="onSave">保存</Button>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
  import api from './api'

  export default {
    props: {
      id: {
        default: ''
      },
    },
    computed: {
      unitText () {
        let selectUnit = this.commonData.units.find(o => o.value === this.item.unitId)
        return selectUnit && selectUnit.text
      },
      currencyText () {
        let selectCurrency = this.commonData.currencies.find(o => o.value === this.item.currencyId)
        return selectCurrency && selectCurrency.shortName
      },
      units () {
        let selectedCommodity = this.commonData.comodities.find(o=> {
          return o.value === this.item.commodityId
        })
        const unitsId = selectedCommodity ? _.map(selectedCommodity.units, o => o.unitId) : []
        return this.commonData.units.filter(o => {
          return unitsId.includes(o.value)
        })
      },
      materials () {
        return this.commonData.materials.filter(o => {
          return o.value === this.item.commodityId
        })
      },
      accountStrategies () {
        const accountStrategiesObj = this.commonData.accountStrategies.find(o => !o.isDisabled && o.accountEntityId === this.item.accountingEntityId)
        return accountStrategiesObj ? accountStrategiesObj.tradingStrategies : []
      }
    },
    data () {
      return {
        commodityTypes: [],
        acGranularity: '',
        commonData: {
          simpleTradeType: [],
          profitCenters: [],
          options: {},
          enums: {},
          accountEntities: [],
          tradingStrategies: [],
          corporations: [],
          commodityTypes: [],
          comodities: [],
          currencies: [],
          units: [],
          accountStrategies: [],
          materials: []
        },
        item: {
          pricingDate: '',
          accountingEntityId: '',
          tradingStrategyId: '',
          corporationId: '',
          isBuy: '',
          commodityId: '',
          commodityTypeId: '',
          materialId: '',
          cargoQuantity: null,
          unitId: '',
          currencyId: '',
          basePrice: null,
          premiumDiscount: null,
          tradeType: '',
          taxRate: null,
          contractCode: '',
          customer: '',
          remark: '',
        },
        itemRules: {}
      }
    },
    async created () {
      let commonData = this.$store.state.cachedCommonData['spotpricing_getcommondata']
      if (!commonData) {
        commonData = await this.api.getCommonData('AcSpotPricingRecord')
      }
      this.commonData = commonData
      if (!!this.id) {
        let data = await api.getById(this.id);
        data.isBuy += ''
        this.item = data;
        const commodityObj = this.commonData.comodities.find(o => o.value === data.commodityId)
        this.acGranularity = commodityObj && commodityObj.acGranularity
        this.commodityTypes = this.commonData.commodityTypes.filter(o => {
          return data.commodityTypeId === o.value
        })
      }
    },
    methods: {
      backToList () {
        this.$router.push({
          name: 'spotPricingInfoList'
        })
      },
      onSave () {
        this.$refs['ManageForm'].validate(async valid => {
          if (valid) {
            let data = { ...this.item }
            if (!this.id) {
              await api.add(data)
              this.$Message.success('添加成功')
            } else {
              await api.upDate(data)
              this.$Message.success('编辑成功')
            }
            this.backToList()
          }
        })
      },
      accountingEntityIdChange (val) {
        this.item.tradingStrategyId = ''
      },
      commodityChange (val) {
        if (val) {
          let selectedCommodity = this.commonData.comodities.find(o=> {
            return o.value === val
          })
          this.commodityTypes = this.commonData.commodityTypes.filter(o => {
            return o.value === (selectedCommodity && selectedCommodity.commodityTypeId)
          })
          this.acGranularity = selectedCommodity && selectedCommodity.acGranularity
        } else {
          this.item.materialId = ''
          this.item.commodityTypeId = ''
          this.acGranularity = ''
          this.units = []
        }
      }
    }
  }
</script>

<style>
</style>
