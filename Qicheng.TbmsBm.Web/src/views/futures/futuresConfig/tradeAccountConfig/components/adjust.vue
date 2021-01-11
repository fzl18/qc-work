<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowAddModal" width="500">
      <p slot="header">
        <Icon type="md-flash" color="#ff9900"/>
        <span>{{$t('资金账户授权调整')}}</span>
      </p>
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Row>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('账户号')" prop="code">
              {{form.code}}
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('资金下限')" prop="friendlyName" required>
              <InputNumber v-model="form1.friendlyName" placeholder/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('资金预警线')" prop="englishName">
              <InputNumber v-model="form1.friendlyName" placeholder/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <p style="color: #ff9900">注：此时的授权修改会同步修改该期货账户在期货交易系统下的授权信息。</p>
          </Col>
        </Row>
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
