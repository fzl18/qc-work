function getStyle(ele, cla) {
  return window.getComputedStyle ? window.getComputedStyle(ele, cla || null) : ele.currentStyle;
}
export default (Vue) => {
  Vue.directive('title',{
     inserted(el, binding, vnode) {
      setTimeout(() => {
        let wrap = document.createElement('div')
        wrap.style.cssText = 'display:inline-block;position: absolute; opacity:0;left:-1000px'
        let innerHTML = el.innerHTML
        wrap.innerHTML = innerHTML
        document.body.appendChild(wrap)
        let wrapWidth = wrap.getBoundingClientRect().width
        let style = getStyle(el)
        let lrPadding = parseInt(style.paddingLeft) + parseInt(style.paddingRight)
        if(el.getBoundingClientRect().width - lrPadding < wrapWidth){
          el.setAttribute('title', innerHTML)
        } else {
          el.removeAttribute('title')
        }
      }, 10)
    },
    componentUpdated(el, binding, vnode) {
      setTimeout(() => {
        let wrap = document.createElement('div')
        wrap.style.cssText = 'display:inline-block;position: absolute; opacity:0;left:-1000px'
        let innerHTML = el.innerHTML
        wrap.innerHTML = innerHTML
        document.body.appendChild(wrap)
        let wrapWidth = wrap.getBoundingClientRect().width
        let style = getStyle(el)
        let lrPadding = parseInt(style.paddingLeft) + parseInt(style.paddingRight)
        if(el.getBoundingClientRect().width - lrPadding < wrapWidth){
          el.setAttribute('title', innerHTML)
        } else {
          el.removeAttribute('title')
        }
      }, 10)
    },
  })
  Vue.directive('maxHeight', {
    inserted(el, binding, vNode){
      let minheight = binding.value || 0
      setTimeout(() => {
        if(vNode.componentInstance.$options.name == "QcGrid") {
          if(vNode.componentInstance.$options.propsData.height) {
            vNode.componentInstance.maxHeight = Math.max(minheight,vNode.componentInstance.$options.propsData.height)  + 'px'
          } else {
            let bodyHeight = document.body.getBoundingClientRect().height
            let tableTop = el.getBoundingClientRect().top
            let dis = +vNode.componentInstance.$attrs.bottomDistance || 80
            vNode.componentInstance.maxHeight = Math.max(minheight, bodyHeight - tableTop - dis) + 'px'
          }
          return
        }
        // if(!vNode.componentInstance.$attrs.maxHeight) {
          let bodyHeight = document.body.getBoundingClientRect().height
          let tableTop = el.getBoundingClientRect().top
          let dis = +vNode.componentInstance.$attrs.bottomDistance || 70
          vNode.componentInstance.maxHeight = Math.max(minheight, bodyHeight - tableTop - dis) 
        // }
      })
    },
    componentUpdated(el, binding, vNode){
      let minheight = binding.value || 0
      setTimeout(() => {
        let children = vNode.componentInstance.$parent.$children
        let dat = 0
        for(let i=0;i<children.length;i++) {
          if(children[i].$options.name == 'Collapse') {
            dat = children[i].dat
            if(!children[i].forceUpdate) {
              return
            } else {
              children[i].forceUpdate = false
            }
          }
        }
        if(vNode.componentInstance.$options.name == "QcGrid") {
          if(vNode.componentInstance.$options.propsData.height) {
            vNode.componentInstance.maxHeight =Math.max(minheight,vNode.componentInstance.$options.propsData.height) + 'px'
          } else {
            let bodyHeight = document.body.getBoundingClientRect().height
            let tableTop = el.getBoundingClientRect().top
            let dis = +vNode.componentInstance.$attrs.bottomDistance || 80
            vNode.componentInstance.maxHeight = Math.max(minheight, bodyHeight - tableTop - dis + dat )+ 'px'
          }
          return
        }
        // if(!vNode.componentInstance.$attrs.maxHeight) {
          let bodyHeight = document.body.getBoundingClientRect().height
          let tableTop = el.getBoundingClientRect().top
          let dis = +vNode.componentInstance.$attrs.bottomDistance || 70
          vNode.componentInstance.maxHeight = Math.max(minheight, bodyHeight - tableTop - dis + dat)
        // }
      })
    }
  })
  Vue.directive('clickOutside', {
      bind (el, binding, vnode) {
          function documentHandler (e) {
              if (el.contains(e.target)) {
                  return false;
              }
              if (binding.expression) {
                  minheight(e, el);
              }
          }
          el.__vueClickOutside__ = documentHandler;
          document.addEventListener('click', documentHandler);
      },
      update () {

      },
      unbind (el, binding) {
          document.removeEventListener('click', el.__vueClickOutside__);
          delete el.__vueClickOutside__;
      }
  })
}
