﻿<template>
  <div class="app-container ">
    <div class="search-header-row search-margin-bottom">
      <div class="full-width">
        <el-input
          title="唯一标识"
          clearable
          placeholder="唯一标识"
          v-model="query.qcKey"
        />
      </div>
      <div class="full-width">
        <el-input
          title="代码"
          clearable
          placeholder="代码"
          v-model="query.instrumentCode"
        />
      </div>
      <div class="full-width">
        <el-input
          title="名称"
          clearable
          placeholder="名称"
          v-model="query.friendlyName"
        />
      </div>
      <div class="full-width">
        <el-select
          clearable
          filterable
          placeholder="合约类型"
          title="合约类型"
          v-model="query.financialInstrumentType"
        >
          <el-option
            v-for="item in enums.financialInstrumentType"
            :key="item.key"
            :label="item.text"
            :value="item.code"
          />
        </el-select>
      </div>
      <div class="full-width">
        <el-select
          clearable
          filterable
          placeholder="标准合约"
          title="标准合约"
          v-model="query.instrumentCategory"
        >
          <el-option
            v-for="item in instrumentCategories"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="full-width">
        <el-select
          clearable
          filterable
          placeholder="是否期货下单"
          title="是否期货下单"
          v-model="query.isETrading"
        >
          <el-option
            v-for="item in yOrNList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>
      <div>
        <el-select
          clearable
          filterable
          placeholder="是否停用"
          title="是否停用"
          v-model="query.isDeleted"
        >
          <el-option
            v-for="item in yOrNList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']"
          >新增</el-button
        >
      </div>
      <div>
        <import-file
          :download-file-name="downloadFileName"
          :column="importColumn"
          :download-url="downloadUrl"
          :preview-url="previewUrl"
          :import-url="importUrl"
          @fetch-data="fetchData"
          v-hasAuth="[$route,'import']"
        />
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="doSearch"
          >搜索</el-button
        >
      </div>
      <div>
        <el-button icon="el-icon-error" @click="doReset">清空</el-button>
      </div>
    </div>

    <div class="search-margin-bottom">
      <el-table
        border
        fit
        highlight-current-row
        :data="list"
        v-loading.body="isListLoading"
      >
        <el-table-column align="center" label="唯一标识" prop="qcKey" />
        <el-table-column align="center" label="代码" prop="instrumentCode" />
        <el-table-column align="center" label="名称" prop="friendlyName" />
        <el-table-column
          align="center"
          label="合约类型"
          prop="financialInstrumentType"
        >
          <template slot-scope="scope">
            {{
              scope.row.financialInstrumentType
                | mapKV(enums.financialInstrumentType, 'text', 'code')
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="合约日期" prop="contractDate">
        </el-table-column> -->
        <el-table-column
          align="center"
          label="标准合约"
          prop="instrumentCategory"

        >
          <template slot-scope="scope">
            {{
              scope.row.instrumentCategory
                | mapKV(instrumentCategories, 'value')
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否期货下单"
          prop="isETrading"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.isETrading | parseBool }}
          </template>
        </el-table-column>
        <el-table-column label="是否停用" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.isDeleted | parseBool }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="creationTime">
          <template slot-scope="scope">
            <span>{{ scope.row.creationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="最近更新时间"
          prop="lastManipulationTime"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lastManipulationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="doEdit(scope.row)"
                class="operation-btn"
                v-hasAuth="[$route,'update']"
              />
            </el-tooltip>
            <el-tooltip
              content="启用"
              placement="top"
              v-if="scope.row.isDeleted"
            >
              <el-button
                type="text"
                icon="el-icon-success"
                @click="doToggleStatus(scope.row)"
                class="operation-btn operation-enable-btn"
              />
            </el-tooltip>
            <el-tooltip content="停用" placement="top" v-else>
              <el-button
                type="text"
                icon="el-icon-remove-outline"
                @click="doToggleStatus(scope.row)"
                v-hasAuth="[$route,'switch-enable-status']"
                class="operation-btn operation-disable-btn"
              />
            </el-tooltip>
            <el-tooltip content="查看" placement="top">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="doView(scope.row)"
                class="operation-btn operation-view-btn"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="query.pagination.currentPage"
        :page-size="query.pagination.pageSize"
        :total="query.pagination.itemCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <div >
      <el-drawer
        :title="manageDrawerTitle"
        :visible.sync="showManage"
        direction="rtl"
        size="70%"
      >
        <div style="padding: 0 5px;" class="manage-drawer__content ">
          <el-form
            :class="isDetail ? 'instrument-detail' : '' "
            class="qc-instrument-container"
            label-position="right"
            label-width="160px"
            status-icon
            :ref="formName"
            :rules="rules"
            :model="dto"
            size="mini"
          >
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>基本合约数据</span>
              </div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="唯一标识" prop="qcKey" class="full-width">
                    <el-input
                      v-model="dto.qcKey"
                      :disabled="isEdit || isDetail"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="代码" prop="instrumentCode" class="full-width">
                    <el-input
                      v-model="dto.instrumentCode"
                      :disabled="isEdit || isDetail"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="名称" prop="friendlyName" class="full-width">
                    <el-input
                      v-model="dto.friendlyName"
                      :disabled="isEdit || isDetail"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="标准合约" prop="instrumentCategory" class="full-width">
                    <el-select
                      clearable
                      filterable
                      placeholder=""
                      v-model="dto.instrumentCategory"
                      :disabled="isDetail"
                      @change="onChangeIC"
                    >
                      <el-option
                        v-for="item in instrumentCategories"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="合约类型" prop="financialInstrumentType" class="full-width">
                    <el-select
                      clearable
                      filterable
                      placeholder=""
                      v-model="dto.financialInstrumentType"
                      disabled
                    >
                      <el-option
                        v-for="item in enums.financialInstrumentType"
                        :key="item.code"
                        :label="item.text"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="特殊合约类型" prop="instrumentType" class="full-width">
                    <el-select
                      clearable
                      filterable
                      placeholder=""
                      v-model="dto.instrumentType"
                      :disabled="isDetail"
                    >
                      <el-option
                        v-for="item in enums.specialInstrumentType"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="具体合约税率"
                    prop="instrumentTaxRate"
                    class="full-width"
                  >
                    <el-input-number
                      v-model="dto.instrumentTaxRate"
                      :disabled="isDetail"
                      :step="0.01"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="第一个交易日" prop="firstTradingDate" class="full-width">
                    <el-date-picker
                      v-model="dto.firstTradingDate"
                      type="date"
                      :disabled="isDetail"
                      class="full-width"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最后交易日" prop="lastTradingDay" class="full-width">
                    <el-date-picker
                      v-model="dto.lastTradingDay"
                      type="date"
                      class="full-width"
                      :disabled="isDetail"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="合约日期" prop="contractDate">
                    <el-input
                      v-model="dto.contractDate"
                      :disabled="isDetail || !isForeign"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="成为当月合约的日期" prop="deliveryDate" class="full-width">
                    <el-date-picker
                      v-model="dto.deliveryDate"
                      type="date"
                      :disabled="isDetail"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="成为次月合约的日期"
                    prop="previousDeliveryDate"
                    class="full-width"
                  >
                    <el-date-picker
                      v-model="dto.previousDeliveryDate"
                      type="date"
                      :disabled="isDetail"
                    />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="交割日" prop="promptDate" class="full-width">
                    <el-date-picker
                      v-model="dto.promptDate"
                      type="date"
                      :disabled="isDetail || isForeign"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否期货下单" prop="isETrading" class="full-width">
                    <el-select
                      v-model="dto.isETrading"
                      placeholder=""
                      clearable
                      :disabled="isDisabledByInstrumentCategory"
                    >
                      <el-option
                        v-for="(item, index) in yOrNList"
                        :key="index"
                        :label="item.value"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card
              class="box-card"
              v-if="dto.financialInstrumentType === financialInstrumentType.COMBINATION"
            >
              <div slot="header" class="clearfix">
                <span>组合合约</span>
              </div>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="合约腿数"
                    prop="numberOfLegs"
                    class="full-width"
                  >
                    <el-input-number
                      type="number"
                      v-model="dto.numberOfLegs"
                      clearable
                      :disabled="isDetail"
                      :min="2"
                      :max="16"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="8"
                  v-for="(legItem, index) in dto.sdInstrumentLegList"
                  :key="index"
                >
                  <el-form-item
                    :label="`第${index + 1}腿合约ID`"
                    :prop="
                      `sdInstrumentLegList_${index + 1}_legInstrumentQctKey`
                    "
                    class="full-width"
                  >
                    <el-select
                      clearable
                      filterable
                      placeholder="输入内容后搜索"
                      v-model="legItem.legInstrumentQctKey"
                      :disabled="isDetail"
                      :loading="legLoadingObj[index]"
                      remote
                      :remote-method="doFetchData(index)"
                    >
                      <el-option
                        v-for="item in legItem.legData"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card
              class="box-card"
              v-if="dto.financialInstrumentType === financialInstrumentType.OPTIONS"
            >
              <div slot="header" class="clearfix">
                <span>期权合约</span>
              </div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="标的合约" prop="underlyingInstrumentId" class="full-width">
                    <el-select
                      :disabled="isDetail"
                      clearable
                      filterable
                      placeholder=""
                      v-model="dto.underlyingInstrumentId"
                      :loading="getUnderlyingLoading"
                      remote
                      :remote-method="doFetchDataOfUnderlying"
                    >
                      <el-option
                        v-for="item in underlyingInstruments"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="行权价" prop="strikePrice">
                    <el-input
                      v-model="dto.strikePrice"
                      clearable
                      :disabled="isDetail"
                    />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="行权价" prop="realStrikePrice">
                    <el-input
                      type="number"
                      v-model.number="dto.realStrikePrice"
                      :disabled="isDetail"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="期权权利方向" prop="isCallOption" class="full-width">
                    <el-select
                      clearable
                      filterable
                      v-model="dto.isCallOption"
                      :disabled="isDetail"
                    >
                      <el-option
                        v-for="item in [
                          { text: 'call', value: true },
                          { text: 'put', value: false }
                        ]"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-form>
        </div>
        <div class="manage-drawer__footer" style="margin: 20px; float: right;">
          <el-button @click="showManage = false" v-if="!isDetail"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="doSave"
            :loading="isSaving"
            v-if="!isDetail"
            >保存</el-button
          >
          <el-button @click="showManage = false" v-if="isDetail"
            >确定</el-button
          >
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {
  list as getList,
  add,
  update,
  toggle,
  baseUrl,
  getCommonData,
  getInstrumentList
} from '../../api/qcInstrument'
import ImportFile from '../../components/ImportFile/index'
import { getEnums } from '../../api/enums'
import { debounce } from '../../utils'
import { YOrNList } from '../../assets/enums'

const FINANCIAL_INSTRUMENT_TYPE = {
  SPOTS: 'Spots', // 现货
  SPOTS_DEFERRED_DELIVERY: 'SpotDeferredDelivery', // 现货延期交收 (T+D、T+N)
  COMBINATION: 'Combination', // 组合合约
  FUTURES: 'Futures', // 期货
  OPTIONS: 'Options', // 期权
  SWAP: 'Swap', //掉期
  STOCKINDEX:'StockIndex',  // 股指
  STOCK:'Stock', // 股票
  FUND:'Fund' //基金
}

export default {
  name: 'StandardContract',
  components: { ImportFile },
  data: () => ({
    formName: 'standardContractForm',
    dialogVisible: false,
    dialogStatus: 'add',
    dialogTitle: {
      add: '新增',
      update: '编辑'
    },
    defaultDto: {
      id: null,
      qcKey: '',
      instrumentCode: '',
      friendlyName: '',
      isETrading: '',
      financialInstrumentType: null,
      instrumentType: null,
      instrumentCategory: null,
      contractDate: null,
      promptDate: null,
      deliveryDate: null,
      previousDeliveryDate: null,
      firstTradingDate: null,
      lastTradingDay: null,
      numberOfLegs: null,
      contractType: null,
      contractType2: null,
      leg1Id: null,
      leg2Id: null,
      underlyingInstrumentId: null,
      // strikePrice: null,
      realStrikePrice: null,
      isCallOption: null,
      sdInstrumentLegList: []
    },
    MAX_LEGS: 16,
    dto: {
      id: null,
      qcKey: '',
      instrumentCode: '',
      friendlyName: '',
      isETrading: false,
      financialInstrumentType: null,
      instrumentType: null,
      instrumentCategory: null,
      contractDate: null,
      promptDate: null,
      deliveryDate: null,
      previousDeliveryDate: null,
      firstTradingDate: null,
      lastTradingDay: null,
      numberOfLegs: null,
      contractType: null,
      contractType2: null,
      leg1Id: null,
      leg2Id: null,
      underlyingInstrumentId: null,
      // strikePrice: null,
      realStrikePrice: null,
      isCallOption: null,
      sdInstrumentLegList: []
    },
    rules: {},
    defaultRules: {
      qcKey: [{ required: true, message: '不能为空', trigger: 'change' }],
      instrumentCode: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      friendlyName: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      financialInstrumentType: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      instrumentType: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      instrumentCategory: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],

      instrumentTaxRate: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],

      deliveryDate: [
        { required: false, message: '不能为空', trigger: 'change' }
      ],
      previousDeliveryDate: [
        { required: false, message: '不能为空', trigger: 'change' }
      ],
      firstTradingDate: [
        { required: false, message: '不能为空', trigger: 'change' }
      ],
      lastTradingDay: [
        { required: false, message: '不能为空', trigger: 'change' }
      ],
      numberOfLegs: [
        { required: true, message: '不能为空', trigger: 'change' },
        { type: 'number', message: '必须为数字值' }
      ],

      contractType: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      contractType2: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      leg1Id: [{ required: true, message: '不能为空', trigger: 'change' }],
      leg2Id: [{ required: true, message: '不能为空', trigger: 'change' }],
      underlyingInstrumentId: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      // strikePrice: [{ required: true, message: '不能为空', trigger: 'change' }],
      realStrikePrice: [
        { required: true, message: '不能为空', trigger: 'change' },
        { type: 'number', message: '必须为数字值' }
      ],
      isCallOption: [{ required: true, message: '不能为空', trigger: 'change' }]
    },

    query: {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        itemCount: 0
      }
    },
    defaultQuery: {
      qcKey: '',
      code: '',
      exchange: '',
      commodityType: '',
      currency: '',
      unit: '',
      isETrading: '',
      isDeleted: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        itemCount: 0
      }
    },
    isSaving: false,
    isOperating: false,
    isListLoading: false,
    list: [],
    showDetail: false,
    showManage: false,
    isEdit: false,
    isDetail: false,
    enums: {},
    legInstruments: [],
    underlyingInstruments: [],
    getUnderlyingLoading: false,
    instrumentCategories: [],
    exchangeList: [],
    FOREIGN_PAN: '外盘',
    FOREIGN_PAN_EN: 'Foreign',
    isForeign: false,

    downloadFileName: '具体合约模板.xls',
    downloadUrl: `${baseUrl}/Download`,
    previewUrl: `${baseUrl}/Preview`,
    importUrl: `${baseUrl}/Import`,
    importColumn: [
      {
        label: '唯一标识',
        prop: 'qcKey'
      },
      {
        label: '代码',
        prop: 'instrumentCode'
      },
      {
        label: '名称',
        prop: 'friendlyName'
      },
      {
        label: '合约类型',
        prop: 'financialInstrumentType'
      },
      {
        label: '特殊合约类型',
        prop: 'instrumentType'
      },
      {
        label: '标准合约',
        prop: 'instrumentCategory'
      },
      {
        label: '具体合约税率',
        prop: 'instrumentTaxRate'
      },
      // {
      //   label: '合约日期',
      //   prop: 'contractDate'
      // },
      {
        label: '交割日',
        prop: 'promptDate'
      },
      // {
      //   label: '成为当月合约的日期',
      //   prop: 'deliveryDate'
      // },
      // {
      //   label: '成为次月合约的日期',
      //   prop: 'previousDeliveryDate'
      // },
      {
        label: '第一个交易日',
        prop: 'firstTradingDate'
      },
      {
        label: '最后交易日',
        prop: 'lastTradingDay'
      },
      {
        label: '是否期货下单',
        prop: 'isETrading'
      },
      {
        label: '合约腿数',
        prop: 'numberOfLegs'
      },
      {
        label: '标的合约',
        prop: 'underlyingInstrumentId'
      },
      // {
      //   label: '行权价',
      //   prop: 'strikePrice'
      // },
      {
        label: '行权价',
        prop: 'realStrikePrice'
      },
      {
        label: '期权权利方向',
        prop: 'isCallOption'
      },
      {
        label: '第1腿合约',
        prop: 'leg1Contract'
      },
      {
        label: '第2腿合约',
        prop: 'leg2Contract'
      },
      {
        label: '第3腿合约',
        prop: 'leg3Contract'
      },
      {
        label: '第4腿合约',
        prop: 'leg4Contract'
      },
      {
        label: '第5腿合约',
        prop: 'leg5Contract'
      },
      {
        label: '第6腿合约',
        prop: 'leg6Contract'
      },
      {
        label: '第7腿合约',
        prop: 'leg7Contract'
      },
      {
        label: '第8腿合约',
        prop: 'leg8Contract'
      },
      {
        label: '第9腿合约',
        prop: 'leg9Contract'
      },
      {
        label: '第10腿合约',
        prop: 'leg10Contract'
      },
      {
        label: '第11腿合约',
        prop: 'leg11Contract'
      },
      {
        label: '第12腿合约',
        prop: 'leg12Contract'
      },
      {
        label: '第13腿合约',
        prop: 'leg13Contract'
      },
      {
        label: '第14腿合约',
        prop: 'leg14Contract'
      },
      {
        label: '第15腿合约',
        prop: 'leg15Contract'
      },
      {
        label: '第16腿合约',
        prop: 'leg16Contract'
      }
    ],
    legInstrumentObj: {},
    legLoadingObj: {},
    isDisabledByInstrumentCategory: false
  }),
  created() {
    this.defaultRules = { ...this.defaultRules }
    this.rules = { ...this.defaultRules, ...this.conditionalRules }
    this.defaultDto = { ...this.dto }
    this.fetchEnums()
    this.fetchCommonData()
    this.fetchData()
  },
  watch: {
    'dto.numberOfLegs': function(newVal) {
      let legItems = []
      for (let i = 0; i < newVal; i++) {
        legItems.push({
          id: 0,
          combinationInstrumentQctKey: null,
          legInstrumentQctKey: null,
          legIndex: null,
          legData: []
        })
      }
      this.dto.sdInstrumentLegList = legItems
    },
    'dto.isETrading': function() {
      this.getAllInstruments()
    },
    'dto.instrumentType' (val) {
      if(val == 2){
        this.changeRules(false)
      }else{
        this.changeRules(true)
      }
    },    
    'dto.instrumentCategory': function(newVal) {
      const category = this.instrumentCategories.find(d => {
        return d.value === newVal
      })
      let exchangeKey = category && category.exchange
      const exchange = this.exchangeList.find(d => {
        return d.value === exchangeKey
      })
      if (
        exchange &&
        [this.FOREIGN_PAN, this.FOREIGN_PAN_EN].includes(exchange.type)
      ) {
        // 外盘
        this.rules = {
          ...this.defaultRules,
          ...{
            contractDate: [
              { required: true, message: '不能为空', trigger: 'change' }
            ]
          }
        }
        this.isForeign = true
        this.dto.promptDate = null
      } else {
        this.rules = {
          ...this.defaultRules,
          ...{
            promptDate: [
              { required: false, message: '不能为空', trigger: 'change' }
            ]
          }
        }
        this.isForeign = false
        this.dto.contractDate = null
      }
      this.$nextTick(() => {
        this.$refs[this.formName].clearValidate()
        if(this.dto.instrumentType == 1){
          this.changeRules(true)
        }
      })
      this.getAllInstruments()
    }
  },
  methods: {
    doSearch() {
      this.query.pagination.currentPage = 1
      this.fetchData()
    },

    async getAllInstruments() {
      await this.getInstruments()
    },

    async getInstruments(fuzzyQueryStr, index) {
      if (index !== undefined) {
        this.legLoadingObj[index] = true
      }
      this.getUnderlyingLoading = true

      //int转为string
      let financialInstrumentType = this.dto.financialInstrumentType
      let financialInstrumentTypes = []
      if (this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.COMBINATION) {
        financialInstrumentTypes = [
          FINANCIAL_INSTRUMENT_TYPE.FUTURES,
          FINANCIAL_INSTRUMENT_TYPE.OPTIONS
        ]
      } else if (this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.OPTIONS) {
        financialInstrumentTypes = [FINANCIAL_INSTRUMENT_TYPE.FUTURES]
      } else if(this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.STOCK){
        financialInstrumentTypes = [FINANCIAL_INSTRUMENT_TYPE.STOCK]
      } else if(this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.STOCKINDEX){
        financialInstrumentTypes = [FINANCIAL_INSTRUMENT_TYPE.STOCKINDEX]
      } else if(this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.FUND){
        financialInstrumentTypes = [FINANCIAL_INSTRUMENT_TYPE.FUND]
      }
      let instrumentCategory = this.dto.instrumentCategory
      if (!financialInstrumentType || !instrumentCategory) {
        this.legInstruments = []
        if (index !== undefined) {
          this.legLoadingObj[index] = false
        }
        this.getUnderlyingLoading = false
      }
      const { data } = await getInstrumentList({
        financialInstrumentTypes,
        isETrading: this.dto.isETrading,
        friendlyName: fuzzyQueryStr || null
      })
      if (this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.OPTIONS) {
        this.getUnderlyingLoading = false

        this.underlyingInstruments = data.list.map(d => {
          return {
            text: d.friendlyName,
            value: d.qcKey
          }
        })
      }

      if (this.dto.financialInstrumentType === FINANCIAL_INSTRUMENT_TYPE.COMBINATION) {
        this.legLoadingObj[index] = false

        if (index === undefined) {
          return
        }
        this.dto.sdInstrumentLegList[index].legData = data.list.map(d => {
          return {
            text: d.instrumentCode,
            value: d.qcKey
          }
        })
      }
    },

    doFetchData(index) {
      return debounce(async fuzzyQueryStr => {
        await this.getInstruments(fuzzyQueryStr, index)
      }, 1000)
    },

    doFetchDataOfUnderlying: debounce(async function(fuzzyQueryStr) {
      await this.getInstruments(fuzzyQueryStr)
    }, 1000),

    doReset() {
      this.query = Object.assign({}, this.defaultQuery)
    },

    async fetchEnums() {
      const { data } = await getEnums({
        enumTypeNames: [
          'SpecialInstrumentType',
          'FinancialInstrumentType',
          'ExchangeType'
        ]
      })
      this.enums = data
    },

    async fetchCommonData() {
      const { data } = await getCommonData()
      this.instrumentCategories = data.instrumentCategoryList
      this.exchangeList = data.exchangeList
    },

    async fetchData() {
      this.isListLoading = true
      const { data } = await getList(this.query).finally(() => {
        this.isListLoading = false
      })
      const { list, pagination } = data
      this.list = list
      this.query.pagination.currentPage = pagination.currentPage
      this.query.pagination.pageSize = pagination.pageSize
      this.query.pagination.itemCount = pagination.itemCount
    },

    handleCurrentChange(currentPage) {
      this.query.pagination.currentPage = currentPage
      this.fetchData()
    },

    handleSizeChange(pageSize) {
      this.query.pagination.pageSize = pageSize
      this.fetchData()
    },

    onChangeIC(newVal) {
      const category =
      this.instrumentCategories.find(d => d.value === newVal) || {}
      let financialInstrumentTypeKey = category.financialInstrumentType
      if (financialInstrumentTypeKey === 1) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.FUTURES
      }
      if (financialInstrumentTypeKey === 4) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.OPTIONS
      }
      if (financialInstrumentTypeKey === 5) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.COMBINATION
      }
      if (financialInstrumentTypeKey === 2) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.SPOTS
      }
      if (financialInstrumentTypeKey === 3) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.SPOTS_DEFERRED_DELIVERY
      }
      if (financialInstrumentTypeKey === 6) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.SWAP
      }
      if (financialInstrumentTypeKey === 7) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.STOCK
      }if (financialInstrumentTypeKey === 8) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.FUND
      }if (financialInstrumentTypeKey === 9) {
        this.dto.financialInstrumentType = FINANCIAL_INSTRUMENT_TYPE.STOCKINDEX
      }

      this.selectedInstrumentCategory =
        this.instrumentCategories.find(e => e.value == newVal) || {}
      if (this.selectedInstrumentCategory) {
        if (!this.selectedInstrumentCategory.isETrading) {
          this.isDisabledByInstrumentCategory = true
          this.dto.isETrading = false
        } else {
          this.isDisabledByInstrumentCategory = false
        }
      }
    },

    doAdd() {
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].resetFields()
      }
      this.dto = Object.assign({}, this.defaultDto)
      this.showManage = true
      this.isEdit = false
      this.isDetail = false
    },

    doEdit(row) {
      this.isEdit = true
      this.isDetail = false
      this.showManage = true
      this.$nextTick(() => {
        this.$refs[this.formName].clearValidate()
        this.dto.sdInstrumentLegList = [
          ...row.sdInstrumentLegList.map(t => {
            return {
              ...t,
              legData: []
            }
          })
        ];
        if(row.instrumentType == 1){
          this.changeRules(true)
        }
      })
      this.dto = Object.assign({}, { ...row })
      
    },

    doView(row) {
      this.showManage = true
      this.isDetail = true
      this.isEdit = false
      this.$nextTick(() => {
        this.dto.sdInstrumentLegList = [
          ...row.sdInstrumentLegList.map(t => {
            return {
              ...t,
              legData: []
            }
          })
        ]
      })
      this.dto = Object.assign({}, { ...row })
      this.rules = {}
    },

    doCancel() {
      this.dialogVisible = false
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].resetFields()
      }
    },

    doSave() {
      const data = { ...this.dto }

      data.sdInstrumentLegList.forEach((d, i) => {
        d.combinationInstrumentQctKey = data.qcKey
        d.legIndex = i + 1
      })
      let emptyLegItems = data.sdInstrumentLegList.filter(d => {
        return !d.legInstrumentQctKey
      })
      if (emptyLegItems.length) {
        this.$alert('组合合约腿数存在未选择项', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$refs[this.formName].validate(async valid => {
        if (valid) {
          this.isSaving = true
          if (!this.isEdit) {
            await add(data).finally(() => {
              this.isSaving = false
            })
            this.showManage = false
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.fetchData()
          } else {
            await update(data.id, data).finally(() => {
              this.isSaving = false
            })
            this.showManage = false
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.fetchData()
          }
        }
      })
    },

    doToggleStatus(row) {
      const { exchange = '', qcKey = '', isDeleted = false } = { ...row }
      this.$confirm(
        `确认${isDeleted ? '启用' : '停用'}：${exchange}【${qcKey}】？`,
        '提示',
        {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }
      )
        .then(() => {
          this.isOperating = true
          toggle(row.id)
            .then(response => {
              if (response.status === 200) {
                this.isOperating = false
                this.$message({
                  type: 'success',
                  message: `${isDeleted ? '启用' : '停用'}成功`
                })
                this.fetchData()
              }
            })
            .catch(() => {
              this.isOperating = false
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    changeRules (val) {
      let newList = {
          deliveryDate: [
            { required: val, message: '不能为空', trigger: 'change' }
          ],
          previousDeliveryDate: [
            { required: val, message: '不能为空', trigger: 'change' }
          ],
          firstTradingDate: [
            { required: val, message: '不能为空', trigger: 'change' }
          ],
          lastTradingDay: [
            { required: val, message: '不能为空', trigger: 'change' }
          ],
        }
        Object.assign(this.rules,newList)
    }
  },
  computed: {
    manageDrawerTitle() {
      return this.isDetail ? '详情' : this.isEdit ? '编辑' : '新增'
    },
    yOrNList() {
      return YOrNList
    },
    financialInstrumentType() {
      return FINANCIAL_INSTRUMENT_TYPE
    }
  }
}
</script>

