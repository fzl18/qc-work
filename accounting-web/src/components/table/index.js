import {Table} from 'view-design'
export default {
  data() {
    return{
      maxHeight: null
    }
  },
  render: function(h) {
    return h(Table, {
      props: {'max-height': this.maxHeight, ...this.$attrs},
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      slots: this.$slots
    })
  },
}
