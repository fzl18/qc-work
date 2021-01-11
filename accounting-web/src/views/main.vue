<template>
  <div class="layout" style="height:100%">
    <Layout style="height:100%">
      <Header
              :style="{paddingLeft: isCollapsed?siderCollapsed+'px':siderExpand +'px', 'z-index': 7}"
              class="layout-header-bar"
      >
        <div class="loge" :style="{width: isCollapsed?'78px':'220px'}">
           <img src="../../src/assets/imgs/logo-new.png" style="vertical-align:inherit" title="期程科技"/>
          <span v-show="!isCollapsed">期程科技</span>
          <!-- <img src="../../src/assets/imgs/logo-main.png"
               :style="{verticalalign: center, height: '24px', width: '24px', marginTop: '-24px'}"/> -->
        </div>
        <Icon
                @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{margin: '0 20px',color:'#fff',dispaly:'inline-block'}"
                type="md-menu"
                size="24"
        ></Icon>
        <span class="title">风控清算管理平台</span>
        <Menu mode="horizontal" theme="light" class="orange">
          <MenuItem name="md-apps" @click.native="back">
            <Icon type="md-apps" title="返回主入口"/>
          </MenuItem>
          <Submenu name="md-person">
            <template slot="title">
              <Icon type="md-person"/>
              {{userDisplayName}}
            </template>
            <MenuItem name="help" @click.native="getHelp">帮助手册</MenuItem>
            <MenuItem name="logout" @click.native="onLogoff">退出登录</MenuItem>
          </Submenu>
        </Menu>
      </Header>
      <Layout>
        <Sider ref="side1"
               class="sider-menu"
               hide-trigger
               collapsible
               :collapsed-width="siderCollapsed"
               :width="siderExpand"
               v-model="isCollapsed"
               :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
          <Menu
                  width="auto"
                  :class="menuitemClasses"
                  :active-name="activeMenu"
                  :open-names="openNames"
                  :accordion="true"
          >
            <template v-if="!isCollapsed">
              <MenuItem to="/home" name="home">
                <Icon type="ios-home"/>
                <span class="sider-title">首页</span>
              </MenuItem>
              <Submenu v-for="(item,index) in (menuList.filter(function(x) { return x.showFlag}))" :key="index" :name="`${index}`">
                <template slot="title">
                  <Icon :type="item.meta.icon"></Icon>
                  <span class="sider-title">{{item.meta.title}}</span>
                </template>
                <template v-for="(childrenItem,childrenIndex) in item.children">
                    <Divider :key="`key-${childrenIndex}`" v-if="childrenItem.path == '/report-charts'"></Divider>
                  <MenuItem
                          :key="`key_${childrenIndex}`"
                          :name="`${index}-${childrenIndex}`"
                          :to="childrenItem.path"
                          v-if="isShowMenu(childrenItem.children[0].meta.permission) && !childrenItem.children[0].meta.second"
                  >
                    {{childrenItem.meta.title}}
                  </MenuItem>
                </template>
                <template v-for="(childrenItem,childrenIndex) in item.children">
                  <MenuItem
                          :key="`key_${childrenIndex}`"
                          :name="`${index}-${childrenIndex}`"
                          :to="childrenItem.path"
                          v-if="isShowMenu(childrenItem.children[0].meta.permission) && childrenItem.children[0].meta.second"
                  >
                    {{childrenItem.meta.title}}
                  </MenuItem>
                </template>
              </Submenu>
            </template>
            <template v-if="isCollapsed">
              <MenuItem to="/home" name="home">
                <Icon type="ios-home"/>
              </MenuItem>
              <Poptip
                      v-for="(item,index) in menuList"
                      :key="`poptip_${index}`"
                      trigger="hover"
                      placement="right-start"
                      title
                      content="content"
              >
                <MenuItem
                        :name="`poptip_menu-${index}`"
                        :style="{color: openNames.includes(`${index}`) ? 'red': 'inherit'}"
                >
                  <Icon :type="item.meta.icon"></Icon>
                </MenuItem>
                <div slot="content">
                  <Card
                          :title="item.meta.name"
                          :icon="item.meta.icon"
                          :padding="0"
                          shadow
                          :style="`${siderExpand}px`"
                  >
                    <CellGroup
                            v-for="(childrenItem,childrenIndex) in item.children"
                            :key="childrenIndex"
                    >
                      <Cell
                              :title="childrenItem.meta.title"
                              :to="childrenItem.path"
                              :style="{color: activeMenu === `${index}-${childrenIndex}` ? 'red': 'inherit'}"
                              v-if="isShowMenu(childrenItem.children[0].meta.permission)"
                      />
                    </CellGroup>
                  </Card>
                </div>
              </Poptip>
            </template>
          </Menu>
        </Sider>
        <layout :style="{marginLeft: isCollapsed?'78px':'220px'}">
          <Content :style="{marginTop: '50px'}">
            <Breadcrumb>
              <BreadcrumbItem v-for="(item,index) in breadcrumbItem" :key="index" :to="item.redirect ? '' : item.path">{{item.title}}</BreadcrumbItem>
            </Breadcrumb>
             <Divider></Divider>
            <router-view class="mainview" style="height: calc(100vh - 120px); overflow-y: auto; overflow-x: hidden;"/>
          </Content>
          <Footer>
            © {{currentYear}} QiCheng Tech Co. Ltd. All Rights Reserved.
            
            <span style="float: right; padding: 0 30px">{{versionId}}</span>
            </Footer>
        </layout>
      </Layout>
    </Layout>
    <Spin fix v-show="loading">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>
