<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowAddModal" :title="isEdit ? $t('修改') : $t('新增')" width="70%">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Card>
          <p slot="title">基本信息</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')" prop="accountingName" required>
                <Input v-model="form.accountingName" placeholder :disabled="isEdit"/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('名称')" prop="name" required>
                <Input v-model="form.name" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('英文名称')" prop="englishName" required>
                <Input v-model="form.englishName" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('显示名')" prop="informalName" required>
                <Input v-model="form.informalName" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('符号')" prop="symbol" required>
                <Input v-model="form.symbol" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('显示英文名')" prop="informalEnglishName" required>
                <Input v-model="form.informalEnglishName" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('显示符号')" prop="informalSymbol" required>
                <Input v-model="form.informalSymbol" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('类别')" prop="quantityKind" required>
                <Select
                  transfer
                  placeholder
                  filterable
                  clearable
                  v-model="form.quantityKind"
                >
                  <Option
                    v-for="(item, index) in commonData.enumOptions.QuantityKind"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{ item.text }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card>
          <p slot="title">转换关系</p>
          <Row>
            <Table
              size="small"
              border
              class="margin-bottom-10"
              :loading="false"
              :columns="columns"
              :data="form.wfUnitConversionDtos"
            >
              <template slot-scope="{ row, index }" slot="fromUnitNumericValue">
                <Input type="text" v-model="row.fromUnitNumericValue"
                       @input.native="fromUnitNumericValueChange($event, index)"/>
              </template>
              <template slot-scope="{ row, index }" slot="toUnitNumericValue">
                <Input type="text" v-model="row.toUnitNumericValue"
                       @input.native="toUnitNumericValueChange($event, index)"/>
              </template>
              <template slot-scope="{ row, index }" slot="toUnitId">
                <Select
                  placeholder
                  filterable
                  clearable
                  transfer
                  v-model="row.toUnitId"
                  @on-change="toUnitIdChange($event, index)"
                >
                  <Option
                    v-for="(item, index) in commonData.allUnits"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{ item.text }}
                  </Option>
                </Select>
              </template>
              <template slot-scope="{ row, index }" slot="note">
                <Input type="text" v-model="row.note" @input.native="noteChange($event, index)"/>
              </template>
            </Table>
          </Row>
        </Card>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from './api'

export default {
  props: {
    commonData: {
      type: Object,
      default: () => {
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowAddModal: false,
      defaultForm: {
        accountingName: '',
        englishName: '',
        informalEnglishName: '',
        informalName: '',
        informalSymbol: '',
        isDeleted: '',
        messageInfo: '',
        name: '',
        quantityKind: '',
        sapCode: '',
        specialUnit: '',
        symbol: '',
        wfUnitId: '',
        wfUnitConversionDtos: []
      },
      form: {
        accountingName: '',
        englishName: '',
        informalEnglishName: '',
        informalName: '',
        informalSymbol: '',
        isDeleted: '',
        messageInfo: '',
        name: '',
        quantityKind: '',
        sapCode: '',
        specialUnit: '',
        symbol: '',
        wfUnitId: '',
        wfUnitConversionDtos: []
      },
      columns: [
        {
          title: '基础值',
          slot: 'fromUnitNumericValue',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '转换单位',
          render: (h) => {
            return h('span', this.form.name)
          },
          width: 90,
          align: 'center',
        },
        // {
        //   title: ' ',
        //   render: (h) => {
        //     return h('span', '=')
        //   },
        //   width: 50
        // },
        {
          title: '转换后值',
          slot: 'toUnitNumericValue',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '转成单位',
          slot: 'toUnitId',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '备注',
          slot: 'note',
          minWidth: 100,
          align: 'center',
        },
        {
          width: 60,
          align: 'center',
          renderHeader: (h, data) => {
            let that = this
            return h('Button', {
              props: {
                type: 'primary',
                icon: 'md-add',
                size: 'small'
              },
              on: {
                click () {
                  that.form.wfUnitConversionDtos.push({
                    fromUnitId: that.form.wfUnitId || '',
                    fromUnitNumericValue: '',
                    note: '',
                    toUnitId: '',
                    toUnitNumericValue: ''
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
                click () {
                  that.form.wfUnitConversionDtos[index] = {}
                  that.form.wfUnitConversionDtos.splice(index, 1)
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
      this.isShowAddModal = !this.isShowAddModal
    },
    async getById (id) {
      const form = await api.getById(id)
      this.form = form
    },
    add () {
      this.toggleShow()
      this.$refs['form'].resetFields()
      this.form = _.cloneDeep(this.defaultForm)
    },
    edit (row) {
      this.toggleShow()
      this.$refs['form'].resetFields()
      this.getById(row.wfUnitId)
    },
    onSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form }
          if (this.isEdit) {
            await api.update(data)
          } else {
            await api.create(data)
          }
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功')
          this.toggleShow()
          this.$emit('onSearch')
        }
      })
    },
    fromUnitNumericValueChange (e, i) {
      this.form.wfUnitConversionDtos[i]['fromUnitNumericValue'] = e.target.value
    },
    toUnitNumericValueChange (e, i) {
      this.form.wfUnitConversionDtos[i]['toUnitNumericValue'] = e.target.value
    },
    toUnitIdChange (e, i) {
      this.form.wfUnitConversionDtos[i]['toUnitId'] = e
    },
    noteChange (e, i) {
      this.form.wfUnitConversionDtos[i]['note'] = e.target.value
    }
  }
}
</script>
