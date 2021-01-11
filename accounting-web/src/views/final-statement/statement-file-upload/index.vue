<template>
  <div style="display: inline; margin-left: 3px;">
    <Button
      type="info"
      icon="ios-cloud-upload-outline"
      class="margin-right-3"
      @click="show = true"
    >导入</Button>
    <Modal v-model="show" width="80vw" class="uploadModel" @on-cancel='close' :mask-closable='false'>
      <p slot="header">
        <Icon type="md-cloud-upload"></Icon>
        <span>导入</span>
      </p>
      <div>
        <Row>
          <Col span="20">
            <Upload ref="fileUpload"
            :action="action"
            :before-upload="beforeUpload"
            >
              <Button type="success" icon="md-add">选择文件...</Button>
              <span style="margin-left: 10px;">{{fileName}}</span>
              <span v-if='showChart2==4'  style="margin-left: 20px;color:red;">{{dealDetailTotalErrorMessage.join(',')}}</span>
            </Upload>
          </Col>

          <Col span="4">
            <Button type="primary" style="float: right;" @click="downloadTemplate">下载模板</Button>
          </Col>
        </Row>
        <Row>
          <!-- <Col span="10"> -->
           <a-radio-group  style="float: left"  default-value=1 v-model="showChart2" button-style="solid">
              <a-radio-button :value="1" :style="{color: basicInfoHasErro && showChart2 != 1? 'red': ''}">
                基本信息
              </a-radio-button>
               <a-radio-button :value="2" :style="{color: fundDetailInfoesHasErro && showChart2 != 2? 'red': ''}">
                资金变动明细
              </a-radio-button>
              <a-radio-button :value="3" :style="{color: positionDetailInfoesHasErro && showChart2 != 3? 'red': ''}">
                持仓明细
              </a-radio-button>
              <a-radio-button :value="4" :style="{color: (tradeDetailInfoesHasErro|| dealDetailTotalErrorMessage.length) && showChart2 != 4 ? 'red': ''}">
                成交明细
              </a-radio-button>
              </a-radio-group>
          <!-- </Col> -->
          <Col :offset="1" span="10"><i-switch v-model="isShowErrorList"  ><span slot="open">开</span><span slot="close">关</span></i-switch> <span style="line-height:30px;color:red">  (只显示错误行)</span></Col>
        </Row>
       
        <Divider style="margin: 5px 0" />
        <div>
          <!-- <Scroll :on-reach-bottom="handleReachBottom" :height="500" :distance-to-edge="-80"> -->
           <basic-info :isShowErrorList='isShowErrorList' :data='basicInfo' v-if="showChart2==1" />
           <fundsOccupation :isShowErrorList='isShowErrorList' :data='fundDetailInfoes'  v-if="showChart2==2"/>
           <position-detail :isShowErrorList='isShowErrorList' :data='positionDetailInfoes' v-if="showChart2==3" />
           <deal-detail  :isShowErrorList='isShowErrorList' :data='tradeDetailInfoes' v-if="showChart2==4"/>
          <!-- </Scroll> -->
          <div style="text-align:center">
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer_tip">
          <svg t="1600163615246" style="margin-right:10px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2917" width="20" height="20"><path d="M512 14.208c274.56 0 497.792 223.168 497.792 497.792 0 274.56-223.168 497.792-497.792 497.792C237.44 1009.792 14.208 786.56 14.208 512 14.208 237.44 237.44 14.208 512 14.208z m0 71.104A427.072 427.072 0 0 0 85.312 512 427.072 427.072 0 0 0 512 938.688 427.072 427.072 0 0 0 938.688 512 427.072 427.072 0 0 0 512 85.312z m35.584 628.16v71.104H476.416v-71.04h71.168z m0-474.048v402.944H476.416V239.424h71.168z" p-id="2918" fill="red"></path></svg>
          <div>
              注：结算单记录仅支持导入内盘逐笔日结算单的数据，对于其他市场或盘面的结算单需要下载模板后整理为模板表格数据才可导入。<br>结算单数据需要一次导入日结算单相关所有数据，相同日期相同账户不可重复导入。
          </div>
        </div>
        <Button
          type="primary"
          :loading="loading"
          @click="importFn"
          :disabled="!isAllowImport"
        >导入</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { http } from "@/utils/http";
