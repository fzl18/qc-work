<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Row>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('交易密码')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('资金下限')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('资金预警线')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('行情订阅')" prop="code">
            <i-switch v-model="form.accountingSubjectId" />
          </FormItem>
        </Col>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('交易地址列表')" prop="pledgeInterestRate">
            <Input type="textarea" v-model="form.note" :rows="4" />
          </FormItem>
        </Col>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('行情地址列表')" prop="pledgeInterestRate">
            <Input type="textarea" v-model="form.note" :rows="4" />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      form: {
        code: '',
        accountingSubjectId: ''
      }
    }
  },
  methods: {
    toggleShow () {
      this.isShowAddModal = !this.isShowAddModal
    },
    onValidate () {
      return this.$refs['form'].validate((valid) => valid)
    }
  }
}
</script>
