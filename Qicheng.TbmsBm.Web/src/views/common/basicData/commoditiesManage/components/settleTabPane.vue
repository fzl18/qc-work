<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Row>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('结算模式')" prop="storageModel" required>
            <RadioGroup v-model="form.storageModel">
              <Radio label="1">简单</Radio>
              <Radio label="2">复杂</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('条款类型')" prop="storageModel">
            <template>
              <div>计量条款</div>
              <div>
                <CheckboxGroup v-model="form.ll">
                  <Checkbox label="计量条款"></Checkbox>
                </CheckboxGroup>
              </div>
            </template>
            <template>
              <div>计价条款-成分价格</div>
              <div>
                <CheckboxGroup v-model="form.ll">
                  <Checkbox label="成分价格-普通条款"></Checkbox>
                  <Checkbox label="成分价格-赏罚区间条款"></Checkbox>
                </CheckboxGroup>
              </div>
            </template>
            <template>
              <div>其他赏罚条款</div>
              <div>
                <div>
                  <CheckboxGroup v-model="form.ll">
                    <Checkbox label="罚-粗炼费"></Checkbox>
                    <Checkbox label="罚-精炼费"></Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </template>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
export default {
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
      }
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
