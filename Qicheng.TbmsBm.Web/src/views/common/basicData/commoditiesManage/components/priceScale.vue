<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" title="价格精度" width="500">
      <Form :model="form" label-position="right" :label-width="80" ref="form">
        <Row>
          <Col  span="24" class-name="margin-bottom-10">
            <FormItem label="主量单位" prop="unitId" required>
              <Select
                transfer
                placeholder
                disabled
                v-model="form.unitId"
              >
                <Option
                  v-for="(item, index) in commonData.units"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem :label="$t('精度')" prop="englishName">
              <Input v-model="form.englishName" placeholder/>
            </FormItem>
          </Col>
          <Col  span="24" class-name="margin-bottom-10">
            <FormItem label="币种" prop="currencyId" required>
              <Select
                transfer
                placeholder
                filterable
                clearable
                v-model="form.currencyId"
              >
                <Option
                  v-for="(item, index) in commonData.currencies"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowModal = !isShowModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
    <property-config ref="propertyConfigModal"></property-config>
  </div>
</template>

<script>
import api from '../api'
import { utils } from '@/utils/utils'
import propertyConfig from './propertyConfig'
export default {
  components: {propertyConfig},
  props: {
    commonData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowModal: false,
      defaultForm: {
        accountingName: '',
        name: '',
        englishName: '',
        informalName: '',
        symbol: '',
        informalEnglishName: '',
        informalSymbol: '',
        quantityKind: '',
        data: []
      },
      form: {
        accountingName: '',
        name: '',
        englishName: '',
        commodityId: '',
        code: '',
        data: []
      },
      columns: [
        {
          title: '量',
          slot: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '属性值',
          slot: 'priority',
          minWidth: 100
        },
        {
          width: 60,
          renderHeader: (h, data) => {
            let that = this
            return h('Button', {
              props: {
                type: 'primary',
                icon: 'md-add',
                size: 'small'
              },
              on: {
                click() {
                  that.form.data.push({
                    wFQuantityTypeId: '',
                    unitId: '',
                    scale: '',
                    priority: '',
                    isGroup: false
                  })
                }
              }
            })
          },
          render: (h, { row, index }) => {
            let that = this
            return h('Button', {
              props: {
                type: 'warning',
                icon: 'md-close',
                size: 'small',
                key: 'button' + index
              },
              style: {
                margin: 'auto',
                display: 'block'
              },
              on: {
                click() {
                  that.form.data[index] = {}
                  that.form.data.splice(index, 1)
                }
              }
            })
          }
        }
      ]
    }
  },
  methods: {
    toggleShow () {
      this.isShowModal = !this.isShowModal
    },
    add () {
      this.toggleShow()
      this.form = _.cloneDeep(this.defaultForm)
    },
    edit (row) {
      this.toggleShow()
      this.form = _.cloneDeep(row)
    },
    onSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form };
          await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
          this.toggleShow();
        }
      })
    },
    wFQuantityTypeIdChange (e, i) {
      this.form.data[i]['wFQuantityTypeId'] = e.target.value
    },
    unitIdChange (e, i) {
      this.form.data[i]['unitId'] = e.target.value
    },
    scaleChange (e, i) {
      this.form.data[i]['scale'] = e.target.value
    },
    priorityChange (e, i) {
      this.form.data[i]['priority'] = e.target.value
    },
    isShow (permission) {
      return utils.hasPermission(permission)
    },
    propertyConfig () {
      this.$refs['propertyConfigModal'].toggleShow()
    }
  }
}
</script>
