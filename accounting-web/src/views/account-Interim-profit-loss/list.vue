<template>
  <div>
    <Row type="flex" :gutter="10" class="searchBar">
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="日期时段"
            v-model="query.daterange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId" @on-clear="query.tradeAccountId = null">
            <Option
              v-for="(item, index) in commonData.corporations"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
              v-for="(item, index) in (commonData.tradeAccounts && commonData.tradeAccounts.filter(val => val.corporationId == query.corporationId))"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="4" :sm="12" :xs="24" style="text-align:right">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>     
      </Row>
    <Row type="flex" :gutter="24" class="chart">
      <Col :span="24" class-name="margin-bottom-10">
        <!-- <Card :bordered="false">
            <p slot="title">资金账户期间盈亏</p> -->
              <Col class-name="margin-bottom-10" >
                <a-table :columns="tabColumns" :dataSource="listData" :pagination="false" bordered>
                  <span :class="text < 0 ? 'red':''" slot="openingProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <span :class="text < 0 ? 'red':''" slot="endingProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <span :class="text < 0 ? 'red':''" slot="duringProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
                  <a href="javascript:;" slot="option" slot-scope="text,recode" @click="seeMore(recode)">查看详情</a>
                </a-table>
              </Col>            
        <!-- </Card>-->
      </Col>
    </Row>
    <Modal v-model="isShowModal" title="查看详情" width="70%">
      <div class="colList">
        <a-table          
          :pagination="false" bordered
          class="margin-bottom-10"
          :loading="false"
          :columns="childColumns"
          :dataSource="curData"
        >
          <span :class="text < 0 ? 'red':''" slot="openingProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="endingProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
          <span :class="text < 0 ? 'red':''" slot="duringProfit" slot-scope="text,recode">{{utils.formatNum(text.toFixed(2))}}</span>
        </a-table>
      </div>      
    </Modal>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";

export default {
  data() {
    return {
      commonData: {
        profitCenters: [],
        options: {},
        enums: {}
      },
      isShowModal: false,
      query: {
        daterange: [utils.formatDate(new Date()), utils.formatDate(new Date())]
      },
      // pagination: {
      //   currentPage: 1,
      //   totalCount: 0,
      //   pageSize: 15
      // },
      data:[],
      tabColumns:[],
      childColumns:[],
      listData:[],
      curData:[],
    };
  },
  async beforeCreate() {
    this.commonData = await this.api.getCommonData("AcTAPnL")    
  },
  created() {
    this.search();
  },
  watch: {

  },
  methods: {
    onSearch() {
      this.search();
    },
    resetQuery() {
      this.query = {};
    },
    async search() {
      let lengthList = []
      this.listData = []
      if( !this.query.daterange || this.query.daterange.length == 0 || this.query.daterange[0] == '' || this.query.daterange[1] == ''){
        this.$Message.error("日期时段不能为空")
        return
      }
      this.query.accountingDateQueryStart = utils.formatDate(this.query.daterange[0])
      this.query.accountingDateQueryEnd = utils.formatDate(this.query.daterange[1])
      let data = await api.search(this.query)
      
      data.list.map(val =>{
        lengthList.push(val.details.length)
        val.details.map(data =>{
          this.listData.push({
            tradeAccount: val.tradeAccount,
            ...data
          })
        })
      })

      this.tabColumns=[
        { title: '资金账户', dataIndex: 'tradeAccount', key: 'tradeAccount',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            if (index < lengthList.reduce((prev,cur)=> prev + cur)) {
              obj.attrs.rowSpan = 0;
            }
            if (index == 0) {
              obj.attrs.rowSpan = lengthList[0];
            }            
            lengthList.forEach((val,i)=>{
              let newArray = lengthList.slice(0,i+1)              
              if (index == newArray.reduce((prev,cur)=> prev + cur)) {
                obj.attrs.rowSpan = lengthList[i+1]
              }
            })
            return obj;
          }        
        },
        { title: '币种', dataIndex: 'currency', key: 'currency'},     
        { title: '期间利润', dataIndex: 'duringProfit', key: 'duringProfit',scopedSlots: { customRender: 'duringProfit'}},
        { title: '期初利润', dataIndex: 'openingProfit', key: 'openingProfit',scopedSlots: { customRender: 'openingProfit'}},
        { title: '期末利润', dataIndex: 'endingProfit', key: 'endingProfit',scopedSlots: { customRender: 'endingProfit'}},
        { title: '操作', dataIndex: 'option', key: 'option',scopedSlots: { customRender: 'option'}},

      ]

      this.childColumns=[
        { title: '品类', dataIndex: 'commodityType', key: 'commodityType'},
        { title: '业务类型', dataIndex: 'businessType', key: 'businessType'},
        { title: '期间利润', dataIndex: 'duringProfit', key: 'duringProfit',scopedSlots: { customRender: 'duringProfit'}},
        { title: '期初利润', dataIndex: 'openingProfit', key: 'openingProfit',scopedSlots: { customRender: 'openingProfit'}},
        { title: '期末利润', dataIndex: 'endingProfit', key: 'endingProfit',scopedSlots: { customRender: 'endingProfit'}},
      ]
    },
    // onPageChange(page) {
    //   this.pagination.currentPage = page.currentPage;
    //   this.search();
    // },
    // onPageSizeChange(pageSize) {
    //   this.pagination.pageSize = pageSize;
    //   if (pageSize) {
    //     this.search();
    //   }
    // },

    seeMore(data) {
      this.isShowModal = true
      this.curData = data.detail2s
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>
<style scoped>
.searchBar{
  margin:20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f7f9
}
.chart{
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100vh - 242px);
  padding-bottom: 150px;
}
.ivu-card h3{
  font-weight: 700;
  text-align: center;
  line-height: 35px;
  margin-top:20px;
}
.ivu-card{
  border-radius: 0;
  position: relative;
  height:100%;
}
.ivu-card:hover{
  box-shadow: none;
}
.ivu-card-head p{
  font-size:16px;
}
.ivu-card::before{
  content: '';
  height: 2px;
  width: 100%;
  background: orange;
  position:absolute;
  left:0;
  top:0;
}
ul li{
  line-height: 35px;
  list-style: none;
  margin-left:15px;
  font-size:16px;
  font-weight:500;
}
.colList{
  margin-bottom: 50px;
}
a{
  text-decoration: none;
}
</style>

