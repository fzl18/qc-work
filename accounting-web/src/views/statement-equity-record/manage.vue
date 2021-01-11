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
      <Row type="flex" align="middle">
        <Col span="24" class-name="margin-bottom-10">
          <Row type="flex" >
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="结算日期" prop="settlementDate" required>
                <DatePicker
                    type="date"
                    confirm
                    placement="bottom-start"
                    placeholder
                    v-model="item.settlementDate"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="发生日期" prop="happenedDate" required>
                <DatePicker
                    type="date"
                    confirm
                    placement="bottom-start"
                    placeholder
                    v-model="item.happenedDate"
                    :options="options1"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="资金账户" prop="tradeAccountId" required>
                <Select placeholder filterable clearable v-model="item.tradeAccountId">
                  <Option
                      v-for="(item, index) in commonData.tradeAccounts.filter(o => !o.isDisabled)"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
                  >{{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="权益类型" prop="equityTypeId" required>
                <Select placeholder filterable clearable v-model="item.equityTypeId">
                  <Option
                      v-for="(item, index) in equityTypes"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
                  >{{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10 custom-error">
              <FormItem label="金额" prop="amount" required>
                <Input v-model="item.amount" type="number" title="">
                  <Button slot="append">{{currency}}</Button>
                </Input>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="业务类型" prop="businessTypeId" :required="exchangeRequired">
                <Select placeholder filterable clearable v-model="item.businessTypeId">
                  <Option
                    v-for="(item, index) in businessType"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="交易所" prop="exchageId" :required="exchangeRequired">
                <Select placeholder filterable clearable v-model="item.exchageId">
                  <Option
                    v-for="(item, index) in allExchanges"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="品类" prop="commodityTypeId" :required="exchangeRequired">
                <Select placeholder filterable clearable v-model="item.commodityTypeId">
                  <Option
                    v-for="(item, index) in commonData.commodityTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="24" :md="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="备注" prop="remark">
                <Input type="textarea" :rows="5" v-model="item.remark"/>
              </FormItem>
            </Col>
            <div style="color: orange">
              <Icon type="md-alert" style="font-size: 20px;" color="orange"/>
              为了结算单盈亏整体统计，当权益类型的科目为交易费用或交易盈亏时，业务类型、交易所、品类必填。
            </div>
          </Row>
        </Col>
        <Divider/>
        <Col span="24">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="backToList">返回</Button>
            <Button type="primary" class="margin-right-3" @click="onSave">保存</Button>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
  import api from './api';

  export default {
    name: 'Account-Equity-Allocation',
    props: [ 'id' ],
    data() {
      return {
        commonData: {
          tradeAccounts: [],
          allEquityTypes: [],
          allExchanges: [],
          businessType: []
        },
        currency: '',
        item: {
          id: '',
          creationTime: '',
          lastManipulationTime: '',
          creatorId: '',
          lastManipulatorId: '',
          isLocked: '',
          isDeleted: '',
          remark: '',
          settlementDate: '',
          tradeAccountId: '',
          equityTypeId: '',
          ptlTradeAccountText: '',
          ptlEquityTypeText: '',
          ptlLastManipulatorText: '',
          amount: null,
          commodityTypeId: null,
          businessTypeId: '',
          exchageId: '',
          happenedDate: '',
          currencyId: ''
        },
        equityTypes: [],
        itemRules: {},
        isEdit: !!this.id
      };
    },
    async created() {
      let commonData = await api.getCommonData();
      this.equityTypes = _.filter(commonData.allEquityTypes, function (o) {
        return !o.isDisabled;
      });
      this.commonData = commonData;
      if (this.isEdit) {
        this.item = await api.getById(this.id);
      }
    },
    watch: {
      'item.tradeAccountId' (val) {
        const obj = this.commonData.tradeAccounts.find(o => o.value === val);
        this.item.currencyId = obj ? obj.currencyId : ''
        this.currency = obj ? obj.currency : ''
      }
    },
    computed: {
      allExchanges () {
        return this.commonData.allExchanges.filter(o => !o.isDisabled)
      },
      businessType () {
        return this.commonData.businessType.filter(o => !o.isDisabled)
      },
      options1 () {
        const self = this;
        return {
          disabledDate (date) {
            return date && date.valueOf() > self.item.settlementDate;
          }
        }
      },
      exchangeRequired () {
        var obj = this.commonData.allEquityTypes.find(o => o.value === this.item.equityTypeId)
        return obj ? obj.subType.text === '交易费用' || obj.subType.text === '交易盈亏' : false
      }
    },
    methods: {
      async onSave() {
        if (!(await this.validate())) {
          return;
        }
        let data = { ...this.item };
        if (this.isEdit) {
          await api.save(data);
        } else {
          await api.create(data);
        }
        this.backToList();
      },

      validate() {
        return this.$refs['ManageForm'].validate(valid => valid);
      },

      backToList() {
        this.$router.push({
          name: 'StatementEquityRecordList'
        });
      }
    }
  };
</script>

