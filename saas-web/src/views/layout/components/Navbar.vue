<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <breadcrumb class="breadcrumb-container"></breadcrumb>
        <div class="right-menu">
            <el-dropdown class="avatar-container right-menu-item" size="medium" placement="bottom-end">
                <span>{{name}}</span><i class="el-icon-caret-bottom"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <span @click="doChangePassword" style="display:block;">修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item :divided="true">
                        <span @click="logout" style="display:block;">登出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "name"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },

    doChangePassword() {
      this.$router.push({
        path: "/change-password"
      });
    },

    logout() {
      this.$store.dispatch("FedLogOut").then(() => {
        location.reload();
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0 !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>
