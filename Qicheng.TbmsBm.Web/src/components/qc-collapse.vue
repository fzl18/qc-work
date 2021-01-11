<template>
    <div class="collapse">
         <!-- <Button @click="expand" type='primary' class="expendBtn">展开</Button> -->
         <div ref='expand' @transitionend="transitionend" v-getHeight :style="{'height': height2+'px'}"  class="expand">
           <slot></slot>
         </div>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'Collapse',
  data () {
    return {
      collapse: false,
      height: null,
      collapseHeight: 0,
      dat: 0,
      forceUpdate: false
    };
  },
  computed: {
    height2 () {
      if(!this.height) return null
      if(!this.collapse) return this.height
      if(this.collapse) return this.collapseHeight
      return null
    }
  },
  props: {
    hiddenBar: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    let vm = new Vue({
      render: () => {
        return  <div onClick={this.expand}  type='primary' class="expendBtn">
          <svg t="1601023155313" class={this.collapse ? 'icon collapse_icon collapse_icon_transfer' : 'icon collapse_icon' } viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3122" width="16" height="16"><path d="M910.222222 796.444444c-17.066667 0-34.133333-5.688889-45.511111-17.066666L551.822222 409.6c-11.377778-5.688889-17.066667-11.377778-34.133333-11.377778-5.688889 0-22.755556 5.688889-28.444445 11.377778l-329.955555 364.088889c-22.755556 22.755556-56.888889 22.755556-79.644445 5.688889-22.755556-22.755556-22.755556-56.888889-5.688888-79.644445l329.955555-364.088889c28.444444-34.133333 73.955556-51.2 119.466667-51.2s85.333333 22.755556 119.466666 56.888889l312.888889 364.088889c22.755556 22.755556 17.066667 56.888889-5.688889 79.644445-11.377778 5.688889-28.444444 11.377778-39.822222 11.377777z" p-id="3123" fill="#707070"></path></svg>
        </div>
      }
    })
    let body = document.body
    body.style.position = 'relative'
    this.el = vm.$mount().$el
    document.body.appendChild(this.el)
    this.mainView = document.querySelector('.mainView')
  },
  directives: {
    'getHeight': {
      inserted(el, binding, vNode) {
        setTimeout(() => {
          let height = el.getBoundingClientRect().height
          vNode.context.height = height
        })
      }
    }
  },
  methods: {
    transitionend (e) {
      if(e.propertyName == 'height') {
        if(!this.collapse) {
          this.$refs.expand.style.overflow = ''
        }
        clearTimeout(this.time)
        this.time = setTimeout(() => {
          this.mainView.style.overflow = 'hidden auto'
        }, 200)
      }
    },
    expand() {
      this.collapse = !this.collapse
      if(this.collapse) {
        this.dat =   this.height - this.collapseHeight
        this.$refs.expand.style.overflow = 'hidden'
      } else {
        this.dat = this.collapseHeight - this.height
        if(this.hiddenBar) {
          this.mainView.style.overflow = 'hidden'
        }
      }
      this.forceUpdate = true
      this.$parent.$forceUpdate()
    }
  },
  watch: {

  },
  destroyed() {
    document.querySelector('.mainView').style.overflowY = 'hidden auto'
    document.body.removeChild(this.el)
  }
};
</script>
<style lang="less">
    .collapse{
        position: relative;
        .expand {
            margin: 10px 0;
            transition: height  .3s linear;
        }

    }
    .collapse_icon {
        transform: rotate(0deg);
        transition: all 0.3s;
        transform-origin: center;
    }
    .collapse_icon_transfer{
        transform: rotate(180deg);
    }
    .expendBtn {
        position: absolute;
        top: 55px;
        right: 17px;
        z-index: 7;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
</style>