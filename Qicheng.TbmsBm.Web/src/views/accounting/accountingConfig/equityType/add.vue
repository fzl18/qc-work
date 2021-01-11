<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowAddModal" :title="isEdit ? $t('修改') : $t('新增')" width="500">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Row>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="code" required>
              <Input v-model="form.code" placeholder/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="friendlyName" required>
              <Input v-model="form.friendlyName" placeholder/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('权益系数')" prop="equityFatorType" required>
              <Select
                placeholder
                filterable
                clearable
                v-model="form.equityFatorType"
              >
                <Option
                  v-for="(item, index) in commonData.equityFatorTypes"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('科目')" prop="subType" required>
              <Select
                transfer
                placeholder
                filterable
                clearable
                v-model="form.subType"
              >
                <Option
                  v-for="(item, index) in commonData.subTypes"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
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
import api from './api'
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
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isShowAddModal: false
    }
  },
  methods: {
    toggleShow () {
      this.isShowAddModal = !this.isShowAddModal
    },
    onSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form };
          await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
          this.toggleShow();
        }
      })
    }
  }
}
</script>
