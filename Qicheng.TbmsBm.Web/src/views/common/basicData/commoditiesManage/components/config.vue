<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" title="品类类型" width="40%">
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
              <Input v-model="row.wFQuantityTypeId" placeholder @input.native="wFQuantityTypeIdChange($event, index)" v-if="!row.id"/>
              <div v-else>{{row.wFQuantityTypeId}}</div>
            </template>
            <template slot-scope="{ row, index }" slot="unitId">
              <Input v-model="row.unitId" placeholder @input.native="unitIdChange($event, index)"/>
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
        informalName: '',
        symbol: '',
        informalEnglishName: '',
        informalSymbol: '',
        quantityKind: '',
        data: []
      },
      columns: [
        {
          title: '量',
          slot: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '量单位',
          slot: 'unitId',
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
                    unitId: ''
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
    isGroupChange (e, i) {
      this.form.data[i]['isGroup'] = e.target.value
    },
    isShow (permission) {
      return utils.hasPermission(permission)
    },
    onConfig () {

    }
  }
}
</script>
