<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Card>
        <p slot="title">基本信息</p>
        <Row>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="accountingName" required>
              <Input v-model="form.accountingName" placeholder :disabled="!!id"/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('全称')" prop="fullName" required>
              <Input v-model="form.fullName" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('简称')" prop="shortName" required>
              <Input v-model="form.shortName" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('缩写')" prop="abbreviation" required>
              <Input v-model="form.abbreviation" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('本位币')" prop="ourCorporationFunctionalCurrencyId" required>
              <Select
                placeholder
                filterable
                clearable
                v-model="form.ourCorporationFunctionalCurrencyId"
              >
                <Option
                  v-for="(item, index) in commonData.currencies"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('税号')" prop="taxCode">
              <Input v-model="form.taxCode" placeholder/>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('是否境内')" prop="isDomestic">
              <i-switch v-model="form.isDomestic" />
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('是否启用期货')" prop="isETrading">
              <i-switch v-model="form.isETrading" />
            </FormItem>
          </Col>
        </Row>
      </Card>
      <br>
      <Card>
        <p slot="title">银行账户</p>
        <Row>
          <Table
            size="small"
            border
            class="margin-bottom-10"
            :loading="false"
            :columns="columns"
            :data="form.wfCompanyBankInfo"
          >
            <template slot-scope="{ row, index }" slot="bankName">
              <Input type="text" @input.native="bankNameChange($event, index)" v-model="row.bankName"/>
            </template>
            <template slot-scope="{ row, index }" slot="englishName">
              <Input type="text" v-model="row.englishName" @input.native="englishNameChange($event, index)"/>
            </template>
            <template slot-scope="{ row, index }" slot="bankAccount">
              <Input type="text" v-model="row.bankAccount" @input.native="bankAccountChange($event, index)"/>
            </template>
            <template slot-scope="{ row, index }" slot="type">
              <Select
                placeholder
                filterable
                transfer
                clearable
                v-model="row.type"
                @on-change="typeChange($event, index)"
              >
                <Option
                  v-for="(item, index) in commonData.BankType"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="swiftCode">
              <Input type="text" v-model="row.swiftCode" @input.native="swiftCodeChange($event, index)"/>
            </template>
            <template slot-scope="{ row, index }" slot="address">
              <Input type="text" v-model="row.address" @input.native="addressChange($event, index)"/>
            </template>
            <template slot-scope="{ row, index }" slot="isDisabled">
              <i-switch v-model="row.isDisabled" @on-change="isDisabledChange($event, index)" true-color="#19be6b"/>
            </template>
          </Table>
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
export default {
  props: {
    id: {
      default: 0
    }
  },
  data () {
    return {
      form: {
        abbreviation: '',
        accountingName: '',
        creationTime: '',
        customerCode: '',
        customerType: '',
        fullName: '',
        isDisabled: false,
        isDomestic: false,
        isETrading: false,
        lastManipulationTime: '',
        metaCompanyType: '',
        ourCorporationFunctionalCurrencyId: '',
        relationCategory: '',
        shortName: '',
        supplierCode: '',
        supplierType: '',
        taxCode: '',
        type: '',
        wfCompanyBankInfo: [],
        wfCompanyId: '',
        wfCorporationTypeConfiguration: ''
      },
      commonData: {
        BankType: []
      },
      columns: [
        {
          title: '银行名称（中）',
          slot: 'bankName',
          minWidth: 120
        },
        {
          title: '银行名称（英）',
          slot: 'englishName',
          minWidth: 130
        },
        {
          title: '银行账户',
          slot: 'bankAccount',
          minWidth: 120
        },
        {
          title: '类型',
          slot: 'type',
          minWidth: 120
        },
        {
          title: 'SwiftCode',
          slot: 'swiftCode',
          minWidth: 120
        },
        {
          title: '地址',
          slot: 'address',
          minWidth: 120
        },
        {
          title: '是否启用',
          slot: 'isDisabled',
          minWidth: 120
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
                  that.form.wfCompanyBankInfo.push({
                    bankName: '',
                    englishName: '',
                    bankAccount: '',
                    type: '',
                    swiftCode: '',
                    address: '',
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
                  that.form.wfCompanyBankInfo[index] = {}
                  that.form.wfCompanyBankInfo.splice(index, 1)
                }
              }
            })
          }
        }
      ],
      data: []
    }
  },
  async created () {
    let commonData = await api.getCommonData('IntraydayRiskControl')
    this.commonData = commonData
    if (!!this.id) {
      this.form = await api.getById(this.id)
    }
  },
  methods: {
    backToList() {
      this.$router.push({
        name: 'corporationList'
      })
    },
    onSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form };
          if (!!this.id) {
            await api.update(data);
            this.$Message.success('修改成功');
          } else {
            await api.create(data);
            this.$Message.success('添加成功');
          }
          this.backToList()
        }
      })
    },
    bankNameChange (e, i) {
      this.form.wfCompanyBankInfo[i]['bankName'] = e.target.value
    },
    englishNameChange (e, i) {
      this.form.wfCompanyBankInfo[i]['englishName'] = e.target.value
    },
    bankAccountChange (e, i) {
      this.form.wfCompanyBankInfo[i]['bankAccount'] = e.target.value
    },
    typeChange (e, i) {
      this.form.wfCompanyBankInfo[i]['type'] = e
    },
    swiftCodeChange (e, i) {
      this.form.wfCompanyBankInfo[i]['swiftCode'] = e.target.value
    },
    addressChange (e, i) {
      this.form.wfCompanyBankInfo[i]['address'] = e.target.value
    },
    isDisabledChange (e, i) {
      this.form.wfCompanyBankInfo[i]['isDisabled'] = e
    }
  }
}
</script>
