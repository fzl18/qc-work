<template>
  <div style="display: inline; margin-left: 3px;">
    <Button
      type="info"
      icon="ios-cloud-upload-outline"
      class="margin-right-3"
      @click="show = true"
    >导入</Button>
    <Modal v-model="show" width="80vw" class="uploadModel2">
      <p slot="header">
        <Icon type="md-cloud-upload"></Icon>
        <span>导入</span>
      </p>
      <div>
        <Row>
          <Col span="12">
            <Upload ref="fileUpload"
            :action="action"
            :before-upload="beforeUpload"
            >
              <Button type="success" icon="md-add">选择文件...</Button>
              <span style="margin-left: 10px;">{{fileName}}</span>
            </Upload>
            <i-switch v-model="isShowErrorList" @on-change="onlyShowErrList" ><span slot="open">开</span><span slot="close">关</span></i-switch> <span style="line-height:30px;color:red">  (只显示错误行)</span>
          </Col>

          <Col span="12">
            <Button type="primary" style="float: right;" @click="downloadTemplate">下载模板</Button>
          </Col>
        </Row>
        <Row v-if="showSheets">
          <!-- <Col span="12">
            <Select placeholder="工作表" filterable transfer clearable v-model="sheetName">
              <Option
                v-for="(item, index) in previewData.sheetList"
                :label="item"
                :value="item"
                :key="index"
              >{{item}}</Option>
            </Select>
          </Col> -->
        </Row>
        <Divider style="margin: 5px 0" />
        <div v-show="showDataTable">
          <!-- <Scroll :on-reach-bottom="handleReachBottom" :height="500" :distance-to-edge="-80"> -->
            <Table
              minWidth="150"
              size="small"
              border
              style="min-height:450px"
              class="margin-bottom-10"
              :columns="resultColumns"
              :data="showList"
              :loading="loading"
              v-maxHeight=450
              bottomDistance='200'
            ></Table>
          <!-- </Scroll> -->
          <Divider style="margin: 5px 0" />
          <div style="text-align:center">
          <QcPage
            size="small"
            show-total
            show-elevator
            :current="currentPage"
            :total="loadList.length"
            :page-size="maxLoadData"
            @on-page-size-change="pageSizeChange"
            @on-change="onPageChange"
          ></QcPage>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          :loading="loading"
          @click="importData"
          :disabled="!previewData.importAllowed"
        >导入</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { http } from "@/utils/http";
