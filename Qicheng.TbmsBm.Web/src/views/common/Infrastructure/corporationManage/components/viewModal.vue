<template>
  <div>
    <Modal :title="$t('详情')" v-model="show" width="700">
      <Form :label-width="100">
        <Card>
          <p slot="title">基本信息</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')">
                <span>{{detail.accountingName}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('全称')">
                <span>{{detail.fullName}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('简称')">
                <span>{{detail.shortName}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('缩写')">
                <span>{{detail.abbreviation}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('本位币')">
                <span>{{utils.showText(commonData.currencies, detail.ourCorporationFunctionalCurrencyId)}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('税号')">
                <span>{{detail.taxCode}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('是否境内')">
                <span>{{detail.isDomestic === true ? '否' : detail.isDomestic === false ? '是' : ''}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('是否启用期货')">
                <span>{{detail.isETrading === true ? '否' : detail.isETrading === false ? '是' : ''}}</span>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <br>
        <Card>
          <p slot="title">{{$t('银行账户')}}</p>
          <Table
            size="small"
            v-maxHeight
            border
            class="margin-bottom-10"
            :loading="false"
            :columns="columns"
            :data="detail.wfCompanyBankInfo"
          ></Table>
        </Card>
      </Form>
      <div slot="footer">
        <Button type="default" @click="show=!show">{{$t('返回')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils'
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      columns: [
        {
          title: '名称',
          key: 'bankName',
          minWidth: 120
        },
        {
          title: '账户',
          key: 'bankAccount',
          minWidth: 120
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.BankType, row.type)}</span>
          }
        },
        {
          title: 'SwiftCode',
          key: 'swiftCode',
          minWidth: 120
        },
        {
          title: '地址',
          key: 'address',
          minWidth: 120
        },
        {
          title: '是否启用',
          key: 'isDisabled',
          minWidth: 120,
          render: (h, { row }) => {
            return h('span', row.isDisabled === true ? '否' : row.isDisabled === false ? '是' : '')
          }
        }
      ]
    }
  },
  methods: {
    cancel() {
      this.$emit('changeModalStatus', false)
    },
    toggleShow () {
      this.show = !this.show
    }
  }
}
</script>

<style>

</style>
