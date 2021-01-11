<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" :title="isEdit ? $t('品种管理') + '-' + $t('品类') + $t('修改') :  $t('品种管理') + '-' + $t('品类') + $t('添加')" width="70%">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Card>
          <p slot="title">基本信息</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')" prop="accountingName" required>
                <Input v-model="form.accountingName" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('code')" prop="code" required>
                <Input v-model="form.code" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('名称')" prop="name" required>
                <Input v-model="form.name" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('英文名称')" prop="englishName">
                <Input v-model="form.englishName" placeholder/>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem label="类型" required>
                <Row>
                  <Col :span="20">
                    <FormItem prop="groupId" required>
                      <Select
                        transfer
                        placeholder
                        filterable
                        clearable
                        v-model="form.groupId"
                      >
                        <Option
                          v-for="(item, index) in commonData.allCommodityCategories"
                          :label="item.text"
                          :value="item.value"
                          :key="index"
                        >{{ item.text }}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :span="4" style="text-align:right">
                    <FormItem prop="unitId">
                      <Button
                        style="width:100%;"
                        type="primary"
                        icon="md-settings"
                        @click="onConfig"
                        v-if="isShow('H_CreateAcOtherPaymentRecord')"
                      ></Button>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('是否基本成分')" prop="fundamentalVarietyId" required>
                <i-switch v-model="form.fundamentalVarietyId" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('作价品类')" prop="pricingCommodityType" required>
                <i-switch v-model="form.pricingCommodityType" />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card>
          <p slot="title">重量单位</p>
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
                <!--<FormItem prop="scale" required label-width="0">
                </FormItem>-->
                <Input type="text" v-model="row.scale" @input.native="scaleChange($event, index)" placeholder="请输入0-8之间的整数"/>
              </template>
              <template slot-scope="{ row, index }" slot="priority">
                <Input type="text" v-model="row.priority" @input.native="priorityChange($event, index)"/>
              </template>
              <template slot-scope="{ row, index }" slot="isGroup">
                <Radio v-model="row.isGroup" @on-change="isGroupChange($event, index)"></Radio>
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
    <config ref="configModal"></config>
  </div>
</template>

<script>
import api from '../api'
import { utils } from '@/utils/utils'
import config from './config'
export default {
  components: {config},
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
          minWidth: 100,
          align: 'center',
          renderHeader: () => <span><span class="error">*</span>量</span>
        },
        {
          title: '量单位',
          slot: 'unitId',
          minWidth: 100,
          align: 'center',
          renderHeader: () => <span><span class="error">*</span>量单位</span>
        },
        {
          title: '精度',
          slot: 'scale',
          minWidth: 100,
          align: 'center',
        renderHeader: () => <span><span class="error">*</span>精度</span>
        },
        {
          title: '优先级',
          slot: 'priority',
          minWidth: 100,
          renderHeader: (h, data) => {
            return <div><span><span class="error">*</span>优先级</span><Tooltip  placement="top-start" transfer>
            <Icon type="ios-alert" color="orange" style="font-size: 20px;"/>
            <div slot="content">
            <p style="white-space: pre-wrap">数值越小排序越靠前</p>
            </div>
            </Tooltip></div>
          },
          align: 'center'
        },
        {
          title: '是否集团单位',
          slot: 'isGroup',
          minWidth: 100,
          align: 'center'
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
          },
          align: 'center'
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
      this.$refs['configModal'].toggleShow()
    }
  }
}
</script>
