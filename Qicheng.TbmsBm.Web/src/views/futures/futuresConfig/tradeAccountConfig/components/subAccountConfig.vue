<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowAddModal" width="50%" :title="$t('子账户（0000）权限配置')">
      <Form :model="form" ref="form" label-position="top">
        <p style="color: #ff9900">
          请将标准合约唯一标识以英文逗号（,）隔开的形式填入下拉文本框内，系统将识别为多个标准合约。<br>行情订阅标准合约需要在交易标准合约清单内。可以使用
          <a @click="fastConfig">快捷配置</a>
          进行标准合约快速勾选。
        </p>
        <Row>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem :label="$t('交易标准合约清单')" prop="pledgeInterestRate">
              <Input type="textarea" v-model="form.note" :rows="4"/>
            </FormItem>
          </Col>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem :label="$t('行情订阅标准合约清单')" prop="pledgeInterestRate">
              <Input type="textarea" v-model="form.note" :rows="4"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
    <Modal class="closePositionModal" v-model="isShow" width="70%" :title="$t('子账户（0000）权限配置')">
      <multi-select-modal :data="selectData" :originPrivilegeData="allData" @changeButtonStatus="selectOne"
                          ref="multiSelect">
        <template slot="queryArea">
          <Row type="flex" :gutter="16">
            <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
              <Select
                :placeholder="$t('作价市场')"
                filterable
                clearable
                v-model="query.corporationId"
              >
                <Option
                  v-for="(item, index) in commonData.corporations"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </Col>
            <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
              <Select
                :placeholder="$t('品类')"
                filterable
                clearable
                v-model="query.commodityTypeId"
              >
                <Option
                  v-for="(item, index) in commonData.commodityTypes"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}
                </Option>
              </Select>
            </Col>
          </Row>
        </template>
      </multi-select-modal>
      <div slot="footer">
        <span style="color: #ff9900">
          快捷配置只做权限添加，可勾选需要的权限后提交保存，系统会自动去重。
        </span>
        <Checkbox v-model="isSubscribe">默认订阅详情</Checkbox>
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import multiSelectModal from '@/components/multiSelectModal'
// import api from './api'
export default {
  components: { multiSelectModal },
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
      query: {
        corporationId: '',
        commodityTypeId: ''
      },
      selectData: [{
        text: '测试1',
        item: [{
          text: 'ddd'
        }]
      }],
      allData: [{
        text: '测试1',
        item: [{
          text: 'ddd'
        }]
      }],
      isShowAddModal: false,
      isShow: false,
      isSubscribe: false,
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
    fastConfig () {
      this.isShow = true
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
    },
    selectOne () {
      console.log(1)
    }
  }
}
</script>
