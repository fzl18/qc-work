<template>
  <div id="app">
    <router-view/>
    <Modal v-model="isShowMessageModal" :closable="false" @on-close="close" title="提示">
      <div>
        <p>{{message}}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="close">{{$t('ok')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import store from '@/store';
export default {
  name: 'app',
  computed: {
    isShowMessageModal: {
      get() {
        return store.state.isShowMessageModal;
      }
    },
    message() {
      return store.state.message;
    }
  },
  methods: {
    close() {
      store.commit('hideModal');
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