import map from "lodash/map";
import filter from "lodash/filter";
import Radio from 'ant-design-vue/lib/radio'
import basicInfo from './basicinfo'
import fundsOccupation from './fundsOccupation'
import positionDetail from './positionDetail'
import dealDetail from './dealDetail'
import _ from 'lodash'
export default {
  name: "FileUpload",
  components: {[Radio.Button.name]:Radio.Button,[Radio.Group.name]:Radio.Group,basicInfo, fundsOccupation, positionDetail, dealDetail},
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
      showDataTable: true,
      maxLoadData: 10,
      curLoadIndex: 0,
      currentPage: 1,
      isShowErrorList: false,
      showChart2: 1,
      basicInfo: [],
      fundDetailInfoes: [],
      positionDetailInfoes: [],
      tradeDetailInfoes: [],
      dealDetailTotalErrorMessage: [],
      isAllowImport: false
    };
  },
  created() {
    this.sheetName = "";
    this.file = null;
    this.cacheData = {};
  },
  watch: {
    sheetName(v) {
      if (!v) {
        this.showDataTable = false;
        return;
      }
      this.getSheetData();
    },
    show(v) {
      if (!v) {
        this.file = null;
        this.fileName = null;
        this.showDataTable = false;
        this.curLoadIndex = 0
      }
    }
  },
  computed:{
    basicInfoHasErro() {
      return this.basicInfo.some(item => item.errorMessages.length)
    },
    fundDetailInfoesHasErro() {
      return this.fundDetailInfoes.some(item => item.errorMessages.length)
    },
    positionDetailInfoesHasErro() {
      return this.positionDetailInfoes.some(item => item.errorMessages.length)
    },
    tradeDetailInfoesHasErro() {
      return this.tradeDetailInfoes.some(item => item.errorMessages.length)
    }
  },
  methods: {
    close() {
      this.showChart2= 1
      this.basicInfo= []
      this.fundDetailInfoes= []
      this.positionDetailInfoes= []
      this.tradeDetailInfoes= []
      this.dealDetailTotalErrorMessage= []
      this.isAllowImport= false
    },
    downloadTemplate() {
      http.download(this.download, null, false, this.tempName);
    },
    beforeUpload(file) {
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
      let sheetName = this.sheetName;
      let sheetData = this.getCachedData(sheetName);
      if (!sheetData) {
        let formData = new FormData();
        formData.append("file", this.file);
        sheetName && formData.append("sheetName", sheetName);
        let data = await http.post(this.action, formData);
        let basicInfo= _.groupBy(data.importPreviewInfo.basicInfo, 'excelIndex')
        let list = []
       Object.keys(basicInfo).forEach(item => {
         let obj = {}
         obj.content = basicInfo[item][0].content
         obj.value = basicInfo[item][0].value
         obj.excelIndex = basicInfo[item][0].excelIndex
         obj.sheetName = basicInfo[item][0].sheetName
         obj.isNeedFormatAmount = basicInfo[item][0].isNeedFormatAmount
         obj.isNeedFormatAmount2 = basicInfo[item][1]? basicInfo[item][1].isNeedFormatAmount: null
         obj.errorMessages = []
         basicInfo[item][0].errorMessage && obj.errorMessages.push(basicInfo[item][0].errorMessage)
          basicInfo[item][1] && basicInfo[item][1].errorMessage && obj.errorMessages.push(basicInfo[item][1].errorMessage)
         obj.content2 = basicInfo[item][1]? basicInfo[item][1].content : null
         obj.value2 = basicInfo[item][1]? basicInfo[item][1].value : null
         list.push(obj)
       })
        this.basicInfo = list
        this.fundDetailInfoes = data.importPreviewInfo.fundDetailInfoes
        this.positionDetailInfoes = data.importPreviewInfo.positionDetailInfoes
        this.tradeDetailInfoes = data.importPreviewInfo.tradeDetailInfoes


        this.isAllowImport = data.isAllowImport
        this.dealDetailTotalErrorMessage = []
        Object.values(data.errorMessages).forEach(item => {
          this.dealDetailTotalErrorMessage = item.map(err => err.value)
        })
        this.importData = data.importData
      }
      this.showDataTable = true;
    },
    async importFn() {
      this.loading = true;
      try{
        await http.post(this.import, this.importData);
      } catch(e) {
        this.loading = false
      }
      this.loading = false;
      this.$emit("imported");
      this.$Message.success("导入成功!");
      this.show = false;
      this.showChart2= 1
      this.basicInfo= []
      this.fundDetailInfoes= []
      this.positionDetailInfoes= []
      this.tradeDetailInfoes= []
      this.dealDetailTotalErrorMessage= []
      this.isAllowImport= false
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  .footer_tip{
    float: left;
    color:red;
    text-align: left;
    display: flex;
    align-items: center;
  }
</style>
<style lang="less">
  .uploadModel .ivu-modal-body{
    overflow: hidden;
    max-height: calc(100vh - 310px);
  }
</style>