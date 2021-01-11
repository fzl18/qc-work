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
            <Select placeholder="交易所" filterable clearable :disabled="isEdit" v-model="model.exchangeId">
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
            <Select placeholder="标准合约" filterable clearable :disabled="isEdit" v-model="model.instrumentCategoryId">
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
                 class="margin-bottom-10"
                 :columns="columns"
                 :data="model.acMarginTiers"/>
        </Col>
        <Col span="24">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="goBack">返回</Button>
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
    name: 'AcMarginTierDetail',
    props: [ 'action', 'exchangeId', 'instrumentCategoryId', 'accountingDate' ],
    async created() {
      await this.getCommonData();
      const exchangeId = this.exchangeId;
      const instrumentCategoryId = this.instrumentCategoryId;
      const accountingDate = this.accountingDate;
      if (this.isEdit && exchangeId && instrumentCategoryId && accountingDate) {
        await this.getDetail(exchangeId, instrumentCategoryId, accountingDate);
      }
    },
    data() {
      return {
        formName: 'acMarginTierForm',
        model: {
          accountingDate: '',
          exchangeId: '',
          instrumentCategoryId: '',
          acMarginTiers: []
        },
        modelRules: {},
        commonData: {
          exchanges: [],
          instrumentCategories: [],
          options: {}
        },
        columns: [
          {
            title: '期间编号',
            key: 'tier',
            align: 'center',
          },
          {
            title: '合约开始月份',
            key: 'starts',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  type: 'text',
                  maxlength: 7,
                  value: params.row.starts
                },
                on: {
                  'on-change': (e) => {
                    this.$set(this.model.acMarginTiers[params.index], 'starts', e.currentTarget.value);
                  }
                }
              });
            }
          },
          {
            title: '合约结束月份',
            key: 'ends',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  type: 'text',
                  maxlength: 7,
                  value: params.row.ends
                },
                on: {
                  'on-change': (e) => {
                    this.$set(this.model.acMarginTiers[params.index], 'ends', e.currentTarget.value);
                  }
                }
              });
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 120,
            // eslint-disable-next-line no-unused-vars
            renderHeader: (h, _) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'md-add',
                    size: 24
                  },
                  on: {
                    click: () => {
                      this.addRow();
                    }
                  }
                })
              ]);
            },
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'md-remove',
                    size: 24
                  },
                  style: {
                    textAlign: 'center',
                    display: (this.model.acMarginTiers.length - 1) === (params.index) ? 'block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.deleteRow();
                    }
                  }
                })
              ]);
            }
          },
        ],
        itemOfList: {
          id: '',
          tier: 0,
          starts: '',
          ends: '',
          isDeleted: '',
          builtIn: '',
          lastManipulationTime: '',
          lastManipulatorId: ''
        }
      };
    },
    methods: {
      async getCommonData() {
        this.commonData = await api.getCommonData('AcMarginTier');
      },

      async getDetail(exchangeId, instrumentCategoryId, accountingDate) {
        if (exchangeId && instrumentCategoryId && accountingDate) {
          this.model = await api.getDetail({
            exchangeId,
            instrumentCategoryId,
            accountingDate
          });
        }
      },

      addRow() {
        const item = Object.assign({}, this.itemOfList);
        item.tier = this.model.acMarginTiers.length + 1;
        this.model.acMarginTiers.push(item);
      },

      deleteRow() {
        this.model.acMarginTiers.pop();
      },

      deleteTableData() {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>将删除全部合约月份信息，确认继续？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            this.model.acMarginTiers = [];
          }
        });
      },

      doSave() {
        this.$refs[this.formName].validate(async (valid) => {
          if (valid) {
            if (this.model.acMarginTiers.length === 0) {
              this.$Message.info('必须至少有一条合约月份信息');
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
          name: 'AcMarginTierList'
        });
      }
    },
    computed: {
      instrumentCategoriesFilterByExchange() {
        return this.commonData.instrumentCategories.filter(item => item.marketId === this.model.exchangeId);
      },
      isEdit() {
        return this.action === 'edit'
      }
    }
  };
</script>
