<template>
  <div>
    添加按钮 ： <Button type="primary" icon="md-add">添加</Button>
    <br>
    <br>
    搜索按钮 ： <Button type="primary" icon="md-search">搜索</Button>
    <br>
    <br>
    清空按钮 ： <Button  icon="md-close-circle">清空</Button>
     <br>
    <br>
    导入按钮 ： <file-upload
                  tempName=""
                  action=""
                  import=""
                  download=""
                  :columns="[]"
                  @imported="imported"
                ></file-upload>
     <br>
    <br>
    导出按钮 ： <Button type="info" icon="ios-cloud-download-outline"  :loading="false"  >导出</Button>

  </div>
</template>
<script>
export default {
  mounted () {
  },
  methods: {
  }
}
</script>
