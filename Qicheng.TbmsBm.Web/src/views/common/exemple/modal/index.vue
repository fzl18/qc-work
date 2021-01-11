<template>
  <div>
     <Button @click="openConfirm">确认弹框</Button>
     <br>
     <br>
     <Button @click="openModal">模态框</Button>
     <Modal v-model="modal11"  width="60%">
         <p slot="header">
          <Icon type="md-cloud-upload"></Icon>
          <span>标题</span>
      </p>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modal11: false
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    openConfirm() {
      this.$Modal.confirm({
        title: '删除',
        content: '提示内容',
        onOk: () => {
        }
      })
    },
    openModal() {
      this.modal11 = true
    }
  }
}
</script>
