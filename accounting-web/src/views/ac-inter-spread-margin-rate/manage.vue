<template>
  <div>
    <Divider/>
    <Form :label-width="80"
          :id="formName"
          :ref="formName"
          :model="model"
          :rules="modelRules">
      <Row type="flex" :gutter="4">
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="生效日期" prop="accountingDate" required>
            <DatePicker type="date"
                        placement="bottom-end"
                        placeholder
                        :disabled="isEdit"
                        v-model="model.accountingDate"
            />
          </FormItem>
        </Col>
        <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
          <FormItem label="交易所" prop="exchangeId" required>
            <Select placeholder="" filterable clearable :disabled="isEdit" v-model="model.exchangeId">
              <Option v-for="(item, index) in commonData.exchanges"
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
            <Select placeholder="" filterable clearable :disabled="isEdit" v-model="model.instrumentCategoryId">
              <Option v-for="(item, index) in instrumentCategoriesFilterByExchange"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.text}}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Divider/>
        <Col span="24">
          <Table size="small"
                 border
                 max-height="600"
                 class="margin-bottom-10"
                 :columns="columns"
                 :data="model.acInterSpreadMarginRates"/>
        </Col>
        <Col span="24">
          <Row type="flex">
            <Button type="default"  class="margin-right-3" @click="goBack">返回</Button>
            <Button type="primary" class="margin-right-3" @click="doSave">保存</Button>
            <Button type="error" class="margin-right-3" @click="deleteTableData">删除</Button>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
  import api from './api';

  export default {
    name: 'AcInterSpreadMarginRateDetail',
    props: [ 'action', 'exchangeId', 'instrumentCategoryId', 'accountingDate' ],
    async created() {
      await this.getCommonData();
      const exchangeId = this.exchangeId;
      const instrumentCategoryId = this.instrumentCategoryId;
      const accountingDate = this.accountingDate;
      if (!this.isEdit) {
        this.addWatcher();
      }
      if (this.isEdit && accountingDate && exchangeId && instrumentCategoryId) {
        await this.getDetail(accountingDate, exchangeId, instrumentCategoryId);
      }
    },
    data() {
      return {
        formName: 'acInterSpreadMarginRateForm',
        model: {
          accountingDate: '',
          exchangeId: '',
          instrumentCategoryId: '',
          acInterSpreadMarginRates: []
        },
        modelRules: {},
        commonData: {
          exchanges: [],
          instrumentCategories: [],
          options: {}
        },
        columns: [
          {
            title: '期间编号A',
            key: 'tierA',
            align: 'center',
          },
          {
            title: '期间编号B',
            key: 'tierB',
            align: 'center',
          },
          {
            title: '每手保证金',
            key: 'marginPerLot',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.marginPerLot
                },
                style: {
                  width: '100%'
                },
                on: {
                  'on-change': (e) => {
                    this.$set(this.model.acInterSpreadMarginRates[params.index], 'marginPerLot', e.currentTarget.value - 0);
                  }
                }
              });
            }
          }
        ],
        acMarginTierCount: 0
      };
    },
    methods: {
      async getCommonData() {
        this.commonData = await api.getCommonData('AcInterSpreadMarginRate');
      },

      async getDetail(accountingDate, exchangeId, instrumentCategoryId) {
        if (accountingDate && exchangeId && instrumentCategoryId) {
          const data = await api.getDetail({
            accountingDate,
            exchangeId,
            instrumentCategoryId
          });
          await this.getCount(accountingDate, exchangeId, instrumentCategoryId);
          this.model = data;
        }
      },

      async getCount(accountingDate, exchangeId, instrumentCategoryId) {
        if (accountingDate && exchangeId && instrumentCategoryId) {
          this.acMarginTierCount = await api.getAcMarginTierCount({
            accountingDate,
            exchangeId,
            instrumentCategoryId
          });
          if (!this.isEdit) {
            this.generateMatrixTable(this.acMarginTierCount);
          }
        }
      },

      addWatcher() {
        this.$watch('model.accountingDate', function (newVal) {
          this.getCount(newVal, this.model.exchangeId, this.model.instrumentCategoryId);
        });
        this.$watch('model.exchangeId', function (newVal) {
          this.getCount(this.model.accountingDate, newVal, this.model.instrumentCategoryId);
        });
        this.$watch('model.instrumentCategoryId', function (newVal) {
          this.getCount(this.model.accountingDate, this.model.exchangeId, newVal);
        });
      },

      deleteTableData() {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>将删除全部期间保证金数据，确认继续？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            this.model.acInterSpreadMarginRates = [];
          }
        });
      },

      generateMatrixTable(count) {
        let t = [];
        for (let i = 1; i <= count; i++) {
          for (let j = i; j <= count; j++) {
            t.push({
              id: null,
              tierA: i,
              tierB: j,
              isDeleted: '',
              marginPerLot: null,
              lastManipulationTime: null,
              lastManipulatorId: null
            });
          }
        }

        this.model.acInterSpreadMarginRates = t;
      },

      doSave() {
        this.$refs[this.formName].validate(async (valid) => {
          if (valid) {
            if (this.model.acInterSpreadMarginRates.length === 0) {
              this.$Message.info('必须至少有一行期间保证金信息');
              return;
            }
            const hasNullMarginPerLot = this.model.acInterSpreadMarginRates.some(t => !t.marginPerLot);
            if (hasNullMarginPerLot) {
              this.$Message.info('每手保证金不能为空');
              return;
            }
            await api.save(this.model);
            this.$Message.success('保存成功');
            this.goBack();
          }
        });
      },

      goBack() {
        this.$router.push({
          name: 'AcInterSpreadMarginRateList'
        });
      }
    },
    computed: {
      instrumentCategoriesFilterByExchange() {
        return this.commonData.instrumentCategories.filter(item => item.marketId === this.model.exchangeId);
      },
      isEdit() {
        return this.action === 'edit';
      }
    }
  };
</script>
