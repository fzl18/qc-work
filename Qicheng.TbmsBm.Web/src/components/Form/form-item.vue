<template>
  <div :class="classes">
    <label :class="[prefixCls + '-label']" :for="labelFor" :style="labelStyles" v-if="label || $slots.label"><slot name="label">{{ label }}{{ FormInstance.colon }}</slot></label>
    <div :class="[prefixCls + '-content']" :style="contentStyles">
      <div v-width><slot ></slot></div>
      <transition name="fade">
        <div :class="[prefixCls + '-error-tip']" :style="{'right': right + 'px'}" v-if="validateState === 'error' && showMessage && FormInstance.showMessage">{{ validateMessage }}</div>
      </transition>
    </div>
  </div>
</template>
<script>
import {FormItem} from 'view-design'
import AsyncValidator from 'async-validator';
const cn = {
  required: '不能为空',
};
export default {
  extends: FormItem,
  data() {
    return{
      right: 20
    }
  },
  directives: {
    width: {
      inserted(el, binding, Vnode) {
        setTimeout(() => {
          let appedEl = el.getElementsByClassName('ivu-input-group-append')
          let dis = appedEl[0] && appedEl[0].getBoundingClientRect().width + 5
          if(typeof dis == 'number') {
            Vnode.context.right = appedEl[0] && appedEl[0].getBoundingClientRect().width + 5
          }
        })
      },
      componentUpdated(el, binding, Vnode) {
        setTimeout(() => {
          let appedEl = el.getElementsByClassName('ivu-input-group-append')
          let dis = appedEl[0] && appedEl[0].getBoundingClientRect().width + 5
          if(typeof dis == 'number') {
            Vnode.context.right = appedEl[0] && appedEl[0].getBoundingClientRect().width + 5
          }
        })
      }
    }
  },
  methods: {
    dealrule (rules) {
      return rules.map(rule => {
        if (!rule.message ||  !rule.type) {
          if (rule.min != undefined) {
            rule.type = 'number';
            rule.message = `不能小于${rule.min}`;
          }
          if (rule.max != undefined) {
            rule.type = 'number';
            rule.message = `不能大于${rule.max}`;
          }
          if (rule.required) {
            rule.message = '不能为空';
            if(this.fieldValue) {
              rule.type = typeof this.fieldValue
            }
          }
          if (!rule.trigger) {
            rule.trigger = 'change';
          }
        }
        if (typeof rule.validator == 'function') {
          rule.message = null;
        }
        if (rule.type == 'number') {
          rule.transform = function (value) {
            if(value == '') {
              return ''
            }
            return Number(value);
          };
        }
        return rule;
      });
    },
    validate(trigger, callback = function () {}) {
      let rules = this.dealrule(this.getFilteredRule(trigger));
      if (!rules || rules.length === 0) {
        if (!this.required) {
          callback();
          return true;
        }else {
          rules = [{required: true}];
        }
      }
      this.validateState = 'validating';
      let descriptor = {};
      descriptor[this.prop] = rules;
      const validator = new AsyncValidator(descriptor);
      validator.messages(cn);
      let model = {};
      model[this.prop] = this.fieldValue;
      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error';
        this.validateMessage = errors ? errors[0].message : '';
        callback(this.validateMessage);
        this.FormInstance && this.FormInstance.$emit('on-validate', this.prop, !errors, this.validateMessage || null);
      });
      this.validateDisabled = false;
    },
  },
}
</script>
