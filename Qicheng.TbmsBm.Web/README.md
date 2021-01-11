# spot-hedge-web

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目目录结构

├─.eslintrc.js                   eslint规则
├─.gitignore                     git忽略规则
├─babel.config.js                babel规则               
├─package.json
├─postcss.config.js
├─README.md
├─vue.config.js
├─web.config
├─src
|  ├─App.vue                      根组件
|  ├─index.vue 
|  ├─main.js                      入口js文件
|  ├─permission.js                权限判断添加路由规则
|  ├─theme.config.js
|  ├─views                        视图模块名
|  |   ├─404.vue
|  |   ├─About.vue
|  |   ├─Home.vue
|  |   ├─main.vue
|  |   ├─login
|  ├─utils                         项目公共方法
|  |   ├─baseUrl.js
|  |   ├─createElement.js
|  |   ├─http.js
|  |   ├─httpBase.js
|  |   ├─mainLogin.js
|  |   └utils.js
|  ├─store
|  |   ├─index.js
|  |   ├─modules                    
|  |   |    ├─permission.js         路由权限过滤
|  |   |    └user.js                用户权限获取
|  ├─router
|  |   ├─asyncRoutes.js             需要权限管理的路由
|  |   └index.js                    路由主入口文件
|  ├─i18n                           国际化相关
|  |  ├─index.js
|  |  ├─lang
|  ├─components                     公共组件目录
|  |     ├─file-upload.vue          文件上传组件
|  |     ├─Locales.vue
|  |     ├─siderMenu                菜单相关组件
|  |     |     ├─collapsedMenu.vue
|  |     |     ├─expandMenu.vue
|  |     |     └index.vue
|  |     ├─qcgrid                   
|  ├─assets
|  |   ├─style.less                  全局样式
|  |   ├─images                      图片资源
|  ├─api
|  |  └api.js                        公共api请求
├─public
|   ├─favicon.ico                    页面图标
|   ├─index.html                     入口页面
|   ├─scripts                        js插件
|   |    ├─qcgrid
|   |    ├─moment
|   |    ├─jquery
