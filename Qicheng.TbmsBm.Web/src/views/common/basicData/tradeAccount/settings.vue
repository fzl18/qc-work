<template>
  <div>
    <Modal
      class="closePositionModal"
      v-model="isShowSettingModal"
      :title="$t('账户类型')"
      width="500"
    >
      <Form
        :model="addForm"
        label-position="right"
        :label-width="0"
        ref="addForm"
      >
        <Table size="small" max-height="400" border class="margin-bottom-10" :loading="false" :columns="setTypeColumns" :data="setTypeData"></Table>
      </Form>
      <div slot="footer">
        <Button @click="isShowSettingModal = !isShowSettingModal">{{
          $t("返回")
        }}</Button>
        <Button type="primary" @click="onSave">{{ $t("保存") }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from "@/utils/utils";
import api from "./api";
export default {
  name: "settings",
  data() {
    return {
      isShowSettingModal: false,
      addForm: {},
      setTypeColumns: [{
        align: 'center',
        renderHeader: () => <span><span class="error">*</span>唯一标识</span>,
        render: (h, { row, index }) => {
          let that = this;
          return(row.id ? <span>{row.qctKey}</span> : h('Input', {
          props: {
            value: row.qctKey,
            key: 'qctKey' + index
          },
          on: {
            input (value) {
                that.$set(that.setTypeData[index], 'qctKey', value)
              }
          }
          })
        )}
      }, {
        align: 'center',
        renderHeader: () => <span><span class="error">*</span>名称</span>,
        render: (h, { row, index }) => {
          let that = this
          return h('Input', {
            props: {
              value: row.name,
              key: 'name' + index
            },
            on: {
              input (value) {
                that.$set(that.setTypeData[index], 'name', value)
              }
            }
          })
        }
      }, {
        align: 'center',
        width: 60,
        renderHeader: (h) => {
          let that = this
          return h('Icon', {
            props: {
              color: '#2d8cf0',
              type: 'md-add',
              size: '16'
            },
            style: {
              cursor: 'pointer'
            },
            on: {
              click() {
                that.setTypeData.push({
                  qctKey: '',
                  name: '',
                  id: 0
                })
              }
            }
          })
        },
        render: (h, { index }) => {
          let that = this
          return h('Icon', {
            props: {
              type: 'md-remove',
              size: '16',
              color:'#ed4014',
              key: 'button' + index
            },
            style: {
              margin: 'auto',
              display: 'block',
              cursor: 'pointer'
            },
            on: {
              click() {
                that.setTypeData[index] = {}
                that.setTypeData.splice(index, 1)
              }
            }
          })
        }
      }],
      setTypeData: [{
        qctKey: '',
        name: ''
      }],
    };
  },
  mounted() {},
  methods: {
    onEdit() {
      this.isShowSettingModal = true;
      api.GetAccountTypes().then(data => {
        this.setTypeData = data     
      })
    },
    onSearch(data) {      
      api.GetAccountTypes().then(res => {
        this.setTypeData = res
      })
    },
    onSave() {
      console.log(this.setTypeData)
      api.SaveAccountTypes(this.setTypeData).then(() => {
        this.$parent.getAccountTypes()
        this.isShowSettingModal = false;
      })
    }
  },
};
</script>

<style scoped lang='less'>

</style>