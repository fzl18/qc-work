<template>
  <div>{{$t('fastLogin')}}</div>
</template>
<script>
// import { http } from "@/utils/http";
export default {
  name: 'FastLogin',
  props: {
    token: String,
    redirect: String
  },
  async beforeMount() {
    let data = await this.http.get('api/accounts/fastlogin', {
      token: this.token
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.user.username);
    localStorage.setItem('userId', data.user.userId);
    // await this.api.getPermissions();
    let redirect = this.redirect || '/';
    this.$router.push({
      path: redirect
    });
  }
};
</script>
