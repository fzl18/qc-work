let events = ['click', 'touchstart', 'touchmove', 'touchend']
function getType(data) {
  return Object.prototype.toString.call(data)
}
function _createElement(tag) {
  return document.createElement(tag)
}
function createElement(tag, data, children) {
  let tags = ['div', 'span', 'button', 'i', 'p', 'a']
  if(!tags.includes(tag)) throw Error('标签名称有误')
  let element = _createElement(tag)
  if(getType(data) == '[object Object]') {
    Object.keys(data).forEach(attr => {
      if(attr === 'class') {
        if(getType(data[attr]) === '[object Object]') {
          let className = Object.keys(data[attr]).filter(c => data[attr][c]).join(' ')
          element.className = className
        } else if(getType(data[attr]) === '[object String]') {
          element.className = data[attr]
        }
      }
      if(attr === 'style') {
        if(getType(data[attr]) === '[object Object]') {
          Object.keys(data[attr]).forEach(style => {
            element.style[style] = data[attr][style]
          })
        }
      }
      if(attr === 'attrs') {
        if(getType(data[attr]) === '[object Object]') {
          Object.keys(data[attr]).forEach(i => {
            element.setAttribute(i, data[attr][i])
          })
        }
      }
      if(attr === 'on') {
        if(getType(data[attr]) === '[object Object]') {
          Object.keys(data[attr]).forEach(i => {
            if(events.includes(i)) {
              element.addEventListener(i, function() {
                data[attr][i].call(this)
              }, false)
            }
          })
        }
      }
    })
  }
  if(children === undefined && getType(data) !== '[object Object]') {
    children = data
  }
  if(getType(children) === '[object Array]') {
    let frag = document.createDocumentFragment();
    children.forEach(child => {
      if(getType(child) === '[object String]') {
        frag.appendChild(document.createTextNode(child))
      }
      if(getType(child) === '[object HTMLElement]' || getType(child) === '[object HTMLButtonElement]') {
        frag.appendChild(child)
      }
    })
    element.appendChild(frag)

  }
  if(getType(children) === '[object String]') {
    element.appendChild(document.createTextNode(children))
  }
  return element
}

export default createElement