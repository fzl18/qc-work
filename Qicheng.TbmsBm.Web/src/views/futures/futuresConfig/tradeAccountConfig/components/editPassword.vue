<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowAddModal" width="500">
      <p slot="header">
        <Icon type="md-flash" color="#ff9900"/>
        <span>{{$t('资金账户密码实时修改')}}</span>
      </p>
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Tabs type="card" v-model="currentTab">
          <TabPane label="期货系统密码修改" name="tab1">
            <Row>
              <Col span="22" class-name="margin-bottom-10">
                <FormItem :label="$t('账户号')" prop="code">
                  {{form.code}}
                </FormItem>
              </Col>
              <Col span="22" class-name="margin-bottom-10">
                <FormItem :label="$t('新密码')" prop="friendlyName" :required="isCurrentTab1">
                  <Input v-model="form.friendlyName" type="password" password placeholder/>
                </FormItem>
              </Col>
              <Col span="22" class-name="margin-bottom-10">
                <p style="color: #ff9900">注：此时的密码修改会同步修改该期货账户在期货交易系统下的密码。</p>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="经济公司密码修改" name="tab2">
            <Row>
              <Col span="22" class-name="margin-bottom-10">
                <FormItem :label="$t('账户号')" prop="code">
                  {{form.code}}
                </FormItem>
              </Col>
              <Col span="22" class-name="margin-bottom-10">
                <FormItem :label="$t('原密码')" prop="friendlyName" :required="!isCurrentTab1">
                  <Input v-model="form1.friendlyName" type="password" password placeholder/>
                </FormItem>
              </Col>
              <Col span="22" class-name="margin-bottom-10">
                <FormItem :label="$t('新密码')" prop="englishName" :required="!isCurrentTab1">
                  <Input v-model="form1.friendlyName" type="password" password placeholder/>
                </FormItem>
              </Col>
              <Col span="22" class-name="margin-bottom-10">
                <FormItem :label="$t('确认密码')" prop="englishName" :required="!isCurrentTab1">
                  <Input v-model="form1.friendlyName" type="password" password placeholder/>
                </FormItem>
              </Col>
              <Col span="22" class-name="margin-bottom-10">
                <p style="color: #ff9900">注：此时的密码修改会同步经纪公司修改经纪公司的密码<br>修改成功后会同时修改期货系统的账户密码</p>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import api from './api'
export default {
  props: {
    commonData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowAddModal: false,
      form: {
        code: ''
      },
      form1: {
        friendlyName: ''
      },
      currentTab: 'tab1'
    }
  },
  computed: {
    isCurrentTab1 () {
      return this.currentTab === 'tab1'
    }
  },
  methods: {
    toggleShow () {
      this.isShowAddModal = !this.isShowAddModal
    },
    onSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form }
          // await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功')
          this.toggleShow()
        }
      })
    }
  }
}
</script>
