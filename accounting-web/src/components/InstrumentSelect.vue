<template>
  <AutoComplete
    v-model="instrument"
    :disabled="disabled"
    :icon="loading ? 'ios-loading' : 'ios-search'"
    :placeholder="placeholder"
    clearable
    @on-change="change"
    @on-select="selected"
    @on-blur="blur"
    @on-focus='addEventListener'
    class="autocomplete_instument"
    ref='autocomplete'
    v-getEl
    transfer
  >
    <div class="InstrumentSelect autocomplete_instument">
      <div class="body">
        <div class="list" :style="`max-height: ${height}px;`">
          <Option v-for="(option, index) in list" :value="option.qctKey" :key="index">
            <div @click="optionClick(option)"  @mousedown.prevent >{{option.qctKey}}</div>
          </Option>
          <div class="nodata" v-if="!list.length">
            <Icon type="md-alert" :size="16" style="margin-right:5px"/>
            暂无数据<template v-if="(instrument && instrument.length < 3) || !instrument">输入3个字符后查询</template>
          </div>
          <div class="more" v-show="list.length > 0 && isMore">
            <Button :loading="loading" size="small" type="info" @click.native.stop="loadMore" @mousedown.native.prevent>
              <Icon type="md-download"/>
              加载更多...
            </Button>
          </div>
        </div>
      </div>
      <template v-if="isLost">
        <div class="divider" style="color:red" title='缺少前置过滤(筛选)条件'></div>
        <div class="filter">
          <h5 class="title"></h5>
          <div class="option">
            <template v-for="(item,index) in filterRequired">
              <Tag color="default" v-if="!item.id" :key="index">{{item.text}}</Tag>
            </template>
          </div>
        </div>
      </template>
      <template v-if="filterEffective.length > 0">
        <div class="divider" style="fontSize:12px;" title='当前过滤(筛选)条件'></div>
        <div class="filter">
          <h5 class="title"></h5>
          <div class="option">
            <template v-for="(item,index) in filterEffective">
              <Tag :key="index" :color="colors[index]" v-if="item.id">{{item.text}}：{{item.code}}</Tag>
            </template>
          </div>
        </div>
      </template>
    </div>
  </AutoComplete>
