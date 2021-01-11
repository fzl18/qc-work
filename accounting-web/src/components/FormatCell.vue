<template>
  <Row type="flex" :style="inline?{'display': 'inline-flex'}:''" :justify="justify" :key="uniqKey" align="middle">
    <Col v-if="label">{{label}}</Col>
    <Col v-if="needFormatter" :style="{ color: amountNum < 0 ? 'red': '' }">{{formatter(amountNum)}}{{unit}}</Col>
    <Col v-else :style="{ color: amountNum < 0 ? 'red': '' }">{{amountNum}}</Col>
  </Row>
</template>

<script>
  import { utils } from '@/utils/utils';

  /**
   * props: {
   *   label: 描述
   *   num: 数字 【必传】
   *   needFormatter: 是否需要格式化金额，默认 true 是
   *   justify: 分布方式, 默认 end 右对齐 跟`iView` `Row` 组件props: `justify`保持一致, 可选值为【start, end, center, space-around, space-between】
   * }
   */
  export default {
    name: 'FormatCell',
    props: {
      label: {
        type: String,
        default: ''
      },
      uniqKey: {
        type: String,
        default: ''
      },
      num: {
        type: [ String, Number ],
        default: ''
      },
      needFormatter: {
        type: Boolean,
        default: true
      },
      justify: {
        type: String,
        default: 'end'
      },
      fixed: {
        type: [Number, Boolean],
        default: 2
      },
      inline: {
        type: [Boolean],
        default: false
      }
    },
    data() {
      return {
        defaultSlot: null
      }
    },
    mounted() {
      this.defaultSlot = this.$slots.default
    },
    updated() {
      this.defaultSlot = this.$slots.default
    },
    computed:{
      amountNum() {
        if(this.defaultSlot) {
          return this.defaultSlot[0].text.trim() ? parseFloat(this.defaultSlot[0].text.trim()): ''
        } else {
          return parseFloat(this.num)
        }
      },
      unit() {
        if(!this.amountNum && this.amountNum != 0) return  ''
        if(this.defaultSlot) {
          return this.defaultSlot[0].text.trim().substr(String(this.amountNum).length)
        } else {
          return String(this.num).trim().substr(String(this.amountNum).length)
        }
      }
    },
    methods: {
      formatter(value) {
        if(this.fixed == false && this.fixed !== 0) return value
        if(value === undefined || value === null || value === '') return null
        if(this.fixed === false) return value
        return utils.formatAmount(value, {
          precision: this.fixed
        });
      }
    }
  };
</script>

<style scoped>

</style>
