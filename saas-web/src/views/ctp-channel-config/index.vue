﻿<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div class="full-width">
        <el-select v-model="query.qct" filterable clearable :placeholder="assertData['qct']" :title="assertData['qct']">
          <el-option
              v-for="(item, index) in instrumentCategoryList"
              :key="index"
              :label="item.qcKey"
              :value="item.qcKey">
          </el-option>
        </el-select>
      </div>
      <div class="full-width">
        <el-input
            :title="assertData['origin']"
            clearable
            :placeholder="assertData['origin']"
            v-model="query.origin"
        />
      </div>
      <div>
        <el-select
            v-model="query.isDeleted"
            :title="assertData['isDeleted']"
            :placeholder="assertData['isDeleted']"
            clearable
        >
          <el-option
              v-for="(item, index) in yOrNList"
              :key="index"
              :label="item.value"
              :value="item.key"
          />
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
            :preview-url="previewUrl"
            :import-url="importUrl"
            @fetch-data="fetchData"
            v-hasAuth="[$route,'import']"
        />
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
          v-loading.body="isListLoading"
      >
        <el-table-column
            align="center"
            :label="assertData['qct']"
            prop="qct"
        >
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['origin']"
            prop="origin"
        >
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['creatorId']"
            prop="creatorName"
        >
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['creationTime']"
            prop="creationTime"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.creationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['lastManipulatorId']"
            prop="lastManipulatorName"
        >
        </el-table-column>
        <el-table-column
            align="center"
            :label="assertData['lastManipulationTime']"
            prop="lastManipulationTime"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lastManipulationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
            :label="assertData['isDeleted']"
            align="center"
            width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.isDeleted | parseBool }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top" v-if="!scope.row.isDeleted">
              <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="doEdit(scope.row)"
                  class="operation-btn"
                  v-hasAuth="[$route,'update']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="!scope.row.isDeleted">
              <el-button type="text" icon="el-icon-delete" class="color-danger operation-btn" v-hasAuth="[$route,'delete']"
                         @click="doDelete(scope.row)"/>
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
          :total="query.pagination.itemCount"
      />
    </div>

    <div>
      <el-dialog
          :title="dialogTitle[dialogStatus]"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          width="30%"
      >
        <el-form
            label-position="right"
            label-width="100px"
            status-icon
            :ref="formName"
            :rules="rules"
            :model="dto"
            size="mini"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item :label="assertData.qct" prop="qct" class="full-width">
                <el-select v-model="dto.qct" filterable clearable>
                  <el-option
                      v-for="(item, index) in instrumentCategoryList"
                      :key="index"
                      :label="item.qcKey"
                      :value="item.qcKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="assertData.origin" prop="origin">
                <el-input v-model="dto.origin" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button @click="doCancel">取消</el-button>
          <el-button type="primary" @click="doSave" :loading="isSaving">保存</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import ImportFile from '../../components/ImportFile/index'
  import {
    list as getList,
    add,
    update,
    remove,
    url as ctpChannelUrl
  } from '../../api/ctpChannelConfig'
  import { YOrNList } from '../../assets/enums'
  import { list as getStandardList } from '../../api/standardContract'

  export default {
    name: 'CtpChannelConfig',
    components: { ImportFile },
    data: () => ({
      formName: 'standardContractForm',
      dialogVisible: false,
      dialogStatus: 'add',
      dialogTitle: {
        add: '新增',
        update: '编辑'
      },
      dto: {
        origin: '',
        qct: ''
      },
      defaultDto: {
        origin: '',
        qct: ''
      },
      rules: {
        qct: [ { required: true, message: '不能为空', trigger: 'blur' } ],
        origin: [ { required: true, message: '不能为空', trigger: 'blur' } ]
      },
      query: {
        origin: '',
        qct: '',
        isDeleted: '',
        pagination: {
          currentPage: 1,
          pageSize: 10,
          itemCount: 0
        }
      },
      defaultQuery: {
        origin: '',
        qct: '',
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
      assertData: {
        id: 'Id',
        creationTime: '创建时间',
        lastManipulationTime: '最近修改时间',
        creatorId: '创建人',
        lastManipulatorId: '最后修改人',
        isDeleted: '是否删除',
        origin: '原始合约',
        qct: '标准合约'
      },
      downloadUrl: `${ctpChannelUrl}/template`,
      previewUrl: `${ctpChannelUrl}/preview`,
      importUrl: `${ctpChannelUrl}/import`,
      cols: [
        {
          label: '标准合约',
          prop: 'qct'
        },
        {
          label: '原始合约',
          prop: 'origin'
        }
      ],
      instrumentCategoryList: []
    }),
    async created () {
      this.getStandardData()
      await this.fetchData()
    },
    methods: {
      doSearch () {
        this.query.pagination.currentPage = 1
        this.fetchData()
      },

      doReset () {
        this.query = Object.assign({}, this.defaultQuery)
      },
      
      async getStandardData () {
        const { data } = await getStandardList({ pagination: { pageSize: 0 } })
        this.instrumentCategoryList = data && data.list
      },

      async fetchData () {
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

      handleCurrentChange (currentPage) {
        this.query.pagination.currentPage = currentPage
        this.fetchData()
      },

      handleSizeChange (pageSize) {
        this.query.pagination.pageSize = pageSize
        this.fetchData()
      },

      doAdd () {
        this.dialogStatus = 'add'
        this.dialogVisible = true
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.dto = Object.assign({}, this.defaultDto)
      },

      doEdit (row) {
        this.dialogStatus = 'update'
        this.dialogVisible = true
        this.dto = Object.assign({}, { ...row })
      },

      doCancel () {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.dialogVisible = false
        this.dto = Object.assign({}, this.defaultDto)
      },

      doSave () {
        const data = Object.assign({}, this.dto)
        this.$refs[this.formName].validate(async valid => {
          if (valid) {
            if (this.dialogStatus === 'add') {
              this.isSaving = true
              await add(data).finally(() => {
                this.isSaving = false
              })
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.fetchData()
            } else {
              this.isSaving = true
              await update(data.id, data).finally(() => {
                this.isSaving = false
              })
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.fetchData()
            }
          }
        })
      },

      doDelete (row) {
        this.$confirm(`您将删除【原始合约为${row.origin}与标准合约${row.qct}的配置】，确认删除？`, '提示', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
          .then(() => {
            if (row.isDeleted) return
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
      }

    },
    computed: {
      isEdit () {
        return this.dialogStatus === 'update'
      },

      yOrNList () {
        return YOrNList
      }
    }
  }
</script>
