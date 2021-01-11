<template>
  <Tabs :animated="false" v-model="currentTab">
    <TabPane name="0" label="压测配置">
      <Alert type="info" closable>
        使用说明
        <template slot="desc">
          在查看报表前，请先配置压测配置中的基本配置信息，然后点击生成压测指标，在确认压测指标清单无误后，点击开始测算即可！
        </template>
      </Alert>
      <Form :ref="formName" :model="model" :rules="modelRules" :label-width="100">
        <Card class="margin-bottom-10">
          <p slot="title">基本配置</p>
          <Row type="flex" :gutter="4">
            <Col :span="24" class="margin-bottom-10">
              <FormItem label="压测利润中心" prop="accountingEntityList" required>
                <Select v-model="model.accountingEntityList" multiple transfer filterable>
                  <Option v-for="(item, index) in commonData.profitCenters" :key="index" :value="item.value">
                    {{item.text}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Divider/>
            <h3 class="full-width st-form-label">压测通用配置</h3>
            <Col :span="8" class="margin-bottom-10">
              <FormItem label="测算方式" prop="stressTestMethod" required>
                <RadioGroup v-model="model.stressTestMethod">
                  <Radio v-for="(item, index) in stressTestMethodList" :key="index" :label="item.key">{{item.value}}
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col :span="8" class="margin-bottom-10">
              <FormItem label="测算次数" prop="stressTestCount" required>
                <InputNumber class="full-width" placeholder="请输入1~20的整数" :precision="0" :max="20" :min="1"
                             v-model="model.stressTestCount"></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" :gutter="4" class="margin-bottom-10">
            <Divider/>
            <h3 class="full-width st-form-label">压测对象配置</h3>
            <Col span="24">
              <Table border
                     max-height="500"
                     :columns="pressureTestConfigObjectColumns"
                     :data="model.stressTestObjConfigs"/>
            </Col>
          </Row>
          <Button type="primary" @click="generatePressureMeasureIndicators">生成压测指标</Button>
        </Card>
        <Card>
          <p slot="title">压测指标清单</p>
          <Alert type="info" closable>以下压测指标 根据压测对象配置自动生成，可手动修改变动值，确认无误后，可点击开始测算进行系统压力测试。</Alert>
          <Row type="flex" justify="end" :gutter="4" class="margin-bottom-10">
            <Col span="24">
              <Table class="margin-bottom-10" border max-height="600"
                     :loading="isGettingPressureIndicatorLoading"
                     :columns="pressureTestIndicatorListingColumns"
                     :data="pressureTestIndicatorListingData"/>
            </Col>
            <Col span="1.5">
              <Button type="primary" @click="generateStressTestReport">开始测算</Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </TabPane>
    <TabPane name="1" label="查看报表">
      <div v-if="couldNotViewReport" @click="goPressureTestConfigTab">
        <Alert type="info">未配置过压力检测，请切换到<strong class="ivu-tag-color-success">压测配置</strong>面板进行配置操作，或者点击<strong
            class="ivu-tag-color-success">开始配置</strong>。
        </Alert>
      </div>
      <Row type="flex" justify="end" :gutter="4">
        <Col span="1.5" class="margin-bottom-10">
          <Button type="default" class="margin-right-3" @click="goPressureTestConfigTab">返回压测配置</Button>
          <Button type="primary" v-if="isShow('H_ExportAcStressTestReport')" :disabled="couldNotViewReport" @click="doExportStressTestReport">导出</Button>
        </Col>
        <Col span="24">
          <Table ref="reportTable" class="margin-bottom-10" border
                 :row-class-name="rowClassName"
                 :columns="stressTestReportColumns"
                 :data="stressTestReportData"/>
          <p>注：总利润、小计、总计的单位：万元</p>
        </Col>
      </Row>
    </TabPane>
  </Tabs>
</template>

<script>
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    name: 'StressTestList',
    async created() {
      await this.getCommonData();
    },
    data() {
      return {
        numberConfig: {
          symbol: '',
          decimal: '.',
          thousand: '',
          precision: 2,
          format: '%s%v'
        },
        currentTab: '0',
        formName: 'stressTestForm',
        commonData: {
          stressTestObj: [],
          currencies: [],
          profitCenters: [],
          commodityTypes: []
        },
        stressTestMethodList: [
          {
            key: 0,
            value: '按比例'
          },
          {
            key: 1,
            value: '按数值'
          }
        ],
        model: {
          accountingEntityList: [],
          stressTestCount: null,
          stressTestMethod: 0, // 0 ：按比例  1：按数值
          stressTestObjConfigs: []
        },
        modelRules: {},
        pressureTestConfigObjectColumns: [
          {
            title: '压测对象',
            key: 'stressTestObjName',
            align: 'center',
            render: (h, params) => {
              const vm = this;
              const options = this.commonData.stressTestObj.map(item => h('Option', {
                props: {
                  value: item.text
                }
              }, item.text));

              return h('Select', {
                props: {
                  value: params.row.stressTestObjName,
                  transfer: true,
                  filterable: true
                },
                on: {
                  'on-change': function (v) {
                    const stressTestObjNames = vm.model.stressTestObjConfigs.map(t => t.stressTestObjName);
                    vm.hasDuplicatedStressTestObjName = stressTestObjNames.includes(v);
                    if (vm.hasDuplicatedStressTestObjName) {
                      vm.$Message.info('压测对象不能重复');
                    }
                    vm.$set(vm.model.stressTestObjConfigs[params.index], 'stressTestObjName', v);
                  }
                }
              }, options);
            }
          },
          {
            title: '压测下限',
            key: 'stressTestLowerLimit',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.stressTestLowerLimit,
                  type: 'number'
                },
                on: {
                  'on-change': (e) => {
                    if (!e.currentTarget.value) {
                      this.$set(this.model.stressTestObjConfigs[params.index], 'stressTestLowerLimit', e.currentTarget.value);
                      return;
                    }
                    this.$set(this.model.stressTestObjConfigs[params.index], 'stressTestLowerLimit', e.currentTarget.value - 0);
                  }
                }
              }, [
                h('span', {
                  slot: this.isRatio ? 'append' : ''
                }, '%')
              ]);
            }
          },
          {
            title: '压测上限',
            key: 'stressTestUpperLimit',
            align: 'center',
            render: (h, params) => {
              return h('Input', {
                props: {
                  value: params.row.stressTestUpperLimit,
                  type: 'number'
                },
                on: {
                  'on-change': (e) => {
                    if (!e.currentTarget.value) {
                      this.$set(this.model.stressTestObjConfigs[params.index], 'stressTestLowerLimit', e.currentTarget.value);
                      return;
                    }
                    this.$set(this.model.stressTestObjConfigs[params.index], 'stressTestUpperLimit', e.currentTarget.value - 0);
                  }
                }
              }, [
                h('span', {
                  slot: this.isRatio ? 'append' : ''
                }, '%')
              ]);
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
                    color: '#19be6b',
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
                    color: '#ed4014',
                    size: 24
                  },
                  style: {
                    textAlign: 'center'
                  },
                  on: {
                    click: () => {
                      this.deleteRow(params);
                    }
                  }
                })
              ]);
            }
          }
        ],
        pressureTestIndicatorListingColumns: [],
        pressureTestIndicatorListingData: [],
        currencyCommodities: [],
        configModel: {
          currencyId: '',
          commodityTypeId: '',
          stressTestUpperLimit: null,
          stressTestLowerLimit: null,
          stressTestObjName: ''
        },
        stressTestIndicatorModel: {
          indicatorIndex: null,
          currencyId: '',
          commodityTypeId: '',
          indicatorValue: null,
          stressTestObjName: '',
          stressTestIndicatorName: ''
        },
        stressTestReportColumns: [],
        stressTestReportData: [],
        totalProfitSumItem: {
          totalProfitSumTotal: null,
          indicatorTotalProfitSumTotal: {}
        },
        isGettingPressureIndicatorLoading: false,
        hasDuplicatedStressTestObjName: false
      };
    },
    computed: {
      isRatio() {
        return this.model.stressTestMethod === 0;
      },
      couldNotViewReport() {
        return this.pressureTestIndicatorListingData.length === 0;
      }
    },
    methods: {
      async getCommonData() {
        this.commonData = await api.getCommonData();
      },

      generatePressureMeasureIndicators() {
        this.$refs[this.formName].validate(async (valid) => {
          const data = Object.assign({}, this.model);
          if (valid) {
            if (data.stressTestObjConfigs.length === 0) {
              this.$Message.info('压测对象配置至少要有一行');
              return;
            }
            const hasNilOfStressTestObj = data.stressTestObjConfigs.some(t => !t.stressTestObjName);
            if (hasNilOfStressTestObj) {
              this.$Message.info('压测对象不能为空');
              return;
            }
            const objNames = data.stressTestObjConfigs.map(t => t.stressTestObjName)
            if (objNames.length > [...new Set(objNames)].length) {
              this.$Message.info('压测对象不能重复');
              return;
            }
            data.stressTestObjConfigs = data.stressTestObjConfigs.map(t => {
              const target = this.commonData.stressTestObj.find(o => o.text === t.stressTestObjName);
              t.currencyId = target.currencyId;
              t.commodityTypeId = target.commodityTypeId;
              return t;
            });
            this.isGettingPressureIndicatorLoading = true;
            this.pressureTestIndicatorListingData = await api.generatePressureMeasureIndicators(data).finally(() => {
              this.isGettingPressureIndicatorLoading = false;
            });
            this.generateIndicatorTable(this.pressureTestIndicatorListingData);
          }
        });
      },

      /**
       * 生成 压测指标清单 表格
       * @param data `api.generatePressureMeasureIndicators`接口返回数据
       */
      generateIndicatorTable(data) {
        const indicatorIndexes = [ ...new Set(data.map(row => row.indicatorIndex)) ]; // 行索引
        const stressTestObjNames = data
          .filter(item => item.indicatorIndex === indicatorIndexes[0])
          .map(row => ({
            title: row.stressTestObjName,
            key: row.currencyId + '*' + row.commodityTypeId,
            align: 'center',
            render: (h, param) => {
              return h('Input', {
                props: {
                  value: param.row[row.currencyId + '*' + row.commodityTypeId],
                  type: 'number'
                },
                on: {
                  'on-change': (e) => {
                    this.$set(
                      this.pressureTestIndicatorListingData[param.index],
                      row.currencyId + '*' + row.commodityTypeId,
                      e.currentTarget.value - 0
                    );
                  }
                }
              }, [
                h('span', {
                  slot: this.isRatio ? 'append' : ''
                }, '%')
              ]);
            }
          }));
        stressTestObjNames.unshift({ title: ' ', key: 'stressTestIndicatorName', align: 'center' }); // 第一列表头

        let bodyData = [];
        indicatorIndexes.forEach(item => {
          const rowData = data.filter(t => t.indicatorIndex === item);
          const conRowData = rowData.reduce((acc, cur) => {
            return {
              ...acc,
              indicatorIndex: cur.indicatorIndex,
              stressTestIndicatorName: cur.stressTestIndicatorName,
              [cur.currencyId + '*' + cur.commodityTypeId]: utils.formatAmount(cur.indicatorValue, this.numberConfig)
            };
          }, {});
          bodyData.push(conRowData);
        });

        this.pressureTestIndicatorListingColumns = stressTestObjNames;
        this.pressureTestIndicatorListingData = bodyData;
      },

      // [{ [currencyId*commodityTypeId]: indicatorValue, ... }] 转化成后台数据结构. Ex: { '1111*10': 1, '1111*11': 2, .... } => 转成对应行 [{ 1111: '..', 10: '..', indicatorValue: 1 }, { 1111: '..', 11: '..', indicatorValue: 2 }]
      generateStressTestReport() {
        const data = this.pressureTestIndicatorListingData.reduce((acc, curr) => {
          const keys = Object.keys(curr);
          let tmp = [];
          keys.forEach(key => {
            if (key.includes('*')) {
              const [ currencyId, commodityTypeId ] = key.split('*');
              const target = this.pressureTestIndicatorListingColumns.find(col => col.key === key);
              const a = {
                indicatorIndex: curr.indicatorIndex,
                currencyId: currencyId - 0,
                commodityTypeId: commodityTypeId - 0,
                indicatorValue: utils.formatAmount(curr[key], this.numberConfig),
                stressTestObjName: target.title,
                stressTestIndicatorName: curr.stressTestIndicatorName
              };
              tmp.push(a);
            }
          });
          return [ ...acc, ...tmp ];
        }, []);
        api.getStressTestReport({
          stressTestMehod: this.model.stressTestMethod,
          accountEntityIds: this.model.accountingEntityList,
          stressTestIndicatorDtos: data
        })
          .then(t => {
            if (t['totalProfitSumItem'] && t['stressTestReportDtos']) {
              this.totalProfitSumItem = t['totalProfitSumItem'];
              this.generateReportTable(t['stressTestReportDtos']);
              this.currentTab = '1'; // 切换到查看报表Tab
            }
          });
      },

      /**
       * 生成压测报表
       * @param tableData 接口返回的 列表 数据
       */
      generateReportTable(tableData) {
        const constColumns = [
          {
            title: '利润中心',
            key: 'accountingEntityName',
            minWidth: 120,
            align: 'center'
          },
          {
            title: '压测对象',
            key: 'stressTestObjName',
            minWidth: 100,
            align: 'center',
          },
          {
            title: '总利润',
            key: 'totalProfit',
            minWidth: 100,
            align: 'right',
            render: (h, params) => {
              if (params.row.totalProfit < 0) {
                return h('span', {
                  style: {
                    color: 'red'
                  }
                }, '(' + utils.formatAmount(Math.abs(params.row.totalProfit), this.numberConfig) + ')');
              }
              return h('span', utils.formatAmount(params.row.totalProfit, this.numberConfig));
            }
          }
        ];
        // 生成报表表头
        if (tableData.length === 0) {
          return;
        }
        const dynamicColumns = Array.from({ length: this.model.stressTestCount }, (v, i) => i + 1).map(item => {
          return {
            title: '压测指标' + item,
            align: 'center',
            children: [
              {
                title: '变动值',
                key: 'indicatorValue' + item,
                minWidth: 100,
                align: 'right'
              },
              {
                title: '总利润',
                key: 'totalProfitIndicator' + item,
                minWidth: 100,
                align: 'right',
                render: (h, params) => {
                  if (params.row['totalProfitIndicator' + item] < 0) {
                    return h('span', {
                      style: {
                        color: 'red'
                      }
                    }, '(' + utils.formatAmount(Math.abs(params.row['totalProfitIndicator' + item]), this.numberConfig) + ')');
                  }
                  return h('span', utils.formatAmount(params.row['totalProfitIndicator' + item], this.numberConfig));
                }
              }
            ]
          };
        });
        this.stressTestReportColumns = [ ...constColumns, ...dynamicColumns ];

        // 生成报表数据
        let totalIndex = [];
        const stressTestReportData = tableData.reduce((acc, block) => {
          const sumIndex = [];
          const blockData = block.stressTestObjs.map((item, itemIndex) => {
            const dynamicCol = item.stressTestIndicatorDetails.reduce((accIndicator, elem) => {
              if (itemIndex === 0) {
                sumIndex.push(elem.indicatorIndex + '');
              }

              return {
                ...accIndicator,
                ['indicatorValue' + elem.indicatorIndex]: utils.formatAmount(elem.indicatorValue, this.numberConfig) + (this.isRatio ? '%' : ''),
                ['totalProfitIndicator' + elem.indicatorIndex]: elem.totalProfitIndicator
              };
            }, {});
            return {
              'accountingEntityId': block.accountingEntityId,
              'currencyId': item.currencyId,
              'commodityTypeId': item.commodityTypeId,
              'totalProfit': item.totalProfit,
              'accountingEntityName': block.accountingEntityName,
              'stressTestObjName': item.stressTestObjName,
              ...dynamicCol
            };
          });
          const sumData = {
            'totalProfit': block.totalProfitSum,
            'accountingEntityName': '小计'
          };
          const stressTestIndicatorSum = block.stressTestIndicatorSum;
          sumIndex.forEach(item => {
            sumData['totalProfitIndicator' + item] = stressTestIndicatorSum[item];
          });
          totalIndex = sumIndex;
          return [ ...acc, ...blockData, sumData ];
        }, []);

        const totalData = {
          'totalProfit': this.totalProfitSumItem.totalProfitSumTotal,
          'accountingEntityName': '总计'
        };
        const stressTestIndicatorSum = this.totalProfitSumItem.indicatorTotalProfitSumTotal;
        totalIndex.forEach(item => {
          totalData['totalProfitIndicator' + item] = stressTestIndicatorSum[item];
        });

        stressTestReportData.push(totalData);
        this.stressTestReportData = stressTestReportData;
      },

      goPressureTestConfigTab() {
        this.currentTab = '0';
      },

      async doExportStressTestReport() {
        const data = this.pressureTestIndicatorListingData.reduce((acc, curr) => {
          const keys = Object.keys(curr);
          let tmp = [];
          keys.forEach(key => {
            if (key.includes('*')) {
              const [ currencyId, commodityTypeId ] = key.split('*');
              const target = this.pressureTestIndicatorListingColumns.find(col => col.key === key);
              const a = {
                indicatorIndex: curr.indicatorIndex,
                currencyId: currencyId - 0,
                commodityTypeId: commodityTypeId - 0,
                indicatorValue: curr[key],
                stressTestObjName: target.title,
                stressTestIndicatorName: curr.stressTestIndicatorName
              };
              tmp.push(a);
            }
          });
          return [ ...acc, ...tmp ];
        }, []);
        await api.exportExcel(
          {
            stressTestMehod: this.model.stressTestMethod,
            accountEntityIds: this.model.accountingEntityList,
            stressTestIndicatorDtos: data
          }
        );
        this.$Message.success('导出成功');
      },

      addRow() {
        const configModel = Object.assign({}, this.configModel);
        this.model.stressTestObjConfigs.push(configModel);
      },

      deleteRow(param) {
        this.model.stressTestObjConfigs.splice(param.index, 1);
      },

      rowClassName(row) {
        if (row.accountingEntityName.includes('小计')) {
          return 'stress-info-row';
        } else if (row.accountingEntityName.includes('总计')) {
          return 'stress-error-row';
        }
        return '';
      },

      isShow(permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>

<style>
  .ivu-table .stress-info-row td {
    font-weight: bolder;
    background-color: #fff9e6;
  }

  .ivu-table .stress-error-row td {
    font-weight: bolder;
    background-color: #f6ffed;
  }
</style>
<style scoped>
  .full-width {
    width: 100%;
  }

  .st-form-label {
    text-align: left;
    font-size: 14px;
  }
</style>
