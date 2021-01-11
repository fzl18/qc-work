<template>
  <div>
    <el-button type="warning" icon="el-icon-upload2" @click="dialogTableVisible = true" title="导入">
      <span class="hidden-lg-and-down">导入</span>
    </el-button>

    <!--导入预览Dialog-->
    <el-dialog title="导入" :visible.sync="dialogTableVisible" :width="width" @close="clearFile">
      <el-button @click="downloadTmp">下载模板</el-button>
      <div class="search-margin-bottom upload-btn">
        <input id="excel-upload-input" ref="uploadInput" type="file" :accept="accepts" style="display: none;"
               :multiple="isMultiple"
               @change="onMultipleUpload">
        <el-button icon="md-cloud-upload" @click="handleUpload" type="primary" plain>
          <slot>上传导入</slot>
        </el-button>
        <span v-if="!!fileName" style="margin-left: 10px;">{{fileName}}</span>
      </div>
      <div class="full-width search-margin-bottom">
        <el-select v-model="sheetName" filterable placeholder="sheetName"
                   @change="onSheetChange"
                   v-if="sheetList.length !== 0">
          <el-option
              v-for="item in sheetList"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </div>
      <el-table :data="showList" border>
        <el-table-column align="center" prop="excel序号" label="Excel行号" />
        <el-table-column align="center" prop="errMsg" label="错误信息" width="200">
          <template slot-scope="scope">
            <span class="errMsg">{{ scope.row.errMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :prop="item.prop"
                         :label="item.label" :width="item.width"
                         v-for="(item, index) in column" :key="index" />
      </el-table>
      <el-pagination
          @current-change="onPageChange"
          :current-page="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="maxLoadData"
          :total="gridData.length">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importCancel">取消</el-button>
        <el-button type="primary" @click="importDataList" :disabled="!importAllowed">导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    props: {
      width: {
        type: String,
        default: '80%'
      },
      column: {
        type: Array,
        default: () => []
      },
      downloadUrl: {
        type: String,
        required: true
      },
      previewUrl: {
        type: String,
        required: true
      },
      importUrl: {
        type: String,
        required: true
      },
      accepts: {
        type: String,
        default: '.'
      },
      downloadFileName: {
        type: String,
        default: '模板.xls'
      },
      isMultiple: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        showList: [],
        currentPage: 1,
        gridData: [],
        maxLoadData: 10,
        sheetName: '',
        sheetList: '',
        dialogTableVisible: false,
        fileName: '',
        importAllowed: '',
        listDatas: ''
      }
    },
    methods: {
      onPageChange (index = 1) {
        this.currentPage = index
        this.sliceArr(index)
      },

      sliceArr (index) {
        this.showList = this.gridData.slice((index - 1) * this.maxLoadData, index * this.maxLoadData)
      },

      downloadRequest () {
        return request({
          url: this.downloadUrl,
          method: 'get',
          responseType: 'blob'
        })
      },

      previewRequest (data) {
        return request({
          url: this.previewUrl,
          method: 'post',
          data
        })
      },

      importDataRequest (data) {
        return request({
          url: this.importUrl,
          method: 'post',
          data
        })
      },

      clearFile () {
        this.fileName = ''
        this.files = []
        this.gridData = []
        this.showList = []
        this.sheetList = []
        this.listDatas = []
        this.sheetName = ''
        this.importAllowed = false
        this.$refs['uploadInput'].value = null
      },

      importCancel () {
        this.clearFile()
        this.dialogTableVisible = false
      },

      async importDataList () {
        await this.importDataRequest(this.listDatas)
        this.clearFile()
        this.dialogTableVisible = false
        this.$emit('fetch-data')
      },

      extractFileNameFromResponse (responseHeaders) {
        if (!responseHeaders) return this.downloadFileName
        const [ , _tFileInfo ] = responseHeaders['content-disposition'].split(';')
        if (!_tFileInfo) return this.downloadFileName
        const [ , fileName ] = _tFileInfo && _tFileInfo.split('\'\'')
        return decodeURIComponent(fileName)
      },

      async downloadTmp () {
        const { data, headers } = await this.downloadRequest()
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(data)
        a.download = this.extractFileNameFromResponse(headers)
        a.href = url
        a.click()
      },

      async getPreviewData (sheetName) {
        let data2 = new FormData()
        for (let file of this.files) {
          data2.append('file', file)
        }
        data2.append('sheetName', sheetName)
        const { data } = await this.previewRequest(data2)
        return data
      },

      async onMultipleUpload (e) {
        this.showList = []
        this.files = e.target.files
        this.fileName = this.files[0].name
        if (!this.files || this.files.length === 0) {
          return
        }
        const data = await this.previewData('')
        this.gridData = data.resultDatas
        this.listDatas = data.listDatas
        this.importAllowed = data.importAllowed
        this.sheetList = data.sheetList
        this.sheetName = data.sheetList.length && data.sheetList[0]
        this.sliceArr(1)

      },
      async onSheetChange (val) {
        if (!val) {
          return
        }
        this.sheetName = val
        const data1 = await this.previewData(this.sheetName)
        this.gridData = data1.resultDatas
        this.listDatas = data1.listDatas
        this.importAllowed = data1.importAllowed
        this.sliceArr(1)
      },
      async previewData (sheetName) {
        const data = await this.getPreviewData(sheetName)
        if (data.resultDatas.length) {
          data.errorRowMessages.forEach(item => {
            if (item.key === -1) {
              this.$message({
                type: 'warning',
                message: item.value,
                showClose: true,
                duration: 6000
              })
              return
            } else {
              data.resultDatas.forEach((x) => {
                if (x['excel序号']=== item['key'] + '' ) {
                  x['errMsg'] = (x['errMsg'] || '') + item['value'] + ';'
                }
              })
            }
          })
        }
        return data
      },

      handleUpload () {
        this.clearFile()
        this.$refs['uploadInput'].click()
      }
    }
  }
</script>

<style scoped>
  .upload-btn {
    display: inline-block;
    margin-left: 10px;
  }

  .errMsg {
    color: #F56C6C;
  }
</style>
