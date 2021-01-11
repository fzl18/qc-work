<template>
  <Modal
    class="closePositionModal"
    v-model="isShowAddModal"
    :title="isEdit ? $t('修改') : $t('新增')"
    width="900"
  >
    <Form
      :model="addForm"
      label-position="right"
      :label-width="120"
      ref="addForm"
      :rules="ruleValidate"
    >
      <Row>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('用户名')" prop="loginName" required>
            <Input v-model="addForm.loginName"/>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('姓名')" prop="name" required>
            <Input v-model="addForm.name"  />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('邮箱')" prop="mailAddress" required>
            <Input v-model="addForm.mailAddress"  />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('英文名')" prop="englishName">
            <Input v-model="addForm.englishName"  />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('办公地址')" prop="wfOfficeAddressId">
            <Select
              filterable
              clearable
              transfer
              v-model="addForm.wfOfficeAddressId"
            >
              <Option
                v-for="(item, index) in commonData.officeAddress"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('办公电话')" prop="officePhone">
            <Input v-model="addForm.officePhone" />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('岗位')" prop="wfUserRole">
            <Select multiple filterable clearable transfer v-model="addForm.wfUserRole">
              <Option
                v-for="(item, index) in commonData.roles"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('传真')" prop="fax">
            <Input
              v-model="addForm.fax"
              type="number"
            />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('信任设备号')" prop="trustedDevice">
            <Input
              v-model="addForm.trustedDevice"
              type="number"
            />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('通知类型')" prop="notifyingAgents">
            <Select
              filterable
              clearable
              multiple
              transfer
              v-model="addForm.notifyingAgents"
            >
              <Option
                v-for="(item, index) in commonData && commonData.NotifyingAgentType.filter(val=> val.key == 'WeChat' || val.key == 'DingDing' )"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('钉钉id')" prop="ddId">
            <Input
              v-model="addForm.ddId"
              type="number"
            />
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('用户名(企业号)')" prop="wxUserId">
            <Input
              v-model="addForm.wxUserId"
              type="number"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button @click="isShowAddModal = !isShowAddModal">{{
        $t("返回")
      }}</Button>
      <Button type="primary" @click="onSave">{{ $t("保存") }}</Button>
    </div>
  </Modal>
</template>

<script>
import { utils } from "@/utils/utils";
import enums from "@/utils/enums";
import api from "./api";
export default {
  props:{
    commonData: {
      type:Object,
      default:()=> {}
    }
  },
  data() {    
    return {
      isShowAddModal: false,
      isEdit: false,
      enums,
      addForm: {
        loginName: null,
        name: null,
        mailAddress: null,
        officePhone: null,
        fax: null,
        wxUserId: null,
        trustedDevice: null,
        notifyingAgents: null,
        englishName: null,
        wfOfficeAddressId: null,
        ddId: null,
        wfUserRole: []
      },
      ruleValidate: {
        mailAddress: [
            { required: true, message: this.$t('不能为空'), trigger: 'blur' },
            { type: 'email', message: this.$t('错误的邮箱地址'), trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    onAdd() {
      this.isShowAddModal = true;
      this.isEdit = false;
      this.$refs["addForm"].resetFields();
    },
    onSave() {
      this.$refs["addForm"].validate((valid) => {
        if(valid) {          
          const roleList = [];
          const wfUserId = this.addForm.wfUserId 
          if(this.isEdit && this.addForm.wfUserRoleDto.length) {
            let wfUserRoleId = this.addForm.wfUserRoleDto[0].wfUserRoleId
            this.addForm.wfUserRole.map(item => {
              roleList.push({
                wfRoleInfoId: item,
                wfUserId,
                wfUserRoleId
              })
            });            
          } else if(this.addForm.wfUserRole.length) {
            this.addForm.wfUserRole.map(item => {
              roleList.push({
                wfRoleInfoId: item,
                wfUserId
              })
            })
          };
          this.addForm.wfUserRoleDto = roleList;
          this.addForm.notifyingAgents = this.addForm.notifyingAgents.reduce( (pre,cur) => pre + cur)
          api.save(this.addForm).then(res=>{
            this.$parent.onSearch()
            this.isShowAddModal = false;
          })
        }else{
          return
        }
      })
    },
    onEdit(data) {
      this.isShowAddModal = true;
      this.isEdit = true;
      
      if(data.notifyingAgents){
        const notifyingAgents = []
        this.commonData.NotifyingAgentType.forEach(item => {
          if((item.value & data.notifyingAgents) !== 0){
            notifyingAgents.push(item.value)
          }
        });
        data.notifyingAgents = notifyingAgents
      }
      data.wfUserRole = []
      this.addForm = data;
      if(data.wfUserRoleDto.length){
        data.wfUserRoleDto.forEach(val=>{
          this.addForm.wfUserRole.push(val.wfRoleInfoId)
        })
      }
      //请求数据填充
    },
  },
};
</script>

<style>
</style>