<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div>
        <el-input placeholder="唯一标识" title="唯一标识" v-model="query.qcKey" clearable></el-input>
      </div>
      <div>
        <el-input placeholder="交易所名称" title="交易所名称" v-model="query.fullName" clearable></el-input>
      </div>
      <div>
        <el-input placeholder="交易所简称" title="交易所简称" v-model="query.shortName" clearable></el-input>
      </div>
      <div>
        <el-select
          v-model="query.exchangeType"
          filterable
          clearable
          placeholder="交易所类型"
          title="交易所类型"
          class="item-select"
        >
          <el-option
            v-for="item in exchangeTypes"
            :key="item.value"
            :label="item.text"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-date-picker
          style="max-width: 13rem;"
          v-model="dateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          title="选择开始/结束日期"
        ></el-date-picker>
      </div>
      <div>
        <el-select
          clearable
          filterable
          placeholder="是否期货下单"
          title="是否期货下单"
          v-model="query.isETrading"
        >
          <el-option
            v-for="item in [
                            { text: '是', value: true },
                            { text: '否', value: false }
                        ]"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-select clearable filterable placeholder="是否停用" title="是否停用" v-model="query.isDeleted">
          <el-option
            v-for="item in [
                            { text: '是', value: true },
                            { text: '否', value: false }
                        ]"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
      </div>
      <import-file
        :download-file-name="downloadFileName"
        :column="importColumn"
        :download-url="downloadUrl"
        :preview-url="previewUrl"
        :import-url="importUrl"
        @fetch-data="fetchData"
        v-hasAuth="[$route,'import']"
      />
      <div>
        <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      </div>
      <div>
        <el-button icon="el-icon-error" @click="doReset">清空</el-button>
      </div>
    </div>

    <div class="search-margin-bottom">
      <el-table
        :data="list"
        v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="唯一标识" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qcKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易所名称" align="center">
          <template slot-scope="scope">{{scope.row.fullName}}</template>
        </el-table-column>
        <el-table-column label="交易所简称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.shortName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易所类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.exchangeType | mapKV(exchangeTypes, 'text', 'name')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否期货下单" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isETrading | parseBool }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否允许开平" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isAllowOpenClose | parseBool }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否允许今仓" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isAllowToday | parseBool }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否允许投/保" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isAllowHedge | parseBool }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时区" align="center" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.timeZoneId | mapKV(commonData.timeZoneIdList, 'DisplayName', 'Id') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creationTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lastManipulationTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否停用" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isDeleted | parseBool }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="doEdit(scope.row)"
                v-hasAuth="[$route,'update']"
                class="operation-btn"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="启用" placement="top" v-if="scope.row.isDeleted">
              <el-button
                type="text"
                icon="el-icon-success"
                @click="doEnable(scope.row)"
                class="operation-btn operation-enable-btn"
                v-hasAuth="[$route,'switch-enable-status']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="停用" placement="top" v-else>
              <el-button
                type="text"
                icon="el-icon-remove-outline"
                @click="doDisable(scope.row)"
                class="operation-btn operation-disable-btn"
                v-hasAuth="[$route,'switch-enable-status']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="收盘时间维护" placement="top">
              <el-button
                type="text"
                icon="el-icon-time"
                @click="setTime(scope.row,'config')"
                class="operation-btn"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="收盘时间查看" placement="top">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="setTime(scope.row,'view')"
                class="operation-btn operation-view-btn"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-footer>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pagination.currentPage"
        :page-size="query.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="itemCount"
      ></el-pagination>
    </el-footer>

    <!-- dialog -->
    <div>
      <el-dialog
        :title="dialogTitle[dialogStatus]"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="60%"
      >
        <div>
          <el-form
            label-position="right"
            label-width="140px"
            status-icon
            :ref="formName"
            :rules="rules"
            :model="exchangeModel"
          >
            <el-row>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="唯一标识" prop="qcKey">
                  <el-input
                    v-model="exchangeModel.qcKey"
                    clearable
                    placeholder
                    :disabled="dialogStatus === 'update'"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="交易所名称" prop="fullName">
                  <el-input v-model="exchangeModel.fullName" clearable placeholder />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="交易所简称" prop="shortName">
                  <el-input v-model="exchangeModel.shortName" clearable placeholder />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="交易所类型" prop="exchangeType" class="full-width">
                  <el-select v-model="exchangeModel.exchangeType" filterable clearable placeholder>
                    <el-option
                      v-for="(item, index) in exchangeTypes"
                      :key="index"
                      :label="item.text"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="时区" prop="timeZoneId" class="full-width">
                  <el-select v-model="exchangeModel.timeZoneId" filterable clearable placeholder>
                    <el-option
                      v-for="(item, index) in commonData.timeZoneIdList"
                      :key="index"
                      :label="item.DisplayName"
                      :value="item.Id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="是否期货下单" prop="isETrading">
                  <el-switch
                    v-model="exchangeModel.isETrading"
                    border
                    :disabled="exchangeModel.exchangeType === '无'"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="是否允许开平" prop="isAllowOpenClose">
                  <el-switch
                    v-model="exchangeModel.isAllowOpenClose"
                    border
                    :disabled="exchangeModel.exchangeType === '无'"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="是否允许今仓" prop="isAllowToday">
                  <el-switch
                    v-model="exchangeModel.isAllowToday"
                    border
                    :disabled="exchangeModel.exchangeType === '无'"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="是否允许投/保" prop="isAllowHedge">
                  <el-switch
                    v-model="exchangeModel.isAllowHedge"
                    border
                    :disabled="exchangeModel.exchangeType === '无'"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="doCancel">取消</el-button>
          <el-button type="primary" @click="doSave" :loading="isLoading">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 收盘时间维护 -->
    <el-dialog
      :title="'收盘时间' + dialogTitle[dialogStatus]"
      :visible.sync="dialogTimeVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="60%"
    >
      <div v-if="dialogStatus === 'config'">
        <h4>交易所时间</h4>
        <el-row type="flex" justify="end" align="bottom">
          <el-col :span="20">
            <el-table :data="editExchangeTimeList" border fit highlight-current-row>
              <el-table-column label="交易所" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.exchangeQctKey }}</span>
                </template>
              </el-table-column>
              <el-table-column label="收盘开始时间" align="center">
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.beginTime"
                    value-format="HH:mm:ss"
                    placeholder="选择时间"
                  ></el-time-picker>
                </template>
              </el-table-column>
              <el-table-column label="收盘结束时间" align="center">
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.endTime"
                    value-format="HH:mm:ss"
                    placeholder="选择时间"
                  ></el-time-picker>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="4" class="option">
            <i class="el-icon-circle-plus" @click="addTime('exchange')"></i>
            <i
              class="el-icon-remove"
              style="color: #f56c6c"
              @click="removeTime('exchange')"
              v-if="editExchangeTimeList.length > 1"
            ></i>
          </el-col>
        </el-row>
        <h4>标准合约时间</h4>
        <el-row type="flex" justify="end" align="bottom">
          <el-col :span="20">
            <el-table :data="editContractTimeList" border fit highlight-current-row>
              <el-table-column label="品种" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.instrumentCategoryQctKey"
                    filterable
                    clearable
                    placeholder="请选择品种"
                    class="item-select"
                  >
                    <el-option
                      v-for="item in commonData[curExchange.qcKey.toLowerCase()]"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="收盘开始时间" align="center">
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.beginTime"
                    value-format="HH:mm:ss"
                    placeholder="选择时间"
                  ></el-time-picker>
                </template>
              </el-table-column>
              <el-table-column label="收盘结束时间" align="center">
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.endTime"
                    value-format="HH:mm:ss"
                    placeholder="选择时间"
                  ></el-time-picker>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="4" class="option">
            <i class="el-icon-circle-plus" @click="addTime('contract')"></i>
            <i
              class="el-icon-remove"
              style="color: #f56c6c"
              @click="removeTime('contract')"
              v-if="editContractTimeList.length >1"
            ></i>
          </el-col>
        </el-row>
        <div class="foot-btn">
          <el-button @click="timeCancel">取消</el-button>
          <el-button
            type="primary"
            @click="saveTime"
            :disabled="editContractTimeList.length > 0 || editExchangeTimeList.length > 0 ? false : true"
            :loading="isSaveing"
          >保存</el-button>
        </div>
      </div>
      <!-- 收盘时间查看 -->
      <div v-if="dialogStatus === 'view'">
        <el-table :data="editExchangeTimeList" border fit highlight-current-row>
          <el-table-column label="交易所" align="center" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.exchangeQctKey}}</span>
            </template>
          </el-table-column>
          <el-table-column label="收盘时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime }} - {{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <h4></h4>
        <el-table
          :data="editContractTimeList"
          border
          fit
          :span-method="spanMethod"
          highlight-current-row
        >
          <el-table-column label="品种" align="center" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.instrumentCategoryQctKey }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收盘时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime }} - {{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="foot-btn">
          <el-button @click="timeCancel">取消</el-button>
          <el-button type="primary" @click="editTime">编辑</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getEnums } from "../../api/enums";
import {
  list,
  update,
  toggleAble,
  add,
  baseUrl,
  saveTime,
  getCommonData
} from "../../api/exchange";
import ImportFile from "../../components/ImportFile/index";

export default {
  name: "exchange",
  components: {
    ImportFile
  },

  data() {
    return {
      importColumn: [
        {
          label: "唯一标识",
          prop: "qcKey"
        },
        {
          label: "交易所名称",
          prop: "fullName"
        },
        {
          label: "交易所简称",
          prop: "shortName"
        },
        {
          label: "交易所类型",
          prop: "exchangeType"
        },
        {
          label: "是否期货下单",
          prop: "isETrading"
        },
         {
          label: "是否允许开平",
          prop: "isAllowOpenClose"
        },
        {
          label: "是否允许今仓",
          prop: "isAllowToday"
        },
        {
          label: "是否允许投/保",
          prop: "isAllowHedge"
        },
        {
          label: "时区",
          prop: "timeZoneId"
        }
      ],
      downloadFileName: "交易所模板.xls",
      downloadUrl: `${baseUrl}/Download`,
      previewUrl: `${baseUrl}/Preview`,
      importUrl: `${baseUrl}/Import`,
      isOperating: false,
      list: [],
      listLoading: false,
      itemCount: 0,
      dateTime: [],
      importData: [],
      query: {
        qctKey: "",
        fullName: "",
        shortName: "",
        exchangeType: "",
        creationTime: "",
        creationStartDate: "",
        creationEndDate: "",
        isETrading: "",
        isDeleted: "",
        pagination: {
          currentPage: 1,
          pageSize: 10
        }
      },
      defaultQuery: {
        qctKey: "",
        fullname: "",
        shortName: "",
        exchangeType: "",
        creationTime: "",
        creationStartDate: "",
        creationEndDate: "",
        isETrading: "",
        isAllowOpenClose: "",
        isDeleted: "",
        pagination: {
          currentPage: 1,
          pageSize: 10
        }
      },
      formName: "exchangeModelForm",
      dialogVisible: false,
      rules: {
        qcKey: [{ required: true, message: "不能为空", trigger: "blur" }],
        fullName: [{ required: true, message: "不能为空", trigger: "blur" }],
        shortName: [{ required: true, message: "不能为空", trigger: "blur" }],
        exchangeType: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        isETrading: [{ required: true, message: "不能为空", trigger: "blur" }],
        isAllowOpenClose: [{ required: true, message: "不能为空", trigger: "blur" }],
        isAllowToday: [{ required: true, message: "不能为空", trigger: "blur" }],
        isAllowHedge: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      exchangeTypes: [],
      exchangeModel: {
        id: "",
        shortName: "",
        fullName: "",
        qcKey: "",
        isDeleted: "",
        creationTime: "",
        lastManipulationTime: "",
        exchangeType: "",
        isETrading: false,
        isAllowOpenClose: false,
        isAllowHedge: false,
        isAllowToday: false,
        timeZoneId: ""
      },
      defaultData: {
        id: "",
        shortName: "",
        fullName: "",
        qcKey: "",
        isDeleted: "",
        creationTime: "",
        lastManipulationTime: "",
        exchangeType: "",
        isETrading: false,
        isAllowOpenClose: false,
        isAllowHedge: false,
        isAllowToday: false,
        timeZoneId: ""
      },
      dialogStatus: "",
      dialogTitle: {
        add: "新增",
        update: "编辑",
        config: "维护",
        view: "查看"
      },
      isLoading: false,
      // 收盘时间
      commonData: {},
      dialogTimeVisible: false,
      curExchange: null,
      editExchangeTimeList: [],
      editContractTimeList: [],
      exchangeTimeList: [],
      contractTimeList: [],
      isSaveing: false,
      tabSpanList: []
    };
  },

  watch: {
    "exchangeModel.exchangeType": function(newVal) {
      if (newVal === "无") {
        this.exchangeModel.isETrading = false;
      }
    }
  },

  async created() {
    await this.fetchEnums();
    this.fetchData();
    this.commonData = (await getCommonData()).data;
  },
  methods: {
    doEnable(row) {
      if (row.isDeleted) {
        this.$confirm(`确认启用：【${row.fullName}】？`, "提示", {
          type: "warning",
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.isOperating = true;
            toggleAble(row.id)
              .then(response => {
                if (response.status === 200) {
                  this.isOperating = false;
                  this.$message({
                    type: "success",
                    message: "启用成功"
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
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },

    doDisable(row) {
      if (!row.isDeleted) {
        this.$confirm(`确认停用：【${row.fullName}】？`, "提示", {
          type: "warning",
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.isOperating = true;
            toggleAble(row.id)
              .then(response => {
                if (response.status === 200) {
                  this.isOperating = false;
                  this.$message({
                    type: "success",
                    message: "禁用成功"
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
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },

    doAdd() {
      this.dialogStatus = "add";
      this.dialogVisible = true;
      this.isLoading = false;
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].resetFields();
      }
      this.exchangeModel = { ...this.defaultData };
    },

    doSearch() {
      this.query.pagination.currentPage = 1;
      this.query.creationStartDate =
        this.dateTime && this.dateTime.length && this.dateTime[0];
      this.query.creationEndDate =
        this.dateTime && this.dateTime.length && this.dateTime[1];
      this.fetchData();
    },

    async fetchEnums() {
      const { data } = await getEnums({
        enumTypeNames: ["exchangeType"]
      });
      this.exchangeTypes = data.exchangeType;
    },

    async fetchData() {
      this.listLoading = true;
      const response = await list(this.query).finally(() => {
        this.listLoading = false;
      });
      this.list = response.data.list;
      this.query.pagination.currentPage = response.data.pagination.currentPage;
      this.query.pagination.pageSize = response.data.pagination.pageSize;
      this.itemCount = response.data.pagination.itemCount;
    },

    handleSizeChange(val) {
      this.query.pagination.pageSize = val;
      this.fetchData();
    },

    handleCurrentChange(val) {
      this.query.pagination.currentPage = val;
      this.fetchData();
    },

    doEdit(row) {
      this.dialogStatus = "update";
      this.dialogVisible = true;
      this.exchangeModel = { ...row };
    },

    doCancel() {
      this.dialogVisible = false;
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].resetFields();
      }
    },
    doSave() {
      let t = { ...this.exchangeModel };
      this.$refs[this.formName].validate(async valid => {
        if (valid) {
          this.isLoading = true;
          if (this.dialogStatus === "update") {
            await update(t.id, t).finally(() => {
              this.isLoading = false;
            });
            this.dialogVisible = false;
            this.$refs[this.formName].resetFields();
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.fetchData();
          } else {
            await add(t).finally(() => {
              this.isLoading = false;
            });
            this.dialogVisible = false;
            this.$refs[this.formName].resetFields();
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.fetchData();
          }
        } else {
          return false;
        }
      });
    },

    doReset() {
      this.query = Object.assign({}, this.defaultQuery);
      this.dateTime = []
    },

    spanList() {
      let data = this.curExchange.instumentCategoryTradingTimeRanges;
      let list = [];
      let count;
      data.map((item, index) => {
        if (index == 0) {
          list.push(1);
          count = 0;
        }
        if (index > 0) {
          if (
            data[index - 1].instrumentCategoryQctKey ==
            item.instrumentCategoryQctKey
          ) {
            list[count] += 1;
            list.push(0);
          } else {
            list.push(1);
            count = index;
          }
        }
      });
      this.tabSpanList = list;
    },
    // eslint-disable-next-line no-unused-vars
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.tabSpanList[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    setTime(val, type) {
      let data = JSON.stringify(val);
      this.dialogTimeVisible = true;
      this.dialogStatus = type;
      this.curExchange = JSON.parse(data);
      this.editExchangeTimeList = this.curExchange.exchangeTradingTimeRanges;
      this.editContractTimeList = this.curExchange.instumentCategoryTradingTimeRanges;
      if (type === "view") {
        this.spanList();
      }
    },
    editTime() {
      this.dialogStatus = "config";
    },
    addTime(type) {
      if (type === "exchange") {
        this.editExchangeTimeList.push({
          exchangeQctKey: this.curExchange.qcKey,
          beginTime: null,
          endTime: null
        });
      }
      if (type === "contract") {
        this.editContractTimeList.push({
          instrumentCategoryQctKey: null,
          beginTime: null,
          endTime: null
        });
      }
    },
    removeTime(type) {
      if (type === "exchange") {
        this.editExchangeTimeList.pop();
      }
      if (type === "contract") {
        this.editContractTimeList.pop();
      }
    },
    saveTime() {
      try {
        this.editContractTimeList.map(item => {
          if (!item.instrumentCategoryQctKey) {
            throw "error";
          } else {
            item.exchangeQctKey = this.curExchange.qcKey;
          }
        });
      } catch (e) {
        this.$message.error("品种不能为空！");
        return;
      }
      this.isSaveing = true;
      saveTime(this.editExchangeTimeList.concat(this.editContractTimeList))
        .then(() => {
          this.$message.success("保存成功！");
          this.isSaveing = false;
          this.timeCancel();
          this.fetchData();
        })
        .catch(() => {
          this.isSaveing = false;
        });
    },
    timeCancel() {
      this.curExchange = [];
      this.dialogTimeVisible = false;
      this.editContractTimeList = [];
      this.editExchangeTimeList = [];
    }
  }
};
</script>

<style scoped>
.operation-btn {
  font-size: 18px;
}
.option {
  font-size: 24px;
}
.option i {
  margin-left: 10px;
  cursor: pointer;
  color: #409eff;
}
.foot-btn {
  margin-top: 20px;
  text-align: center;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: inherit;
}
</style>
