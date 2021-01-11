<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Card>
        <p slot="title">基本信息</p>
        <Row>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('品类')" prop="commodityTypeId" required>
              <Select
                placeholder
                filterable
                clearable
                v-model="form.commodityTypeId"
                :disabled="hasWfCommodityType"
              >
                <Option
                  v-for="(item, index) in commonData.commodityTypes"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="accountingName" required>
              <Input v-model="form.accountingName" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('code')" prop="code" required>
              <Input v-model="form.code" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="name" required>
              <Input v-model="form.name" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('英文名称')" prop="englishName" required>
              <Input v-model="form.englishName" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('显示名')" prop="friendlyName" required>
              <Input v-model="form.friendlyName" placeholder/>
            </FormItem>
          </Col>
        </Row>
      </Card>
      <br>
      <Card>
        <p slot="title">配置信息</p>
        <Row>
          <Tabs type="card">
            <TabPane label="库存信息管理">
              <storage-tab-pane ref="storageTabPane"></storage-tab-pane>
            </TabPane>
            <TabPane label="价格信息管理">
              <price-tab-pane ref="priceTabPane"></price-tab-pane>
            </TabPane>
            <TabPane label="结算信息管理">
              <settle-tab-pane ref="settleTabPane"></settle-tab-pane>
            </TabPane>
          </Tabs>
        </Row>
      </Card>
    </Form>
    <br>
    <Row type="flex" justify="space-between" :gutter="5">
      <Col class-name="margin-bottom-10">
        <Button @click="backToList" class="margin-right-3">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
import api from './api'
import storageTabPane from './components/storageTabPane'
import priceTabPane from './components/priceTabPane'
import settleTabPane from './components/settleTabPane'
export default {
  components: { storageTabPane, priceTabPane, settleTabPane },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      form: {
        accountingName: '',
        fullName: '',
        shortName: '',
        abbreviation: '',
        currencyId: '',
        taxCode: '',
        isDomestic: '',
        isETrading: false
      },
      commonData: {
        equityFatorTypes: [],
        subTypes: []
      }
    }
  },
  computed: {
    hasWfCommodityType () {
      return !!this.$route.query.wfCommodityTypeId
    }
  },
  async created () {
    let commonData = await api.getCommonData('IntraydayRiskControl')
    this.commonData = commonData
    if (this.$route.query.wfCommodityTypeId) {
      this.form.commodityTypeId = this.$route.query.wfCommodityTypeId;
    }
    if (!!this.id) {
      this.form = await api.getById(this.id)
    }
  },
  methods: {
    backToList() {
      this.$router.push({
        name: 'CommoditiesList'
      })
    },
    async onSave () {
      let storageValid = await this.$refs['storageTabPane'].onValidate()
      let priceValid = await this.$refs['priceTabPane'].onValidate()
      let settleValid = await this.$refs['settleTabPane'].onValidate()
      this.$refs['form'].validate(async (valid) => {
        if (storageValid && priceValid && settleValid && valid) {
          let data = { ...this.form };
          await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
        }
      })
    }
  }
}
</script>
