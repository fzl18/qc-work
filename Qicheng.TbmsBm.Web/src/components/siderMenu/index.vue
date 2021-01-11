<template>
  <expand-menu
    v-if="!isCollapsed"
    :activeName="activeMenu"
    :openNames="openMenu"
    :menuitemClasses="menuitemClasses"
    :sideMenu='sideMenu'
  >
  </expand-menu>
  <collapsed-menu
    v-else
    :activeName="activeMenu"
    :openNames="openMenu"
    :menuitemClasses="menuitemClasses"
    :sideMenu='sideMenu'
  >
  </collapsed-menu>
</template>

<script>
import collapsedMenu from './collapsedMenu'
import expandMenu  from './expandMenu'
import store from '@/store'
import path from 'path'
export default {
  components: {
    collapsedMenu,
    expandMenu
  },
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, matched } = route
      // if set path, the sidebar will highlight the path you set
      if(matched[0] && matched[1]) {
        return matched[0].path + matched[1].path
      }
      return ''
    },
    openMenu() {
      const route = this.$route
      let { matched } = route
      if (matched.length && matched[0]) {
        return [matched[0].name]
      }
      return []
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    },
    sideMenu() {
      return store.state.permission.addRoutes
    }
  },
  methods: {
    resolvePath(basePath, routePath) {
      routePath = routePath || ''
      return path.resolve(basePath, routePath)
    }
  }
}
</script>

<style scoped>
	.collapsed-menu span {
		width: 0px;
		transition: width 0.2s ease;
	}
	.collapsed-menu i {
		transform: translateX(5px);
		transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
		vertical-align: middle;
		font-size: 22px;
	}
</style>
