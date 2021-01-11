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
              <FormItem label="结算日期" prop="settlementDate" required>
                <DatePicker
                  type="date"
                  confirm
                  placement="bottom-end"
                  placeholder
                  v-model="item.settlementDate"
                  :options="tradeDateOptions"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10" >
              <FormItem label="合同编号" prop="contractCode" required>
                 <Input type="text" :rows="3" v-model="item.contractCode" />
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
              <FormItem label="结算重量" prop="settlementWeight" required>
                 <Input type="number"  v-model="item.settlementWeight" />
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="结算金额" prop="settlementPrice" required>
                 <Input type="number"  v-model="item.settlementPrice" />
              </FormItem>
            </Col>
            <Col :lg="24" :md="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="备注" prop="notes">
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
        settlementDate: null,
        settlementWeight: null,
        contractCode: '',
        commodityTypeId: '',
        notes: ''
      },
      materials:[],
      itemRules: {
        basePrice: [
          {
            required: true,
            type: 'number'
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
      unit:'',
      currency:'',
      isOver: false
    };
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
    if(this.$route.query.id) {
      this.getById(this.$route.query.id)
      this.edit = true
    } else {
      this.edit = false
    }
  },
  methods: {
    async onSave() {
      if (!(await this.validate())) {
        return;
      }
      let data = { ...this.item };
      if(this.edit) {
        await api.edit(data)
        this.$Message.success('修改成功');
      }else {
        await api.save(data);
        this.$Message.success('添加成功');
      }
      this.backToList();
    },
    validate() {
      return this.$refs["ManageForm"].validate(valid => valid);
    },
     backToList() {
      this.$router.back()
    },
    getById(id) {
      api.getById(id).then((res) => {
        this.item = res
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