</template>
<script>
  import { http } from '@/utils/http';
  import debounce from 'lodash/debounce';

  const url = 'Common/GetInstrumentList';
  export default {
    name: 'InstrumentSelect',
    props: {
      //  用来双向绑定数据与业务无关
      value: {
        type: [String, Number],
        default: ''
      },

      //  用来设置返回的字段,默认返回 具体合约的 ID 值
      keyName: {
        type: String,
        default: ''
      },
      //  input的默认文字说明
      placeholder: {
        type: String,
        default: '具体合约'
      },

      //  用来设置 滚动框的高度
      height: {
        type: Number,
        default: 300
      },

      //  用来设置 输入完字符串后延时多少毫秒触发搜索行为
      delay: {
        type: Number,
        default: 500
      },

      //  用来设置 前置过滤条件：    多个条件添加多个对象。
      //   [{
      //      key :    需要进行搜索的字段名
      //      id :     对应 key 字段名的 值
      //      text :   显示在页面上的过滤条件,如果 id 为空时,会显示在缺少条件里
      //   }]
      filterQuery: {
        type: Array,
        default: () => {
          return [];
        }
      },

      //  主要用来控置 返回结果 是否包含 当日以前日期的数据, 默认只返回 当日及以后日期的数据, 一般用于列表页中的搜索条件
      allDate: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    directives: {
      'getEl'(el, binding, vNode) {
        vNode.context.el = el
      }
    },
    data () {
      return {
        init: true,
        loading: false,
        isMore: false,
        isSelectChange: false,
        colors: ['blue', 'green', 'cyan', 'purple', 'orange', 'blue', 'green', 'cyan', 'purple', 'orange'],
        list: [],
        instrument: '',
        pagination: {
          pageSize: 30,
          currentPage: 1
        }
      };
    },
    created () {
      this.change = debounce(this.change, this.delay);
    },
    mounted () {
      if(this.value) {
        this.findInstrunment(this.value)
      }
    },
    beforeDestroy() {
      document.body.removeEventListener('mousedown',this.mouseDown)
    },
    watch: {
      value(val) {
        if(!val) {
          this.list = [];
        }
        this.findInstrunment(val)
      },
      filterQuery (nVal, oVal) {
        let cur = JSON.stringify(nVal);
        let pre = JSON.stringify(oVal);
        if (oVal.length && cur != pre) {
          this.list = [];
          this.instrument = '';
          if (!this.init) {
            this.$emit('input', '');
            this.$emit('change', {})
          }
          this.init = false;
        }
        this.isMore = false
      },
      instrument (val) {
        if (!val) {
          this.list = [];
          this.$emit('input', '')
          if(this.$listeners.change) {
            this.$emit('change', {})
          }
        }
      }
    },
    computed: {
      filterRequired () {
        return this.filterQuery.filter(o => o.required)
      },
      filterEffective () {
        return this.filterQuery.filter(o => o.id)
      },
      isLost() {
        return this.filterQuery.some(item => {
          return (item.id===undefined || item.id==='' || item.id===null) && item.required}
        )
      }
    },
    methods: {
      addEventListener() {
        document.body.removeEventListener('mousedown',this.mouseDown)
        document.body.addEventListener('mousedown',this.mouseDown)
      },
      findInstrunment(val) {
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          if (val && !this.isSelectChange) {
            let data = await this.getInstrumentList(val);
            let value = data.find(item => (item.value == val));
            this.instrument = value && value.qctKey;
          } else {
            let value = this.list.find(item => (item.value == val));
            this.instrument = value && value.qctKey;
          }
          this.emitFn(this.instrument)
        }, 300)
      },
      async getInstrumentList (id) {
        this.loading = true;
        let params = this.keyName ? { [this.keyName]: this.instrument } : { qctKeyContains: this.instrument };
        id ? params.instrumentId = id : null;
        let filter = { isFilterEffectiveDate: id ? false : !this.allDate, pagination: this.pagination };
        this.filterQuery.forEach(data => {
          if (data.id) {
            filter[data.key] = data.id;
          }
        });
        Object.assign(params, filter);
        let res = await http.get(url, params, false);
        if (res.pagination && res.pagination.currentPage && res.pagination.currentPage > 1) {
          this.list.push(...res.data);
        } else {
          this.list = res.data;
        }
        if (id) {
          const data = res.data.length && res.data[0];
          if(this.$listeners.change) {
            this.$emit('change', data)
          }
          this.instrumentCopy = data && data['qctKey'];
        }
        this.loading = false;
        let resPage = res.pagination;
        if (resPage && resPage.pageCount > this.pagination.currentPage) {
          this.isMore = true;
        } else {
          this.isMore = false;
          this.pagination.currentPage = 1;
        }
        return res.data;
      },
      optionClick(e) {
        this.isSelectChange = true;
        if (this.list.length && this.list[0].qctKey === e.qctKey) {
          this.emitFn(e.qctKey);
        }
      },
      selected (val) {
        this.emitFn(val);
        this.isSelectChange = true;
      },
      change(val) {
        if(!val) {
          this.list = []
        }
        this.pagination.currentPage = 1
        if (val) {
          if (!this.isSelectChange && this.instrument.length > 2 && !this.isLost) {
            this.getInstrumentList();
          } else {
            this.isMore = false
          }
        } else {
          this.isMore = false
        }
      },
      emitFn(v) {
        let data = this.list.find(item => {
          return item.qctKey == v
        })
        if (data) {
          this.instrumentCopy = data.qctKey
          this.$emit('change', data)
          this.$emit('input', !this.keyName ? data.value : data[this.keyName])
          this.$refs.autocomplete.dispatch('FormItem', 'on-form-change', this.instrument);
        }
        this.isSelectChange= false
      },
      blur() {
        document.body.removeEventListener('mousedown',this.mouseDown)
      },
      hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
      },
      isAutocomplete(node) {
        if(this.hasClass(node, 'autocomplete_instument')) {
          return true
        }
        if(node.tagName.toLowerCase() != 'body') {
          return this.isAutocomplete(node.parentNode)
        } else {
          return false
        }
      },
      mouseDown(e) {
        let node =  event.srcElement || event.target
        this.inputElement = this.el.getElementsByTagName('input')[0];
        if(this.isAutocomplete(node)) {
          this.inputElement && this.inputElement.focus()
        } else {
          if(!this.value) {
            this.instrument = '';
          }
          this.inputElement && this.inputElement.blur()
          if(!this.isSelectChange && this.value) {
            this.instrument = this.instrumentCopy
          }
        }
      },
      loadMore () {
        this.pagination.currentPage++;
        this.getInstrumentList();
      }
    }
  };
</script>

<style lang="less" scoped>
  .InstrumentSelect {
    font-size: 12px;
    padding: 5px 10px;

    h5 {
      font-weight: bold;
      font-size: 14px;
    }

    .bottom {
      border-bottom: 1px solid #eee;
      margin-bottom: 5px;
      padding-bottom: 5px;
    }

    .body {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        margin-bottom: 5px;
        padding-bottom: 5px;
      }

      .list {
        overflow-y: auto;

        .nodata {
          text-align: center;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
        }

        .more {
          text-align: center;
          padding: 5px 0
        }
      }
    }
    .bottom {
      text-align: center;
    }
    .filter {
      .option {
        margin-top: 10px;
        align-items: center;
      }
    }
    .divider{
      position: relative;
      margin: 8px 0;
      color: #aaa;
      &:before {
        display: inline-block;
        content: '';
        width: 100%;
        border-bottom: 1px solid #e8eaec;
        position: absolute;
        top: 50%;
      }
      &:after {
        display: inline-block;
        content: attr(title);
        // width: 100%;
        height: 20px;
        background: #fff;
        left: 50%;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
        color: inherit;
        padding: 0px 8px;
        transform: translateX(-50%);
      }
    }
  }
</style>
