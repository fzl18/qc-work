<template>
 <Menu
    :active-name="activeName"
    theme="light"
    width="77px"
    :open-names="openNames"
    :class="menuitemClasses"
    ref = 'menu'
  >
    <Poptip
      trigger="hover"
      placement="right-start"
      title
      content="content"
      v-for="menu in sideMenu" :key="menu.path"
    >
      <Submenu
        :name="menu.name"
         class="collapse"
        :style="{color: openNames[0] === menu.name ? 'red': 'inherit'}"
      >
        <template :title="$t(menu.meta.title)" slot="title">
          <Icon :type="menu.meta.icon" size='20'/>
        </template>
      </Submenu>
      <div class="api" slot="content">
        <Card
          :title="$t(menu.meta.title)"
          icon="md-menu"
          :padding="0"
          shadow
          style="width: 200px;"
        >
          <CellGroup>
            <Cell
              :title="$t(submenu.meta.title)"
              :to="{name: submenu.name}"
              :style="{color: menu.path + submenu.path === activeName ? '#dd4b39': 'inherit'}"
               v-for="submenu in menu.children" :key="submenu.path"
            />
          </CellGroup>
        </Card>
      </div>
    </Poptip>
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

<style lang="less">
  .collapse{
    .ivu-menu-submenu-title-icon{
      display: none;
    }
  }
</style>