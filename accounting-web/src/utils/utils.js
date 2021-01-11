import _ from 'lodash'
import moment from 'moment'
import store from '@/store'
// let querys =  JSON.parse(sessionStorage.getItem('querys')) || {}
const utilMethods = {

    // 日期区间选择 查询转换为 字符串 output: '2020.02 - 2020.03'
    dateRangeToKebabCase(source) {
        if (source.length === 0) {
            return '';
        }
        const [ start, end ] = source.map(t => utils.formatDate(t));
        return (start && end) ? `${start} - ${end}` : '';
    },

    //textCode
    showText(arr, value, textCode = 'text', valueCode = 'value') {
        if ([null, 'null', undefined, 'undefined'].includes(value)) {
            return ''
        }
        let text = value;
        textCode = textCode || 'text';
        valueCode = valueCode || 'value';
        let item = _.find(arr, (d) => {
            return d[valueCode] == value;
        })
        if (item) {
            text = item[textCode]
        }else{
            text = typeof value == 'number' ? '' : value
        }
        return text
    },
    formatDate(dateString, format = 'YYYY-MM-DD') {
        if (dateString) {
            let m = moment(dateString);
            if (m.isValid()) {
                return m.format(format);
            } else {
                return dateString;
            }
        } else {
            return ''
        }
    },
    formatNum(amount, thousands = ',') {
        if ([null, undefined].includes(amount)) {
            return ''
        }
        amount = amount || 0;
        let numAmount = Number(amount).toString();
        // let fixedAmount = numAmount.toFixed(scale);
        let value2Array = numAmount.split(".");
        if (value2Array.length >= 1) {
            let intPart = value2Array[0];
            let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + thousands)
            if(Number.isNaN(intPartFormat)) {
                return ''
            }
            if (value2Array.length === 2) {
                let floatPart = value2Array[1]
                return intPartFormat + "." + floatPart
            } else if (value2Array.length === 1) {
                return intPartFormat
            }
        }
    },
   
    hasPermission(privilege) {
        if (!privilege || privilege == 0) {
            return true
        }
        let permissions = store.state.userPermissions;
        if (!permissions || !permissions.length) {
            return false
        }
        if (store.getters['getPermission'].indexOf(privilege.toLowerCase()) > -1) {
            return true
        }
        return false
    },
    param(obj) {
        let paramList = [];
        for (var key in obj) {
            let p = `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
            paramList.push(p);
        }
        if (!paramList.length) {
            return '';
        } else {
            return `?${paramList.join('&')}`
        }
    },
    cleanEmpty(o) {
        if (o === null || o === undefined || _.isFunction(o) || o === '') {
            return o;
        } else {
            let obj = _.clone(o);
            if (_.isDate(obj) || _.isBoolean(obj) || _.isNumber(obj) || _.isString(obj)) {
                return;
            } else if (_.isArrayLike(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    this.cleanEmpty(obj[i]);
                }
            } else if (_.isObject(obj)) {
                for (var prop in obj) {
                    var v = obj[prop];
                    this.cleanEmpty(v);

                    if (v === null || v === undefined || _.isFunction(v) || v === '' ||
                        !(_.isDate(v) || _.isBoolean(v) || _.isNumber(v) || _.isString(v)) &&
                        (_.isArrayLike(v) || _.isObject(v)) &&
                        _.isEmpty(v)) {
                        delete obj[prop];
                    }
                }
            }
            return obj
        }
    },
    /**
     ** 加
     **/
    add(arg1, ...arg2) {
        return;

        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    },
    /**
     ** 减
     **/
    subtract(arg1, ...arg2) {
        return;
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
    },
    multiply(arg1, ...arg2) {
        return;
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {}
        try {
            m += s2.split(".")[1].length;
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    divide(arg1, ...arg2) {
        return;
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {}
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },
    formatAmount(number, options) {
        if ([null, undefined].includes(number)) {
            return ''
        }
        if(Number.isNaN(Number(number))) return ''
        // eslint-disable-next-line no-undef
        return accounting.formatMoney(number, Object.assign({
            symbol: '',
            precision: 2,
            format: {
                pos: "%s %v",
                neg: "%s -%v",
                zero: "%s 0"
            }
        }, options || {}))
    },
    numberToBoolean(num) {
        if (typeof num === "number") {
            return num === 1;
        }
        return num;

    },
    booleanToNumber(bo) {
        if (typeof bo === "boolean") {
            return bo ? 1 : 0;
        }
        return bo;
    },
    /**
     * 获取/保存查询条件
     * @param query 查询条件对象
     * @param type get为获取数据 不传则为保存
     * @returns {*}
     */
    saveQuery(query, type) {
        let page = sessionStorage.getItem('page');
        // query[i]数据为时间的统一进行格式化处理
        for(let i in query) {
            if (Object.prototype.toString.call(query[i]) == '[object Date]') {
                query[i] = this.formatDate(query[i], 'YYYY-MM-DD HH:mm:ss');
            }
            if (Object.prototype.toString.call(query[i]) == '[object Array]') {
                query[i] = query[i].map(item => {
                    if (Object.prototype.toString.call(item) == '[object Date]') {
                        item = this.formatDate(item, 'YYYY-MM-DD HH:mm:ss');
                    }
                    return item;
                });
            }
        }
        let querys = JSON.parse(sessionStorage.getItem('querys')) || {};
        if(type == 'get') {
            if(querys[page]) {
                return querys[page]
            } else {
                return query
            }
        }
        if(!querys[page] || querys[page] != query) {
            querys = {}
            querys[page] = query
        }
        sessionStorage.setItem('querys', JSON.stringify(querys))
    },
    filterDisable(list) {
        console.log(list)
        return list.filter(e => !e.isDisabled)
    },
    /**
     * 操作栏多按钮显示控制
     * @param {*} h 
     * @param {*} buttons 
     */
    createButton(h, buttons) {
        /**
         * @params {buttons} Array
         * @example[{
         *    name: 'Button',
                icon: 'md-create',
                type： 'primary'
                isShow: utils.hasPermission('hf_UpdateHedgePlan') && this.$route.name !== 'instructionCreate',
                event:  () => _this.onEdit(param),
                content: _this.$t('modify'),
                buttonText: '查看'
         * }]
         *
         */
        let nodeArry = [], dropdownArry =[];
        let newButtons = buttons.filter((o) => o.isShow)
        let buttonLength = newButtons.length
    
        function innerButton(o) {
          if(o.buttonText) {
            nodeArry.push(
              h(o.name, {
                props: {
                  size: 'small',
                  icon: o.icon || null,
                  type: o.type || null
                },
                style: {
                  marginRight: '3px',
                },
                on: {
                  click: () => {
                    o.event()
                  }
                }
              }, o.buttonText)
            )
          } else {
            let bt;
            if (o.href) {
              bt = <a
                target='_blank'
                href={o.href}>
                {h(o.name, {
                  props: {
                    size: 'small',
                    icon: o.icon || null,
                    type: o.type || null
                  },
                  style: {
                    marginRight: '3px',
                  },
                  nativeOn: {
                    click: () => {
                      tooltip.child && tooltip.child.handleClosePopper();
                      o.event();
                    }
                  }
                })}
              </a>;
            } else {
              bt = h(o.name, {
                props: {
                  size: 'small',
                  icon: o.icon || null,
                  type: o.type || null
                },
                style: {
                  marginRight: '3px',
                  color: o.icon.indexOf('trash') != -1 ? 'red' : '#515a6e'
                },
                nativeOn: {
                  click: () => {
                    tooltip.child && tooltip.child.handleClosePopper();
                    o.event();
                  }
                }
              });
            }
            let tooltip = h('Tooltip', {
              props: {
                content: o.content,
                placement: 'top',
                transfer: true,
              }
            },[ bt ])
            nodeArry.push(tooltip)
          }
        }
        function outerButton(o) {
          if(o.buttonText) {
            dropdownArry.push(
              h(
                'DropdownItem', {
                  nativeOn: {
                    'click': () => {
                      o.event()
                    }
                  }
                },[
                  h(o.name, {
                    props: {
                      size: 'small',
                      icon: o.icon || null,
                      type: o.type || null
                    },
                    style: {
                      marginRight: '3px',
                    },
                    on: {
                      click: () => {
                        o.event()
                      }
                    }
                  }, o.buttonText)
                ]
              )
            )
          } else {
            dropdownArry.push(
              h(
                'DropdownItem', {
                  nativeOn: {
                    'click': () => {
                      o.event()
                    }
                  }
                },o.content
              )
            )
          }
        }
        newButtons.forEach((o, i) => {
          if(buttonLength <= 4) {
            innerButton(o)
          } else {
            if (i < 3) {
              innerButton(o)
            } else {
              outerButton(o)
            }
          }
        });
        if(buttonLength > 4) {
          nodeArry.push(
            h('Dropdown', {
              props: {
                transfer: true,
                'transfer-class-name': 'hh'
              }
            }, [
              h('Button', {
                props: {
                  size: 'small'
                }
              }, '...'),
              h('DropdownMenu', {
                slot: 'list'
              }, dropdownArry),
            ])
          )
        }
        return nodeArry
    },
}
export const utils = utilMethods
