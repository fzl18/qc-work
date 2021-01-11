import {Table} from 'view-design'
export default {
  data() {
    return{
      maxHeight: null
    }
  },
  beforeCreate() {
    if(this.$attrs.isDisabledKey) {
      this.key = this.$attrs.isDisabledKey
    } else {
      this.key = 'isDisabled'
    }
  },
  mounted() {

  },
  methods: {
    rowClassName(row) {
      if(row[this.key] === true || row[this.key] === 'true') {
        return 'IsDisabled'
      } else {
        return
      }
    }
  },
  render: function(h) {
    return h(Table, {
      props: {maxHeight: this.maxHeight, 'row-class-name': this.rowClassName, ...this.$attrs},
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      slots: this.$slots
    })
  },
}
