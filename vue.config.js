'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
function dateFormat(oDate, fmt = 'yyyy-MM-dd hh:mm:ss') {
  // 正常化日期
  function normalDate(date) {
    var reg = /\-+/g
    if (typeof date == 'string') {
      date = date.split('.')[0] // 解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
      date = date.replace(reg, '/') // 解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }
    date = new Date(date)
    return date
  }
  // 时间变成两位数
  function toTwo(n) {
    return +n < 10 ? '0' + n : n + ''
  }
  var nDate = normalDate(oDate || new Date())
  var date = {
    'y+': nDate.getFullYear(), // 年
    'M+': nDate.getMonth() + 1, // 月
    'd+': nDate.getDate(), // 日
    'h+': nDate.getHours(), // 时
    'm+': nDate.getMinutes(), // 分
    's+': nDate.getSeconds(), // 秒
    S: nDate.getMilliseconds(), // 毫秒
    'q+': Math.ceil((nDate.getMonth() + 1) / 3), // 季度
  }
  var result = ''
  var value = ''
  for (var attr in date) {
    if (new RegExp('(' + attr + ')').test(fmt)) {
      result = RegExp.$1
      value = date[attr] + ''
      fmt = fmt.replace(result, result.length == 1 ? value : attr == 'y+' ? value.substring(4 - result.length) : toTwo(value))
    }
  }
  return fmt
}
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = defaultSettings.title || 'vue Admin Template' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const CONFIG_JSON = require('./src/services/config.js')
const ENV = process.env.__ENV
const target = CONFIG_JSON[ENV || 'proj'].baseUrl
const getGroupId = () => {
  const posIndex = process.argv.indexOf('--groupId')
  const groupId = ~posIndex ? process.argv[posIndex + 1] : ''
  return groupId || ''
}
const __GROUPID = getGroupId()
// 应用部署的CDN目录
const CDN_PATH = '//asset.tsign.cn/apps/forward-front/'
// 需要部署在nginx下的模式 不变的文件放到ngxin 变化的文件单独打包放到oss
const NGINX_MODE = ['prod']
const IS_NGINX_MODE = NGINX_MODE.includes(ENV)
const currentTime = dateFormat(new Date(), 'yyyyMMdd.hhmmss')
const newVersion = `V1.${currentTime}`
const APP_VERSION = IS_NGINX_MODE ? newVersion : 'v1.1.1'
console.log(`当前运行环境：${ENV}`)
console.log(`当前代理地址：${target}`)
console.log(`当前groupId：${__GROUPID}`)
console.log(`当前版本：${APP_VERSION}`)
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: IS_NGINX_MODE ? `${CDN_PATH}` : '/',
  outputDir: 'dist',
  assetsDir: IS_NGINX_MODE ? `${ENV}/${APP_VERSION}` : 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    proxy: {
      '/api': {
        // 这里最好有一个 /
        target, // 服务器端接口地址
        // 如果要代理 websockets，配置这个参数
        ws: false,
        // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    overlay: {
      warnings: false,
      errors: true,
    },
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        root: resolve('./'),
        '@': resolve('src'),
        src: resolve('src'),
        components: resolve('src/components'),
        views: resolve('src/views'),
        store: resolve('src/store'),
        services: resolve('src/services'),
        utils: resolve('src/utils'),
        styles: resolve('src/styles'),
        assets: resolve('src/assets'),
        images: resolve('src/assets/images'),
        audio: resolve('src/assets/audio'),
        video: resolve('src/assets/video'),
      },
    },
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial',
      },
    ])
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
    config.plugin('define').tap(args => {
      args[0].__ENV = JSON.stringify(process.env.__ENV)
      args[0].__GROUPID = JSON.stringify(__GROUPID)
      return args
    })
  },
}
