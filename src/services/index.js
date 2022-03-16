/* eslint-disable */
import vm from 'src/main.js'
import md5 from 'md5'
import { cookie, lStore, sStore, alerts, axios, axiosWrap } from 'utils/utils'
import CONFIG_JSON from 'services/config'

const COMMON = CONFIG_JSON[__ENV || 'proj']
// const URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) ? '/api' : COMMON.baseUrl // 本地环境用反向代理，线上环境用baseUrl，线上域名和请求地址一致用'/'
const URL = COMMON.baseUrl
const context = require.context('./modules', true, /\.js$/)
const modules = {}
let headers = {}
if (__GROUPID) {
  headers['X-Tsign-Service-Group'] = __GROUPID
}

context.keys().forEach(item => {
  Object.assign(modules, context(item))
})
const API = config => {
  if (!config.noJoinUrl) config.url = URL + config.url
  config.method = config.method ? config.method : 'post'
  config.withCredentials = true
  config.code = [200, 0, 10000000, 'ok', 'OK', 'success', 'SUCCESS']
  config.headers = Object.assign(headers, config.headers)
  return axiosWrap(config)
}

const CONFIG = Object.assign({}, COMMON, {
  envName: __ENV,
  API, // api请求函数
  headers, //请求头设置
  appId: 'forward', //应用id
})
const SERVICES = Object.assign({}, CONFIG, modules)

console.log('当前环境：', __ENV)
console.log('当前环境配置：', CONFIG)
console.log(`当前groupId：${__GROUPID}`)
console.log('SERVICES', SERVICES)
export default SERVICES
