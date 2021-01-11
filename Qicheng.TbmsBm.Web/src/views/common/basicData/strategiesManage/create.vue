<template>
  <div>
      <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
        <Row>
          <Col span="8" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="qctKey" required>
              <Input v-model="addForm.qctKey" :disabled="isEdit" />
            </FormItem>
          </Col>
          <Col span="8" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="name" required>
              <Input v-model="addForm.name" />
            </FormItem>
          </Col>
          <Col span="8" class-name="margin-bottom-10">
            <FormItem :label="$t('上级策略')" prop="parentId">
              <Select
                filterable
                clearable
                v-model="addForm.parentId"
              >
                <Option
                  v-for="(item, index) in strategies"
                  :label="item.name"
                  :value="item.wfTradingStrategyId"
                  :key="index"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="8" class-name="margin-bottom-10">
            <FormItem :label="$t('是否最小')" prop="isAtomic" required>
              <i-switch v-model="addForm.isAtomic" ></i-switch>
            </FormItem>
          </Col>
          <Col span="8" class-name="margin-bottom-10">
            <FormItem :label="$t('是否启用期货')" prop="isETrading" required>
              <i-switch v-model="addForm.isETrading" ></i-switch>
            </FormItem>
          </Col>
          <Col span="8" class-name="margin-bottom-10">
            <FormItem :label="$t('关联利润中心')" prop="brokerId">
              <Button type="primary" icon="md-add" @click="showProfitCenterModle">{{$t('添加')}}</Button>
              <div>已选择{{this.checkProfitList.length }}个利润中心</div>
            </FormItem>
          </Col>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem :label="$t('备注')" prop="pledgeInterestRate">
              <Input type="textarea" v-model="addForm.note" :rows="4" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="back" style="margin-right:10px">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
      <ProfitCenterTree ref="profitCenterTree" :commonData="commonData" @getChecked="getChecked"/>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import api from "./api";
import ProfitCenterTree from "./profitCenterTree"

export default {
  name: 'strategiesCreate',
  components: {
    ProfitCenterTree,
  },
  data() {
    return {
      isShowAddModal: false,
      isShowPassWordModal: false,
      isEdit: false,
      enums,
      strategies: [],
      commonData: {
        allAccountingEntities: []
      },
      addForm: {
        parentId: null,
        qctKey: null,
        name: null,
        isAtomic: false,
        isETrading: false,
        note: null
      },
      checkProfitList:[],
    };
  },
  created() {
    if(!Object.keys(this.$route.params).length) {
      this.$router.push('/strategies')
    }
    console.log(this.$route.params)
    let {isEdit, commonData, data} = this.$route.params
    this.isEdit = isEdit
    this.commonData = commonData
    if(isEdit){
      this.addForm = data
    }    
  },
  mounted() {    
    api.selectList().then(res => {
      this.strategies = res.list.filter(item => !item.isAtomic)
    })
    if(this.isEdit && this.addForm.wfStrategyAccountingEntityRelations){
      this.addForm.wfStrategyAccountingEntityRelations.forEach(item => {        
        this.checkProfitList.push({
          text: item.accountEntityName,
          value: item.wfAccountingEntityId
        })
      })
    }
  },
  methods: {
    onSave() {
      this.$refs.addForm.validate(valid => {
        if(valid){
          let wfStrategyAccountingEntityRelations = []
          if(this.checkProfitList.length){
            this.checkProfitList.forEach(val => {
              wfStrategyAccountingEntityRelations.push({
                accountEntityName: val.text,
                // wfStrategyAccountingEntityRelationId: 0,
                // wfTradingStrategyId: 0,
                wfAccountingEntityId: val.value
              })
            })            
          }
          api.save({
            wfStrategyAccountingEntityRelations: wfStrategyAccountingEntityRelations.length ? wfStrategyAccountingEntityRelations : null,
            ...this.addForm,
          }).then(res => {
            this.back()
          })
        }else{
          return
        }
      })
    },    
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    handlePassWord() {
      this.isShowPassWordModal = true
    },
    showProfitCenterModle() {
      if(this.checkProfitList.length){
        this.checkProfitList.forEach(data => {
          this.commonData.allAccountingEntities.forEach(item => {
            if(item.value == data.value){
              item.checked = true
            }
          })
        })
      }
      this.$refs['profitCenterTree'].onShow()
    },
    getChecked(data) {
      this.checkProfitList = data
    },
    back() {
      this.$router.go(-1)
    }
  },
};
</script>

<style scoped lang='less'>
.icoBtn{
  margin-top:5px;
  color:#2d8cf0;
  cursor: pointer;
}
</style>
