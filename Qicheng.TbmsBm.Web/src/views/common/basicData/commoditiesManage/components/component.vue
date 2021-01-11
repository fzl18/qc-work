<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" title="品种管理-物料添加" width="70%">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Row>
          <Table
            size="small"
            border
            class="margin-bottom-10"
            :loading="false"
            :columns="columns"
            :data="form.data"
          >
            <template slot-scope="{ row, index }" slot="wFQuantityTypeId">
              <Select
                placeholder
                filterable
                clearable
                v-model="row.wFQuantityTypeId"
                @on-change="wFQuantityTypeIdChange($event, index)"
              >
                <Option
                  v-for="(item, index) in commonData.units"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="unitId">
              <Select
                placeholder
                filterable
                clearable
                v-model="row.unitId"
                @on-change="unitIdChange($event, index)"
              >
                <Option
                  v-for="(item, index) in commonData.units"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="scale">
              <Input type="text" v-model="row.scale" @input.native="scaleChange($event, index)"/>
            </template>
          </Table>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowModal = !isShowModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '../api'
import { utils } from '@/utils/utils'
export default {
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
          title: '单位',
          slot: 'unitId',
          minWidth: 100
        },
        {
          title: '精度',
          slot: 'scale',
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
          this.toggleShow();
          let data = { ...this.form };
          await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
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
    isShow (permission) {
      return utils.hasPermission(permission)
    }
  }
}
</script>
