<template>
  <Modal
    class="closePositionModal"
    v-model="isShowAddModal"
    :title="$t('登录限制') + (isEdit ? $t('编辑') : $t('添加'))"
    width="900"
  >
    <Form
      :model="addForm"
      label-position="right"
      :label-width="120"
      ref="addForm"
    >
      <Row>
        <Col span="8" class-name="margin-bottom-10">
          <FormItem :label="$t('用户')" prop="wfUserId" required>
            <Select
              filterable
              clearable
              v-model="addForm.wfUserId"
              :disabled="isEdit"
            >
              <Option
                v-for="(item, index) in commonData"
                :label="item.name"
                :value="item.wfUserId"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem :label="$t('IP限制')" prop="ip">
            <Input type="textarea" v-model="addForm.ip" :rows="5" />
          </FormItem>
        </Col>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem :label="$t('Mac限制')" prop="mac">
            <Input type="textarea" v-model="addForm.mac" :rows="5" />
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Row>
        <Col :span="18" style="text-align: left; color: orange"
          ><Icon type="md-alert" size="16" />
          请将IP地址/MAC地址以英文分号(;)换行隔开后，填入文本框内，没有分号(;)隔开将识别为一个限制配置。示例：
          <br />
          192.0.0.0:8099 <br />
          192.0.0.0:8098</Col
        >
        <Col :span="6">
          <Button @click="isShowAddModal = !isShowAddModal">{{
            $t("返回")
          }}</Button>
          <Button type="primary" @click="onSave">{{ $t("保存") }}</Button>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
import { utils } from "@/utils/utils";
import enums from "@/utils/enums";
import api from "./api";
export default {
  props: ["commonData"],
  data() {
    return {
      isShowAddModal: false,
      isEdit: false,
      enums,
      addForm: {
        wfUserId: null,
        ip: null,
        mac: null,
      },
      userId: null,
      item: {}
    };
  },
  methods: {
    onAdd() {
      this.isShowAddModal = true;
      this.isEdit = false;
      this.$refs["addForm"].resetFields();
    },
    onSave() {     
      let {ip,mac} = this.addForm 
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if(!ip && !mac){
            this.$Message.error('IP限制与MAC限制不可全部为空！')
            return
          }
          // let data = {
          //   user: this.isEdit ?
          //     item.user
          //     : commonData.find( item => this.addForm.wfUserId == item.wfUserId),
          //   traderAddressBindings: this.isEdit ?
          //     item.traderAddressBindings
          //   : [],
          // };
          // if(this.isEdit){
          //   if(ip){
          //     let ipAddress = ip.split(';')
          //     let addressList = []
          //     _.uniq(_.compact(ipAddress)).forEach(item => {
          //       addressList.push(item.trim())
          //     });
          //     data.traderAddressBindings.push({
          //       id: 0,
          //       wfUserId: 0,
          //       traderId: "string",
          //       bindingType: 0,
          //       address: addressList.join(';')
          //     })
          //   }
          //   if(mac){
          //     let macAddress = mac.split(';')
          //     data.traderAddressBindings.push({
          //       id: 0,
          //       wfUserId: 0,
          //       traderId: "string",
          //       bindingType: 0,
          //       address: "string"
          //     })
          //   }
          // }else{

          // }
          let traderAddressBindings = []
          if(ip) {
            let ips = _.uniq(_.compact(ip.split(';')));
            console.log(ips)
            ips.forEach(val => {
              traderAddressBindings.push({
                bindingType: 1,
                address: val.trim()
              })
            });            
          }
          if(mac) {            
            let macs = _.uniq(_.compact(mac.split(';')))
            console.log(macs)
            macs.forEach(val => {
              traderAddressBindings.push({
                bindingType: 2,
                address: val.trim()
              })
            });            
          }

          api.save({
            user: { wfUserId:this.addForm.wfUserId},
            traderAddressBindings:traderAddressBindings
          }).then(res => {
            this.isShowAddModal = false;
            this.$parent.onSearch()
          });
        } else {
          return
        }
      });
    },
    onEdit(data) {
      this.isShowAddModal = true;
      this.isEdit = true;
      this.addForm.ip = data.IP
      this.addForm.mac = data.Mac
      this.addForm.wfUserId = data.wfUserId
      //请求数据填充
    },
  },
};
</script>

<style>
</style>