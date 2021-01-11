<template>
  <div class="app-container">
    <div class="tools">
      <span>全部所选交易所为非交易日</span>
      <span>部分所选交易所为非交易日</span>
      <span>选中日期</span>
      <el-button type="success" v-hasAuth="[$route,'create']" @click="doInitTradingDays">初始化双休为非交易日</el-button>
      <el-button type="primary" v-hasAuth="[$route,'create']" @click="confirm(1)">设置交易日</el-button>
      <el-button type="danger" v-hasAuth="[$route,'create']" @click="confirm(0)">设置为非交易日</el-button>
    </div>
    <el-row type="flex" :gutter="20" >
      <el-col :span="4" >
        <div>
          <dl class="exchange-side-menu">
            <dt>交易所</dt>
            <dd v-for="item in exChange" :key="item.value"><el-checkbox v-model="item.checked" @change="handleExchange">{{item.text}}</el-checkbox></dd>
          </dl>
        </div>        
      </el-col>
      <el-col :span="20">
        <section class="calendar">
          <el-row type="flex" justify="space-between">
            <el-col :span="2"> <el-button type="primary" icon="el-icon-back" size="mini" circle @click="handleYear('prev')"></el-button></el-col>
            <el-col :span="20" class="input-year">
              <el-button type="text" style="fontSize:16px;color:#000" v-show="!editYear" @click="changeYear(false)">{{curYear}} 年</el-button>
              <el-input v-model="curYear" v-show="editYear" maxlength="4" minlength="4" @blur="changeYear(true)" @keyup.enter.native="changeYear(true)"/>
            </el-col>
            <el-col :span="2" class="text-r"><el-button type="primary" icon="el-icon-right" size="mini" circle @click="handleYear('next')"></el-button></el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6" v-for=" month in monthList" :key="month"> 
              <monthCard :date="{year: curYear,month,daysList,cacheSelectDayList}" @dayChecked="dayChecked"/> 
            </el-col>
          </el-row>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  list,
  tradingDays,
  notTradingDays,
  initTradingDays,
  getCommonData
} from "../../api/tradeCalendar";

import moment from "moment"
import monthCard from "../../components/monthCard"

