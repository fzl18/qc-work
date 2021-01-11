<template>
  <Modal
    class="closePositionModal"
    v-model="isShowPassWordModal"
    :title="$t('设置登录密码')"
    width="500"
  >
    <Form
      :model="setPassWordForm"
      label-position="right"
      :label-width="120"
      ref="setPassWordForm"
    >
      <Row>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem :label="$t('用户名')" prop="loginName">
            <span> {{item.name}}</span>
          </FormItem>
        </Col>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem :label="$t('邮箱')" prop="name">
            <span> {{item.mailAddress}}</span>
          </FormItem>
        </Col>
        <Col span="22" class-name="margin-bottom-10">
          <FormItem
            :label="$t('新密码')"
            prop="passWord"
            required
            style="width: 80%; margin-right: 5px; display: inline-block"
          >
            <span class="box">{{ passWord ? passWord : $t('点击刷新获取随机密码')}}</span><Icon type="md-refresh" size="22" class="icoBtn" @click="generateNewPassword" />
          </FormItem>          
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button @click="isShowPassWordModal = !isShowPassWordModal">{{
        $t("返回")
      }}</Button>
      <Button type="primary" @click="onSave">{{ $t("保存") }}</Button>
    </div>
  </Modal>
</template>

<script>
import api from "./api"
export default {
  data() {
    return {
      isShowPassWordModal: false,
      setPassWordForm:{},
      passWord: '',
      item: {},
    };
  },
  methods: {
    handlePassWord(data) {
      this.item = data
      this.isShowPassWordModal = true;
    },
    onSave() {
        api.saveNewPassword( this.item.wfUserId,this.passWord).then(()=>{
          this.isShowPassWordModal = false
        })
    },
    async generateNewPassword() {
      let pw = await api.generateNewPassword();
      this.passWord = pw
    }
  },
};
</script>

<style lang="less">
  .icoBtn{
    color:#2d8cf0;
    cursor: pointer;
    position: relative;
    top: 3px;
    left: 5px;
  }
  .box{
    background:rgba(255, 190, 49,.9);
    display: inline-block;
    padding: 0 6px;
  }
</style>