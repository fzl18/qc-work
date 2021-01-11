<template>
  <div id="app" style="height:100%">
    <router-view/>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: 'app',
  components: {
   
  },
  methods: {

  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
