<template>
<div>
  <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
    <Card>
      <p slot="title">{{$t('基本信息')}}</p>
      <Row>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('唯一标识')" prop="code" required>
            <Input v-model="addForm.code" :placeholder="$t('唯一标识')"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('代码')" prop="fullName" required>
            <Input v-model="addForm.fullName" :placeholder="$t('代码')"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('名称')" prop="shortName" required>
            <Input v-model="addForm.shortName" :placeholder="$t('名称')"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('交易所')" prop="shortName" required>
            <Select
              :placeholder="$t('交易所')"
              filterable
              clearable
              v-model="addForm.isETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('标准合约')" prop="shortName">
            <Select
              :placeholder="$t('标准合约')"
              filterable
              clearable
              v-model="addForm.isETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('税率')" prop="code" required>
            <Input v-model="addForm.code" :placeholder="$t('税率')"/>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('合约类型')" prop="shortName" required>
            <Select
              :placeholder="$t('合约类型')"
              filterable
              clearable
              v-model="addForm.isETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('合约周期')" prop="shortName" required>
            <Select
              :placeholder="$t('合约周期')"
              filterable
              clearable
              v-model="addForm.isETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('特殊合约类型')" prop="shortName" required>
            <Select
              :placeholder="$t('特殊合约类型')"
              filterable
              clearable
              v-model="addForm.isETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('第一个交易日')" prop="code" required>
            <DatePicker type="date" placeholder="Select date"></DatePicker>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('最后交易日')" prop="isETrading" required>
            <DatePicker type="date" placeholder="Select date"></DatePicker>
          </FormItem>
        </Col>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('交割日')" prop="isETrading" required>
            <DatePicker type="date" placeholder="Select date"></DatePicker>
          </FormItem>
        </Col>
        <Col :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('是否启用期货')" prop="pledgeInterestRate">
            <i-switch v-model="addForm.is" />
          </FormItem>
        </Col>
      </Row>
    </Card>
    <Card>
      <p slot="title">{{$t('组合合约')}}</p>
      <Row>
        <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
          <FormItem :label="$t('合约腿数')" prop="shortName" required>
            <Input v-model="addForm.shortName" :placeholder="$t('合约腿数')"/>
          </FormItem>
        </Col>
        <template v-for="(item, index) in []">
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10" :key="'col' + index">
            <FormItem :label="$t('第') + index + $t('腿合约')" prop="shortName" :key="'instrument' + index" required>
              <Select
                :placeholder="$t('请选择')"
                filterable
                clearable
                v-model="addForm.isETrading"
              >
                <Option
                  v-for="(item, index) in enums.yONOptions"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </template>
      </Row>
    </Card>
    <Card>
      <p slot="title">{{$t('期权合约')}}</p>
        <Row>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('标的合约ID')" prop="shortName" required>
              <Input v-model="addForm.shortName" :placeholder="$t('标的合约ID')"/>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('行权价')" prop="shortName" required>
              <Input v-model="addForm.shortName" :placeholder="$t('行权价')"/>
            </FormItem>
          </Col>
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('期权权利方向')" prop="shortName" required>
              <Input v-model="addForm.shortName" :placeholder="$t('期权权利方向')"/>
            </FormItem>
          </Col>
        </Row>
    </Card>
  </Form>
  <div slot="footer">
    <Button class="margin-right-3" @click="backToList">{{$t('返回')}}</Button>
    <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
  </div>
</div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums';
import api from './api';

export default {
  data() {
    return {
      isShowAddModal: false,
      isEdit: false,
      enums,
      addForm: {
        code: '',
        fullName: '',
        shortName: '',
        isETrading: '',
        brokerId: '',
        pledgeProportion: '',
        pledgeInterestRate: '',
      },
    };
  },
  async mounted() {
    if(this.$route.query.is) {
      // 请求get数据
    }
  },
  methods: {
    onSave() {
      this.$router.push({name: 'specificInstrumentList'})
    },
    backToList() {
      this.$router.push({name: 'specificInstrumentList'})
    }
  },
};
</script>

<style>
</style>