<template>
  <div class="login-container">
    <Menu mode="horizontal">
      <div class="layout-nav">
        <Locales style="float: right;"></Locales>
      </div>
    </Menu>
    <div class="login-logo">
      <p>{{$t('spotHedgingManagementSystem')}}</p>
    </div>
    <div class="login-form-container">
      <Form :ref="formName" :rules="loginRules" :model="user">
        <FormItem prop="userName">
          <Input
            v-model="user.userName"
            type="text"
            icon="person"
            :placeholder="$t('plzInputUserName')"
            :title="$t('plzInputUserName')"
            size="large"
            autofocus
            @keyup.enter="onSubmit"
          ></Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            v-model="user.password"
            type="password"
            icon="locked"
            :placeholder="$t('plzInputPassword')"
            :title="$t('plzInputPassword')"
            size="large"
            @on-keyup.enter="onSubmit"
          ></Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            shape="circle"
            long
            :loading="isLoging"
            @click="onSubmit"
            :disabled="!btnSubmitEnabled"
          >{{$t('login')}}</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import Locales from '@/components/Locales';
export default {
  name: 'Login',
  components: { Locales },
  data() {
    return {
      formName: 'loginForm',
      isLoging: false,
      user: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: this.$t('userNameCannotEmpty'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('passwordCannotEmpty'),
            trigger: 'change'
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.btnSubmitEnabled) {
        this.$refs[this.formName].validate(async valid => {
          if (valid) {
            this.isLoging = true;
            try {
              const result = await this.http.post(
                'api/accounts/login',
                this.user
              );
              this.isLoging = false;

              localStorage.setItem('token', result.token);
              localStorage.setItem('userName', result.user.username);
              localStorage.setItem('userId', result.user.userId);

              // await this.api.getPermissions();

              this.routeToTarget();
            } catch (error) {
              this.isLoging = false;
              this.$Modal.error({
                title: this.$t('loginError'),
                content: error.message
              });
            }
          }
        });
      }
    },
    routeToTarget() {
      const targetPath = this.$route.query.redirect
        ? this.$route.query.redirect
        : '/home';
      this.$router.push({ path: targetPath });
    }
  },
  computed: {
    btnSubmitEnabled() {
      return this.user.userName && this.user.password;
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 360px;
  margin: 7% auto;
}

.login-container .login-logo {
  font-size: 35px;
  text-align: center;
  margin-bottom: 25px;
  font-weight: bolder;
}

.login-container .login-form-container {
  width: 300px;
  margin: auto;
}

/* 对 iview 的 form 报错信息的修改进行恢复，使登录页面的表现正常 */
.login-container .login-form-container .ivu-form-item-error-tip {
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
}

.login-container .ivu-form-item {
  margin-bottom: 24px;
}
</style>