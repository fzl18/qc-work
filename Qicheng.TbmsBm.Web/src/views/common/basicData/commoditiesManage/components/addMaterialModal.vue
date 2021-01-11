<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" title="品种管理-物料添加" width="70%">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Card>
          <p slot="title">基本信息</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')" prop="accountingName" required>
                <Input v-model="form.accountingName" placeholder clearable/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('名称')" prop="name" required>
                <Input v-model="form.name" placeholder clearable/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('英文名称')" prop="englishName">
                <Input v-model="form.englishName" placeholder clearable/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem label="隶属品种" prop="commodityId" required>
                <Select
                  transfer
                  placeholder
                  filterable
                  clearable
                  v-model="form.commodityId"
                >
                  <Option
                    v-for="(item, index) in commonData.allUnits"
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
          <p slot="title">
            其他属性
            <a type="text" @click="propertyConfig">配置</a>
          </p>
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
              <template slot-scope="{ row, index }" slot="priority">
                <Input type="text" v-model="row.priority" @input.native="priorityChange($event, index)"/>
              </template>
            </Table>
          </Row>
        </Card>
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
