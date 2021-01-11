<template>
    <div>
        <div class="login-container">
            <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
                <div class="title">
                    <img src="../../assets/qicheng-logo.png" alt="QiCheng Tech" />
                </div>
                <h3 class="title">标准数据管理系统</h3>
                <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                  <svg-icon icon-class="user" />
                </span>
                    <el-input name="username" autoComplete="on" autofocus placeholder="用户名" type="text" v-model="loginForm.username" />
                </el-form-item>
                <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                    <el-input name="password" :type="pwdType"
                              autoComplete="on"
                              placeholder="密码"
                              v-model="loginForm.password"
                              @keyup.enter.native="handleLogin"/>
                    <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;"
                               :loading="loading"
                               @click.native.prevent="handleLogin">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <el-dialog title="修改初始密码"
                       width="30%"
                       :visible.sync="changePasswordDialog"
                       :show-close="false"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false">
                <el-form :model="newPassword"
                         :rules="newPasswordRules"
                         label-width="120px"
                         label-position="right"
                         :ref="newPasswordFormName"
                         status-icon>
                    <el-form-item label="初始密码" prop="oldPass">
                        <el-input type="password" v-model="newPassword.oldPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="pass">
                        <el-input type="password" v-model="newPassword.pass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="password" v-model="newPassword.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="doChangePassword" :loading="isChangingPass">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<script>
import axios from "axios";

export default {
  name: "login",
  data() {
    // const validatePass = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error("密码不能小于6位"));
    //   } else {
    //     callback();
    //   }
    // };
    const validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入初始密码"));
      } else {
        callback();
      }
    };

    const validatePass = (rule, value, callback) => {
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})"
      );
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!strongRegex.test(value)) {
        callback(
          new Error("请输入包含大写、小写、数字、特殊字符，长度大于6的密码")
        );
      } else {
        if (
          this.newPassword.checkPass !== "" &&
          strongRegex.test(this.newPassword.checkPass)
        ) {
          this.$refs[this.newPasswordFormName].validateField("checkPass");
        }
        callback();
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.newPassword.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
        // password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      changePasswordDialog: false,
      newPasswordFormName: "changePassword",
      newPassword: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      newPasswordRules: {
        oldPass: [{ validator: validateOldPass, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      isChangingPass: false,
      token: ""
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(response => {
              this.loading = false;
              if (response.changPassword) {
                this.changePasswordDialog = true;
                this.token = response.token;
              } else {
                this.$router.push({ path: "/" });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },

    doChangePassword() {
      const baseUserManageUrl = `api/users`;

      this.$refs[this.newPasswordFormName].validate(valid => {
        if (valid) {
          this.isChangingPass = true;
          axios
            .put(
              `${
                  Window.apiUrl
              }/${baseUserManageUrl}/current/change-password`,
              {
                passwordOld: this.newPassword.oldPass,
                passwordNew: this.newPassword.pass
              },
              {
                headers: {
                  token: this.token
                }
              }
            )
            .then(response => {
              if (response.status === 204) {
                this.changePasswordDialog = false;
                this.$message({
                  type: "success",
                  message: "修改密码成功，请重新登录"
                });
              }
            })
            .catch(() => {
              this.$message.error("出错了，请稍候重试！！！");
            })
            .finally(() => {
              this.isChangingPass = false;
              this.$store.dispatch("FedLogOut").then(() => {
                this.$router.push({ path: "/login" });
              });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    color: $light_gray;
    /*margin: 0 auto 40px auto;*/
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
