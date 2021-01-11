<template>
  <Menu
    accordion
    :active-name="activeName"
    theme="light"
    width="220px"
    :open-names="openNames"
    :class="menuitemClasses"
    class="expand"
    ref = 'menu'
  >
    <Submenu :name="menu.name" v-for="menu in sideMenu" :key="menu.path">
      <template slot="title">
        <Icon :type="menu.meta.icon" />
        <span>{{$t(menu.meta.title)}}</span>
      </template>
      <MenuItem
        v-for="submenu in menu.children" :key="submenu.path"
        tag="a"
        :name="menu.path + submenu.path"
        :to="submenu.path"
      >
        <span>{{$t(submenu.meta.title)}}</span>
      </MenuItem>
    </Submenu>
  </Menu>
</template>

<script>
import path from 'path'

export default {
  props: {
    activeName: {
      default: '',
      type: String
    },
    openNames: {
      default: () => [],
      type: Array
    },
    menuitemClasses: {
      default: () => [],
      type: Array
    },
    sideMenu: {
      default: () => [],
      type: Array
    }
  },
  watch: {
    openNames(o, n) {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened(); // 更新展开状态
      });
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