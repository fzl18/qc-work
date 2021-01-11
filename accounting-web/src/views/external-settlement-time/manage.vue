<template>
  <div>
    <Form
            :label-width="150"
            label-position="right"
            id="ManageForm"
            :model="item"
            :rules="itemRules"
            ref="ManageForm"
    >
      <Row type="flex" :gutter="4">
        <Col span="24" class-name="margin-bottom-10">
          <Row type="flex" :gutter="16">
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="资金账户" prop="tradeAccountId" required>
                <Select placeholder filterable clearable v-model="item.tradeAccountId">
                  <Option
                          v-for="(item, index) in commonData.foreignTradeAccounts"
                          :label="item.name"
                          :value="item.wfTradeAccountId"
                          :key="index"
                  >{{item.wfTradeAccountId}} - {{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="交易所" prop="exchangeId" required>
                <Select placeholder filterable clearable v-model="item.exchangeId">
                  <Option
                          v-for="(item, index) in commonData.foreignExchanges"
                          :label="item.shortName"
                          :value="item.wfCompanyId"
                          :key="index"
                  >{{item.wfCompanyId}} - {{item.shortName}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="今日/次日" priop="type">
                <Select placeholder filterable clearable v-model="item.type">
                  <Option
                          v-for="(item, index) in commonData.tradeSettlementDateConfigType"
                          :label="item.text"
                          :value="item.value"
                          :key="index"
                  >{{item.value}} - {{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="时间" prop="confTime">
                <TimePicker format="HH:mm" placeholder="" v-model="item.confTime"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="24">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="backToList">返回</Button>
            <Button type="primary" class="margin-right-3" @click="onSave">保存</Button>
          </Row>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
  import api from "./api";
  export default {
    name: "Spot-Trade-Record-Edit",
    props: ["id"],
    data() {
      return {
        commonData: {},
        item:{
          id: '',
          tradeAccountId: '',
          exchangeId: '',
          type: '',
          confTime: '',
          creationTime: '',
          lastManipulationTime: '',
          creatorId: '',
          lastManipulatorId: '',
          isDeleted: ''
        },
        itemRules: {},
        isEdit: !!this.id
      };
    },
    async created() {
      let commonData = await this.api.getCommonData("TradeSettlementDateConfig");
      this.commonData = commonData;
      if (this.isEdit) {
        this.item = await api.getById(this.id);
      }
    },
    methods: {
      async onSave() {
        if (!(await this.validate())) {
          return;
        }
        let data = { ...this.item };
        await api.save(data);
        this.$Message.success('添加成功');
        this.backToList();
      },
      validate() {
        return this.$refs["ManageForm"].validate(valid => valid);
      },
      backToList() {
        this.$router.push({
          name: "ExternalSettlementTimeList"
        });
      }
    }
  };
</script>
