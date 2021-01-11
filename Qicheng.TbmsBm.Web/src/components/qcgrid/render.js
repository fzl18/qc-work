
import Vue from 'vue'
export default (el) => {
  let vm
  if(el instanceof Array) {
    vm = new Vue({
      render: (h) => {
        return h('div', el)
      }
    })
  } else {
    vm = new Vue({
      render: () => {
        return el
      }
    })
  }
  return vm.$mount().$el
}