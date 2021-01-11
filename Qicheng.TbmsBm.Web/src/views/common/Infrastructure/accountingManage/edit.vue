<template>
<div>
  <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
    <Card>
      <p slot="title">{{$t('基本信息')}}</p>
      <Row>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('唯一标识')" prop="accountingName" required>
            <Input v-model="addForm.accountingName" :placeholder="$t('唯一标识')"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('名称')" prop="name" required>
            <Input v-model="addForm.name" :placeholder="$t('名称')"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('上级利润中心')" prop="parentDepartmentId">
            <Select
              :placeholder="$t('上级利润中心')"
              filterable
              clearable
              v-model="addForm.parentDepartmentId"
            >
              <Option
                v-for="(item, index) in commonData.AccountingEntityObjectType.filter(data => !data.isDisabled)"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('隶属部门')" prop="relationDepartmentId">
            <Select
              :placeholder="$t('隶属部门')"
              filterable
              clearable
              v-model="addForm.relationDepartmentId"
            >
              <Option
                v-for="(item, index) in commonData.Departments"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('业务类型')" prop="businessTypeIds" required>
            <Select
              :placeholder="$t('业务类型')"
              filterable
              clearable
              multiple
              v-model="addForm.businessTypeIds"
            >
              <Option
                v-for="(item, index) in commonData.BussinessType"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('是否最小')" prop="isAtomicAccounting" required>
            <i-switch v-model="addForm.isAtomicAccounting" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('是否启用期货')" prop="isETrading" required>
            <i-switch v-model="addForm.isETrading" />
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('是否启用套保')" prop="isHedgeAccounting" required>
            <i-switch v-model="addForm.isHedgeAccounting" />
          </FormItem>
        </Col>
      </Row>
    </Card>
    <Card class="card-padding-top15" v-if="addForm.isETrading">
      <p slot="title">{{$t('期货权限')}}</p>
      <Row>
        <Col :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('法人')" prop="corporations" class="transfer-formitem">
            <Checkbox v-model="selectAllCorporation">全选</Checkbox>
            <CheckboxGroup v-model="addForm.corporations">
              <Checkbox v-for="(item, index) in commonData.Corporations.filter(data => data.isETrading)" :key="item.value" :label="item.value">{{item.shortName}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
        <Col :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('资金账户')" prop="tradeAccounts">
            <Checkbox v-model="selectAllTradeAccount">全选</Checkbox>
            <CheckboxGroup v-model="addForm.tradeAccounts">
              <Checkbox v-for="(item, index) in commonData.TradeAccounts.filter(data => data.isETrading)" :key="item.value" :label="item.value">{{item.text}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
        <Col :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('标准合约')" prop="instrumentCategoriesConfiguration">
            <Button type="primary" icon="md-add" @click="showInstrumentModal">添加</Button>
            <p>
              已选中
              <span>{{addForm.instrumentCategoriesConfiguration.length}}</span>
              条标准合约
            </p>
          </FormItem>
        </Col>
      </Row>
    </Card>
  </Form>
  <div slot="footer">
    <Button class="margin-right-3" @click="backToList">{{$t('返回')}}</Button>
    <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
  </div>
  <InstrumentModal @getSelected="getSelectedInstrument" ref="instrumentModal"></InstrumentModal>
</div>
</template>

<script>
/*global _ _*/
// import { utils } from '@/utils/utils';
import enums from '@/utils/enums';
import InstrumentModal from './components/instrumentModal'
import api from './api';

export default {
  components: {
    InstrumentModal
  },
  data() {
    return {
      selectAllCorporation: false,
      selectAllTradeAccount: false,
      isShowAddModal: false,
      isEdit: false,
      enums,
      commonData: {
        AccountingEntityObjectType: [],
        Corporations: [],
        TradeAccounts: []
      },
      addForm: {
        wfAccountEntityId: 0,
        accountingName: '',
        name: '',
        // wfAccountEntityId: '',
        relationDepartmentId: '',
        parentDepartmentId: '',
        businessTypeIds: [],
        corporations: [],
        tradeAccounts: [],
        instrumentCategoriesConfiguration: [],
        isAtomicAccounting: false,
        isHedgeAccounting: false,
        isETrading: false,
      },
    };
  },
  async mounted () {
    this.commonData = await api.getCommonData()
    if(this.$route.query.is) {
      // 请求get数据
    }
  },
  methods: {
    onSave() {
      this.$refs['addForm'].validate(valid => {
        if(valid) {
          this.saveBussinessType()
          this.saveAccountCorporation()
          this.saveAccoutAgent()
          api.save(this.addForm).then(() => {
            this.$Message.success(this.$t('操作成功'))
            this.$router.push({name: 'accountingList'})
          })
        }
      })
    },
    saveBussinessType() {
      let objectType = _.find(this.commonData.AccountingEntityObjectType, d => d.key === 'BussinessType').value //关联业务类型
      let bussinessesConfiguration = _.map(this.addForm.businessTypeIds, item => {
        return {
          objectType: objectType,
          objectId: item
        }
      });
      this.addForm.bussinessesConfiguration = bussinessesConfiguration
    },
    saveAccountCorporation() {
      let objectType = _.find(this.commonData.AccountingEntityObjectType, d => d.key === 'AccountCorporation').value //关联法人
      let corporationsConfiguration = _.map(this.addForm.corporations, item => {
        return {
          objectType: objectType,
          objectId: item
        }
      });
      this.addForm.corporationsConfiguration = corporationsConfiguration
    },
    saveAccoutAgent() {
      let objectType = _.find(this.commonData.AccountingEntityObjectType, d => d.key === 'AccoutAgent').value //关联业务类型
      let tradeAccountsConfiguration = _.map(this.addForm.tradeAccounts, item => {
        return {
          objectType: objectType,
          objectId: item
        }
      });
      this.addForm.tradeAccountsConfiguration = tradeAccountsConfiguration
    },
    backToList() {
      this.$router.push({name: 'accountingList'})
    },
    showInstrumentModal() {
      this.$refs['instrumentModal'].isShowModal = true
    },
    getSelectedInstrument(arr) {
      let objectType = _.find(this.commonData.AccountingEntityObjectType, d => d.key === 'AccountContract').value //关联标准合约
      let instrumentCategoriesConfiguration = _.map(arr, data => {
        return {
          objectType: objectType,
          objectId: data
        }
      })
      this.addForm.instrumentCategoriesConfiguration = instrumentCategoriesConfiguration
    }
  },
};
</script>

<style lang="less" scoped>
.transfer-formitem {
  /deep/ .ivu-form-item-content {
    top: -15px;
    margin-bottom: -15px;
  }
}
.card-padding-top15 {
  /deep/ .ivu-card-body {
    padding-top: 31px;
  }
}
</style>
