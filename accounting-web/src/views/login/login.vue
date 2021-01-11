<template>
  <div class="login-container">
    <h1>登录</h1>
    <Row>
      <Col>
        <Input type="text" v-model="username" placeholder="用户名" @keyup.enter.native="login" />
      </Col>
      <Col>
        <Input type="text" v-model="password" placeholder="密码" @keyup.enter.native="login" />
      </Col>
      <Col>
        <Button type="primary" style="width:100%" @click="login" size="large">登录</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    onSubmit() {},
    async login() {
      let data = await this.http.post(`accounts/login`, {
        username: this.username,
        password: this.password
      });
      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.username);
        localStorage.setItem("userDisplayName", data.user.displayName);
        localStorage.setItem("userId", data.user.userId);
        await this.api.getPermissions(true);
        this.$router.push("home");
        // this.api.getPermissions().then( data => {
        //     let permissions = data.userPermissions
        //     // console.log(privilege,permissions)
        //     localStorage.setItem('userPermissions',permissions)
        //     this.$router.push('home')
        // })
      }
    },
    routeToTarget() {}
  },
  computed: {}
};
</script>

<style scoped>
.login-container {
  width: 50%;
  margin: 20vh auto;
  text-align: center;
}
.ivu-col {
  margin: 20px 0;
}
</style>