import map from "lodash/map";
import filter from "lodash/filter";
export default {
  name: "FileUpload",
  props: {
    action: {
      type: String,
      default: ""
    },
    import: {
      type: String,
      default: ""
    },
    download: {
      type: String,
      default: ""
    },
    columns: Array,
    tempName: {
      type: String,
      default: "导入模板"
    }
  },
  data() {
    return {
      show: false,
      loading: false,
      file: null,
      fileName: "",
      sheetName: "",
      // sheetNames: [],
      cacheData: {},
      // 解析后 sheet的datatable 数据
      // sheetDataList: [],
      showDataTable: false,
      previewData: {},
      showList: [],
      maxLoadData: 15,
      curLoadIndex: 0,
      currentPage: 1,
      isShowErrorList: false,
      loadList: [],
    };
  },
  created() {
    this.previewData = {};
    this.sheetName = "";
    // this.sheetNames = [];
    this.file = null;
    this.cacheData = {};
    // this.sheetDataList = [];
  },
  computed: {
    showSheets() {
      return (
        this.previewData &&
        this.previewData.sheetList &&
        this.previewData.sheetList.length
      );
    },
    resultColumns() {
      let importColumns = [...this.columns];
      importColumns.unshift({
        title: "错误信息",
        key: "errorMessage",
        align: "center",
        width: 250,
        render: (h, params) => {
          return h(
            "span",
            {
              style: {
                color: "red"
              }
            },
            params.row.errorMessage
          );
        }
      });
      return importColumns;
    }
  },

  watch: {
    // sheetName(v) {
    //   if (!v) {
    //     this.showDataTable = false;
    //     return;
    //   }
    //   this.getSheetData();
    // },
    show(v) {
      if (!v) {
        this.file = null;
        this.fileName = null;
        this.previewData = {};
        this.showDataTable = false;
        this.curLoadIndex = 0
        this.showList = []
        this.loadList = []
      }
    }
  },
  methods: {
    downloadTemplate() {
      http.download(this.download, null, false, this.tempName);
    },
    beforeUpload(file) {
      this.showList = []
      this.loadList = []
      this.sheetName = "";
      this.sheetNames = [];
      this.file = file;
      // 第一次上传解析逻辑
      this.fileName = file.name;
      let len = this.fileName.split(".").length
      const backName = this.fileName.split(".")[len - 1]
      const isAccpet = ['xls','xlsx'].some(val=> val == backName)
      if(isAccpet){
        this.uploadFile();
      }else{
        this.$Message.error( `文件:${file.name}格式不正确，请上传.xls或.xlsx文件。`)
      }

      return false;
    },
    uploadFile() {
      this.getSheetData();
    },
    cacheSheetData(sheetName, data) {
      this.cacheData[sheetName] = data;
    },
    getCachedData(sheetName) {
      return this.cacheData[sheetName] || null;
    },
    async getSheetData() {
      this.showDataTable = false;
      let sheetName = this.sheetName;
      let sheetData = this.getCachedData(sheetName);
      if (!sheetData) {
        let formData = new FormData();
        formData.append("file", this.file);
        sheetName && formData.append("sheetName", sheetName);
        let data
        try {
          data = await http.post(this.action, formData);
        } catch(e) {
          this.loading = false
        }
        //处理 错误信息;
        let resultList = data.resultDatas;
        let errorMessages = data.errorRowMessages;
        let errMessage = ''
        errorMessages.map((item)=>{
          if(item.key === -1){
            errMessage += item.value
          }
        })
        if(errMessage.length > 0) this.$Modal.error({title: '错误提示',content: errMessage});
        let newList = map(resultList, d => {
          let msgObjs =
            filter(errorMessages, r => {
              return r.key.toString() === d.excel序号;
            }) || [];
          let errorMessage = map(msgObjs, m => {
            return m.value;
          }).join(", ");
          return { ...d, ...{ errorMessage: errorMessage } };
        });
        data.resultDatas = newList;
        if (!data.sheetList.length) {
          data.sheetList = _.cloneDeep(this.previewData.sheetList)
        }
        this.previewData = data;
        this.loadList = newList
        for(var i=0; i< this.maxLoadData;i++){
          if(i > this.loadList.length-1){
            break
          }
          this.showList.push(data.resultDatas[i])
        }
        if(this.isShowErrorList){
          this.onlyShowErrList()
        }
        if (data.sheetList && data.sheetList.length === 1) {
          sheetName = data.sheetList[0];
        }
        // this.cacheSheetData(sheetName, data);
        this.sheetName = sheetName;
      }
      this.showDataTable = true;

    },
    async importData() {
      this.loading = true;
      let list = [...this.previewData.listDatas];
      try {
        await http.post(this.import, list);
         this.loading = false;
        this.$emit("imported");
        this.$Message.success("导入成功!");
        this.show = false;
      } catch(e) {
        this.loading = false
      }
     
    },
    pageSizeChange(e) {
      this.maxLoadData =e
    },
    onPageChange(index=1) {
      this.loading = true
      // this.showList = []
      this.currentPage = index
      let loadNum = (index-1)*this.maxLoadData
      let arr = []

      for(let i=0; i<this.maxLoadData;i++){
        if((loadNum + i) > this.loadList.length-1){
          break
          }
          arr.push(this.loadList[loadNum + i])
      }
      setTimeout(() => {this.showList = arr;this.loading = false},200)
    },
    onlyShowErrList() {
      if(this.isShowErrorList){
        this.loadList = this.previewData.resultDatas? this.previewData.resultDatas.filter(data => data.errorMessage.length > 0) : []
      }else{
        this.loadList = this.previewData.resultDatas || []
      }
      this.onPageChange()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ivu-upload {
 display: inline-block;
 margin-right: 10px;
}
</style>
<style lang="less">
  .uploadModel2 .ivu-modal-body{
    max-height: calc(100vh - 310px);
    overflow: hidden;
  }
</style>