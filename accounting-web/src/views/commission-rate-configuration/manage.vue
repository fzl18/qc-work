<template>
  <div>
    <Form
            :label-width="150"
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
              <FormItem label="生效日期" prop="effectiveDate" required>
                <DatePicker
                        type="date"
                        confirm
                        placement="bottom-end"
                        placeholder
                        v-model="item.effectiveDate"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="资金账户" prop="tradeAccountId" required>
                <Select placeholder filterable clearable v-model="item.tradeAccountId">
                  <Option
                          v-for="(item, index) in commonData.allTradeAccounts.filter( data => !data.isDisabled)"
                          :label="item.text"
                          :value="item.value"
                          :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="标准合约" prop="instrumentCategoryId" required>
                <Select placeholder filterable clearable v-model="item.instrumentCategoryId">
                  <Option
                          v-for="(item, index) in commonData.allInstrumentCategories"
                          :label="item.text"
                          :value="item.value"
                          :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="具体合约" prop="instrumentId">
                <InstrumentSelect :filterQuery="instrumentQuery" v-model="item.instrumentId"></InstrumentSelect>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="开仓手续费（按手数）" prop="openPerLot">
                <InputNumber style="width:100%" :min="0" v-model="item.openPerLot"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="开仓手续费（按金额）" prop="openProportion">
                <InputNumber style="width:100%" :min="0" v-model="item.openProportion"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="平今手续费（按手数）" prop="closeTodayPerLot">
                <InputNumber style="width:100%" :min="0" v-model="item.closeTodayPerLot"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="平今手续费（按金额）" prop="closeTodayProportion">
                <InputNumber style="width:100%" :min="0" v-model="item.closeTodayProportion"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="平仓手续费（按手数）" prop="closePerLot">
                <InputNumber style="width:100%" :min="0" v-model="item.closePerLot"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="平仓手续费（按金额）" prop="closeProportion">
                <InputNumber style="width:100%" :min="0" v-model="item.closeProportion"></InputNumber>
              </FormItem>
            </Col>
          </Row>
        </Col>
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
          allInstrumentCategories: [],
          allTradeAccounts: []
        },
        item:{
          effectiveDate: '',
          tradeAccountId: '',
          instrumentCategoryId: '',
          instrumentId: '',
          openPerLot: null,
          openProportion: null,
          closeTodayPerLot: null,
          closeTodayProportion: null,
          closePerLot: null,
          closeProportion: null
        },
        itemRules: {},
        isEdit: !!this.id
      };
    },
    async created() {
      let commonData = await this.api.getCommonData("AcCommissionRate");
      this.commonData = commonData;
      if (this.isEdit) {
        let data = await api.getById(this.id);
        data.isBuy = utils.booleanToNumber(data.isBuy);
        data.isVirtual = utils.booleanToNumber(data.isVirtual);
        data.isClose = utils.booleanToNumber(data.isClose);
        data.isHistory = utils.booleanToNumber(data.isHistory);
        this.item = data;
      }
    },
    computed:{
      instrumentQuery () {
        const instrumentCategoryObj = this.commonData.allInstrumentCategories.find(val => val.value === this.item.instrumentCategoryId);
        const instrumentCategoryText = instrumentCategoryObj ? instrumentCategoryObj.text : '';
        return [{
          key: 'instrumentCategoryId',
          text: '标准合约',
          id: this.item.instrumentCategoryId,
          code: `${this.item.instrumentCategoryId ? instrumentCategoryText : ''}`,
          required: true
        }];
      }
    },
    methods: {
      async onSave() {
        if (!(await this.validate())) {
          return;
        }
        let data = { ...this.item };
        await api.save(data);
        this.$Message.success('添加成功');
        this.backToList();
      },
      validate() {
        return this.$refs["ManageForm"].validate(valid => valid);
      },
      backToList() {
        this.$router.push({
          name: "CommissionRateConfigurationList"
        });
      }
    }
  };
</script>
