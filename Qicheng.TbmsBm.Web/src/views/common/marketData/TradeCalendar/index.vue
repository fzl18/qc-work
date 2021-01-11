<template>
  <div class="app-container">
    <div class="tools">
      <span>{{$t('全部所选交易所为非交易日')}}</span>
      <span>{{$t('部分所选交易所为非交易日')}}</span>
      <span>{{$t('选中日期')}}</span>
      <Button type="success" v-if="isShow('')" @click="doInitTradingDays"
        >{{$t('初始化双休为非交易日')}}</Button
      >
      <Button type="primary" v-if="isShow('')" @click="confirm(1)"
        >{{$t('设置交易日')}}</Button
      >
      <Button type="error" v-if="isShow('')" @click="confirm(0)"
        >{{$t('设置为非交易日')}}</Button
      >
    </div>
    <Row type="flex" :gutter="20">
      <Col :lg="4" :sm="8" :xs="12">
        <div>
          <dl class="exchange-side-menu">
            <dt>{{$t('交易所')}}</dt>
            <dd v-for="item in exChange" :key="item.value">
              <Checkbox v-model="item.checked" @on-change="handleExchange">{{
                item.text
              }}</Checkbox>
            </dd>
          </dl>
        </div>
      </Col>
      <Col :lg="20" :sm="16" :xs="12">
        <section class="calendar">
          <Row type="flex" justify="space-between">
            <Col :span="2">
              <Button
                type="text"
                icon="ios-arrow-back"
                circle
                @click="handleYear('prev')"
              ></Button
            ></Col>
            <Col :span="20" class="input-year">
              <Button
                type="text"
                style="fontsize: 12px; color: #000"
                v-show="!editYear"
                @click="changeYear(false)"
                >{{ curYear }} 年</Button
              >
              <Input
                v-model="curYear"
                v-show="editYear"
                maxlength="4"
                minlength="4"
                @blur="changeYear(true)"
                @keyup.enter.native="changeYear(true)"
              />
            </Col>
            <Col :span="2" class="text-r"
              ><Button
                type="text"
                icon="ios-arrow-forward"
                circle
                @click="handleYear('next')"
              ></Button
            ></Col>
          </Row>
          <Row :gutter="10">
            <Col
              :lg="6"
              :sm="8"
              :xs="12"
              v-for="month in monthList"
              :key="month"
            >
              <MonthCard
                :date="{ year: curYear, month, daysList, cacheSelectDayList }"
                @dayChecked="dayChecked"
              />
            </Col>
          </Row>
        </section>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  list,
  tradingDays,
  notTradingDays,
  initTradingDays,
  getCommonData,
} from './tradeCalendar';
import { utils } from '@/utils/utils';
import moment from 'moment';
import MonthCard from './monthCard';

