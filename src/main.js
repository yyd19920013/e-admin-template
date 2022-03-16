import Vue from 'vue'

import ElementUI from 'element-ui'
import 'src/styles/element-ui.css'
import 'src/styles/index.scss' // global css
import 'src/icons' // icon
import 'src/permission' // permission control

import App from './App'
import store from './store'
import router from './router'
import * as filters from './filters'
import services from 'services'
import commonMixinPlugin from './plugins/commonMixinPlugin'
import { LoadingChunkErrorReload } from './utils/utils'

Vue.use(commonMixinPlugin)
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

// 挂载过滤器
for (const attr in filters) {
  Vue.filter(attr, filters[attr])
}

// 挂载网络请求
Vue.prototype.$services = services

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

// 加载chunk报错处理
LoadingChunkErrorReload(router)
export default vm
