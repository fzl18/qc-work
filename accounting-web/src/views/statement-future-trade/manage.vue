<template>
  <div>
    <Form :label-width="80"
          :id="formName"
          :ref="formName"
          :model="model"
          :rules="modelRules">
      <Row type="flex" >
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="结算日期" prop="settlementDate" required>
            <DatePicker
              type="date"
              placement="bottom-end"
              placeholder
              v-model="model.settlementDate"
            />
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="成交日期" prop="tradeDate" required>
            <DatePicker
              type="date"
              placement="bottom-end"
              placeholder
              :options="options1"
              v-model="model.tradeDate"
            />
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="资金账户" prop="tradeAccountId" required>
            <Select filterable clearable v-model="model.tradeAccountId">
              <Option v-for="(item, index) in tradeAccounts"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.value}} - {{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="标准合约" prop="instrumentCategoryId" required>
            <Select filterable clearable v-model="model.instrumentCategoryId" @on-change="onVolumeOrPriceChange">
              <Option v-for="(item, index) in commonData.instrumentCategories"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.value}} - {{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="具体合约" prop="instrumentId" required>
            <InstrumentSelect
                    :filterQuery="instrumentQuery"
                    v-model="model.instrumentId"></InstrumentSelect>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="方向" prop="isBuy" required>
            <Select filterable clearable v-model="model.isBuy">
              <Option v-for="(item, index) in directions"
                      :label="item.text"
                      :value="item.value"
                      :key="index">{{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="成交手数" prop="volume">
            <Input v-model="model.volume" clearable @on-keyup="onVolumeOrPriceChange" type="number" title=""/>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="成交价格" prop="price" required>
            <Input v-model="model.price" clearable type="number" @on-keyup="onVolumeOrPriceChange" title="">
              <Button slot="append">{{ currencyText }}{{unitText && currencyText ? '/' : ''}}{{unitText}}</Button>
            </Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="成交金额" prop="totalAmount" required>
            <Input v-model="model.totalAmount" clearable type="number" title="">
              <Button slot="append">{{currencyText}}</Button>
            </Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="手续费" prop="commission" required>
            <Input v-model="model.commission" clearable type="number">
              <Button slot="append">{{currencyText}}</Button>
            </Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="平仓盈亏" prop="closingProfitLoss">
            <Input v-model="model.closingProfitLoss" clearable type="number">
              <Button slot="append">{{currencyText}}</Button>
            </Input>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="开/平" prop="isClose">
            <Select filterable clearable v-model="model.isClose">
              <Option v-for="(item, index) in openCloseList"
                      :label="item.text"
                      :value="item.value"
                      :key="index">{{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="投机/保值" prop="hedgeFlagType">
            <Select filterable clearable v-model="model.hedgeFlagType">
              <Option v-for="(item, index) in hedgeFlagTypes"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="成交时间" prop="tradeTime">
<!--            <DatePicker type="datetime"-->
<!--                        placement="bottom-end"-->
<!--                        placeholder-->
<!--                        v-model="model.tradeTime"-->
<!--            />-->
            <TimePicker type="time" placeholder v-model="model.tradeTime"></TimePicker>
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="成交序号" prop="tradeNumber">
            <Input v-model="model.tradeNumber" clearable/>
          </FormItem>
        </Col>
        <Col :span="24" class-name="margin-bottom-10">
          <FormItem label="备注" prop="remark">
            <Input type="textarea" :rows="4" v-model="model.remark" clearable/>
          </FormItem>
        </Col>
        <Col span="24">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="goBack">返回</Button>
            <Button type="primary" @click="doSave">保存</Button>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
  import { utils } from '@/utils/utils';
  import api from './api';
  import BigNumber from 'big-number';

  export default {
    name: 'StatementFutureTradeDetail',
    props: [ 'action', 'id' ],
    async created() {
      await this.getCommonData();
      if (this.isEdit && this.id) {
        await this.getDetail(this.id);
      }
    },
    data() {
      return {
        formName: 'statementFutureTradeForm',
        model: {
          id: '',
          tradeDate: '',
          settlementDate: '',
          accountingEntityId: '',
          accountingEntity: '',
          corporationId: '',
          corporation: '',
          tradeAccountId: '',
          tradeAccount: '',
          instrumentCategoryId: '',
          instrumentId: '',
          exchange: '',
          commodityType: '',
          commodityTypeId: '',
          instrumentCode: '',
          volume: '',
          price: '',
          totalAmount: '',
          commission: '',
          isBuy: '',
          isClose: '',
          isHistory: '',
          isVirtual: '',
          trader: '',
          operator: '',
          tradingStrategyId: '',
          tradingStrategy: '',
          tradeTime: '',
          tradeNumber: '',
          requestNumber: '',
          remark: '',
          lastManipulationTime: '',
          lastManipulationBy: '',
          isLocked: '',
          isDeleted: '',
          dataSourceType: '',
          fillId: '',
          hedgeFlagType: '',
          subAccount: '',
          isBuyText: '',
          isCloseText: '',
          isHistoryText: '',
          isVirtualText: '',
          dataSourceTypeText: '',
          lastManipulationByText: '',
          closingProfitLoss: ''
        },
        modelRules: {
          volume: [
            {
              required: true
            },
            {
              min: 0
            }
          ]
        },
        commonData: {
          commodityTypes: [],
          instrumentCategories: [],
          corporations: [],
          tradeAccounts: [],
          users: []
        },
        unitText: '',
        currencyText: '',
        lotSize: null,
        directions: [ { text: '买', value: 'true' }, { text: '卖', value: 'false' } ],
        openCloseList: [ { text: '开', value: 'false' }, { text: '平', value: 'true' } ],
        historyList: [ { text: '今', value: 'false' }, { text: '昨', value: 'true' } ],
        hedgeFlagTypes: [{ text: '投机', value: '投机' }, { text: '保值', value: '保值' }]
      };
    },
    methods: {
      onVolumeOrPriceChange () {
        if (this.model.volume && this.model.price && this.lotSize) {
          this.model.totalAmount = BigNumber(this.model.volume).mult(this.model.price).mult(this.lotSize).val();
        }
      },
      async getCommonData() {
        this.commonData = await api.getCommonData();
      },

      async getDetail(id) {
        if (id) {
          const data = await api.getDetail(id);
          data.isBuy += '';
          data.isClose += '';
          data.isHistory += '';
          data.volume += '';
          data.tradeTime = data.tradeTimeAsLongTimeStr;
          this.model = data;
        }
      },

      doSave() {
        this.$refs[this.formName].validate(async (valid) => {
          if (valid) {
            // this.model.tradeDate = utils.formatDate(this.model.tradeTime);
            await api.save(this.model);
            this.$Message.success('保存成功');
            this.goBack();
          }
        });
      },

      goBack() {
        this.$router.push({
          name: 'StatementFutureTradeList'
        });
      }
    },
    watch: {
      'model.instrumentCategoryId' (val) {
        let instrumentCategoryObj = this.commonData.instrumentCategories.find(o => {
          return o.value === val;
        });
        if (instrumentCategoryObj) {
          this.unitText = instrumentCategoryObj.unitId;
          this.currencyText = instrumentCategoryObj.currencyId;
          this.lotSize = instrumentCategoryObj.lotSize;
        }
      }
    },
    computed: {
      tradeAccounts () {
        return this.commonData.tradeAccounts.filter(o => !o.isDisabled);
      },
      options1 () {
        const self = this;
        return {
          disabledDate (date) {
            return date && date.valueOf() > self.model.settlementDate;
          }
        }
      },
      isEdit() {
        return this.action === 'edit';
      },
      instrumentQuery () {
        const instrumentCategoryText = utils.showText(this.commonData.instrumentCategories, this.model.instrumentCategoryId)
        return [{
          key: 'instrumentCategoryId',
          text: '标准合约',
          id: this.model.instrumentCategoryId,
          code: `${this.model.instrumentCategoryId ? instrumentCategoryText : ''}`,
          required: true
        }];
      }
    }
  };
</script>
