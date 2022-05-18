import Vue from 'vue'

export default {
  install() {
    const handler = (el, binding, vnode, hook) => {
      const { arg, modifiers, value = '' } = binding
      const { space, pre } = modifiers
      let result = value

      switch (true) {
        case arg == 'focus' && ['inserted'].includes(hook): // 自动获取焦点
          /*
            <input v-common:focus />
          */
          el.focus()
          break
        case arg == 'html' && ['bind', 'update'].includes(hook): // 渲染为html并保留空格space、保留格式pre
          /*
              <div v-common:html.space="`空  格`"></div>
              <div
                v-common:html.pre="
                  `换
                  行`
                "
              ></div>
            */
          if (space) {
            result = result.replaceAll(' ', '&nbsp;')
          }
          if (pre) {
            el.style.whiteSpace = 'pre'
          }
          el.innerHTML = result
          break
      }
    }
    const unbind = (el, binding, vnode) => {
      el.parentNode && el.remove()
    }
    Vue.directive('common', {
      bind: (el, binding, vnode) => {
        handler(el, binding, vnode, 'bind')
      },
      inserted: (el, binding, vnode) => {
        handler(el, binding, vnode, 'inserted')
      },
      update: (el, binding, vnode) => {
        handler(el, binding, vnode, 'update')
      },
      unbind,
    })
  },
}
