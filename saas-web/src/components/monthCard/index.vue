<template>
    <el-card shadow="hover" class="card">
      <table>
          <tr><td colspan="7" align="center">{{date.month}}月</td></tr>
          <tr>
              <th v-for="(weekDay,index) in weeks" :key="`weekDay${index}`">{{weekDay}}</th>
          </tr>
          <tr v-for="(week,index) in monthDay" :key="`week${index}`"> 
              <td v-for="item in week" :key="item.day" align="center">
                  <span :class="[{'checked': item.checked},{'select':item.select === 1},{'select2':item.select === 2},'day']" @click="choose(item)" v-if="item.day">{{item.day}}</span>
              </td>
          </tr>
      </table>
    </el-card>
</template>

<script>
import moment from 'moment'
export default {
    name: "monthCard",
    props:['date'],
    data () {
        return {
            weeks:['日','一','二','三','四','五','六'],
            monthDay:[]
        }
    },
    mounted(){
        this.init()
    },
    watch: {
        "date.year" () {this.init()},
        "date.daysList" () {this.init()}
    },
    methods: {
        choose (data) {
            data.checked = !data.checked
            this.$emit('dayChecked',{day:data.formatDay,select:data.checked})
        },
        init () {
            this.monthDay = []
            let curYear = this.date.year
            let curMonth = this.date.month - 1
            let lastDay = moment({year:curYear,month:curMonth}).endOf('month').format('DD')
            let dayOfStart = moment({year:curYear,month:curMonth,day:1}).day()
            let weekDays = []
            let daysList = this.date.daysList
            let cacheSelectDayList = this.date.cacheSelectDayList
            if(curYear){
                for(let i=1;i<=lastDay;i++){
                    weekDays.push(
                        {select:0,formatDay:`${curYear}-${(curMonth+1) < 10 ? '0'+(curMonth+1) : curMonth+1}-${ i<10 ? '0'+i : i}`, day: i, checked:false},
                    )
                }
                for(let j=0;j<dayOfStart;j++){
                    weekDays.unshift({select:0,formatDay:null, day: null, checked:false})
                }
                weekDays.map(item=>{
                    daysList.map(val=>{                        
                        if(item.formatDay === val.day){
                            item.select = val.select
                        }
                    })
                })
                weekDays.map(item=>{
                    if(cacheSelectDayList.includes(item.formatDay)){
                        item.checked = true
                    }
                })
                let weekNum = Math.ceil(weekDays.length / 7)
                for(let k=0;k<weekNum;k++){
                    let end = (k + 1) *7
                    this.monthDay.push(weekDays.slice(k*7,end))
                }
            }
            
        }
    }
}
</script>

<style scoped>
 .card{
     margin-top:10px;
     font-size: 14px;
     height:220px;
 }
 .card table{width: 100%;}
 .card .day{
     cursor: pointer;
     border: 1px solid #fff;
     border-radius: 4px;
     display: block;
 }
  .card .day:hover{
      border: 1px solid orange;
  }
  .card .day.checked{
      border: 1px solid red;
  }
  .card .day.select{
      background: rgba(88,88,88,.43);
      color: #fff;
  }
  .card .day.select2{
      background: #888;
      color: #fff;
  }
</style>