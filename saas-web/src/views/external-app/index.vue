<template>
  <el-container class="container">
    <el-header>
      <div class="search-header-row">
        <div>
          <el-input
              placeholder="id"
              v-model="query.id"
              clearable>
          </el-input>
        </div>
        <div>
          <el-input
              placeholder="移动应用Id"
              v-model="query.externalAppIdEquals"
              clearable>
          </el-input>
        </div>
        <div>
          <el-select v-model="query.qcExternalAppType" filterable clearable placeholder="移动应用类型" class="item-select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div>
          <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column label='移动应用ID' align="center">
          <template slot-scope="scope">
            {{scope.row.externalAppId}}
          </template>
        </el-table-column>
        <el-table-column label="移动应用类型" align="center">
          <template slot-scope="scope">
            {{scope.row.qcExternalAppTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="移动应用Ticket" align="center">
          <template slot-scope="scope">
            {{scope.row.externalAppTicket}}
          </template>
        </el-table-column>
        <el-table-column label="套件秘钥" align="center">
          <template slot-scope="scope">
            {{scope.row.suiteSecret}}
          </template>
        </el-table-column>
        <el-table-column label="token" align="center">
          <template slot-scope="scope">
            {{scope.row.token}}
          </template>
        </el-table-column>
        <el-table-column label="数据加密密钥" align="center">
          <template slot-scope="scope">
            {{scope.row.encodingAesKey}}
          </template>
        </el-table-column>
        <el-table-column label="分享链接" align="center">
          <template slot-scope="scope">
            {{scope.row.shareLink}}
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center">
          <template slot-scope="scope">
            {{scope.row.creatorName}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creationTime | parseTime}}</span>
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
            <el-tooltip content="删除" placement="top">
              <el-button type="text" icon="el-icon-delete" class="color-danger operation-btn" v-hasAuth="[$route,'delete']"
                         @click="doDelete(scope.row)"></el-button>
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
                   label-width="120px"
                   status-icon
                   :ref="formName"
                   :rules="rules"
                   :model="externalApp">
            <el-form-item label="移动应用ID" prop="externalAppId">
              <el-input v-model="externalApp.externalAppId"></el-input>
            </el-form-item>
            <el-form-item label="移动应用类型" prop="qcExternalAppType">
              <el-select v-model="externalApp.qcExternalAppType" filterable placeholder="请选择移动应用类型" class="item-select">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="套件秘钥" prop="suiteSecret">
              <el-input v-model="externalApp.suiteSecret"></el-input>
            </el-form-item>
            <el-form-item label="token" prop="token">
              <el-input v-model="externalApp.token"></el-input>
            </el-form-item>
            <el-form-item label="数据加密密钥" prop="encodingAesKey">
              <el-input v-model="externalApp.encodingAesKey"></el-input>
            </el-form-item>
            <el-form-item label="分享链接" prop="shareLink">
              <el-input v-model="externalApp.shareLink"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="doCancel">取 消</el-button>
                <el-button type="primary" @click="doSave">保 存</el-button>
            </span>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
  import { list, add, update, remove } from '../../api/externalApp'
  import { getEnum } from '../../api/enums'

  export default {
    name: 'ExternalApp',
    data () {
      return {
        options: [],
        list: [],
        listLoading: false,
        itemCount: 0,
        query: {
          id: '',
          externalAppIdEquals: '',
          qcExternalAppType: '',
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        formName: 'externalAppForm',
        dialogVisible: false,
        rules: {
          externalAppId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          qcExternalAppType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        externalApp: {
          externalAppId: '',
          qcExternalAppType: '',
          externalAppTicket: '',
          suiteSecret: '',
          token: '',
          encodingAesKey: '',
          shareLink: ''
        },
        defaultExternalApp: {
          externalAppId: '',
          qcExternalAppType: '',
          externalAppTicket: '',
          suiteSecret: '',
          token: '',
          encodingAesKey: '',
          shareLink: ''
        },
        dialogStatus: '',
        dialogTitle: {
          add: '新增',
          update: '编辑'
        }
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
        const response = await getEnum('qcExternalAppType')
        this.options = response.data
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
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.dialogStatus = 'update'
        this.dialogVisible = true
        this.externalApp = { ...row }
      },

      doDelete (row) {
        this.$confirm(`确认删除该移动应用：ID【${row.externalAppId}】`, '提示', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
          .then(() => {
            remove(row.id).then(response => {
              if (response.status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.fetchData()
              }
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
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.externalApp = { ...this.defaultExternalApp }
      },

      doCancel () {
        this.dialogVisible = false
        this.$refs[this.formName].resetFields()
      },

      doSave () {
        let t = { ...this.externalApp }
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            if (this.dialogStatus === 'add') {
              add(t).then(response => {
                if (response.status) {
                  this.dialogVisible = false
                  this.$refs[this.formName].resetFields()
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  })
                  this.fetchData()
                }
              })
            } else {
              update(t.id, t).then(response => {
                if (response.status) {
                  this.dialogVisible = false
                  this.$refs[this.formName].resetFields()
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  })
                  this.fetchData()
                }
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
