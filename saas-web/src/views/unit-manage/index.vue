<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div>
        <el-input placeholder="唯一标识" title="唯一标识" v-model="query.qcKey" clearable/>
      </div>
      <div>
        <el-input placeholder="名称" title="名称" v-model="query.name" clearable/>
      </div>
      <div>
        <el-input placeholder="英文名称" title="英文名称" v-model="query.englishName" clearable/>
      </div>
      <div>
        <el-input placeholder="符号" title="符号" v-model="query.symbol" clearable/>
      </div>
      <div>
        <el-select v-model="query.quantityKind" filterable clearable placeholder="类别" title="类别">
          <el-option v-for="(item, index) in quantityKindList"
                     :key="index"
                     :label="item.text"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="query.isDeleted" title="是否停用" placeholder="是否停用" clearable>
          <el-option v-for="(item, index) in yOrNList" :key="index" :label="item.value" :value="item.key"/>
        </el-select>
      </div>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
      <div>
        <el-button icon="el-icon-error" title="清空" @click="doReset">
          <span class="hidden-lg-and-down">清空</span>
        </el-button>
      </div>
    </div>

    <div class="search-margin-bottom">
      <el-table element-loading-text="Loading" border fit highlight-current-row
                :data="list" v-loading.body="listLoading">
        <el-table-column label="唯一标识" align="center">
          <template slot-scope="scope">
            <el-link :underline="false">{{ scope.row.qcKey }}
              <el-tooltip v-if="scope.row.warningMsg" class="item" effect="dark" :content="scope.row.warningMsg"
                          placement="right"><i class="el-icon-warning-outline el-icon--right color-danger" />
              </el-tooltip>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.englishName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="符号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.symbol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.quantityKind | mapKV(quantityKindList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否停用" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isDeleted | parseBool }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-if="!scope.row.isDeleted">
              <el-button type="text" icon="el-icon-edit" v-hasAuth="[$route,'update']" @click="doEdit(scope.row)"
                         class="operation-btn"/>
            </el-tooltip>
            <el-tooltip content="启用" placement="top" v-if="scope.row.isDeleted">
              <el-button
                  type="text"
                  icon="el-icon-success"
                  @click="doToggleStatus(scope.row)"
                  v-hasAuth="[$route,'switch-enable-status']"
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
          :total="itemCount">
      </el-pagination>
    </el-footer>

    <!-- dialog -->
    <div>
      <el-dialog
          :title="dialogTitle[dialogStatus]"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="70%">
        <div>
          <el-form label-position="right"
                   label-width="100px"
                   status-icon
                   :ref="formName"
                   :rules="rules"
                   :model="model">
            <el-row>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="唯一标识" prop="qcKey">
                  <el-input v-model="model.qcKey" clearable placeholder=""
                            :disabled="isEdit"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="model.name" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="英文名称" prop="englishName">
                  <el-input v-model="model.englishName" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="符号" prop="symbol">
                  <el-input v-model="model.symbol" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="类别" prop="quantityKind" class="full-width">
                  <el-select v-model="model.quantityKind" filterable clearable placeholder=""
                             :disabled="isEdit">
                    <el-option v-for="(item, index) in quantityKindList"
                               :key="index"
                               :label="item.text"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider/>
            <div class="search-margin-bottom">
              <el-row :gutter="16">
                <el-col :span="2">
                  <span>转换关系</span>
                </el-col>
                <transition name="el-fade-in">
                  <el-col :span="22">
                    <div>
                      <el-link :underline="false" type="danger" v-if="relationDataHasZero">基础值、转换后值不能为0;</el-link>
                      <el-link :underline="false" type="danger" v-if="unitHasNil">转成单位不能为空</el-link>
                    </div>
                  </el-col>
                </transition>
              </el-row>
            </div>
            <el-table :data="model.sdUnitConversionDtos" border fit highlight-current-row>
              <el-form-item :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                <el-table-column label="基础值" align="center">
                  <template slot="header">
                    <span><i class="color-danger">*</i>&nbsp;基础值</span>
                  </template>
                  <template slot-scope="scope">
                    <el-input-number :controls="false" v-model="scope.row.fromUnitNumericValue"/>
                  </template>
                </el-table-column>
              </el-form-item>
              <el-table-column label="转换单位" align="center">
                <template slot-scope="scope">
                  <span>{{ model.name || scope.row.name || scope.row.fromUnit }}</span>
                </template>
              </el-table-column>
              <el-table-column label="=" align="center" width="40">
                <template slot="header">
                  <span/>
                </template>
                <template>
                  <span>=</span>
                </template>
              </el-table-column>
              <el-table-column label="转换后值" align="center">
                <template slot="header">
                  <span><i class="color-danger">*</i>&nbsp;转换后值</span>
                </template>
                <template slot-scope="scope">
                  <el-input-number :controls="false" v-model="scope.row.toUnitNumericValue"/>
                </template>
              </el-table-column>
              <el-table-column label="转成单位" align="center">
                <template slot="header">
                  <span><i class="color-danger">*</i>&nbsp;转成单位</span>
                </template>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.toUnit" filterable clearable placeholder="">
                    <el-option v-for="(item, index) in sameQuantityKind"
                               :key="index"
                               :label="item.name"
                               :value="item.qcKey"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input type="textarea" :rows="1" v-model="scope.row.note"/>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="60">
                <template slot="header">
                  <el-link icon="el-icon-plus" type="primary" @click="addRow"/>
                  <!--<el-button type="primary" size="mini" icon="el-icon-plus" @click="addRow"/>-->
                </template>
                <template slot-scope="scope">
                  <el-link icon="el-icon-minus" type="danger" @click="removeRow(scope)"/>
                  <!--<el-button type="warning" size="mini" icon="el-icon-minus" @click="removeRow(scope)"/>-->
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="doCancel">取消</el-button>
          <el-button type="primary" @click="doSave" :loading="isLoading">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import {
    list,
    update,
    toggle,
    commonData,
    add
  } from '../../api/unitManage';
  import { YOrNList } from '../../assets/enums';

  export default {
    name: 'UnitManage',
    data() {
      return {
        isOperating: false,
        list: [],
        listLoading: false,
        itemCount: 0,
        quantityKindList: [],
        query: {
          qcKey: '',
          name: '',
          englishName: '',
          symbol: '',
          quantityKind: '',
          isDeleted: '',
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        defaultQuery: {
          qcKey: '',
          name: '',
          englishName: '',
          symbol: '',
          quantityKind: '',
          isDeleted: '',
          pagination: {
            currentPage: 1,
            pageSize: 10,
            itemCount: 0
          }
        },
        formName: 'unitManageForm',
        dialogVisible: false,
        rules: {
          qcKey: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          name: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          englishName: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          symbol: [ { required: true, message: '不能为空', trigger: 'change' } ],
          quantityKind: [ { required: true, message: '不能为空', trigger: 'change' } ]
        },
        model: {
          qcKey: '',
          name: '',
          englishName: '',
          symbol: '',
          quantityKind: '',
          sdUnitConversionDtos: []
        },
        defaultData: {
          qcKey: '',
          name: '',
          englishName: '',
          symbol: '',
          quantityKind: '',
          sdUnitConversionDtos: []
        },
        relationModel: {
          id: '',
          fromUnit: '',
          name: '', // 转换单位名称
          toUnit: '',
          fromUnitNumericValue: 1,
          toUnitNumericValue: 1,
          note: ''
        },
        dialogStatus: '',
        dialogTitle: {
          add: '新增',
          update: '编辑'
        },
        isLoading: false,
        allUnits: []
      };
    },
    async created() {
      await this.fetchEnums();
      this.fetchData();
    },
    methods: {
      doToggleStatus(row) {
        const { name = '', id = '', isDeleted = false } = { ...row };
        this.$confirm(
          `确认${isDeleted ? '启用' : '停用'}：【${name}】？`,
          '提示',
          {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }
        )
          .then(() => {
            this.isOperating = true;
            toggle(id)
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
      },

      doAdd() {
        this.dialogStatus = 'add';
        this.dialogVisible = true;
        this.isLoading = false;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.clearData();
        this.fetchAllUnit();
      },

      doSearch() {
        this.query.pagination.currentPage = 1;
        this.fetchData();
      },

      async fetchEnums() {
        const { data } = await commonData();
        const { options } = data;
        this.quantityKindList = options.quantityKind;
      },

      async fetchData() {
        this.listLoading = true;
        const { data } = await list(this.query).finally(() => {
          this.listLoading = false;
        });
        this.list = data.result;
        this.query.pagination.currentPage = data.pagination.currentPage;
        this.query.pagination.pageSize = data.pagination.pageSize;
        this.itemCount = data.pagination.itemCount;
      },

      async fetchAllUnit() {
        const { data } = await list({ pagination: { pageSize: 0 } });
        this.allUnits = data.result;
      },

      handleCurrentChange(currentPage) {
        this.query.pagination.currentPage = currentPage;
        this.fetchData();
      },

      handleSizeChange(pageSize) {
        this.query.pagination.pageSize = pageSize;
        this.fetchData();
      },

      doEdit(row) {
        this.fetchAllUnit();
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.model = Object.assign({}, { ...row });
        this.model.sdUnitConversionDtos = JSON.parse(JSON.stringify(row.sdUnitConversionDtos));
      },

      doCancel() {
        this.dialogVisible = false;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.clearData();
      },

      doSave() {
        let _model = { ...this.model };
        this.$refs[this.formName].validate(async valid => {
          if (valid) {
            if (this.relationDataHasZero || this.unitHasNil) {
              this.$message.info('基础值、转换后值不能为0，转成单位不能为空');
              return;
            }
            this.isLoading = true;
            if (this.isEdit) {
              await update(_model.id, _model).finally(() => {
                this.isLoading = false;
              });
              this.dialogVisible = false;
              this.$refs[this.formName].resetFields();
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.fetchData();
            } else {
              await add(_model).finally(() => {
                this.isLoading = false;
              });
              this.dialogVisible = false;
              this.$refs[this.formName].resetFields();
              this.$message({
                type: 'success',
                message: '新增成功'
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
      },

      addRow() {
        if (!(this.model.qcKey || this.model.qcKey)) {
          this.$message.info('请先输入唯一标识和名称');
          return;
        }
        this.model.sdUnitConversionDtos.push({
          id: '',
          fromUnit: this.model.qcKey,
          name: this.model.name, // 转换单位名称
          toUnit: '',
          fromUnitNumericValue: 1,
          toUnitNumericValue: 1,
          note: ''
        });
      },

      removeRow(data) {
        const { $index } = { ...data };
        this.model.sdUnitConversionDtos.splice($index, 1);
      },

      clearData() {
        this.model = Object.assign({}, { ...this.defaultData });
        this.model.sdUnitConversionDtos = [];
      }

    },
    computed: {
      ...mapGetters([ 'userInfo' ]),
      isAdmin() {
        return this.userInfo.isAdmin;
      },
      yOrNList() {
        return YOrNList;
      },
      relationDataHasZero() {
        return this.model.sdUnitConversionDtos.some(row => (!row.fromUnitNumericValue) || (!row.toUnitNumericValue));
      },
      unitHasNil() {
        return this.model.sdUnitConversionDtos.some(row => !row.toUnit);
      },
      isEdit() {
        return this.dialogStatus === 'update';
      },
      sameQuantityKind() {
        // 只能选择 同类别单位 且 不能选当前单位 且 是启用状态的单位
        return this.allUnits.filter(item => (item.quantityKind === this.model.quantityKind) && (item.qcKey !== this.model.qcKey) && !item.isDeleted);
      }
    }
  };
</script>
