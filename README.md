# 管理系统

## 部署步骤

    1、安装依赖
    npm install

    2、启动命令
    npm run start [groupId]                         // 项目环境才需要groupId，例如分支为feature/forward-v1，groupId为forward-v1
    npm run dev_proj                                // 项目环境启动
    npm run dev
    npm run serve
    npm run start
    npm run dev_test                                // 测试环境启动
    npm run dev_sml                                 // 模拟环境启动
    npm run dev_prod                                // 正式环境启动

    3、打包命令
    npm run build_proj @[__PCODE__]                 // 项目环境打包
    npm run build_test                              // 测试环境打包
    npm run build_sml                               // 模拟环境打包
    npm run build_prod                              // 正式环境打包
    npm run build                                   // 默认打包正式环境

    4、发布配置编译命令
    npm install && npm run build_proj @[__PCODE__]  // 项目环境打包
    npm install && npm run build_test               // 测试环境打包
    npm install && npm run build_sml                // 模拟环境打包
    npm install && npm run build_prod               // 正式环境打包
    npm install && npm run build                    // 默认打包正式环境

## 目录结构描述

    ├── assets
    │   ├── + images                     // 图片资源
    ├── components
    │   ├── + Breadcrumb                 // 面包屑组件
    │   ├── + Hamburger                  // 折叠侧边栏组件
    │   ├── + common                     // 公共组件
    ├── filters
    │   ├── index.js                     // 过滤器
    ├── layout
    │   ├── index.vue                    // 布局组件，侧边栏等
    ├── plugins
    │   ├── commonMixinPlugin.js         // 全局混入插件
    ├── router
    │   ├── index.js                     // 路由配置
    ├── services
    │   ├── + modules                    // 模块化接口
    │   ├── config.js                    // 环境配置
    │   ├── index.js                     // 服务端接口
    ├── store
    │   ├── + modules                    // 模块化vuex
    │   ├── index.js                     // vuex
    ├── styles
    │   ├── index.scss                   // 初始化样式
    │   ├── public.scss                  // 公共sass变量、mixin等
    ├── utils
    │   ├── utils.js                     // 工具函数
    ├── views                            // 页面文件夹
    │   ├── +documents                   // 组件文档
    │   ├── mixins
    │   │   └── commonHandlerMixin.js    // 混入公共操作函数和按钮权限控制
    │   ├── home
    │   │   └── home.vue                 // 首页
    ├── App.vue                          // 根页面
    ├── dictionaries.js                  // 字典
    ├── main.js                          // 入口文件
    ├── permission.js                    // 鉴权
    ├── settings.js                      // 默认配置
