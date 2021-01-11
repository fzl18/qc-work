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
              <FormItem label="生效日期" required prop="effectiveDate">
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
              <FormItem label="资金账户" required prop="tradeAccountId">
                <Select placeholder filterable prop="tradeAccountId" clearable v-model="item.tradeAccountId">
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
              <FormItem label="标准合约" required prop="instrumentCategoryId">
                <Select placeholder="标准合约" filterable clearable v-model="item.instrumentCategoryId">
                  <Option
                          v-for="(item, index) in commonData.instrumentCategories"
                          :label="item.text"
                          :value="item.value"
                          :key="index"
                  >{{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="具体合约" prop="instrumentId">
                <InstrumentSelect
                  :allDate="true"
                  :filterQuery="instrumentQuery"
                  v-model="item.instrumentId"></InstrumentSelect>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="保证金比率" prop="marginRatioByMoney">
                <InputNumber style="width: 100%;" :min="0" v-model="item.marginRatioByMoney"></InputNumber>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="每手保证金" prop="marginRatioByVolume">
                <InputNumber style="width: 100%;" :min="0" v-model="item.marginRatioByVolume"></InputNumber>
              </FormItem>
            </Col>
          </Row>
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
import api from "./api";
import filter from "lodash/filter";
import isNil from 'lodash/isNil';
export default {
  name: "Foreign-Exchange-Trade-Record-Edit",
  data() {
    return {
      commonData: {
        instrumentCategories: []
      },
      item: {
        tradeAccountId: null,
        marginRatioByMoney: null,
        effectiveDate: new Date(),
        marginRatioByVolume: null,
        instrumentCategoryId: ''
      },
      itemRules: {},
      instruments: [],
      contractDateOptions: {
        disabledDate: date => {
          let initdate = new Date(this.item.tradeDate);
          return date < initdate;
        }
      },
    };
  },
  computed: {
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
      }
    },
  async created() {
    let commonData = await this.api.getCommonData("AcMarginRateConfig");
    this.commonData = commonData;
    this.commonData.tradeAccounts =  commonData && commonData.tradeAccounts.filter(v => !v.isDisabled)
    this.commonData.instrumentCategories =  commonData && commonData.instrumentCategories.filter(v => !v.isDisabled)

    if (this.$route.query.id) {
      let data = await api.getById(this.$route.query.id);
      this.item = data;
    }

    window._formItem = this.item
  },
  watch: {
    "item.instrumentCategoryId": function(v) {
      this.filterInstruments();
    }
  },
  methods: {
    filterInstruments() {
      let instrumentCategory = this.item.instrumentCategoryId;
      let matchedInstruments = filter(this.commonData.instruments, d => {
        return d.category === instrumentCategory && !d.isDisabled;
      });
      this.instruments = matchedInstruments;
    },
    async onSave() {
      if (!(await this.validate())) {
        return;
      }
      if(isNil(this.item.marginRatioByMoney) && isNil(this.item.marginRatioByVolume)) {
        this.$Message.error('配置项不能全为空，至少有一项有值')
        return
      }
      let data = { ...this.item };
      delete data.instrumentCategoryQctKey
      delete data.instrumentQctKey
      await api.save(data);
      this.backToList();
    },
    validate() {
      return this.$refs["ManageForm"].validate(valid => valid);
    },
    backToList() {
      this.$router.push({
        name: "AcMarginRateConfiguration"
      });
    }
  }
};
</script>

