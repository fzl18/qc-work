<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Row>
        <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
          <FormItem :label="$t('库存管理模式')" prop="storageModel" required>
            <RadioGroup v-model="form.storageModel">
              <Radio label="1">简单</Radio>
              <Radio label="2">复杂</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
          <FormItem :label="$t('主量单位')" prop="currencyId" required>
            <Select
              placeholder
              filterable
              clearable
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
        <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
          <FormItem :label="$t('货品类型')" prop="currencyId" required>
            <Select
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
      <div>重量单位</div>
      <Table
        size="small"
        border
        class="margin-bottom-10"
        :loading="false"
        :columns="columns"
        :data="data"
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
      <div>品种成分</div>
      <Table
        size="small"
        border
        class="margin-bottom-10"
        :loading="false"
        :columns="columns1"
        :data="data1"
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
    </Form>
    <price-scale ref="priceScaleModal"></price-scale>
    <component-modal ref="componentModal"></component-modal>
  </div>
</template>
<script>
import PriceScale from './priceScale'
import ComponentModal from './component'
export default {
  components: {
    PriceScale,
    ComponentModal
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      form: {
        unitId: 1,
        storageModel: '1',
        shortName: ''
      },
      commonData: {
        equityFatorTypes: [],
        subTypes: []
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
          title: '单位',
          slot: 'unitId',
          minWidth: 100,
          align: 'center',
          renderHeader: () => <span><span class="error">*</span>单位</span>
        },
        {
          title: '精度（小数位）',
          slot: 'scale',
          minWidth: 100,
          align: 'center',
        renderHeader: () => <span><span class="error">*</span>精度（小数位）</span>
        },
        {
          title: '贸易类型',
          slot: 'unitId',
          minWidth: 100,
          align: 'center',
        renderHeader: () => <span><span class="error">*</span>贸易类型</span>
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
          title: '默认单位',
          slot: 'isGroup',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '价格精度',
          minWidth: 100,
          render: (h, { row, index }) => {
            let that = this
            return h('Button', {
              props: {
                type: 'text',
                key: 'button' + index
              },
              style: {
                margin: 'auto',
                display: 'block'
              },
              on: {
                click() {
                  that.$refs['priceScaleModal'].toggleShow()
                }
              }
            }, '价格精度')
          },
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
                  that.data.push({
                    address: '',
                    bankName: '',
                    englishName: '',
                    bankAccount: '',
                    swiftCode: '',
                    isDisabled: false
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
                  that.data[index] = {}
                  that.data.splice(index, 1)
                }
              }
            })
          },
          align: 'center'
        }
      ],
      data: [],
      columns1: [
        {
          title: '基本成分',
          slot: 'wFQuantityTypeId',
          minWidth: 100,
          align: 'center',
          renderHeader: () => <span><span class="error">*</span>基本成分</span>
        },
        {
          title: '名称',
          slot: 'unitId',
          minWidth: 100,
          align: 'center',
        renderHeader: () => <span><span class="error">*</span>名称</span>
        },
        {
          title: '成分含量',
          minWidth: 100,
          render: (h, { row, index }) => {
            let that = this
            return h('Button', {
              props: {
                type: 'text',
                key: 'button' + index
              },
              style: {
                margin: 'auto',
                display: 'block'
              },
              on: {
                click() {
                  that.$refs['componentModal'].toggleShow()
                }
              }
            }, '成分含量')
          },
          align: 'center'
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
                  that.data1.push({
                    address: '',
                    bankName: '',
                    englishName: '',
                    bankAccount: '',
                    swiftCode: '',
                    isDisabled: false
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
                  that.data1[index] = {}
                  that.data1.splice(index, 1)
                }
              }
            })
          },
          align: 'center'
        }
      ],
      data1: []
    }
  },
  async created () {
  },
  methods: {
    backToList() {
      this.$router.push({
        name: 'corporationList'
      })
    },
    onValidate () {
      return this.$refs['form'].validate(valid => valid)
    },
    onAdd () {
      this.data.push({
        address: '',
        bankName: '',
        englishName: '',
        bankAccount: '',
        swiftCode: '',
        isDisabled: false
      })
    },
    bankNameChange (e, i) {
      this.data[i]['bankName'] = e.target.value
    },
    englishNameChange (e, i) {
      this.data[i]['englishName'] = e.target.value
    },
    bankAccountChange (e, i) {
      this.data[i]['bankAccount'] = e
    },
    swiftCodeChange (e, i) {
      this.data[i]['swiftCode'] = e.target.value
    },
    addressChange (e, i) {
      this.data[i]['address'] = e.target.value
    },
    isDisabledChange (e, i) {
      this.data[i]['isDisabled'] = e
    }
  }
}
</script>
