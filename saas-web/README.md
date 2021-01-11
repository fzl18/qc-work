# `saas-web`(即`SaaS管理站`，前端文件夹`SaaS-Web`, 后端文件夹`SaaS-Control`下`QiCheng.SaaSControl.AdnWeb`)开发须知

## ESLint必须保证通过，必须格式化代码后，才可提交【代码格式化推荐使用Prettier】

## 开发完成对接接口，一定要自测自己做的功能。例如：列表的查询条件是否有效，新增，修改，删除基本功能点要做测试，保证质量，然后才能交付完成。

## 开发时需考虑小屏幕展示效果，要至少保证`1366×768`分辨率下可以正常使用

## 表单校验尽量使用`ElementUI`的`ElForm`提供的功能，不清楚可以查文档或者群里问下

## 全局修改样式、公共组件和工具函数 要发到群里大家review

## 页面`新增/编辑`操作，使用`ElementUI`的`ElDialog`组件，字段多布局参考`CorporationManage企业管理`模块处理。 如果有`查看详情`的功能字段少于10个可以直接放到表格里显示或者表格放常用的列; 如果字段较多，查看详情可以做成`抽屉`的形式，使用`ElDrawer`，参考`StandardContract-标准合约`。

> How To

## `backend`

### Startup backend server

---

## `frontend`

### Project setup

```bash
npm i // or yarn
```

### Compiles and hot-reloads for development
```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```
