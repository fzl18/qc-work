<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Row>
        <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
          <FormItem :label="$t('价格管理模式')" prop="storageModel" required>
            <RadioGroup v-model="form.storageModel">
              <Radio label="1">简单</Radio>
              <Radio label="2">复杂</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Table
        size="small"
        border
        class="margin-bottom-10"
        :loading="false"
        :columns="columns"
        :data="data"
      >
        <template slot-scope="{ row, index }" slot="scale">
          <Input type="text" v-model="row.scale" @input.native="scaleChange($event, index)" placeholder="请输入0-8之间的整数"/>
        </template>
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
          title: '成分名称',
          slot: 'wFQuantityTypeId',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '计价品类',
          slot: 'unitId',
          minWidth: 100,
          align: 'center'
        }
      ],
      data: [],
      columns1: [
        {
          title: '基本成分',
          slot: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '名称',
          slot: 'unitId',
          minWidth: 100
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
          }
        },
        {
          title: '优先级',
          slot: 'priority',
          minWidth: 100,
          renderHeader: (h, data) => {
            return <div>优先级<Tooltip  placement="top-start" transfer>
            <Icon type="ios-alert" color="orange" style="font-size: 20px;"/>
            <div slot="content">
            <p style="white-space: pre-wrap">数值越小排序越靠前</p>
            </div>
            </Tooltip></div>
          }
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
          }
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
