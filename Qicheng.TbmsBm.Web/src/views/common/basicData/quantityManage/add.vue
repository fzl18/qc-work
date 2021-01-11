<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowAddModal" :title="isEdit ? $t('修改') : $t('新增')" width="500">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Row>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="qctKey" required>
              <Input v-model="form.qctKey" placeholder :disabled="isEdit"/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('量分类')" prop="quantityKind" required>
              <Select
                placeholder
                filterable
                clearable
                transfer
                v-model="form.quantityKind"
              >
                <Option
                  v-for="(item, index) in commonData.QuantityKind"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('量名称')" prop="name" required>
              <Input v-model="form.name" placeholder/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('量英文名称')" prop="englishName" required>
              <Input v-model="form.englishName" placeholder/>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('强度、广延')" prop="physicalCategory" required>
              <Select
                transfer
                placeholder
                filterable
                clearable
                transfer
                v-model="form.physicalCategory"
              >
                <Option
                  v-for="(item, index) in commonData.QuantityTypePhysicalCategory"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="22" class-name="margin-bottom-10">
            <FormItem :label="$t('是否关联成分')" prop="isRelateComponent" required>
              <i-switch v-model="form.isRelateComponent" />
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
    }
  },
  data () {
    return {
      isShowAddModal: false,
      form: {
        qctKey: '',
        quantityKind: '',
        name: '',
        englishName: '',
        physicalCategory: '',
        isRelateComponent: false
      },
      defaultForm: {
        qctKey: '',
        quantityKind: '',
        name: '',
        englishName: '',
        physicalCategory: '',
        isRelateComponent: false
      }
    }
  },
  methods: {
    toggleShow () {
      this.isShowAddModal = !this.isShowAddModal
    },
    add () {
      this.toggleShow()
      this.$refs['form'].resetFields()
      this.form = _.cloneDeep(this.defaultForm)
    },
    edit (row) {
      this.toggleShow()
      this.$refs['form'].resetFields()
      this.form = _.cloneDeep(row)
    },
    onSave () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form };
          if (this.isEdit) {
            await api.update(data);
          } else {
            await api.create(data);
          }
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
          this.toggleShow();
          this.$emit('onSearch')
        }
      })
    }
  }
}
</script>
