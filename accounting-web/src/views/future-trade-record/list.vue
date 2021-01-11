<template>
  <div>
    <div>
     <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
                  type="daterange"
                  confirm
                  placement="bottom-start"
                  placeholder="交易日期"
                  v-model="query.tradingDateRange"
                  transfer
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId" transfer>
            <Option
              v-for="(item, index) in commonData.accountingEntities"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="策略" filterable clearable v-model="query.tradingStrategyId" transfer>
            <Option
              v-for="(item, index) in accountStrategies"
              :label="item.name"
              :value="item.tradingStrategyId"
              :key="index"
            >{{item.tradingStrategyId}} - {{item.name}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId" transfer>
            <Option
              v-for="(item, index) in commonData.corporations"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
              v-for="(item, index) in commonData.tradeAccounts"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="标准合约" filterable clearable v-model="query.instrumentCategoryId">
            <Option
              v-for="(item, index) in commonData.instrumentCategories"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <InstrumentSelect
            :allDate="true"
            :filterQuery="instrumentQuery"
            v-model="query.instrumentId"
          ></InstrumentSelect>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option
              v-for="(item, index) in [{ text: '买', value: 1 }, { text: '卖', value: 0 }]"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="是否虚拟" filterable clearable v-model="query.isVirtual">
            <Option
              v-for="(item, index) in [{ text: '是', value: 1 }, { text: '否', value: 0 }]"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="数据来源" filterable clearable v-model="query.dataSourceType">
            <Option
              v-for="(item, index) in commonData.acDataSourceType"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="结算日期"
            v-model="query.settlementDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input placeholder="委托单号" type="text" v-model="query.requestNumberContains" />
        </Col>

        <Col
          :lg="6"
          :sm="12"
          :xs="24"
          class-name="margin-bottom-10"
          v-if="isShow('H_SearchFutureTradeRecordFromOnlyOffSite')"
        >
          <Select placeholder="是否场外单" filterable clearable v-model="query.onlyOffSite">
            <Option
              v-for="(item,index) in [{text:'否',value:0}, {text:'是',value:1}]"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
      </Row>
    </qc-collapse>

      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
            type="primary"
            icon="md-add"
            @click="onAdd"
            v-if="isShow('H_CreateAcFutureTradeRecord')"
          >添加</Button>
          <file-upload
            tempName="期货交易记录导入模板"
            action="FutureTradeRecord/Preview"
            import="FutureTradeRecord/Import"
            download="FutureTradeRecord/Download"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_CreateAcFutureTradeRecord')"
          ></file-upload>
          <Button
            type="info"
            icon="ios-cloud-download-outline"
            @click="onExport"
            class="margin-right-3"
            :loading="LoadingExportState"
            v-if="isShow('H_ExportAcFutureTradeRecord')"
          >导出</Button>
          <Button
            type="success"
            icon="md-refresh"
            class="margin-right-3"
            @click="getFutureRecord"
            v-if="isShow('H_GetAcFutureTradeRecord')"
          >获取</Button>
          <Button
            type="warning"
            class="margin-right-3"
            v-if="isShow('H_CalculateAcFutureTradeRecord')"
            @click="clearingFeeModal = true"
          >清算手续费</Button>
          <template v-if="selectList.length">
            <Button
              type="warning"
              icon="md-create"
              class="margin-right-3"
              @click="editMore"
              v-if="isShow('H_UpdateAcFutureTradeRecord')"
            >批量编辑</Button>
            <Poptip confirm title="确认批量删除?" @on-ok="delMore">
              <Button
                type="error"
                icon="md-trash"
                class="margin-right-3"
                v-if="isShow('H_DeleteAcFutureTradeRecord')"
              >批量删除</Button>
            </Poptip>
          </template>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
        size="small"
        border
        v-maxHeight
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
        @on-selection-change="tableSelectHandle"
      ></Table>
    </div>
    <div>
      <QcPage
        size="small"
        show-total
        show-elevator
        show-sizer
        :current="pagination.currentPage"
        :total="pagination.totalCount"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></QcPage>
    </div>

    <!-- 批量编辑 -->
    <Modal
      v-model="isEditMore"
      title="批量编辑"
      @on-ok="editMoreOk"
      @on-cancel="isEditMore = false"
      width="70%"
    >
      <div v-if="commonData.users">
        <manage ref="manage" :editMore="true" />
      </div>
    </Modal>
    <!-- 获取 -->
    <Modal
      title
      v-model="fetchModel"
      cancel-text
      :closable="false"
      class-name="vertical-center-modal"
    >
      <h3>获取结果：</h3>
      <Row>
        <Col
          :span="24"
          class="day"
          v-if="!results.updateCount && !results.addCount && !results.failCount"
        >暂无数据</Col>
        <Col
          :span="24"
          class="day"
        >{{utils.formatDate(results.startDate)}} 至 {{utils.formatDate(results.endDate)}}</Col>
        <Col :span="24" v-if="results.addCount > 0">
          <Row>
            <Col :span="2">
              <Icon type="md-checkmark-circle" style="color:#19be6b;font-size:30px;" />
            </Col>
            <Col :span="20">添加成功{{results.addCount || 0}}条</Col>
            <Col :offset="2" :span="20" v-if="results.updateCount > 0">更新成功{{results.updateCount}}条</Col>
          </Row>
        </Col>
        <Col :span="24" style="marginTop:10px;" v-if=" results.failCount > 0">
          <Row>
            <Col :span="2">
              <Icon type="md-close-circle" style="color:#ed4014;font-size:30px;" />
            </Col>
            <Col :span="20">失败{{results.failCount}}条</Col>
            <Col :offset="2" :span="20">错误信息列表:</Col>
            <Col
              v-for="(item,index) in results.failMessages"
              :offset="2"
              :span="20"
              style="fontSize:14px"
              :key="index"
            >{{index + 1}}.{{item}}</Col>
          </Row>
        </Col>
      </Row>
    </Modal>
    <!-- 清算手续费 -->
    <Modal v-model="clearingFeeModal" title="清算手续费">
      <Form
        ref="feeFormValidate"
        :model="feeFormValidate"
        :label-width="80"
        :rules="feeRuleValidate"
      >
        <FormItem label="时间段" prop="date" required>
          <DatePicker
            type="daterange"
            show-week-numbers
            placement="bottom-end"
            placeholder
            transfer
            v-model="feeFormValidate.date"
          ></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="getClearingFee" :loading="clearingFeeLoading">清算</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import api from './api';
import { isEmpty } from 'lodash'
export default {
  name: 'FutureTradeRecordList',
  components: { manage: () => import('./manage') },
  props: ['tradeAccountId', 'instrumentCategoryId', 'instrumentId', 'isBuy'],
  data () {
    return {
      commonData: {
        instrumentCategories: [],
        accountStrategies: [],
        strategies: [],
        acDataSourceType: []
      },
      query: {
        settlementDateBegin: '',
        settlementDateEnd: '',
        accountingEntityId: '',
        corporationId: '',
        tradeAccountId: '',
        instrumentCategoryId: '',
        instrumentId: '',
        isBuy: '',
        isVirtual: '',
        dataSourceType: '',
        tradeDateBegin: '',
        tradeDateEnd: '',
        isClose: '',
        isHistory: '',
        trader: '',
        tradingStrategyId: '',
        isLocked: '',
        tradingDateRange: [],
        settlementDateRange: [],
        onlyOffSite: 0
      },
      defaultQuery: {
        tradingDateRange: [],
        settlementDateRange: [],
        settlementDateBegin: '',
        settlementDateEnd: '',
        accountingEntityId: '',
        corporationId: '',
        tradeAccountId: '',
        instrumentCategoryId: '',
        instrumentId: '',
        isBuy: '',
        isVirtual: '',
        dataSourceType: '',
        tradeDateBegin: '',
        tradeDateEnd: '',
        isClose: '',
        isHistory: '',
        trader: '',
        tradingStrategyId: '',
        isLocked: '',
        onlyOffSite: 0
      },
      list: [],
      tableLoading: false,
      clearingFeeModal: false,
      feeFormValidate: {
        date: []
      },
      feeRuleValidate: {
        date: [
          {
            type: 'array',
            required: true,
            fields: {
              0: { type: 'date', required: true, message: '' },
              1: { type: 'date', required: true, message: '' }
            }
          }
        ]
      },
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      selectList: [],
      isEditMore: false,
      LoadingExportState: false,
      clearingFeeLoading: false,
      fetchModel: false,
      startDate: null,
      endDate: null,
      results: {},
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '交易日期',
          key: 'tradeDate',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('span', utils.formatDate(params.row.tradeDate));
          }
        },
        {
          title: '利润中心',
          key: 'accountingEntityId',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'span',
              utils.showText(
                this.commonData.accountingEntities,
                params.row.accountingEntityId
              )
            );
          }
        },
        {
          title: '策略',
          key: 'strategyText',
          align: 'center',
          minWidth: 120
        },
        {
          title: '资金账户',
          key: 'tradeAccountId',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'span',
              utils.showText(
                this.commonData.tradeAccounts,
                params.row.tradeAccountId
              )
            );
          }
        },
        {
          title: '子账户',
          key: 'subAccount',
          align: 'center',
          minWidth: 120
        },
        {
          title: '交易所',
          key: 'exchangeName',
          align: 'center',
          minWidth: 120
        },
        {
          title: '品类',
          key: 'commodityTypeName',
          align: 'center',
          minWidth: 120
        },
        // {
        //   title: '标准合约',
        //   key: 'instrumentCategoryId',
        //   align: 'center',
        //   minWidth: 150,
        //   render: (h, params) => {
        //     return h(
        //       'span',
        //       utils.showText(
        //         this.commonData.instrumentCategories,
        //         params.row.instrumentCategoryId
        //       )
        //     );
        //   }
        // },
        {
          title: '具体合约',
          key: 'instrumentText',
          align: 'center',
          minWidth: 150
        },
        {
          title: '成交手数',
          key: 'volume',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                fixed: 0,
                num: params.row.volume
              }
            });
          }
        },
        {
          title: '成交价格',
          key: 'price',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                num: params.row.price
              }
            });
          }
        },
        {
          title: '手续费',
          key: 'commission',
          align: 'center',
          minWidth: 150,
          render: (h, params) =>
            h('format-cell', {
              props: {
                num: params.row.commission
              }
            })
        },
        {
          title: '方向',
          key: 'isBuy',
          align: 'center',
          minWidth: 80,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isBuy)
                ? params.row.isBuy
                  ? '买'
                  : '卖'
                : ''
            )
        },
        {
          title: '开/平',
          key: 'isClose',
          align: 'center',
          minWidth: 80,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isClose)
                ? params.row.isClose
                  ? '平'
                  : '开'
                : ''
            )
        },
        {
          title: '今/昨',
          key: 'isHistory',
          align: 'center',
          minWidth: 80,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isHistory)
                ? params.row.isHistory
                  ? '昨'
                  : '今'
                : ''
            )
        },
        {
          title: '投机/保值',
          key: 'hedgeFlagType',
          align: 'center',
          minWidth: 80,
        },
        {
          title: '是否虚拟',
          key: 'isVirtual',
          align: 'center',
          minWidth: 80,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isVirtual)
                ? params.row.isVirtual
                  ? '是'
                  : '否'
                : ''
            )
        },
        {
          title: '业务员',
          key: 'trader',
          align: 'center',
          minWidth: 80,
        },
        {
          title: '下单员',
          key: 'operator',
          align: 'center',
          minWidth: 80,
        },
        {
          title: '结算日期',
          key: 'settlementDate',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('span', utils.formatDate(params.row.settlementDate));
          }
        },
        {
          title: '是否移仓',
          key: 'isMovePosition',
          align: 'center',
          minWidth: 80,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isMovePosition)
                ? params.row.isMovePosition
                  ? '是'
                  : '否'
                : ''
            )
        },
        {
          title: '成交时间',
          key: 'tradeTime',
          align: 'center',
          minWidth: 150,
          render: (h, params) =>
            h(
              'span',
              utils.formatDate(params.row.tradeTime, 'YYYY-MM-DD HH:mm:ss')
            )
        },
        {
          title: '成交编号',
          key: 'tradeNumber',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '委托单号',
          key: 'requestNumber',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          minWidth: 150,
          align: 'center'
        },        
        {
          title: '法人',
          key: 'corporationId',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'span',
              utils.showText(
                this.commonData.corporations,
                params.row.corporationId
              )
            );
          }
        },
        {
          title: '成交金额',
          key: 'totalAmount',
          align: 'center',
          minWidth: 150,
          render: (h, params) =>
            h('format-cell', {
              props: {
                num: params.row.totalAmount
              }
            })
        },
        {
          title: '利润中心开/平',
          key: 'isClose2',
          align: 'center',
          minWidth: 100,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isClose2)
                ? params.row.isClose2
                  ? '平'
                  : '开'
                : ''
            )
        },
        {
          title: '利润中心今/昨',
          key: 'isClose2',
          align: 'center',
          minWidth: 100,
          render: (h, params) =>
            h(
              'span',
              _.isBoolean(params.row.isHistory2)
                ? params.row.isHistory2
                  ? '昨'
                  : '今'
                : ''
            )
        },
        {
          title: '数据来源',
          key: 'dataSourceType',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h(
              'span',
              {
                class: params.row.dataSourceType !== 1 ? 'orange' : 'blue'
              },
              utils.showText(
                this.commonData.acDataSourceType,
                params.row.dataSourceType
              )
            );
          }
        },
        {
          title: '更新人',
          key: 'lastManipulationBy',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h(
              'span',
              utils.showText(
                this.commonData.users,
                params.row.lastManipulationBy
              )
            );
          }
        },
        {
          title: '更新时间',
          key: 'lastManipulationTime',
          align: 'center',
          minWidth: 150,
          render: (h, params) =>
            h(
              'span',
              utils.formatDate(
                params.row.lastManipulationTime,
                'YYYY-MM-DD HH:mm:ss'
              )
            )
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Tooltip',
                {
                  props: {
                    content: '编辑',
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'md-create'
                    },
                    style: {
                      marginRight: '3px',
                      display: this.isShow('H_UpdateAcFutureTradeRecord') ? 'block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.onEdit(params);
                      }
                    }
                  })
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: '删除',
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  h('Button', {
                    props: {
                      size: 'small',
                      icon: 'md-trash'
                    },
                    style: {
                      marginRight: '3px',
                      display: this.isShow('H_DeleteAcFutureTradeRecord') ? 'block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.onDelete(params);
                      }
                    }
                  })
                ]
              )
            ]);
          }
        }
      ],
      importColumns: [
        {
          title: '交易日期',
          key: 'tradeDate',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('span', utils.formatDate(params.row.tradeDate));
          }
        },
        {
          title: '利润中心',
          key: 'accountingEntity',
          align: 'center',
          minWidth: 120
        },
        {
          title: '策略',
          key: 'strategyText',
          align: 'center',
          minWidth: 120
        },
        {
          title: '资金账户',
          key: 'tradeAccount',
          align: 'center',
          minWidth: 120
        },
        {
          title: '子账户',
          key: 'subAccount',
          align: 'center',
          minWidth: 120
        },
        {
          title: '交易所',
          key: 'exchange',
          align: 'center',
          minWidth: 100
        },
        {
          title: '品类',
          key: 'commodityType',
          align: 'center',
          minWidth: 120
        },
        {
          title: '合约名称',
          key: 'instrumentCode',
          align: 'center',
          minWidth: 150
        },
        {
          title: '成交手数',
          key: 'volume',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                fixed: 0,
                num: params.row.volume
              }
            });
          }
        },
        {
          title: '成交价格',
          key: 'price',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                num: params.row.price
              }
            });
          }
        },
        {
          title: '手续费',
          key: 'commission',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                num: params.row.commission
              }
            });
          }
        },
        {
          title: '方向',
          key: 'isBuy',
          align: 'center',
          minWidth: 80
        },
        {
          title: '开/平',
          key: 'isClose',
          align: 'center',
          minWidth: 80
        },
        {
          title: '今/昨',
          key: 'isHistory',
          align: 'center',
          minWidth: 80
        },
        // {
        //   title: '利润中心开/平',
        //   key: 'isClose2',
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          title: '投机/保值',
          key: 'hedgeFlagType',
          align: 'center',
          minWidth: 80,
        },
        {
          title: '是否虚拟',
          key: 'isVirtual',
          align: 'center',
          minWidth: 80
        },        
        {
          title: '业务员',
          key: 'trader',
          align: 'center',
          minWidth: 80
        },
        {
          title: '下单员',
          key: 'operator',
          align: 'center',
          minWidth: 80
        },
        {
          title: '结算日期',
          key: 'settlementDate',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('span', utils.formatDate(params.row.settlementDate));
          }
        },
        {
          title: '是否移仓',
          key: 'isMovePosition',
          align: 'center',
          minWidth: 90
        },
        {
          title: '成交时间',
          key: 'tradeTime',
          align: 'center',
          minWidth: 150,
          render: (h, params) =>
            h(
              'span',
              utils.formatDate(params.row.tradeTime, 'YYYY-MM-DD HH:mm:ss')
            )
        },

        {
          title: '成交编号',
          key: 'tradeNumber',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '委托单号',
          key: 'requestNumber',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          width: 240,
          align: 'center'
        }
      ]
    }
  },
  async mounted () {
    let query = this.$route.query
    if (Object.keys(query).length) {
      this.query.tradeAccountId = query.tradeAccountId * 1
      this.query.instrumentId = query.instrumentId
      this.query.isBuy = query.isBuy === 'true' ? 1 : 0
      this.query.isVirtual = 0
      this.query.settlementDateRange[0] = query.reportDate
      this.query.settlementDateRange[1] = query.reportDate
    }
    this.query = utils.saveQuery(this.query, 'get');
    let commonData = this.$store.state.cachedCommonData['futuretraderecord_getcommondata'];
    if (!commonData) {
      commonData = await this.api.getCommonData('FutureTradeRecord');
    }
    let accountStrategies = [];
    _.forEach(commonData.accountStrategies, o => {
      accountStrategies.push(...o.tradingStrategies);
    });
    commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
    this.commonData = commonData;
    this.search();
    const tradeAccountId = this.tradeAccountId;
    const instrumentCategoryId = this.instrumentCategoryId;
    const instrumentId = this.instrumentId;
    const isBuy = this.isBuy;

    if (tradeAccountId && instrumentCategoryId && instrumentId && isBuy) {
      const t = {
        'true': 1,
        'false': 0
      };
      this.query.tradeAccountId = tradeAccountId;
      this.query.instrumentCategoryId = instrumentCategoryId;
      this.query.instrumentId = instrumentId;
      this.query.isBuy = t[isBuy];
    }
  },
  computed: {
    instrumentQuery () {
      const instrumentCategoryObj = this.commonData.instrumentCategories.find(val => val.value === this.query.instrumentCategoryId);
      const instrumentCategoryText = instrumentCategoryObj ? instrumentCategoryObj.text : '';
      return [{
        key: 'instrumentCategoryId',
        text: '标准合约',
        id: this.query.instrumentCategoryId,
        code: `${this.query.instrumentCategoryId ? instrumentCategoryText : ''}`,
        required: false
      }];
    },
    accountStrategies () {
      if (this.query.accountingEntityId) {
        const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.query.accountingEntityId)
        return obj ? obj.tradingStrategies : []
      }
      return this.commonData.strategies
    }
  },
  methods: {
    onAdd () {
      this.$router.push({
        name: 'FutureTradeRecordCreate'
      });
    },
    onSearch () {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search () {
      utils.saveQuery(this.query);
      this.selectList = [];
      let query = { ...this.query };
      if (query.onlyOffSite !== '' && query.onlyOffSite !== undefined) {
        query.onlyOffSite = +query.onlyOffSite ? true : false
      }
      if(!this.isShow('H_SearchFutureTradeRecordFromOnlyOffSite')){
        query.onlyOffSite = null
      }
      query.isVirtual =
        _.isNumber(query.isVirtual)
          ? Boolean(query.isVirtual)
          : null;
      query.isBuy =
        typeof query.isBuy === 'number' ? Boolean(query.isBuy) : null;
      if (this.query.tradingDateRange.length) {
        query.tradeDateBegin = this.query.tradingDateRange[0];
        query.tradeDateEnd = this.query.tradingDateRange[1];
      }
      if (this.query.settlementDateRange.length) {
        query.settlementDateBegin = this.query.settlementDateRange[0];
        query.settlementDateEnd = this.query.settlementDateRange[1];
      }
      let { list, pagination } = await api.list(query, this.pagination);
      this.pagination = pagination;
      this.list = list;
      //console.log(this.list)
    },
    resetQuery () {
      this.query = _.assign({}, this.defaultQuery);
      this.query.tradingDateRange = [];
      this.query.settlementDateRange = [];
    },
    onPageChange (page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange (pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
    onDelete (params) {
      this.$Modal.confirm({
        title: '删除',
        content: `<p>确认删除该条数据？</p>`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          await api.delete(params.row.acFutureTradeRecordId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit (params) {
      this.$router.push({
        name: 'FutureTradeRecordEdit',
        query: { id: params.row.acFutureTradeRecordId }
      });
    },
    getClearingFee () {
      this.$refs['feeFormValidate'].validate(async valid => {
        if (valid) {
          this.clearingFeeLoading = true;
          let result = await api.getClearingFeeData({
            startDate: this.feeFormValidate.date[0],
            endDate: this.feeFormValidate.date[1]
          }).finally(() => {
            this.clearingFeeModal = false;
            this.clearingFeeLoading = false;
          });
          this.$Message.info({
            content: result
          });
          this.search();
        }
      });
    },
    imported () {
      this.search();
    },
    onExport () {
      this.LoadingExportState = true;
      let query = _.cloneDeep(this.query);
      if (this.query.tradingDateRange.length) {
        query.tradeDateBegin = this.query.tradingDateRange[0];
        query.tradeDateEnd = this.query.tradingDateRange[1];
      }
      if (this.query.settlementDateRange.length) {
        query.settlementDateBegin = this.query.settlementDateRange[0];
        query.settlementDateEnd = this.query.settlementDateRange[1];
      }
      query.onlyOffSite = +query.onlyOffSite ? true : false
      api.exportExcel(
        query,
        `期货交易记录${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
      )
      .then(() => {
        this.LoadingExportState = false;
      });
    },
    async getFutureRecord () {
      let data = await api.getFutureRecord();
      if (data.length) {
        this.results = data[0];
        this.fetchModel = true;
        this.commonData = await api.getCommonData('FutureTradeRecord');
        this.search();
      }
    },
    tableSelectHandle (selection) {
      this.selectList = selection.map(val => val.acFutureTradeRecordId);
    },
    editMore () {
      if (this.selectList.length) {
        this.isEditMore = true;
      } else {
        this.$Message.info({
          content: '未有选中行！'
        });
      }
    },
    editMoreOk () {
      let item = { ...this.$refs.manage.item };
      item.trader = item.trader ? item.trader : null
      item.operator = item.operator ? item.operator : null
      item.remark = item.remark ? item.remark : null
      item.requestNumber = item.requestNumber ? item.requestNumber : null
      let instrumentCategory = item.instrumentCategoryId;
      let exchangeId = instrumentCategory ? this.commonData.instrumentCategories.filter((data) => {
        return data.value === instrumentCategory;
      })[0].marketId : null;
      let params = { ...item, exchangeId, objectIds: this.selectList };
      api.multModify(params).then(res => {
        this.$Message.success({
          content: res || '批量修改成功！'
        });
        this.search();
        this.$refs.manage.item = {
          volume: null,
          price: null,
          totalAmount: null,
          commission: null,
          tradeDate: null
        };
      });
    },
    delMore () {
      if (this.selectList.length) {
        api.multDelete(this.selectList).then(result => {
          this.$Message.info({
            content: result || '操作成功！'
          })
          this.search();
        }).catch(error => {
          // this.$Message.info({
          // content: error || '操作失败！'
          // });
          this.search();
        });
      } else {
        this.$Message.info({
          content: '未有选中行！'
        });
      }
    },
    isShow (permission) {
      return utils.hasPermission(permission);
    }
  }
};
</script>

<style lang="less" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }

  h3 {
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
  }

  .day {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  .ivu-col-span-20 {
    line-height: 30px;
    font-size: 16px;
    border-left: 1px solid #ddd;
    padding-left: 20px;
  }
}
</style>
