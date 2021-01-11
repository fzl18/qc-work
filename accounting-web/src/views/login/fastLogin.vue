<template>
  <div>正在进行免登验证...</div>
</template>
<script>
import { http } from "@/utils/http";
export default {
  name: "FastLogin",
  props: {
    token: String,
    redirect: String
  },
  async mounted() {
    let data = await this.http.post(`accounts/fastlogin?token=${this.token}`);
    localStorage.setItem("token", this.token);
    localStorage.setItem("userName", data.user.username);
    localStorage.setItem("userDisplayName", data.user.displayName);
    localStorage.setItem("userId", data.user.userId);
    localStorage.setItem("tenantCode", data.user.tenantCode);
    await this.api.getPermissions(true);
    // await this.api.getPermissions().then( data => {
    //         let permissions = data.userPermissions
    //         localStorage.setItem('userPermissions',permissions)
    //     })
    let redirect = this.redirect || "/home";
    this.$router.push({
      path: redirect
    });
  }
};
</script>