<script>
  import store from '@/store'
  import { menuRouters } from '@/router'
  import { mainUrl } from '@/utils/baseUrl'
  import goMainLogin from '@/utils/mainLogin'
  import { utils } from '@/utils/utils'
  import { api } from '@/api/api'

  export default {
    data () {
      return {
        currentYear: new Date().getFullYear(),
        siderExpand: 220,
        siderCollapsed: 78,
        isCollapsed: false,
        breadcrumbItem: [],
        openNames: [],
        activeMenu: '',
        userDisplayName: localStorage.getItem('userDisplayName') == 'undefined' ? '神秘人' : localStorage.getItem('userDisplayName'),
        versionId: ''
      }
    },
    async created () {
      await api.getPermissions()
      this.getBreadcrumb()
      this.getActiveMenu()
    },
    computed: {
      bmSiteUrl () {
        let tenantCode = localStorage.getItem('tenantCode')
        if (!tenantCode) {
          return mainUrl + '/Account/Index'
        } else {
          return mainUrl + `/-${tenantCode}/Account/Index`
        }
      },
      rotateIcon () {
        return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
      },
      menuitemClasses () {
        return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
      },
      menuList () {
         _.forEach(menuRouters, function (i) {
          let flag = 0
          _.forEach(i.children, function (t) {
            _.forEach(t.children, function (x) {
              if (utils.hasPermission(x.meta.permission)) {
                flag += 1
              }
            })
          })
          if (flag === 0) {
            i.showFlag = false
          } else {
            i.showFlag = true
          }
        })
        return menuRouters
      },
      loading () {
        return store.state.loading
      }
    },
    watch: {
      $route (to) {
        this.getBreadcrumb(to)
        this.getActiveMenu()
      }
    },
    beforeMount() {
      this.versionId = localStorage.getItem('versionId')
    },
    methods: {
      getActiveMenu () {
        let currentRouterName = this.$router.history.current.name
        let menuList = [...this.menuList]
        let menuItemIndex = -1
        let subMenu = _.find(menuList, d => {
          let mItem = _.find(d.children, r => {
            let mmItem = _.find(r.children, k => {
              return k.name === currentRouterName
            })
            return !!mmItem
          })
          if (mItem) {
            menuItemIndex = d.children.indexOf(mItem)
          }
          return !!mItem
        })
        let subMenuIndex = menuList.indexOf(subMenu)
        let activeMenu = ''
        let openNames = []
        if (subMenuIndex > -1 && menuItemIndex > -1) {
          activeMenu = `${subMenuIndex}-${menuItemIndex}`
          openNames = [`${subMenuIndex}`]
        }
        this.openNames = openNames
        this.activeMenu = activeMenu
        return { activeMenu, openNames }
      },
      collapsedSider () {
        this.$refs.side1.toggleCollapse()
      },
      getBreadcrumb (router) {
        router = router || this.$route
        let subBreadcrumbItem = _.chain(router.matched).slice(3)
          .map(x => {
            return { 
              title: x.meta.title,
              path: x.path
            }
          })
          .remove(y => {
            return !!y
          })
          .value()
          this.breadcrumbItem = [{title: '首页', path: '/'}, ...subBreadcrumbItem]
      },
      async onLogoff () {
        goMainLogin()
      },
      back () {
        window.open(this.bmSiteUrl)
      },
      getHelp () {
        window.open('/help')
      },
      isShowMenu (permission) {
        return utils.hasPermission(permission)
      }
    }
  }
</script>
<style scoped>
  .ivu-layout-sider {
    padding: 0;
    background: white;
    border-right: 1px solid #ddd;
    margin-top: 50px;
  }

  .ivu-layout-sider-children {
    border: 1px solid #ddd !important;
  }

  .ivu-layout-header {
    background: #850d13;
    height: 50px;
    line-height: 50px;
  }

  .ivu-breadcrumb {
    padding-left: 10px;
    /* margin: 8px 0 !important; */
  }
.ivu-divider-horizontal{
  margin: 5px 0 5px !important;
}
  .ivu-layout-content {
    background: white;
    padding: 10px;
    padding-bottom: 0;
    margin-left: 10px;
    /* margin-bottom: 10px; */
  }

  .layout .ivu-layout-footer {
    padding: 4px 4px 4px 10px;
    /* background: #f5f7f9; */
    background: white;
  }

  .loge {
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 9px;
    padding-top: 10px;
    font-weight: 700;
    font-size: 20px;
    color: white;
  }

  .loge > span {
    position: relative;
    top: -10px;
    left: 5px;
    line-height: 32px;
  }

  .ivu-menu {
    right: -1px;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .layout {
    /*position: relative;*/
    /*overflow: hidden;*/
  }

  .layout-header-bar {
    position: fixed;
    width: 100%;
    padding-right: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .menu-icon {
    transition: all 0.3s;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

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

  .header-nav {
    display: inline-block;
    width: calc(100% - 84px);
  }

  .orange {
    background: #850d13;
  }

  .orange li {
    padding: 0;
    float: right;
    margin-right: 4px;
  }

  .ivu-menu-horizontal {
    position: relative;
    top: -50px;
    margin-left: 64px;
    height: 50px;
    line-height: 50px;
  }

  .ivu-menu-light.ivu-menu-horizontal > .ivu-menu-item,
  .ivu-menu-light.ivu-menu-horizontal > .ivu-menu-submenu {
    color: white;
    border-bottom: none;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    position: absolute;
    top: 0;
    z-index: 999;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  ul.menu-item {
    padding-bottom: 70px;
  }

  .ivu-icon-md-person {
    font-size: 16px;
    margin-right: 0px;
  }

  .ivu-icon-md-apps {
    font-size: 18px;
  }

  .ivu-menu-vertical .ivu-menu-item {
    padding: 6px 24px;
  }
</style>
