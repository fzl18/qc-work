<template>
  <Modal
    class="closePositionModal"
    v-model="isShowAddModal"
    :title="$t('新增')"
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
          <FormItem :label="$t('用户名')">
            {{item.loginName}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('姓名')">
            {{item.name}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('邮箱')">
            {{item.mailAddress}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('英文名')">
            {{item.englishName}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('办公地址')">
            {{item.wfOfficeAddressId}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('办公电话')">
            {{item.officePhone}}
          </FormItem>
        </Col>
        
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('传真')">
            {{item.fax}}
          </FormItem>
        </Col>
        
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('通知类型')">
            {{item.notifyingAgents}}
          </FormItem>
        </Col>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem :label="$t('岗位')">
            {{roles}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('用户名(企业号)')" >
            {{item.wxUserId}}
          </FormItem>
        </Col>
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('钉钉id')">
            {{item.ddId}}
          </FormItem>
        </Col>        
        <Col span="11" class-name="margin-bottom-10">
          <FormItem :label="$t('信任设备号')">
            {{item.trustedDevice}}
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button @click="isShowAddModal = !isShowAddModal">{{
        $t("关闭")
      }}</Button>
      <!-- <Button type="primary" >{{ $t("保存") }}</Button> -->
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
      addForm: {},
      item: {
        wfUserRoleDto: []
      }
    };
  },
  computed: {
    roles() {
      let roles = []
      this.item.wfUserRoleDto.map(val=> {
        this.commonData.roles.map((data,index)=>{
          if(data.value == val.wfRoleInfoId){              
            roles.push(data.text)
          }            
        })          
      })
      return roles.join(', ')
    }
  },
  methods: {
    onShow(data) {
      this.isShowAddModal = true;
      data.notifyingAgents = utils.showText(this.commonData.NotifyingAgentType,data.notifyingAgents) 
      this.item = data
    },
  },
};
</script>

<style>
</style>