<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div>
        <el-input placeholder="唯一标识" title="唯一标识" v-model="query.qcKey" clearable/>
      </div>
      <div>
        <el-input placeholder="名称"
                  title="名称"
                  v-model="query.name"
                  clearable>
        </el-input>
      </div>
      <div>
        <el-input placeholder="代码" title="代码" v-model="query.code" clearable/>
      </div>
      <div>
        <el-select v-model="query.commodity" filterable clearable placeholder="品种" title="品种">
          <el-option
                  v-for="item in commonData.commodityList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-input placeholder="英文名称"
                  title="英文名称"
                  v-model="query.englishName"
                  clearable>
        </el-input>
      </div>
      <div>
        <el-select v-model="query.isDeleted" title="是否停用" placeholder="是否停用" clearable>
          <el-option v-for="(item, index) in yOrNList" :key="index" :label="item.value" :value="item.key"/>
        </el-select>
      </div>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
      <import-file :download-file-name="downloadFileName" :column="importColumn" :download-url="downloadUrl" v-hasAuth="[$route,'import']"
                   :preview-url="previewUrl" :import-url="importUrl" @fetch-data="fetchData"/>
      <div>
        <el-button icon="el-icon-error"
                   title="清空"
                   @click="doReset"><span class="hidden-lg-and-down">清空</span>
        </el-button>
      </div>
    </div>

    <div class="search-margin-bottom">
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column label="唯一标识" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qcKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代码" align="center">
          <template slot-scope="scope">
            {{scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column label="品种" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.commodity | mapKV(commonData.commodityList, 'text', 'value') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.englishName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否停用" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isDeleted | parseBool }}</span>
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
        <el-table-column
                align="center"
                label="操作"
                width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
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
              width="60%">
        <div>
          <el-form label-position="right"
                   label-width="140px"
                   status-icon
                   :ref="formName"
                   :rules="rules"
                   :model="model">
            <el-row>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="唯一标识" prop="qcKey">
                  <el-input v-model="model.qcKey" clearable placeholder=""
                            :disabled="dialogStatus === 'update'"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="model.name" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="代码" prop="code">
                  <el-input v-model="model.code" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="品种" prop="commodity" class="full-width">
                  <el-select v-model="model.commodity" filterable clearable placeholder="">
                    <el-option
                            v-for="(item, index) in commonData.commodityList"
                            :key="index"
                            :label="item.text"
                            :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="英文名称" prop="englishName">
                  <el-input v-model="model.englishName" clearable placeholder=""/>
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ImportFile from '../../components/ImportFile/index'
  import { getEnums } from '../../api/enums'
  import {
    list,
    update,
    toggle,
    commonData,
    add,
    url as baseUrl
  } from '../../api/specification'
  import { YOrNList } from '../../assets/enums'

  export default {
    name: 'Specification',
    components: {
      ImportFile
    },
    data () {
      return {
        importColumn: [
          {
            label: '唯一标识',
            prop: 'qcKey'
          },
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '代码',
            prop: 'code'
          },
          {
            label: '品种',
            prop: 'commodity'
          },
          {
            label: '英文名称',
            prop: 'englishName'
          }
        ],
        downloadFileName: '物料模板.xls',
        downloadUrl: `${baseUrl}/Download`,
        previewUrl: `${baseUrl}/Preview`,
        importUrl: `${baseUrl}/Import`,
        isOperating: false,
        list: [],
        listLoading: false,
        itemCount: 0,
        commonData: [],
        query: {
          qcKey: '',
          code: '',
          name: '',
          commodity: '',
          isDeleted: '',
          englishName: '',
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        formName: 'specificationForm',
        dialogVisible: false,
        rules: {
          qcKey: [{ required: true, message: '不能为空', trigger: 'blur' }],
          code: [{ required: true, message: '不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          commodity: [{ required: true, message: '不能为空', trigger: 'change' }],
        },
        exchangeType: [],
        model: {
          id: '',
          code: '',
          name: '',
          qcKey: '',
          commodity: '',
          isDeleted: false,
          englishName: '',
          creationTime: '',
          lastManipulationTime: ''
        },
        defaultData: {
          id: '',
          code: '',
          name: '',
          qcKey: '',
          commodity: '',
          isDeleted: false,
          englishName: '',
          creationTime: '',
          lastManipulationTime: ''
        },
        defaultQuery: {
          qcKey: '',
          code: '',
          name: '',
          commodity: '',
          englishName: '',
          isDeleted: '',
          pagination: {
            currentPage: 1,
            pageSize: 10,
            itemCount: 0
          }
        },
        dialogStatus: '',
        dialogTitle: {
          add: '新增',
          update: '编辑'
        },
        isLoading: false
      }
    },
    async created () {
      await this.fetchEnums()
      this.fetchData()
    },
    methods: {
      doToggleStatus (row) {
        const { name = '', id = '', isDeleted = false } = { ...row }
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
            this.isOperating = true
            toggle(id)
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

      doAdd () {
        this.dialogStatus = 'add'
        this.dialogVisible = true
        this.isLoading = false
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.model = { ...this.defaultData }
      },

      doSearch () {
        this.query.pagination.currentPage = 1
        this.fetchData()
      },

      async fetchEnums () {
        const { data } = await getEnums({
          enumTypeNames: ['exchangeType']
        })
        this.commonData = (await commonData()).data
        this.exchangeType = data.exchangeType
      },

      async fetchData () {
        this.listLoading = true
        const { data } = await list(this.query).finally(() => {
          this.listLoading = false
        })
        this.list = data.list
        this.query.pagination.currentPage = data.pagination.currentPage
        this.query.pagination.pageSize = data.pagination.pageSize
        this.itemCount = data.pagination.itemCount
      },

      handleCurrentChange (currentPage) {
        this.query.pagination.currentPage = currentPage
        this.fetchData()
      },

      handleSizeChange (pageSize) {
        this.query.pagination.pageSize = pageSize
        this.fetchData()
      },

      doEdit (row) {
        this.dialogStatus = 'update'
        this.dialogVisible = true
        this.model = { ...row }
      },

      doCancel () {
        this.dialogVisible = false
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
      },

      doSave () {
        let _model = { ...this.model }
        this.$refs[this.formName].validate(async valid => {
          if (valid) {
            this.isLoading = true
            if (this.dialogStatus === 'update') {
              await update(_model.id, _model).finally(() => {
                this.isLoading = false
              })
              this.dialogVisible = false
              this.$refs[this.formName].resetFields()
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.fetchData()
            } else {
              await add(_model).finally(() => {
                this.isLoading = false
              })
              this.dialogVisible = false
              this.$refs[this.formName].resetFields()
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.fetchData()
            }
          } else {
            return false
          }
        })
      },

      doReset () {
        this.query = Object.assign({}, this.defaultQuery)
      }

    },
    computed: {
      ...mapGetters(['userInfo']),
      isAdmin () {
        return this.userInfo.isAdmin
      },
      yOrNList () {
        return YOrNList
      }
    }
  }
</script>
