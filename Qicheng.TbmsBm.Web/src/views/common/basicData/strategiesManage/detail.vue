<template>
  <Modal
    class="closePositionModal"
    v-model="isShowAddModal"
    :title="$t('策略详情')"
    width="900"
  >
    <Form
      :model="addForm"
      label-position="right"
      :label-width="120"
      ref="addForm"
    >
      <Row>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('唯一标识')" class="bold">
            <span>{{addForm.qctKey}}</span>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('名称')" class="bold">
            <span>{{addForm.name}}</span>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('上级策略')" class="bold">
            <span>{{addForm.parentId}}</span>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('是否最小')" class="bold">
            <span>{{addForm.isAtomic ? '是' : '否'}}</span>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('是否启用期货')" class="bold">
            <span>{{addForm.isETrading ? '是' : '否'}}</span>
          </FormItem>
        </Col>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem :label="$t('关联利润中心')" class="bold">
            <span>{{addForm.AccountingEntityNames}}</span>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('备注')" class="bold">
            <span>{{addForm.note}}</span>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
</template>

<script>
import { utils } from "@/utils/utils";
import enums from "@/utils/enums";
import api from "./api";
export default {
  data() {
    return {
      isShowAddModal: false,
      isEdit: false,
      enums,
      addForm: {
        qctKey: "",
        name: "",
        shortName: "",
        isETrading: "",
        isAtomic: "",
        pledgeProportion: "",
        pledgeInterestRate: "",
      },
    };
  },
  methods: {
    onShow(data) {
      this.isShowAddModal = true;
      console.log(data)
      if(data.wfStrategyAccountingEntityRelations && data.wfStrategyAccountingEntityRelations.length){
        let names = []
        data.wfStrategyAccountingEntityRelations.forEach(item => {
          names.push(item.accountEntityName)
        });
        data.AccountingEntityNames = names.join(', ')
      }
      
      this.addForm = data
      
      //请求数据填充
    },
  },
};
</script>

<style lang="less" scoped>
.bold{
    font-weight: bold;
    span{
      font-weight: normal;
    }
}

</style>