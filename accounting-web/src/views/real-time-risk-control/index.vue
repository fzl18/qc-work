<template>
  <router-view/>
</template>

// ----------------------------------------------------------
// 说明：
// 通过 'WebSocket' 与服务端建立连接和通信。
// 通过 'postmessage' 实现 'list.vue' 与 'worker.js' 之间的通信。
// 表格控件使用的是 'AGGrid'，其它控件都是用的 'IView'。
// ----------------------------------------------------------

<script>
  export default {
    name: 'RealTimeRiskControl'
  };
</script>