export default {
  name: 'tradeCalendar',
  components: {
    MonthCard,
  },
  data() {
    return {
      curYear: null,
      editYear: false,
      monthList: [],
      exChange: [],
      cacheSelectDayList: [],
      daysList: [],
    };
  },
  async created() {
    this.curYear = moment().year();
    let commonData = (await getCommonData()).Exchanges;
    commonData.map((item, index) => {
      if (index) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    });
    this.exChange = commonData;
    let monthCount = 12;
    for (let i = 1; i <= monthCount; i++) {
      this.monthList.push(i);
    }
    this.search();
  },
  methods: {
    async search() {
      let exchangeIds = this.selectedExchangeList();
      if (!exchangeIds.length) {
        this.showMessage(0);
        return false;
      }
      let Ids = '';
      exchangeIds.map((item) => {
        Ids += `&marketIdList=${item}`;
      });
      let reslist = await list(`year=${this.curYear}${Ids}`);
      let exChangeIds = [];
      let allSelectDays = [];
      reslist.map((item) => {
        item.marketDate = moment(item.marketDate).format('YYYY-MM-DD');
        exChangeIds.push(item.sdExchangeId);
        if(!item.marketDateType){
          allSelectDays.push(item.marketDate);
        }
      });
      let selectedExchangeLength = this.selectedExchangeList().length;
      exChangeIds = Array.from(new Set(exChangeIds));
      this.daysList = this.listCount(allSelectDays, selectedExchangeLength);
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    doInitTradingDays() {
      let exchangeIds = this.selectedExchangeList();
      if (!exchangeIds.length) {
        this.showMessage(0);
        return;
      }
      initTradingDays({
        year: this.curYear,
        marketIds: exchangeIds,
      }).then((res) => {
        // if(res.status == 200){
        this.search();
        this.showMessage(1);
        // }
      });
    },
    setNotTradingDays() {
      let exchangeIds = this.selectedExchangeList();
      if (!exchangeIds.length) {
        this.showMessage(0);
        return;
      }
      let tradeDates = this.cacheSelectDayList;
      notTradingDays({
        marketIds: exchangeIds,
        marketDates: tradeDates,
      }).then((res) => {
        this.handleThen(res);
      });
    },
    setTradingDays() {
      let exchangeIds = this.selectedExchangeList();
      if (!exchangeIds.length) {
        this.showMessage(0);
        return;
      }
      let tradeDates = this.cacheSelectDayList;
      tradingDays({
        marketIds: exchangeIds,
        marketDates: tradeDates,
      }).then((res) => {
        this.handleThen(res);
      });
    },
    handleExchange() {
      this.search();
    },
    changeYear(changed) {
      this.editYear = !changed;
      if (this.curYear) {
        this.curYear =
          +this.curYear > 2099
            ? 2099
            : +this.curYear < 1900
            ? 1900
            : +this.curYear;
      } else {
        this.curYear = 2020;
      }
    },
    handleYear(type) {
      if (type === 'next') {
        this.curYear++;
      } else {
        this.curYear--;
      }
      this.search();
    },
    dayChecked(data) {
      if (data.select) {
        this.cacheSelectDayList.push(data.day);
      } else {
        this.cacheSelectDayList.splice(
          this.cacheSelectDayList.findIndex((item) => item === data.day),
          1
        );
      }
    },
    selectedExchangeList() {
      let exchangeIds = [];
      this.exChange.map((item) => {
        if (item.checked) {
          exchangeIds.push(item.value);
        }
      });
      return exchangeIds;
    },
    listCount(list, count) {
      let _arr = list;
      let _res = [];
      let _new = [];
      _arr.sort();
      for (let i = 0; i < _arr.length; ) {
        let count = 0;
        for (let j = i; j < _arr.length; j++) {
          if (_arr[i] == _arr[j]) {
            count++;
          }
        }
        _res.push([_arr[i], count]);
        i += count;
      }
      _res.map((item) => {
        _new.push({
          day: item[0],
          select: item[1] === count ? 2 : 1,
        });
      });
      return _new;
    },
    showMessage(code) {
      if (code) {
        this.$Message.success('设置成功');
      } else {
        this.$Message.error('请选择交易所');
      }
    },
    confirm(type) {
      if (!this.cacheSelectDayList.length) {
        this.$Message.error('还未有选择日期');
        return;
      }
      this.$Modal.confirm({
        title: `本次设置为${type ? '' : '非'}交易日历的日期共${
          this.cacheSelectDayList.length
        }天`,
        // content:'提示',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          if (type) {
            this.setTradingDays();
          } else {
            this.setNotTradingDays();
          }
        },
      });
    },
    handleThen(res) {
      // if(res.status == 200){
      this.search();
      this.cacheSelectDayList = [];
      this.showMessage(1);
      // }
    },
  },
};
</script>

<style scoped>
.tools {
  margin-bottom: 25px;
  font-size: 14px;
}
.tools span {
  margin: 0 10px;
  line-height: 30px;
  display: inline-block;
}
.tools span::before {
  content: "";
  width: 36px;
  height: 20px;
  margin-right: 5px;
  background: #ddd;
  display: inline-block;
  position: relative;
  top: 6px;
}
.tools span:nth-child(1)::before {
  background: #888;
}
.tools button {
  margin-right: 3px;
}
.tools span:nth-child(3) {
  margin-right: 20px;
}
.tools span:nth-child(3)::before {
  background: none;
  border: 1px solid red;
}
.exchange-side-menu {
  border: 1px solid #ddd;
  margin: 0 10px;
  height: calc(100vh - 200px);
  overflow-y: auto;
  min-width: 190px;
}
.exchange-side-menu dt {
  background: #ddd;
  text-align: center;
  line-height: 36px;
}
.exchange-side-menu dd {
  text-align: left;
  line-height: 20px;
  padding: 5px 15px;
  margin: 0;
}
.exchange-side-menu dd:hover {
  background: #eee;
}
.calendar {
  background: #ddd;
  /* border-radius: 8px; */
  padding: 3px;
}
.calendar .text-r {
  text-align: right;
}
.calendar .input-year {
  width: 62px;
}
.input-year span {
  line-height: 30px;
}
</style>
