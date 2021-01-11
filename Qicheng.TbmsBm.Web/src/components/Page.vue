<template>
  <div class="qcpage">
      <Page
        :current="current"
        :total="total"
        :show-total="showTotal"
        :page-size="pageSize"
        :page-size-opts="pageSizeOpts"
        :size="size"
        @on-change="onPageChange"
      >
        </Page>
       &nbsp;
        <Dropdown style="width:70px" trigger="custom" @on-click='selectOption($event)' :visible="visible">
          <Input v-getElement v-model="pageSizePri" style="width:70px"  :size="size" @on-blur="blur" @on-keydown.enter="enter" @input="handleInput" @click.native="handleOpen"></Input>
            <DropdownMenu slot="list" >
                <DropdownItem style="width:70px"  :name='item' :selected='pageSizePri == item'  v-for='(item, index) in pageSizeOpts' :value='item' :key='index'>{{item}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
   &nbsp;
        条/页
  </div>
</template>
<script>
import {Page} from 'view-design'
import debounce from 'lodash/debounce';
export default {
  components: {Page},
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 15
    },
    'show-total': {
      type: Boolean,
      default: false
    },
    'page-size': {
      type: Number,
      default: 15
    },
    'page-size-opts': {
      type: Array,
      default: () => [15, 30, 50]
    },
    size: [String],
  },
  data() {
    return {
      page: '',
      pageSizePri: 15,
      visible: false
    }
  },
  directives: {
    'getElement'(el, binding, vNode) {
      vNode.context.el = el
    }
  },
  watch: {
    pageSize(e) {
      if(e && this.pageSizePri != e) {
        this.pageSizePri = +e
      }
    }
  },
  mounted() {
    let that = this
    this.pageSizePri = this.pageSizeOpts ? +this.pageSizeOpts[0] : 15
    this.input = this.el.getElementsByTagName('input')[0]
  },
  methods: {
    enter(e) {
      this.input.blur()
    },
    handleOpen() {
      if(this.pageSizePri) {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    handleInput() {
      this.inputflag = true
    },
    selectOption(e) {
      this.pageSizePri = e
      this.visible = false

      this.$emit('on-page-size-change', +this.pageSizePri)
      this.$emit('on-change', 1)
    },
    blur() {
      this.visible = false
      if(this.inputflag) {
        if(this.pageSizePri) {
          this.pageSizePri = +this.pageSizePri > 500 ? 500 : +this.pageSizePri
          this.$emit('on-page-size-change', +this.pageSizePri)
          this.$emit('on-change', 1)
        } else {
          this.pageSizePri = this.pageSize
        }
      }
      this.inputflag = false
    },
    onPageChange(e) {
      this.$emit('on-change', e)
    }
  }
}
</script>
<style lang="less" scoped>
.qcpage{
  display:flex;
  margin-top: 5px;
  align-items:center
}
</style>