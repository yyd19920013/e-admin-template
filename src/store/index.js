import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
const context = require.context('./modules', true, /\.js$/)
const modules = {}

context.keys().forEach(item => {
  const key = item.replace(/(.+\/)|(\.js)/g, '')

  Object.assign(modules, {
    [key]: context(item).default,
  })
})

Vue.use(Vuex)

const state = {
  isLoading: false, // 遮罩是否显示loading
  showRefreshBt: false, // 遮罩是否显示刷新按钮
  status: '', // 服务器错误状态
}

// 非Module格式：xxxx
// 使用了Module的格式：ModuleName.xxxx，这里持久化的是Theme Module下面的persistData数据
const PERSIST_PATHS = ['isLoading']
const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      paths: PERSIST_PATHS,
    }),
  ],
  modules,
  state,
  getters,
  actions,
  mutations,
})

export default store
