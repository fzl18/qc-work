<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowInfoModal" :title="$t('配置作价市场类型')" width="900">
      <Form :model="infoForm" label-position="right" :label-width="120" ref="infoForm">
        <Row>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="code">
              <span v-text="infoForm.qctKey"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="friendlyName">
              <span v-text="infoForm.friendlyName"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('合约代码')" prop="instrumentCategoryCode">
              <span v-text="infoForm.code"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交易所')" prop="marketId">
              <span>{{utils.showText(commonData.exchanges, infoForm.marketId)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('品类')" prop="tradingCommodityName">
              <span>{{utils.showText(commonData.commodityTypes, infoForm.wfCommodityTypeId)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('合约类型')" prop="instrumentPeriodType">
              <span>{{utils.showText(commonData.FinancialInstrumentType, infoForm.financialInstrumentType)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('币种')" prop="wfCurrencyId">
              <span>{{utils.showText(commonData.currencies, infoForm.wfCurrencyId)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('重量单位')" prop="wfUnitId">
              <span>{{utils.showText(commonData.units, infoForm.wfUnitId)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('价格单位倍数')" prop="priceUnitMultiple">
              <span v-text="infoForm.priceUnitMultiple"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交易单位量')" prop="code">
              <span v-text="infoForm.lotSize"></span>
              <span slot="append">{{unitName + '/手'}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('合约格式')" prop="isETrading">
              <span>{{utils.showText(commonData.instrumentContractType, infoForm.instrumentContractFormatId)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('合约时段类型')" prop="isETrading">
              <span>{{utils.showText(commonData.InstrumentPeriodType, infoForm.instrumentPeriodType)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('合约税率')" prop="code">
              <span v-text="infoForm.instrumentTaxRate"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('保值比例')" prop="hedgingCoefficient">
              <span v-text="infoForm.hedgingCoefficient"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('是否启用期货')" prop="code">
              <span v-text="infoForm.isETrading">{{utils.showText(enums.yONOptions, infoForm.isETrading)}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交割乘数')" prop="deliveryMultiple">
              <span v-text="infoForm.deliveryMultiple"></span>
              <span >{{unitName + '/手'}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('最小变动单位')" prop="code">
              <span v-text="infoForm.tickSize"></span>
              <span >{{(infoForm.priceUnitMultiple === 1 ? '' : infoForm.priceUnitMultiple) + currencyName + '/' + unitName}}</span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('持仓限额')" prop="code">
              <span v-text="infoForm.positionLimit"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交易品种名称')" prop="code">
              <span v-text="infoForm.tradingCommodityName"></span>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交易代码')" prop="code">
              <span v-text="infoForm.instrumentCategoryCode"></span>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowInfoModal = false">{{$t('返回')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums';

export default {
  props: {
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    unitName() {
      return utils.showText(this.commonData.units, this.infoForm.wfUnitId)
    },
    currencyName() {
      return utils.showText(this.commonData.currencies, this.infoForm.wfCurrencyId)
    }
  },
  data() {
    return  {
      isShowInfoModal: false,
      infoForm: {},
      enums
    }
  }
}
</script>

<style>

</style>