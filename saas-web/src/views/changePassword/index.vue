<template>
    <el-container class="container">
        <el-form :model="newPassword"
                 :rules="newPasswordRules"
                 label-width="120px"
                 label-position="right"
                 :ref="newPasswordFormName"
                 size="medium"
                 class="changePassForm"
                 status-icon>
            <el-form-item label="旧密码" prop="oldPass">
                <el-input type="password" v-model="newPassword.oldPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="newPassword.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPass">
                <el-input type="password" v-model="newPassword.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doChangePassword" :loading="isChangingPass">修改</el-button>
            </el-form-item>
        </el-form>
    </el-container>
</template>

<script>
import { changePassword } from "../../api/userManage";

export default {
  name: "ChangePassword",
  data() {
    const validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入初始密码！"));
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
      isChangingPass: false,
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
      }
    };
  },
  methods: {
    doChangePassword() {
      this.$refs[this.newPasswordFormName].validate(valid => {
        if (valid) {
          this.isChangingPass = true;
          changePassword({
            passwordOld: this.newPassword.oldPass,
            passwordNew: this.newPassword.pass
          })
            .then(response => {
              if (response.status) {
                this.$message.success("修改成功，请重新登录！");
                this.$store.dispatch("FedLogOut").then(() => {
                  this.$router.push({ path: "/login" });
                });
              }
            })
            .catch(() => {
              this.$message.error("出错了，请稍候重试！！！");
            })
            .finally(() => {
              this.isChangingPass = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 20px;
}

.changePassForm {
  width: 400px;
}
</style>
