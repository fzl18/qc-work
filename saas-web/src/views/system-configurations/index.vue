<template>
  <el-container class="container">
    <el-header>
      <div class="search-header-row">
        <div>
          <el-input
              placeholder="ID"
              v-model="query.id"
              clearable>
          </el-input>
        </div>
        <div>
          <el-select v-model="query.qcKey" filterable clearable placeholder="配置项Key" class="item-select">
            <el-option
                v-for="item in saasControlSysConfKey"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column label="配置项Key" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qcKey }}【{{ scope.row.qcKey | mapKV(saasControlSysConfKey, 'name') }}】</span>
          </template>
        </el-table-column>
        <el-table-column label="配置项Value" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.qcValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近修改人" align="center">
          <template slot-scope="scope">
            {{scope.row.lastManipulatorName}}
          </template>
        </el-table-column>
        <el-table-column label="最近修改时间" align="center">
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
              <el-button type="text" icon="el-icon-edit" @click="doEdit(scope.row)" class="operation-btn" v-hasAuth="[$route,'update']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </el-main>

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
          width="30%">
        <div>
          <el-form label-position="right"
                   label-width="140px"
                   status-icon
                   :ref="formName"
                   :rules="rules"
                   :model="systemConfiguration">
            <el-form-item label="配置项" prop="qcKey">
              <el-select v-model="systemConfiguration.qcKey" filterable clearable placeholder="" class="item-select">
                <el-option
                    v-for="(item, index) in saasControlSysConfKey"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="配置内容" prop="qcValue">
              <el-input v-model="systemConfiguration.qcValue" clearable placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="doCancel">取 消</el-button>
                    <el-button type="primary" @click="doSave" :loading="isLoading">保 存</el-button>
                </span>
      </el-dialog>

    </div>
  </el-container>
</template>

<script>
  import { list, update } from '../../api/systemConfigurations'
  import { getEnums } from '../../api/enums'

  export default {
    name: 'SystemConfigurations',
    data () {
      return {
        saasControlSysConfKey: [],
        list: [],
        listLoading: false,
        itemCount: 0,
        query: {
          id: '',
          qcKey: '',
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        formName: 'systemConfigurationForm',
        dialogVisible: false,
        rules: {
          qcKey: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          qcValue: [ { required: true, message: '不能为空', trigger: 'change' } ]
        },
        systemConfiguration: {
          qcKey: '',
          qcValue: ''
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
      doSearch () {
        this.query.pagination.currentPage = 1
        this.fetchData()
      },

      async fetchEnums () {
        const response = await getEnums({
          enumTypeNames: [ 'saasControlSysConfKey' ]
        })
        this.saasControlSysConfKey = response.data.saasControlSysConfKey
      },

      fetchData () {
        this.listLoading = true
        list(this.query)
          .then(response => {
            this.listLoading = false
            this.list = response.data.list
            this.query.pagination.currentPage =
              response.data.pagination.currentPage
            this.query.pagination.pageSize = response.data.pagination.pageSize
            this.itemCount = response.data.pagination.itemCount
          })
          .catch(() => {
            this.listLoading = false
          })
      },

      handleSizeChange (val) {
        this.query.pagination.pageSize = val
        this.fetchData()
      },

      handleCurrentChange (val) {
        this.query.pagination.currentPage = val
        this.fetchData()
      },

      doEdit (row) {
        this.dialogStatus = 'update'
        this.dialogVisible = true
        this.systemConfiguration = { ...row }
      },

      doCancel () {
        this.dialogVisible = false
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
      },

      doSave () {
        let t = { ...this.systemConfiguration }
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            this.isLoading = true
            if (this.dialogStatus === 'update') {
              update(t.qcKey, { value: t.qcValue })
                .then(response => {
                  if (response.status === 200) {
                    this.isLoading = false
                    this.dialogVisible = false
                    this.$refs[this.formName].resetFields()
                    this.$message({
                      type: 'success',
                      message: '编辑成功'
                    })
                    this.fetchData()
                  }
                })
                .catch(() => {
                  this.isLoading = false
                })
            }
          } else {
            return false
          }
        })
      }
      
    }
  }
</script>

<style scoped>
  .container {
    margin-top: 20px;
  }

  .item-select {
    width: 100%;
  }

  .operation-btn {
    font-size: 18px;
  }
</style>
