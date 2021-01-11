<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    data () {
      return {}
    },
    computed: {
      sidebar () {
        return this.$store.state.app.sidebar
      },
      classObj () {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
</style>
