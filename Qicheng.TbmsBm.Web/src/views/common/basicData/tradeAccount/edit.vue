<template>
<div>
  <Modal class="closePositionModal" v-model="isShowAddModal" :title="(isEdit ? $t('修改') : $t('新增')) + $t('资金账户') " width="900">
      <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
        <Row>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="qctKey" required>
              <Input :disabled="isEdit" v-model="addForm.qctKey" :placeholder="$t('唯一标识')"/>
            </FormItem>
          </Col>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="name" required>
              <Input v-model="addForm.name" :placeholder="$t('名称')"/>
            </FormItem>
          </Col>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('账户号')" prop="userName" :required="addForm.isETrading">
              <Input v-model="addForm.userName" :placeholder="$t('账户号')"/>
            </FormItem>
          </Col>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('账户类型')" prop="tradeAccountTypeId" required style="width:90%;display:inline-block;margin-right:5px">
              <Select
                :placeholder="$t('账户类型')"
                filterable
                clearable
                v-model="addForm.tradeAccountTypeId"
              >
                <Option
                  v-for="(item, index) in commonData.accountTypes"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
            <Button type="success" icon="md-settings" @click="settings"></Button>
          </Col>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('法人')" prop="corporationId" required>
              <Select
                :placeholder="$t('法人')"
                filterable
                clearable
                v-model="addForm.corporationId"
              >
                <Option
                  v-for="(item, index) in commonData.corporations"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('经纪公司')" prop="brokerId" required>
              <Select
                :placeholder="$t('经纪公司')"
                filterable
                clearable
                v-model="addForm.brokerId"
              >
                <Option
                  v-for="(item, index) in commonData.brokers"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('结算币种')" prop="accountCurrencyId" required>
              <Select
                :placeholder="$t('结算币种')"
                filterable
                clearable
                v-model="addForm.accountCurrencyId"
              >
                <Option
                  v-for="(item, index) in commonData.currencies"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>          
          <Col span="11" class-name="margin-bottom-10">
            <FormItem :label="$t('是否启用期货')" prop="isETrading" required>
              <i-switch v-model="addForm.isETrading" :disabled="!canEdit" />
            </FormItem>
          </Col>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem :label="$t('备注')" prop="notes">
              <Input type="textarea" v-model="addForm.notes" :autosize="{minRows: 4,maxRows: 6}" :placeholder="$t('备注')" style="width:90%" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
    <Settings ref="settings" />
</div>    
</template>

<script>
import { utils } from "@/utils/utils";
import enums from "@/utils/enums";
import api from "./api";
import Settings from "./settings"
export default {
  props: {
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Settings,
  },
  data() {
    return {
      isShowAddModal: false,
      isEdit: false,
      canEdit: true,
      enums,
      addForm: {
        code: "",
        fullName: "",
        shortName: "",
        isETrading: false,
        brokerId: "",
        pledgeProportion: "",
        pledgeInterestRate: "",
      },
    };
  },
  watch: {
    'addForm.corporationId' (val) {
      let current = this.commonData.corporations.find(data => data.value == val)
      this.addForm.isETrading = current.isETrading
      this.canEdit = current.isETrading
    }
  },
  methods: {
    onAdd() {      
      this.isShowAddModal = true;
      this.isEdit = false;
      this.$refs.addForm.resetFields()
    },
    onSave() {
      this.$refs.addForm.validate((valid) => {
        if(valid){
          api.save(this.addForm).then(res => {
            this.isShowAddModal = false
            this.$parent.onSearch()
          })      
        }else{
          return
        }
      })      
    },
    onEdit(data) {
      this.isShowAddModal = true;
      this.isEdit = true;
      this.addForm = _.cloneDeep(data)
    },
    settings(data) {
      this.$refs['settings'].onEdit()
    },
    getAccountTypes() {
      api.GetAccountTypes().then(res => {
        const typeList = []
        res.forEach(item => {
          typeList.push({
            code: item.qctKey,
            value: item.id,
            text: item.name
          })
        })
        this.commonData.accountTypes = typeList
      })
    }
  },
};
</script>

<style>
</style>