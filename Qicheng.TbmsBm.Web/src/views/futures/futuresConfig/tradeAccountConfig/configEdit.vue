<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Card>
        <p slot="title">{{$t('基本配置')}}</p>
        <Row>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('资金账户')" prop="code">
              {{form.code}}
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('法人')" prop="friendlyName">
              {{form.friendlyName}}
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('经济公司')" prop="englishName">
              {{form.friendlyName}}
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('是否净持')" prop="accountingSubjectId">
              <i-switch v-model="form.accountingSubjectId" />
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交易通道')" prop="businessTypeId" required>
              <Select
                transfer
                placeholder
                filterable
                clearable
                v-model="form.businessTypeId"
              >
                <Option
                  v-for="(item, index) in commonData.accountingUnits"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('通道类型')" prop="englishName">
              {{form.chanelType}}
            </FormItem>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">{{$t('交易通道配置')}}</p>
        <ctp ref="ctp" v-show="form.chanelType===1"></ctp>
        <kingstar ref="kingstar" v-show="form.chanelType===2"></kingstar>
        <cqg ref="cqg" v-show="form.chanelType===3"></cqg>
        <pats ref="pats" v-show="form.chanelType===4"></pats>
        <Row>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem prop="pledgeInterestRate" style="color: #ff9900">
              <p>！请将交易地址/行情地址以英文分号（;）换行隔开后，填入文本框内，没有分号（;）隔开将识别为一个交易地址。示例：<br>192.0.0.0:8099;<br>192.0.0.0:8098;</p>
            </FormItem>
          </Col>
        </Row>
      </Card>
    </Form>
    <div slot="footer">
      <Button @click="backToList" class="margin-right-3">{{$t('返回')}}</Button>
      <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
    </div>
  </div>
</template>

<script>
import api from './api'
import Kingstar from './components/kingstar'
import Ctp from './components/ctp'
import Cqg from './components/cqg'
import Pats from './components/pats'
export default {
  components: { Kingstar, Ctp, Cqg, Pats },
  data () {
    return {
      commonData: {},
      form: {
        chanelType: 3,
        businessTypeId: 3
      },
    }
  },
  async created () {
    // let commonData = await api.getCommonData();
    // this.commonData = commonData;
    // this.search();
  },
  methods: {
    backToList() {
      this.$router.push({
        name: 'TradeAccountConfigList'
      })
    },
    async onSave () {
      let a = await this.$refs['kingstar'].onValidate()
      this.$refs['form'].validate(async (valid) => {
        if (a && valid) {
          let data = { ...this.form };
          await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
          this.toggleShow();
        }
      })
    }
  }
}
</script>