export default {
  name: "tradeCalendar",
  components: {
    monthCard
  },
  data() {
    return {
      curYear:null,
      editYear:false,
      monthList:[],
      exChange:[],
      cacheSelectDayList:[],
      daysList:[]
    };
  },
  async created() {
    this.curYear = moment().year()
    let commonData = (await getCommonData()).data
    commonData.map((item,index) => {
      if(index){
        item.checked = false
      }else{
        item.checked = true
      }
    })
    this.exChange = commonData
    let monthCount = 12
    for(let i=1;i<=monthCount;i++){
      this.monthList.push(i)
    }
    this.search()
  },
  methods: {
    async search () {
      let exchangeIds = this.selectedExchangeList()
      if(!exchangeIds.length){
        this.showMessage(0)
        return false
      }
      let Ids=''
      exchangeIds.map(item=>{Ids += `&exchangeIds=${item}`})
      let reslist = (await list(`year=${this.curYear}${Ids}`)).data
      let exChangeIds = []
      let allSelectDays = []
      reslist.map(item=>{
        item.marketDate = moment(item.marketDate).format('YYYY-MM-DD')
        exChangeIds.push(item.sdExchangeId)
        allSelectDays.push(item.marketDate)
      })
      let selectedExchangeLength = (this.selectedExchangeList()).length
      exChangeIds = Array.from(new Set(exChangeIds))
      this.daysList = this.listCount(allSelectDays,selectedExchangeLength)
    },
    doInitTradingDays () {
      let exchangeIds = this.selectedExchangeList()
      if(!exchangeIds.length){
        this.showMessage(0)
        return
      }
      initTradingDays({
        year: this.curYear,
        exchangeIds
      }).then(res => {
        if(res.status == 200){
          this.search()
          this.showMessage(1)
        }
      })
    },
    setNotTradingDays () {
      let exchangeIds = this.selectedExchangeList()
      if(!exchangeIds.length){
        this.showMessage(0)
        return
      }
      let tradeDates = this.cacheSelectDayList
      notTradingDays({
        exchangeIds,
        tradeDates
      }).then(res => {
        this.handleThen(res)
      })
    },
    setTradingDays () {
      let exchangeIds = this.selectedExchangeList()
      if(!exchangeIds.length){
        this.showMessage(0)
        return
      }
      let tradeDates = this.cacheSelectDayList
      tradingDays({
        exchangeIds,
        tradeDates
      }).then(res => {
        this.handleThen(res)
      })
    },
    handleExchange () {
      this.search()
    },
    changeYear (changed) {
      this.editYear = !changed
      if(this.curYear){
        this.curYear = 
            +this.curYear > 2099 
          ? 2099 
          : +this.curYear < 1900 
          ? 1900 
          : +this.curYear
      }else{
        this.curYear = 2020;
      }
    },
    handleYear (type) {
      if(type === 'next'){
        this.curYear++
      }else{
        this.curYear--
      }
      this.search()
    },    
    dayChecked (data) {
      if(data.select){
        this.cacheSelectDayList.push(data.day)
      }else{
        this.cacheSelectDayList.splice(this.cacheSelectDayList.findIndex(item => item === data.day), 1)
      }
    },
    selectedExchangeList () {
      let exchangeIds = [] 
      this.exChange.map( item=> { if(item.checked){ exchangeIds.push(item.value) }})
      return exchangeIds
    },
    listCount (list,count) {
      let _arr = list
      let _res = []
      let _new = []
      _arr.sort()
      for (let i = 0; i < _arr.length;) {
          let count = 0;
          for (let j = i; j < _arr.length; j++) {
              if (_arr[i] == _arr[j]) {
                  count++;
              }
          }
          _res.push([_arr[i], count])
          i += count
      }
      _res.map(item=>{
        _new.push({
          day: item[0],
          select: item[1] === count ? 2 : 1
        })
      })
      return _new
    },
    showMessage (code) {      
      this.$message({
          message: code ? '设置成功' : '请选择交易所',
          type: code ? 'success' : 'error'
        })
    },
    confirm (type) {
      if(!this.cacheSelectDayList.length){
        this.$message({
          message:'还未有选择日期',
          type:'error'
        })
        return
      }
      this.$confirm(`本次设置为${type ? '' : '非'}交易日历的日期共${this.cacheSelectDayList.length}天`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(type){
            this.setTradingDays()
          }else{
            this.setNotTradingDays()
          }
        }).catch(()=>{})
    },
    handleThen (res) {
      if(res.status == 200){
          this.search()
          this.cacheSelectDayList = []
          this.showMessage(1)
        }
    }
  }
};
</script>

<style scoped>
.tools{
  margin-bottom:25px;
  font-size: 14px;
}
.tools span{
  margin: 0 10px;
  line-height: 30px;
  display: inline-block;
}
.tools span::before{
  content:'';
  width: 36px;
  height: 20px;
  margin-right: 5px;
  background: #ddd;
  display: inline-block;
  position: relative;
  top:6px
}
.tools span:nth-child(1)::before{
  background: #888;
}
.tools span:nth-child(3){margin-right:20px;}
.tools span:nth-child(3)::before{
  background: none;
  border: 1px solid red;
}
.exchange-side-menu{
  border:1px solid #ddd;
  margin: 0 10px;
  height: 746px;
  overflow-y:auto;
  min-width: 190px;
}
.exchange-side-menu dt{
  background: #ddd;
  text-align: center;
  line-height: 36px;
}
.exchange-side-menu dd{
  text-align: left;
  line-height: 20px;
  padding:5px 15px;
  margin: 0;
}
.exchange-side-menu dd:hover{
  background: #eee;
}
.calendar{
  background: #ddd;
  border-radius: 8px;
  padding:10px;
}
.calendar .text-r{
  text-align: right;
}
.calendar .input-year{
  width: 62px;
}
.input-year span{
  line-height: 30px;
}
</style>
