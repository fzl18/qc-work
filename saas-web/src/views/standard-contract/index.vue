<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div class="full-width">
        <el-input
            :title="assertData['qcKey']"
            clearable
            :placeholder="assertData['qcKey']"
            v-model="query.qcKey"
        />
      </div>
      <div class="full-width">
        <el-input
            :title="assertData['friendlyName']"
            clearable
            :placeholder="assertData['friendlyName']"
            v-model="query.friendlyName"
        />
      </div>
      <div class="full-width">
        <el-input
            :title="assertData['instrumentCategoryCode']"
            clearable
            :placeholder="assertData['instrumentCategoryCode']"
            v-model="query.instrumentCategoryCode"
        />
      </div>
      <div class="full-width">
        <el-select
            :title="assertData['financialInstrumentType']"
            :placeholder="assertData['financialInstrumentType']"
            v-model="query.financialInstrumentType"
            filterable
            clearable>
          <el-option
              v-for="(item, index) in financialInstrumentTypes"
              :key="index"
              :label="item.text"
              :value="item.value"/>
        </el-select>
      </div>
      <div class="full-width">
        <el-select
            :title="assertData['exchange']"
            :placeholder="assertData['exchange']"
            v-model="query.exchange"
            filterable
            clearable>
          <el-option
              v-for="(item, index) in exchangeList"
              :key="index"
              :label="item.fullName"
              :value="item.qcKey"/>
        </el-select>
      </div>
      <div class="full-width">
        <el-select
            :title="assertData['commodityType']"
            :placeholder="assertData['commodityType']"
            v-model="query.commodityType"
            filterable
            clearable>
          <el-option
              v-for="(item, index) in commodityTypeList"
              :key="index"
              :label="item.name"
              :value="item.qcKey"/>
        </el-select>
      </div>
      <div class="full-width">
        <el-select
            v-model="query.isETrading"
            :title="assertData['isETrading']"
            :placeholder="assertData['isETrading']"
            clearable>
          <el-option
              v-for="(item, index) in yOrNList"
              :key="index"
              :label="item.value"
              :value="item.key"/>
        </el-select>
      </div>
      <div>
        <el-select
            v-model="query.isDeleted"
            :title="assertData['isDeleted']"
            :placeholder="assertData['isDeleted']"
            clearable>
          <el-option
              v-for="(item, index) in yOrNList"
              :key="index"
              :label="item.value"
              :value="item.key"/>
        </el-select>
      </div>
      <div>
        <el-button
            type="success"
            title="新增"
            icon="el-icon-plus"
            @click="doAdd"
            v-hasAuth="[$route,'create']"
        ><span class="hidden-lg-and-down">新增</span>
        </el-button>
      </div>
      <div>
        <import-file
            :column="cols"
            :download-url="downloadUrl"
            download-file-name="标准合约模板.xls"
            :preview-url="previewUrl"
            :import-url="importUrl"
            v-hasAuth="[$route,'import']"
            @fetch-data="fetchData"/>
      </div>
      <div>
        <el-button
            type="primary"
            icon="el-icon-search"
            title="搜索"
            @click="doSearch"
        ><span class="hidden-lg-and-down">搜索</span>
        </el-button>
      </div>
      <div>
        <el-button icon="el-icon-error" title="清空" @click="doReset"
        ><span class="hidden-lg-and-down">清空</span>
        </el-button>
      </div>
    </div>

    <div class="search-margin-bottom">
      <el-table
          border
          fit
          highlight-current-row
          :data="list"
          v-loading.body="isListLoading">
        <el-table-column
            align="center"
            :label="assertData['qcKey']"
            prop="qcKey">
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['friendlyName']"
            prop="friendlyName">
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['code']"
            prop="code">
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['financialInstrumentType']"
            prop="financialInstrumentType">
          <template slot-scope="scope">
            <span>{{ scope.row.financialInstrumentType | mapKV(financialInstrumentTypes) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['exchange']"
            prop="exchange">
          <template slot-scope="scope">
            <span>{{ scope.row.exchange | mapKV(exchangeList, 'fullName', 'qcKey') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['commodityType']"
            prop="commodityType">
          <template slot-scope="scope">
            <span>{{ scope.row.commodityType | mapKV(commodityTypeList, 'name', 'qcKey')}}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['isETrading']"
            width="120">
          <template slot-scope="scope">
            {{ scope.row.isETrading | parseBool }}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['creationTime']"
            prop="creationTime">
          <template slot-scope="scope">
            <span>{{ scope.row.creationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['lastManipulationTime']"
            prop="lastManipulationTime">
          <template slot-scope="scope">
            <span>{{ scope.row.lastManipulationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="assertData['isDeleted']"
            align="center"
            width="80">
          <template slot-scope="scope">
            {{ scope.row.isDeleted | parseBool }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="doEdit(scope.row)"
                  v-hasAuth="[$route,'update']"
                  class="operation-btn"/>
            </el-tooltip>
            <el-tooltip
                content="启用"
                placement="top"
                v-if="scope.row.isDeleted">
              <el-button
                  type="text"
                  icon="el-icon-success"
                  @click="doToggleStatus(scope.row)"
                  class="operation-btn operation-enable-btn"/>
            </el-tooltip>
            <el-tooltip content="停用" placement="top" v-else>
              <el-button
                  type="text"
                  icon="el-icon-remove-outline"
                  @click="doToggleStatus(scope.row)"
                  v-hasAuth="[$route,'switch-enable-status']"
                  class="operation-btn operation-disable-btn"/>
            </el-tooltip>
            <el-tooltip content="查看" placement="top">
              <el-button
                  type="text"
                  icon="el-icon-view"
                  @click="doView(scope.row)"
                  class="operation-btn operation-view-btn"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pagination.currentPage"
          :page-size="query.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="query.pagination.itemCount"/>
    </div>

    <div>
      <el-dialog
          :title="dialogTitle[dialogStatus]"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          width="70%"
      >
        <el-form
            label-position="right"
            label-width="140px"
            status-icon
            :ref="formName"
            :rules="rules"
            :model="dto"
            size="mini"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="唯一标识" prop="qcKey">
                <el-input v-model="dto.qcKey" :disabled="isEdit" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="名称" prop="friendlyName">
                <el-input v-model="dto.friendlyName" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合约代码" prop="code">
                <el-input v-model="dto.code" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="合约类型"
                  prop="financialInstrumentType"
                  class="full-width"
              >
                <el-select
                    v-model="dto.financialInstrumentType"
                    filterable
                    clearable
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item, index) in financialInstrumentTypes"
                      :key="index"
                      :label="item.text"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="full-width">
              <el-form-item label="交易所" prop="exchange">
                <el-select
                    v-model="dto.exchange"
                    filterable
                    clearable
                    placeholder="请选择"
                    @change="exchangeChange"
                >
                  <el-option
                      v-for="(item, index) in exchangeList"
                      :key="index"
                      :label="item.fullName"
                      :value="item.qcKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="品类"
                  prop="commodityType"
                  class="full-width"
              >
                <el-select
                    v-model="dto.commodityType"
                    filterable
                    clearable
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item, index) in commodityTypeList"
                      :key="index"
                      :label="item.name"
                      :value="item.qcKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交易所品种名称" prop="tradingCommodityName">
                <el-input v-model="dto.tradingCommodityName" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交易所品种代码" prop="instrumentCategoryCode">
                <el-input v-model="dto.instrumentCategoryCode" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="是否期货下单"
                  prop="isETrading"
                  class="full-width"
              >
                <el-select
                    v-model="dto.isETrading"
                    :disabled="isFuturesSelect"
                    clearable
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
            <el-col :span="8">
              <el-form-item
                  label="合约格式"
                  prop="instrumentContractFormat"
                  class="full-width"
              >
                <el-select
                    v-model="dto.instrumentContractFormat"
                    filterable
                    clearable
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item, index) in contractFormats"
                      :key="index"
                      :label="item.text"
                      :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="币种" prop="currency" class="full-width">
                <el-select
                    v-model="dto.currency"
                    filterable
                    clearable
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item, index) in currencyList"
                      :key="index"
                      :label="item.name"
                      :value="item.qcKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重量单位" prop="unit" class="full-width">
                <el-select
                    v-model="dto.unit"
                    filterable
                    clearable
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item, index) in unitList"
                      :key="index"
                      :label="item.name"
                      :value="item.qcKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="合约税率"
                  prop="instrumentTaxRate"
                  class="full-width"
              >
                <el-input-number v-model="dto.instrumentTaxRate"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="交易单位量"
                  prop="lotSize"
                  class="full-width"
              >
                <el-input-number v-model="dto.lotSize"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最小价格变动单位" prop="tickSize">
                <el-input v-model="dto.tickSize" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="价格单位倍数"
                  prop="priceUnitMultiple"
                  class="full-width"
              >
                <el-input-number v-model="dto.priceUnitMultiple"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="保值比例"
                  prop="hedgingCoefficient"
                  class="full-width"
              >
                <el-input-number v-model="dto.hedgingCoefficient"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="交割乘数"
                  prop="deliveryMultiple"
                  class="full-width"
              >
                <el-input-number v-model="dto.deliveryMultiple"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="持仓限额"
                  prop="positionLimit"
                  class="full-width"
              >
                <el-input-number
                    :max="2147483647"
                    placeholder="最大值为2147483647"
                    v-model="dto.positionLimit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="合约时段类型"
                  prop="instrumentPeriodType"
                  class="full-width"
              >
                <el-select
                    v-model="dto.instrumentPeriodType"
                    filterable
                    clearable
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item, index) in instrumentPeriodTypes"
                      :key="index"
                      :label="item.text"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否允许今仓" prop="tag" class="full-width">
                <el-select
                    v-model="dto.tag"
                    filterable
                    clearable
                    placeholder="请选择"
                    disabled
                >
                  <el-option
                      v-for="(item, index) in tags"
                      :key="index"
                      :label="item.text"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button @click="doCancel">取消</el-button>
          <el-button type="primary" @click="doSave" :loading="isSaving"
          >保存</el-button
          >
        </span>
      </el-dialog>
    </div>

    <div>
      <el-drawer :title="`合约代码：${detailData.instrumentCategoryCode} 详情`"
                 :visible.sync="showDetail"
                 direction="rtl">
        <div class="app-container">
          <el-form label-position="left" inline>
            <el-row :gutter="20">
              <el-col
                  :span="12"
                  v-for="(key, index) in Object.keys(detailData)"
                  :key="index">
                <el-form-item :label="assertData[key]">
                  <span class="content-value">{{ detailData[key] }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import ImportFile from '../../components/ImportFile/index';
  import { parseTime, parseBool, mapKV, currency } from '../../utils/index';
  import {
    list as getList,
    add,
    update,
    toggle,
    commonData,
    url as standardContractUrl
  } from '../../api/standardContract';
  import { getEnums } from '../../api/enums';
  import { YOrNList } from '../../assets/enums';

  export default {
    name: 'StandardContract',
    components: { ImportFile },
    data () {
      var validateLotSize = (rule, value, callback) => {
        if (value !== '') {
          if (value <= 0) {
            callback(new Error('必须大于零'));
          } else {
            callback();
          }
        }
      };
      return {
      formName: 'standardContractForm',
      dialogVisible: false,
      dialogStatus: 'add',
      dialogTitle: {
        add: '新增',
        update: '编辑'
      },
      dto: {
        id: '',
        code: '',
        qcKey: '',
        exchange: '',
        commodityType: '',
        currency: '',
        unit: '',
        instrumentPeriodType: '',
        isDeleted: '',
        financialInstrumentType: null,
        friendlyName: '',
        priceUnitMultiple: '',
        lotSize: '',
        tickSize: '',
        instrumentContractFormat: '',
        instrumentTaxRate: '',
        creationTime: '',
        lastManipulationTime: '',
        hedgingCoefficient: '',
        deliveryMultiple: '',
        isETrading: '',
        positionLimit: '',
        tag: '',
        instrumentCategoryCode: '',
        tradingCommodityName: ''
      },
      defaultDto: {
        id: '',
        code: '',
        qcKey: '',
        exchange: '',
        commodityType: '',
        currency: '',
        unit: '',
        instrumentPeriodType: '',
        isDeleted: '',
        financialInstrumentType: null,
        friendlyName: '',
        priceUnitMultiple: '',
        lotSize: '',
        tickSize: '',
        instrumentContractFormat: '',
        instrumentTaxRate: '',
        creationTime: '',
        lastManipulationTime: '',
        hedgingCoefficient: '',
        deliveryMultiple: '',
        isETrading: '',
        positionLimit: '',
        tag: '',
        instrumentCategoryCode: '',
        tradingCommodityName: ''
      },
      rules: {
        code: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        qcKey: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        friendlyName: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        exchange: [ { required: true, message: '不能为空', trigger: 'change' } ],
        // commodityType: [ { required: true, message: '不能为空', trigger: 'change' } ],
        currency: [ { required: true, message: '不能为空', trigger: 'change' } ],
        unit: [ { required: true, message: '不能为空', trigger: 'change' } ],
        instrumentPeriodType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        priceUnitMultiple: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        lotSize: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: validateLotSize, trigger: 'blur' }
        ],
        tickSize: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        instrumentContractFormat: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        instrumentTaxRate: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        hedgingCoefficient: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        deliveryMultiple: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        isETrading: [ { required: true, message: '不能为空', trigger: 'change' } ],
        positionLimit: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        instrumentCategoryCode: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        tradingCommodityName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        financialInstrumentType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        tag: [ { required: true, message: '不能为空', trigger: 'change' } ]
      },
      query: {
        qcKey: '',
        friendlyName: '',
        instrumentCategoryCode: '',
        financialInstrumentType: '',
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
      defaultQuery: {
        qcKey: '',
        instrumentCategoryCode: '',
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
      detailData: {
        id: '',
        qcKey: '',
        friendlyName: '',
        instrumentCategoryCode: '',
        financialInstrumentType: '',
        exchange: '',
        commodityType: '',
        tradingCommodityName: '',
        code: '',
        isETrading: '',
        instrumentContractFormat: '',
        currency: '',
        unit: '',
        instrumentTaxRate: '',
        tickSize: '',
        priceUnitMultiple: '',
        hedgingCoefficient: '',
        deliveryMultiple: '',
        lotSize: '',
        positionLimit: '',
        instrumentPeriodType: '',
        tag: '',
        isDeleted: '',
        creationTime: '',
        lastManipulationTime: ''
      },
      assertData: {
        id: 'id',
        qcKey: '唯一标识',
        instrumentCategoryCode: '交易所品种代码',
        exchange: '交易所',
        commodityType: '品类',
        currency: '币种',
        unit: '重量单位',
        instrumentPeriodType: '合约时段类型',
        isDeleted: '是否停用',
        financialInstrumentType: '合约类型',
        friendlyName: '名称',
        priceUnitMultiple: '价格单位倍数',
        lotSize: '最小乘数',
        tickSize: '最小价格变动单位',
        instrumentContractFormat: '合约格式',
        instrumentTaxRate: '合约税率',
        creationTime: '创建时间',
        lastManipulationTime: '最近修改时间',
        hedgingCoefficient: '保值比例',
        deliveryMultiple: '交割乘数',
        isETrading: '是否期货下单',
        positionLimit: '持仓限额',
        tag: '是否今仓昨仓',
        code: '合约代码',
        tradingCommodityName: '交易所品种名称'
      },
      contractFormats: [],
      instrumentPeriodTypes: [],
      tags: [],
      financialInstrumentTypes: [],
      unitList: [],
      currencyList: [],
      exchangeList: [],
      commodityTypeList: [],
      financialInstrumentTypeEnum: {},
        tagsEnum: {},
      downloadUrl: `${standardContractUrl}/Download`,
      previewUrl: `${standardContractUrl}/Preview`,
      importUrl: `${standardContractUrl}/Import`,
      cols: [
        {
          label: '唯一标识',
          prop: 'qcKey'
        },
        {
          label: '名称',
          prop: 'friendlyName'
        },
        {
          label: '合约代码',
          prop: 'code'
        },
        {
          label: '合约类型',
          prop: 'financialInstrumentType'
        },
        {
          label: '合约格式',
          prop: 'instrumentContractFormat'
        },
        {
          label: '合约税率',
          prop: 'instrumentTaxRate'
        },
        {
          label: '品类',
          prop: 'commodityType'
        },
        {
          label: '交易所',
          prop: 'exchange'
        },
        {
          label: '交易所品种名称',
          prop: 'tradingCommodityName'
        },
        {
          label: '交易所品种代码',
          prop: 'instrumentCategoryCode'
        },
        {
          label: '是否期货下单',
          prop: 'isETrading'
        },
        {
          label: '币种',
          prop: 'currency'
        },
        {
          label: '重量单位',
          prop: 'unit'
        },
        {
          label: '最小价格变动单位',
          prop: 'tickSize'
        },
        {
          label: '价格单位倍数',
          prop: 'priceUnitMultiple'
        },
        {
          label: '保值比例',
          prop: 'hedgingCoefficient'
        },
        {
          label: '交割乘数',
          prop: 'deliveryMultiple'
        },
        {
          label: '最小乘数',
          prop: 'lotSize'
        },
        {
          label: '持仓限额',
          prop: 'positionLimit'
        },
        {
          label: '合约时段类型',
          prop: 'instrumentPeriodType'
        }
      ],
      exchange: {},
      isFutures: false,
      isFuturesSelect: false
    }
    },
    async created() {
      await this.getCommonData();
      await this.fetchEnums();
      await this.fetchData();
    },
    watch: {
      'dto.financialInstrumentType': function (v) {
        if (v === 2) {
          this.dto.isETrading = false;
          this.isFuturesSelect = true;
        } else {
          this.isFuturesSelect = false;
        }
      },
      'dto.exchange': function (v) {
        this.exchange = this.exchangeList.find(e => e.qcKey === v);
        if (this.exchange) {
          if (!this.exchange.isETrading) {
            this.isFuturesSelect = true;
            this.dto.isETrading = false;
          } else {
            this.isFuturesSelect = false;
            this.dto.isETrading = true;
          }
        }
      }
    },
    methods: {
      exchangeChange (e) {
        let selectExchange = this.exchangeList.find(o => o.qcKey === e);
        if (!selectExchange) {
          this.dto.tag = null
        } else {
          if (!selectExchange.isAllowOpenClose) {
            this.dto.tag = this.tagsEnum.none
          } else {
            if (selectExchange.isAllowToday) {
              this.dto.tag = this.tagsEnum.allowToday
            } else {
              this.dto.tag = this.tagsEnum.onlyYesterday
            }
          }
        }
      },
      async getCommonData() {
        const { data } = await commonData();
        this.unitList = data.unitList;
        this.currencyList = data.currencyList;
        this.exchangeList = data.exchangeList;
        this.commodityTypeList = data.commodityTypeList;
        this.financialInstrumentTypeEnum = data.financialInstrumentTypeEnum
        this.tagsEnum = data.tagsEnum
      },

      async fetchEnums() {
        const { data } = await getEnums({
          enumTypeNames: [
            'contractFormat',
            'InstrumentPeriodType',
            'financialInstrumentType',
            'tags'
          ]
        });
        this.contractFormats = data && data.contractFormat;
        this.instrumentPeriodTypes = data && data.instrumentPeriodType;
        this.financialInstrumentTypes = data && data.financialInstrumentType;
        this.tags = data && data.tags;
      },

      doSearch() {
        this.query.pagination.currentPage = 1;
        this.fetchData();
      },

      doReset() {
        this.query = Object.assign({}, this.defaultQuery);
      },

      async fetchData() {
        this.isListLoading = true;
        this.query.code = this.query.instrumentCategoryCode;
        const { data } = await getList(this.query).finally(() => {
          this.isListLoading = false;
        });
        const { list, pagination } = data;
        this.list = list;
        this.query.pagination.currentPage = pagination.currentPage;
        this.query.pagination.pageSize = pagination.pageSize;
        this.query.pagination.itemCount = pagination.itemCount;
      },

      handleCurrentChange(currentPage) {
        this.query.pagination.currentPage = currentPage;
        this.fetchData();
      },

      handleSizeChange(pageSize) {
        this.query.pagination.pageSize = pageSize;
        this.fetchData();
      },

      doAdd() {
        this.dialogStatus = 'add';
        this.dialogVisible = true;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.dto = Object.assign({}, this.defaultDto);
      },

      doEdit(row) {
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.dto = Object.assign({}, { ...row });
      },

      doView(row) {
        this.showDetail = true;
        const data = Object.assign({}, row);
        data.positionLimit = currency(data.positionLimit);
        data.exchange = mapKV(
          data.exchange,
          this.exchangeList,
          'fullName',
          'qcKey'
        );
        data.commodityType = mapKV(
          data.commodityType,
          this.commodityTypeList,
          'name',
          'qcKey'
        );
        data.currency = mapKV(data.currency, this.currencyList, 'name', 'qcKey');
        data.unit = mapKV(data.unit, this.unitList, 'name', 'qcKey');
        data.instrumentPeriodType = mapKV(
          data.instrumentPeriodType,
          this.instrumentPeriodTypes,
          'text',
          'value'
        );
        data.financialInstrumentType = mapKV(
          data.financialInstrumentType,
          this.financialInstrumentTypes,
          'text',
          'value'
        );
        data.tag = mapKV(
          data.tag,
          this.tags,
          'text',
          'value'
        ) || data.tag;
        data.isDeleted = parseBool(data.isDeleted);
        data.isETrading = parseBool(data.isETrading);
        data.creationTime = parseTime(data.creationTime);
        data.lastManipulationTime = parseTime(data.lastManipulationTime);
        this.detailData = { ...this.detailData, ...data };
      },

      doCancel() {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.dialogVisible = false;
        this.dto = Object.assign({}, this.defaultDto);
      },

      doSave() {
        const data = Object.assign({}, this.dto);
        this.$refs[this.formName].validate(async valid => {
          if (valid) {
            // 当合约类型为 非组合合约 时，品类不能为空
            if (data.financialInstrumentType !== this.financialInstrumentTypeEnum['combination'] && (!data.commodityType)) {
              this.$message.info('当合约类型为 非组合合约 时，品类不能为空')
              return;
            }
            if (this.dialogStatus === 'add') {
              this.isSaving = true;
              await add(data).finally(() => {
                this.isSaving = false;
              });
              this.dialogVisible = false;
              this.$message({
                type: 'success',
                message: '新增成功'
              });
              await this.fetchData();
            } else {
              this.isSaving = true;
              await update(data.id, data).finally(() => {
                this.isSaving = false;
              });
              this.dialogVisible = false;
              this.$message({
                type: 'success',
                message: '编辑成功'
              });
              await this.fetchData();
            }
          }
        });
      },

      doToggleStatus(row) {
        const { exchange = '', qcKey = '', isDeleted = false } = { ...row };
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
            this.isOperating = true;
            toggle(row.id)
              .then(response => {
                if (response.status === 200) {
                  this.isOperating = false;
                  this.$message({
                    type: 'success',
                    message: `${isDeleted ? '启用' : '停用'}成功`
                  });
                  this.fetchData();
                }
              })
              .catch(() => {
                this.isOperating = false;
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
      }
    },
    computed: {
      isEdit() {
        return this.dialogStatus === 'update';
      },

      yOrNList() {
        return YOrNList;
      }
    }
  };
</script>

<style scoped>
  .content-value {
    color: #409eff;
  }

  .form-switch {
    height: 30px;
    line-height: 30px;
  }
</style>
