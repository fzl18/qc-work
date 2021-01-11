import _ from 'lodash';
import moment from 'moment';
import store from '@/store';

const utilMethods = {
  //textCode
  showText (arr, value, textCode = 'text', valueCode = 'value') {
    let text = '';
    let item = _.find(arr, (d) => {
      return d[valueCode] == value;
    });
    if (item) {
      text = item[textCode];
    }
    return text;
  },
  formatDate (dateString, format = 'YYYY-MM-DD') {
    if (dateString) {
      let m = moment(dateString);
      if (m.isValid()) {
        return m.format(format);
      } else {
        return dateString;
      }
    } else {
      return '';
    }
  },
  formatNum (amount, thousands = ',', fixed = 4) {
    if ([null, undefined].includes(amount)) {
      return '';
    }
    if(typeof thousands == 'number') {
      fixed = thousands
      thousands = ','
    }
    amount = amount || 0;
    let decimals = amount.toString().split('.')[1]
    if(decimals && decimals.length > fixed) {
      amount = Math.round(Number(amount) * Math.pow(10, fixed)) / Math.pow(10, fixed)
    }
    amount = Number(amount).toFixed(fixed)
    let numAmount = Number(amount).toString();
    let value2Array = numAmount.split('.');
    if (value2Array.length >= 1) {
      let intPart = value2Array[0];
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + thousands);
      if (value2Array.length === 2) {
        let floatPart = value2Array[1];
        return intPartFormat + '.' + floatPart;
      } else if (value2Array.length === 1) {
        return intPartFormat;
      }
    }
  },
  hasPermission (privilege) {
    return true
    if (!privilege || privilege == 0) {
      return true
    }
    if (store.getters['user/getPermission'].indexOf(privilege.toLowerCase()) > -1) {
      return true
    }
    return false
  },
  param (obj) {
    let paramList = [];
    for (var key in obj) {
      let p = `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      paramList.push(p);
    }
    if (!paramList.length) {
      return '';
    } else {
      return `?${paramList.join('&')}`;
    }
  },
  createButton(h, buttons) {

    /**
     * @params {buttons} Array
     * @example[{
     *    name: 'Button',
            icon: 'md-create',
            type： 'primary'
            isShow: utils.hasPermission('hf_UpdateHedgePlan') && this.$route.name !== 'instructionCreate',
            event:  () => that.onEdit(param),
            content: that.$t('modify'),
            buttonText: '查看'
     * }]
     *
     */
    let nodeArry = []; let dropdownArry = [];
    let newButtons = buttons.filter((o) => o.isShow || o.isShow == undefined)
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
              color: o.color ? o.color : '#515a6e'
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
        }, [bt])
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
            }, [
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
            }, o.content
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

  /**
   ** 加
   **/
  add(arg1, ...arg2) {
    return;
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', '')) * cm;
      } else {
        arg1 = Number(arg1.toString().replace('.', '')) * cm;
        arg2 = Number(arg2.toString().replace('.', ''));
      }
    } else {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
  },

  /**
   ** 减
   **/
  subtract (arg1, ...arg2) {
    return;
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
  },
  multiply (arg1, ...arg2) {
    return;
    var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length;
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  },
  divide (arg1, ...arg2) {
    return;
    var t1 = 0; var t2 = 0; var r1; var r2;
    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },
  formatAmount(number, options) {
    if ([null, undefined].includes(number)) {
      alert(1)
      return ''
    }
    if(Number.isNaN(Number(number))) return ''
    // eslint-disable-next-line no-undef
    return accounting.formatMoney(number, Object.assign({
      symbol: '',
      precision: 2,
      format: {
        pos: '%s %v',
        neg: '%s -%v',
        zero: '%s 0'
      }
    }, options || {}))
  },
  getRecentDate (flag, fromDate, day) {

    /**
     * @method getRecentDate
     * @param{number}flag -1 向后寻找最近日期
     * @param{Date}fromDate  参考的时间点
     * @param{number}day  具体需要的天数
     * @return {Date} 返回制定最近的日期
     */
    if (typeof flag !== 'number' || Math.abs(flag) > 1) throw Error('flag 取值为1或-1');
    if (!day && fromDate) {
      day = fromDate;
      fromDate = Date.now();
    } else if (!fromDate) {
      throw Error('fromDate 为日期类型');
    } else if (Object.prototype.toString.call(fromDate) !== '[object Date]') {
      throw Error('fromDate 为日期类型');
    } else {
      fromDate = new Date(fromDate).getTime();
    }
    return fromDate + day * 1000 * 24 * 3600 * flag;
  },

  /**
   * 处理commonData中的枚举对象
   * @param data commonData
   * @param keyArr enums key
   * @returns {*}
   */
  dealWithEnums (data, keyArr) {
    function findKey (obj, value, compare = (a, b) =>  a == b) {
      return Object.keys(obj).find(k => compare(obj[k], value))
    }
    _.forEach(keyArr, flag => {
      data[`${flag}Options`] = _.cloneDeep(data[flag]);
      if (data[flag]) {
        Object.keys(data[flag]).map(key => {
          if (data[flag][key]._Notes) {
            data[flag][key] = Object.keys(data[flag][key]._Notes).map(
              item => {
                return {
                  value: item,
                  text: data[flag][key]._Notes[item],
                  emunflag: findKey(data[flag][key], +item)
                };
              }
            );
          }
        });
      }
    });
    return data;
  },

  /**
   * 将小数位大于4位的数字转换成4位小数 小于等于四的保留原来小数位数 返回字符串
   * @param num
   * @returns {string}
   */
  formatDecimal (num) {
    if (_.isNil(num)) return '';
    let index = String(num).indexOf('.') + 1;
    if (!index) {
      return num.toFixed(0)
    } else {
      return String(num).length - index > 4 ? Number(num).toFixed(4) : Number(num).toFixed(String(num).length - index)
    }
  },
  filterCommondata (list) {
    return list && list.filter(item => !item.isDisabled)
  },
  saveQuery(query, type) {
    let page = sessionStorage.getItem('page')
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
    let querys =  JSON.parse(sessionStorage.getItem('querys')) || {}
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

  dealWithAuths(list, moduleList, key) {
    let modulesArr = []
    _.each(list, function (val) {
      modulesArr.push(val[key])
    })
    let type = _.uniq(modulesArr)
    let newList = []
    let emus = _.groupBy(moduleList, 'value')
    _.forEach(type, d => {
        newList.push({ [key]: d, text: emus[d] && emus[d][0].text, item:[]})
    })
    _.forEach(newList, function (d, i) {
        _.forEach(list, function (item) {
            if (item[key] === d[key]) {
                newList[i]['item'].push(item)
            }
        })
    })

    return newList  //data
  },

  cleanEmpty (o) {
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
  }
};
export const utils = utilMethods;
