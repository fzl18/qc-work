<template>
  <el-container class="container">
    <el-header>
      <div class="search-header-row">
        <div>
          <el-select v-model="query.instrumentCategory" filterable clearable placeholder="标准合约" title="标准合约">
            <el-option
                v-for="item in commonData.instrumentCategory"
                :key="item.qcKey"
                :label="item.qcKey"
                :value="item.qcKey">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="query.instrument" filterable clearable placeholder="具体合约" title="具体合约">
            <el-option
                v-for="item in instrumentsQuery"
                :key="item.qcKey"
                :label="item.qcKey"
                :value="item.qcKey">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="query.feedType" placeholder="行情类型" title="行情类型">
            <el-option
                v-for="item in commonData.feedTypes"
                :key="item.qctKey"
                :label="item.name"
                :value="item.qctKey">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-date-picker
              v-model="dateTime"
              type="daterange"
              unlink-panels
              title="开始、结束日期"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button type="primary" icon="el-icon-plus" v-hasAuth="[$route,'create']" @click="doAdd">添加</el-button>
        <el-button type="success" icon="el-icon-upload2" v-hasAuth="[$route,'import']" @click="dialogTableVisible = true">导入</el-button>
        <el-button type="warning" icon="el-icon-download" v-hasAuth="[$route,'export']" @click="doExport">导出</el-button>
        <el-button type="danger" icon="el-icon-delete" v-hasAuth="[$route,'multi-delte']" @click="doBatchDelete">批量删除</el-button>
        <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        <el-button icon="el-icon-error" @click="doClear">清空</el-button>
      </div>
    </el-header>

    <el-main>
      <el-table ref="multipleTable" :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                @selection-change="handleSelectionChange"
                highlight-current-row>
        <el-table-column
            type="selection"
            align="center"
            width="55">
        </el-table-column>
        <el-table-column label="行情日期" align="center">
          <template slot-scope="scope">
            {{ scope.row.feedDate | parseTime('{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column label="标准合约" align="center">
          <template slot-scope="scope">
            {{scope.row.instrumentCategory}}
          </template>
        </el-table-column>
        <el-table-column label="具体合约" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.instrument}}</span>
          </template>
        </el-table-column>
        <el-table-column label="行情类型" align="center" width="260">
          <template slot-scope="scope">
            <span>{{scope.row.feedTypeText}}</span>
          </template>
        </el-table-column>
        <el-table-column label="行情数值" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.feedValue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.creationTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
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
              <el-button class="operation-btn" type="text" icon="el-icon-edit"                         
                         v-hasAuth="[$route,'update']"
                         @click="doEdit(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="text" icon="el-icon-delete" class="color-danger operation-btn"
                         @click="doDelete(scope.row)" v-hasAuth="[$route,'delete']"/>
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

    <!--导入dialog-->
    <el-dialog title="导入" :visible.sync="dialogTableVisible">
      <el-button @click="downloadTmp">下载模板</el-button>
      <div style="display: inline-block;margin-left: 10px;" class="search-margin-bottom">
        <input id="excel-upload-input" ref="uploadInput" type="file"
               accept=".xlsx,.xls" style="display: none;"
               @change="onMultipleUpload">
        <el-tooltip placement="top-start" max-width="300" transfer
                    content="文件格式支持EXCEL，文件大小不超过10M">
          <el-button icon="md-cloud-upload" @click="handleUpload" type="primary" plain>
            <slot>上传附件</slot>
          </el-button>
        </el-tooltip>
        <span v-if="!!fileName" style="margin-left: 10px;">{{fileName}}</span>
      </div>
      <div class="full-width">
        <el-select v-model="sheetName" filterable clearable placeholder="sheetName" v-if="sheetList.length !== 0">
          <el-option
              v-for="item in sheetList"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </div>
      <el-table :data="gridData" border>
        <el-table-column class-name="error" label="错误信息" align="center" property="errMsg" />
        <el-table-column label="行情日期" align="center" prop="feedDate" />
        <el-table-column label="具体合约" align="center" prop="instrument" />
        <el-table-column label="行情类型" align="center" prop="feedType" width="200" />
        <el-table-column label="行情数值" align="center" prop="feedValue" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importCancel">取 消</el-button>
        <el-button type="primary" @click="importDataList" :disabled="!importAllowed">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增编辑dialog-->
    <el-dialog
        :title="dialogTitle[dialogStatus]"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="50%">
      <div>
        <el-form label-position="right"
                 label-width="100px"
                 :ref="formName"
                 :rules="rules"
                 :model="marketDataInfo">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <el-form-item label="行情日期" prop="feedDate" class="full-width">
                <el-date-picker
                    v-model="feedDate"
                    type="date"
                    placeholder="">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <el-form-item label="品类" prop="commodityType" class="full-width">
                <el-select v-model="marketDataInfo.commodityType" filterable clearable placeholder="品类">
                  <el-option
                      v-for="item in commonData.commodityType"
                      :key="item.qcKey"
                      :label="item.name"
                      :value="item.qcKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <el-form-item label="标准合约" prop="instrumentCategory" class="full-width">
                <el-select v-model="marketDataInfo.instrumentCategory" value-key="qcKey" filterable clearable placeholder="标准合约"
                           @clear="clearInstrumentCategory"
                           @change="changeInstrumentCategory">
                  <el-option
                      v-for="item in instrumentCategory"
                      :key="item.qcKey"
                      :label="item.qcKey"
                      :value="item.qcKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <el-form-item label="具体合约" prop="instrument" class="full-width">
                <el-select v-model="marketDataInfo.instrument" filterable clearable placeholder="具体合约">
                  <el-option
                      v-for="item in instruments"
                      :key="item.qcKey"
                      :label="item.qcKey"
                      :value="item.qcKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <el-form-item label="行情类型" prop="feedType" class="full-width">
                <el-select v-model="marketDataInfo.feedType" filterable clearable placeholder="行情类型">
                  <el-option
                      v-for="item in commonData.feedTypes"
                      :key="item.qctKey"
                      :label="item.name"
                      :value="item.qctKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
              <el-form-item label="行情数值" prop="feedValue">
                <el-input v-model="marketDataInfo.feedValue" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="备注" prop="remark">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="marketDataInfo.remark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="doCancel">取 消</el-button>
                <el-button type="primary" @click="doSave">保 存</el-button>
            </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../../api/marketData'
  import { parseTime } from '../../utils'
  export default {
    name: 'MarketDataList',
    data () {
      return {
        feedDate: new Date(),        
        fileName: '',
        files: [],
        marketDataInfo: {
          instrumentFeedId: '',
          instrument: '',
          instrumentCategory: '',
          commodityType: '',
          exchange: '',
          feedType: '',
          feedDate: '',
          feedValue: '',
          remark: '',
          creationTime: '',
          isDeleted: false,
          lastManipulationTime: ''
        },
        dialogTitle: {
          add: '新增',
          update: '编辑'
        },
        dialogVisible: false,
        dialogTableVisible: false,
        importAllowed: false,
        gridData: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        all: [],
        list: [],
        listLoading: false,
        itemCount: 0,
        multipleSelection: [],
        dateTime: [],
        query: {
          instrumentCategory: '',
          instrument: '',
          feedType: '',
          exchange: '',
          feedDateStart: '',
          feedDateEnd: '',
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        formName: 'marketDataForm',
        rules: {
          feedDate: [
            {
              required: true,
              message: '行情日期不能为空',
              trigger: 'change'
              
            }],
          instrument: [
            {
              required: true,
              message: '具体合约不能为空',
              trigger: 'change'
            }],
          feedType: [
            {
              required: true,
              message: '行情类型不能为空',
              trigger: 'change'
            }],
          feedValue: [
            {
              required: true,
              message: '行情数值不能为空',
              trigger: 'blur'
            }],
          commodityType: [
            {
              required: true,
              message: '品类不能为空',
              trigger: 'change'
            }],
            instrumentCategory: [
            {
              required: true,
              message: '标准合约不能为空',
              trigger: 'change'
            }]
        },
        defaultData: {
          instrumentFeedId: '',
          instrument: '',
          instrumentCategory: '',
          commodityType: '',
          exchange: '',
          feedType: '',
          feedDate: '',
          feedValue: '',
          remark: '',
          creationTime: '',
          isDeleted: false,
          lastManipulationTime: ''
        },
        dialogStatus: '',
        commonData: {},
        sheetList: [],
        listDatas: [],
        sheetName: ''
      }
    },

    async created () {
      const { data } = await api.getCommonData()
      this.commonData = data
      // this.query.feedType = this.commonData.feedTypes.length && this.commonData.feedTypes[0].qctKey      
      this.fetchData()
    },

    watch: {
      'sheetName': async function (val) {
        this.sheetName = val
        const data = await this.getPreviewData()
        data.errorRowMessages.forEach(item => {
          data.resultDatas[item['key'] - 2].errMsg = item['value']
        })
        this.gridData = data.resultDatas
        this.listDatas = data.listDatas
        this.importAllowed = data.importAllowed
      },
      feedDate(val){        
        this.marketDataInfo.feedDate = parseTime(val,'{y}-{m}-{d}')
      }
    },

    methods: {
      importCancel () {
        this.clearFile()
        this.dialogTableVisible = false
      },

      clearFile () {
        this.fileName = ''
        this.files = []
        this.gridData = []
        this.sheetList = []
        this.listDatas = []
        this.sheetName = ''
        this.$refs['uploadInput'].value = null
      },

      clearInstrumentCategory () {
        this.marketDataInfo.exchange = ''
      },

      changeInstrumentCategory (val) {
        const data = this.commonData.instrumentCategory.find(item => item.qcKey === val)
        this.marketDataInfo.exchange = data && data.exchange || ''
      },

      handleUpload () {
        this.$refs['uploadInput'].click()
      },

      async getPreviewData () {
        let data2 = new FormData()
        for (let file of this.files) {
          data2.append('file', file)
        }
        data2.append('sheetName', this.sheetName)
        const { data } = await api.preview(data2)
        return data
      },

      async onMultipleUpload (e) {
        this.files = e.target.files
        this.fileName = this.files[0].name
        const isMoreThan10M = [...this.files].some(file => file.size > 10485760)
        if (isMoreThan10M) {
          this.$confirm.info('文件不能大于10M')
          this.$refs['uploadInput'].value = null
          return
        }
        if (!this.files || this.files.length === 0) {
          return
        }
        const data = await this.getPreviewData()
        data.errorRowMessages.forEach(item => {
          data.resultDatas[item['key'] - 2].errMsg = item['value']
        })
        this.gridData = data.resultDatas
        this.importAllowed = data.importAllowed
        this.listDatas = data.listDatas
        this.sheetList = data.sheetList
        if (data.errorRowMessages.length) {
          return false
        }
        this.sheetName = data.sheetList.length && data.sheetList[0]
      },

      async downloadTmp () {
        const { data } = await api.downloadTmp()
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(data)
        a.download = '行情数据模板.xls'
        a.href = url
        a.click()
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },

      doSearch () {
        this.query.pagination.currentPage = 1
        this.query.feedDateStart = this.dateTime && this.dateTime.length && this.dateTime[0]
        this.query.feedDateEnd = this.dateTime && this.dateTime.length && this.dateTime[1]
        this.fetchData()
      },

      async importDataList () {
        await api.importData(this.listDatas)
        this.clearFile()
        this.dialogTableVisible = false
        this.fetchData()
      },

      doClear () {
        this.query.instrumentCategory = ''
        this.query.instrument = ''
        this.query.feedDateStart = ''
        this.query.feedDateEnd = ''
        this.query.exchange = ''
        this.query.feedType = ''
        this.dateTime = []
      },

      async fetchData () {
        this.listLoading = true
        const { data } = await api.list(this.query).catch(() => {
          this.listLoading = false
        })
        this.listLoading = false        
        this.list = data.list
        this.query.pagination.currentPage = data.pagination.currentPage
        this.query.pagination.pageSize = data.pagination.pageSize
        this.itemCount = data.pagination.itemCount
      },

      handleSizeChange (val) {
        this.query.pagination.pageSize = val
        this.fetchData()
      },

      handleCurrentChange (val) {
        this.query.pagination.currentPage = val
        this.fetchData()
      },

      doAdd () {
        this.dialogStatus = 'add'
        this.dialogVisible = true
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.marketDataInfo = { ...this.defaultData }
        this.marketDataInfo.feedDate = this.feedDate
      },

      doCancel () {
        this.dialogVisible = false
        this.$refs[this.formName].resetFields()
      },

      doSave () {
        this.$refs[this.formName].validate(async (valid) => {
          if (valid) {
            if (this.dialogStatus === 'add') {
              await api.add(this.marketDataInfo)
              this.dialogVisible = false
              this.$refs[this.formName].resetFields()
              this.$message({
                type: 'success',
                message: '添加行情数据成功'
              })
              this.feedDate = new Date()
              this.fetchData()
            } else {
              await api.update(this.marketDataInfo.instrumentFeedId, this.marketDataInfo)
              this.dialogVisible = false
              this.$refs[this.formName].resetFields()
              this.$message({
                type: 'success',
                message: '修改行情数据成功'
              })
              this.fetchData()
            }
          } else {
            return false
          }
        })
      },

      async doExport () {
        const { data } = await api.exportList(this.query)
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(data)
        a.download = '行情数据.xls'
        a.href = url
        a.click()
      },

      doBatchDelete () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'info',
            message: '请至少选择一条数据'
          })
        } else {
          this.$confirm(`确认删除选中的${this.multipleSelection.length}条数据`, '提示', {
            type: 'warning',
            confirmButtonText: '删除',
            cancelButtonText: '取消'
          })
            .then(async () => {
              if (this.isAdmin) {
                const data = this.multipleSelection.map(item => item.instrumentFeedId)
                await api.multiDelete(data)
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.fetchData()
              } else {
                this.$message({
                  type: 'error',
                  message: '无操作权限'
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              })
            })
        }
      },

      doEdit (row) {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields()
        }
        this.dialogStatus = 'update'
        this.dialogVisible = true
        this.marketDataInfo = { ...row }
      },

      doDelete (row) {
        this.$confirm(`确认删除该条数据`, '提示', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
          .then(async () => {
            if (this.isAdmin) {
              await api.remove(row.instrumentFeedId)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.fetchData()
            } else {
              this.$message({
                type: 'error',
                message: '无操作权限'
              })
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      },

      isEditable (user) {
        if (this.userInfo.userId && this.isAdmin) {
          // 管理员可修改所有人信息
          return true
        } else {
          // 非管理员只可以修改自己信息
          return user.userId === this.userInfo.userId
        }
      }
    },

    computed: {
      ...mapGetters(['userInfo']),
      isDisabled () {
        return this.dialogStatus === 'update'
      },
      isAdmin () {
        return this.userInfo.isAdmin
      },
      instruments () {
        return this.commonData.instrument && this.commonData.instrument.filter((item) => item.instrumentCategory === this.marketDataInfo.instrumentCategory)
      },
      instrumentsQuery () {
        return this.commonData.instrument && this.commonData.instrument.filter((item) => item.instrumentCategory === this.query.instrumentCategory)
      },
      instrumentCategory () {
        return this.commonData.instrumentCategory && this.commonData.instrumentCategory.filter((item) => item.commodityType === this.marketDataInfo.commodityType)
      }
    }
  }
</script>

<style scoped>
  .container {
    margin-top: 20px;
  }

  .operation-btn {
    font-size: 18px;
  }
  
</style>

<style>
td.error{
    color:red; 
  }
</style>
