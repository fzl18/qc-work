<template>
  <div>
    <Modal :title="$t('利润中心详情')" v-model="isShowModal" width="800">
      <Form :model="infoForm">
        <Card>
          <p slot="title">{{$t('基本信息')}}</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('唯一标识')">
                <span>{{infoForm.accountingName}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('名称')">
                <span>{{infoForm.name}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('上级利润中心')">
                <span>{{infoForm.parentDepartmentId}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('是否最小')">
                <span>{{utils.showText(enums.yONOptions, infoForm.isAtomicAccounting + '')}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('是否启用期货')">
                <span>{{utils.showText(enums.yONOptions, infoForm.isETrading + '')}}</span>
              </FormItem>
            </Col>

            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('是否启用套保')">
                <span>{{utils.showText(enums.yONOptions, infoForm.isHedgeAccounting + '')}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('业务类型')">
                <span>{{computedBusinessType}}</span>
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('隶属部门')">
                <span>{{infoForm.relationDepartmentId}}</span>
              </FormItem>
            </Col>
            <Col :lg="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('备注')">
                <span>{{infoForm.note}}</span>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card v-if="infoForm.isETrading">
          <p slot="title">{{$t('基本信息')}}</p>
          <Row>
            <Col :lg="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('法人')">
                <span>{{infoForm.accountingName}}</span>
              </FormItem>
            </Col>
            <Col :lg="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('资金账户')">
                <span>{{infoForm.accountingName}}</span>
              </FormItem>
            </Col>
            <Col :lg="24" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem :labelWidth="120" :label="$t('标准合约')">
                <span>{{infoForm.accountingName}} </span>
                <Icon @click="getInstrumentSelect()" type="md-eye" />
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
      <div slot="footer">
        <Button type="default" @click="isShowModal = false">{{$t('返回')}}</Button>
      </div>
    </Modal>
    <Modal :title="$t('利润中心') + '(' + '利润中心1' + ')' + $t('标准合约清单')" v-model="isShowInstrumentModal" width="1100">
      <MultiSelect :data="privilegeData" :originPrivilegeData="originPrivilegeData" ref="multiSelect">
      </MultiSelect>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils'
import MultiSelect from '@/components/multiSelectModal'
import api from '../api'
import enums from '@/utils/enums'

export default {
  data() {
    return {
      isShowModal: false,
      isShowInstrumentModal: false,
      infoForm: {},
      privilegeData: [],
      originPrivilegeData: [],
      commonData: [],
      enums
    }
  },
  components: {
    MultiSelect
  },
  computed: {
    computedBusinessType() {
      let strArr = _.map(this.infoForm.bussinessesConfiguration, item => utils.showText(this.commonData.BussinessType, item.objectId))
      return strArr.join(',')
    }
  },
  async mounted () {
    this.commonData = await api.getCommonData()
  },
  methods: {
    getInstrumentSelect() {
      this.isShowInstrumentModal = true
    }
  }
}
</script>

<style>

</style>
