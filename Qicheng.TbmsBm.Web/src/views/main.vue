<template>
  <div class="layout" style="height: 100vh;">
    <Layout style="height:100%">
      <Header class='header'>
        <Menu mode="horizontal" :theme="theme" active-name="1">
          <div v-if="!isCollapsed" class="logo">
            <img :title="$t('qichengTech')" src="@/assets/images/logo-new.png">
            <span>{{$t('qichengTech')}}</span>
          </div>
          <div v-if="isCollapsed" class="logo logo-mini">
            <img :title="$t('qichengTech')" src="@/assets/images/logo-new.png">
          </div>
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24" style="color: #ffffff"></Icon>
          <div class="title">
            <span>主数据运维管理平台</span>
          </div>
          <!-- <div class="layout-title">

          </div>-->
          <div class="layout-nav">
            <Locales style="float: right;"></Locales>
            <MenuItem name="4" style="float: right;padding-right:10px !important;">
            <a target="_blank"  :href="bmSiteUrl + '/Account/Index'">
              <Icon type="ios-apps" :title="$t('backToEntry')" />
            </a>
            </MenuItem>
            <Submenu name="3" style="float: right;">
              <template slot="title">
                <Icon type="md-person" />
                {{userName}}
              </template>
              <MenuItem name="3-1" @click.native="onHelp" style="margin-bottom:10px">帮助手册</MenuItem>
              <MenuItem name="3-2" @click.native="onLogoff" v-if="hasLogin">{{$t('logout')}}</MenuItem>
              <MenuItem name="3-3" :to="{path:'/login'}" v-if="!hasLogin">{{$t('login')}}</MenuItem>
            </Submenu>
            <MenuItem name="3">
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider ref="side1"
         class="sider-menu"
         width='220'
         hide-trigger collapsible :style="{background: '#fff','margin-top':'50px'}" :collapsed-width="78" v-model="isCollapsed">
          <sider-menu :isCollapsed= isCollapsed />
        </Sider>
        <Layout :style="{marginLeft: isCollapsed?'78px':'220px'}">
          <Content :style="{marginTop: '50px'}">
            <Breadcrumb>
              <BreadcrumbItem>
              <router-link to="/">{{$t('index')}}</router-link></BreadcrumbItem>
              <BreadcrumbItem v-for="(item, index) in breadcrumbs" :key="index">
                <router-link :to="item.path">{{item.name}}</router-link>
              </BreadcrumbItem>
            </Breadcrumb>
             <Divider></Divider>
          <div  class="mainView" >
            <router-view style="margin-right: 10px" v-if="!$route.meta.keepAlive" ></router-view>
            <keep-alive>
              <router-view style="margin-right: 10px" v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
          </div>
          </Content>
          <div class="footer">
            <span>© {{currentYear}} QiCheng Tech Co. Ltd. All Rights Reserved.</span>
            <span style="float: right;">{{versionId}}</span>
          </div>
        </Layout>
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
// import { http } from '@/utils/http'
import Locales from '@/components/Locales'
import { systemConfig } from '@/theme.config'
import siderMenu from '@/components/siderMenu/index.vue'
export default {
  name: 'Main',
  components: { Locales, siderMenu },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      theme: systemConfig.theme,
      isCollapsed: false,
      minHeight: '',
      userName: '',
      bmSiteUrl: '',
      privileges: {},
      breadcrumbs: [],
      versionId: ''
    }
  },
  async mounted() {
    let collapsed = JSON.parse(localStorage.getItem('isCollapsed')) || false
    this.isCollapsed = collapsed
    // let self = this
    // self.calcMinHeight()
    // window.onresize = () => {
    //   return (() => {
    //     self.calcMinHeight()
    //   })()
    // }

    let userName = localStorage.getItem('userName') || ''
    this.userName = userName

    //系统配置 入口地址
    let bmSiteUrl = localStorage.getItem('bmSiteUrl')
    if (!bmSiteUrl) {
      bmSiteUrl = await this.http.get('api/common/getbmsiteurl')
      localStorage.setItem('bmSiteUrl', bmSiteUrl)
    }
    this.bmSiteUrl = bmSiteUrl
    //根据用户Id获取权限
    // await this.api.getPermissions()
  },
  beforeMount() {
    this.versionId = localStorage.getItem('versionId')
  },
  watch: {
    minHeight(val) {
      this.minHeight = val
    },
    $route: {
      handler(to) {
        this.getBreadcrumb(to)
      },
      immediate: true
    }
  },
  computed: {
    rotateIcon() {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    },
    loading() {
      return store.state.loading
    },
    // breadcrumbs() {
    //   return store.state.breadcrumbs
    // },
    // activeMenu() {
    //   let activeMenu = store.state.activeMenu
    //   return activeMenu
    // },
    hasLogin() {
      let token = localStorage.getItem('token')
      return !!token
    }
  },
  methods: {
    calcMinHeight() {
      // let windowHeight = window.innerHeight
      // let headerHeight = document.querySelector('.ivu-layout-header').clientHeight
      // let contentHeight = document.querySelector('.ivu-layout-content').clientHeight
      // let breadcrumbHeight = document.querySelector('.ivu-breadcrumb').clientHeight
      // let footerHeight = document.querySelector('.footer').clientHeight
      // let lMinHeight = windowHeight - headerHeight - footerHeight - breadcrumbHeight - 2
      // store.commit('setIvuLayoutContentHeight', lMinHeight)
      // this.minHeight = `${lMinHeight}px`
    },
    collapsedSider() {
      // let result = this.$refs.side1.toggleCollapse()
      localStorage.setItem('isCollapsed', this.isCollapsed)
    },
    async onLogoff() {
      let { mainLoginUrl } = await this.api.getMainLoginUrl()
      const MODULE = 16
      var currentRouter = this.$router.history.current.fullPath
      let host = window.location.host
      var returnUrl = `http://${host}/fastlogin?redirect=${currentRouter}`
      let newUrl =
        mainLoginUrl +
        this.utils.param({
          module: MODULE,
          returnUrl
        })
      localStorage.clear()

      window.location.href = newUrl
    },
    onHelp() {
      window.location.href = '/help'
    },
    getBreadcrumb (router) {
      router = router || this.$route
      this.breadcrumbs = router.matched.slice(1).filter(matched => {
        if(matched.meta && matched.meta.title) {
          return matched.meta.title
        }
      }).map((item) => {
        return {
          name: item.meta.title,
          path: item.path
        }
      })
    }
  }
}
</script>
<style scoped>
.mainView{
  height: calc(100vh - 134px);
  overflow-y: auto;
  overflow-x: hidden;
}
.layout {
  /* border: 1px solid #d7dde4; */
  background: #f5f7f9;
  position: relative;
  /* border-radius: 4px; */
  /* overflow: hidden; */
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
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
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
.ivu-layout-header {
  height: 50px;
}
.ivu-menu-horizontal {
  height: 50px;
  line-height: 50px;
}
.ivu-menu-dark {
  background: #850d13;
}
.ivu-menu-primary {
  background: #3c8dbc;
}
.ivu-menu-yellew {
  background: #f39c12;
}
.ivu-layout-header {
  padding: 0;
}
.ivu-breadcrumb {
    padding-left: 10px;
    /* margin: 8px 0 0!important; */
}
.ivu-divider-horizontal{
  margin: 10px 0 10px !important;
}
.logo {
  color: #ffffff;
  width: 200px;
  float: left;
  padding-left: 20px;
  font-weight: 700;
  font-size: 20px;
}
.logo img {
  position: relative;
  top: 10px;
}

.logo.logo-mini {
  width: 78px;
}

.title {
  color: #ffffff;
  width: 200px;
  float: left;
  /* padding-left: 20px; */
  font-size: 20px;
  font-weight: 700;
}

.layout .header {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 10;
    padding: 0;
}
.layout-header-bar {
  background: #fff;
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
  min-width: 69px;
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

.ivu-icon.ivu-icon-md-menu.menu-icon {
  line-height: 50px;
  float: left;
}

.ivu-menu-vertical {
  height: 100%;
}

.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-horizontal .ivu-menu-submenu {
  padding: 0 5px !important;
}
.ivu-layout-content {
  background: white;
  padding: 10px 10px 0 10px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.sider-menu {
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  flex: 0 0 220px;
  position: fixed;
  height: 100vh;
  left: 0px;
  z-index: 1000;
  /* overflow-x: auto; */
}
</style>
