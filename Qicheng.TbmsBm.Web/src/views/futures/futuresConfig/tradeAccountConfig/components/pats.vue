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
          <FormItem :label="$t('EnableAlgo')" prop="code">
            <i-switch v-model="form.accountingSubjectId"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('客户号简称')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('执行决定')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('执行决定类型')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('投资决定')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('投资决定类型')" prop="code" required>
            <Input v-model="form.code" placeholder/>
          </FormItem>
        </Col>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('子账户列表')">
            <Table
              size="small"
              border
              class="margin-bottom-10"
              :columns="listColumns"
              :data="list"
            ></Table>
          </FormItem>
        </Col>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('交易地址列表')" prop="pledgeInterestRate">
            <Input type="textarea" v-model="form.note" :rows="4"/>
          </FormItem>
        </Col>
        <Col span="24" class-name="margin-bottom-10">
          <FormItem :label="$t('行情地址列表')" prop="pledgeInterestRate">
            <Input type="textarea" v-model="form.note" :rows="4"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      listColumns: [
        {
          title: '子账户号',
          key: 'fromUnitNumericValue',
          minWidth: 100
        },
        {
          title: '名称',
          key: 'fromUnitNumericValue',
          minWidth: 100
        },
        {
          title: '可交易权限',
          slot: 'toUnitNumericValue',
          minWidth: 100
        },
        {
          width: 100,
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
                  that.list.push({
                    accountingName: '',
                    name: '',
                    englishName: '',
                    informalName: '',
                    symbol: '',
                    informalEnglishName: '',
                    informalSymbol: '',
                    quantityKind: ''
                  })
                }
              }
            })
          },
          render: (h, { row, index }) => {
            let that = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  icon: 'md-settings',
                  size: 'small',
                  key: 'button' + index
                },
                style: {
                  'margin-right': '3px'
                },
                on: {
                  click () {
                    that.onConfig()
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'warning',
                  icon: 'md-close',
                  size: 'small',
                  key: 'button' + index
                },
                on: {
                  click () {
                    that.list[index] = {}
                    that.list.splice(index, 1)
                  }
                }
              })
            ])
          }
        }],
      list: [],
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
    },
    onConfig () {
      // this.$refs['']
    }
  }
}
</script>
