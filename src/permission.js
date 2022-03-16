import Vue from 'vue'
import router, { baseRoutes, routerJson, resetRouter } from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from 'src/utils/auth' // get token from cookie
import getPageTitle from 'src/utils/get-page-title'
import SERVICES from 'services'
import { strToJson, sStore } from 'utils/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist
const { code, state } = strToJson
const params = sStore.get('dingCode') ? {} : { code, state }
let requested = false
const buttonList = []
const getAsyncRoutes = menuTree => {
  const getRoute = item => {
    const { name: title, url: path, enable } = item
    const route = routerJson[path]
    const { name, component, meta, redirect } = route || {}
    if (meta) meta.title = title
    return {
      name,
      path,
      component,
      meta,
      redirect,
      hidden: !enable,
    }
  }
  const getRoutes = (list = []) => {
    const menuList = []
    list.forEach(item => {
      if (item.resourceType == 'MENU') {
        menuList.push(item)
      } else if (item.resourceType == 'BUTTON') {
        buttonList.push(item.url)
      }
    })
    if (!list.length) return []
    const resultList = menuList.map(item => {
      const { resources } = item
      const parent = getRoute(item)
      if (resources) {
        const children = getRoutes(resources)
        if (children && children.length) {
          parent.children = children
        }
      }
      return parent
    })
    return resultList
  }
  const routes = getRoutes(menuTree)

  routes.unshift(...baseRoutes.slice(1, 2))
  routes.push(...baseRoutes.slice(2))
  resetRouter()
  router.addRoutes(routes)
  return routes
}
const getPersonsJson = res => {
  let persons = res?.data?.persons
  const accountPersonsJson = {}
  const namePersonsJson = {}
  const getName = item => {
    const { alias, name, status } = item
    return `${alias}-${name}${status == 1 ? '（已离职）' : ''}`
  }
  if (persons) {
    persons = persons.map(item => {
      const { account, alias, name } = item
      const fullName = getName(item)
      const resultItem = { account, alias, name, fullName }
      accountPersonsJson[account] = resultItem
      namePersonsJson[`${alias}-${name}`] = resultItem
      return resultItem
    })
  }
  return {
    persons,
    accountPersonsJson,
    namePersonsJson,
  }
}
const getGroupListTreeFlat = groupListTree => {
  const groupListTreeFlat = []
  const groupListTreeFlatFilter = []
  const getGroupListTreeFlat = (children, nameList = []) => {
    if (!children || !children.length) return
    children.forEach(item => {
      const { childNode: nextChildren, depth, groupId, groupName, deleteFlag } = item
      const nextNameList = [...nameList]
      if (depth > 1) {
        nextNameList.push(groupName)
        const fullGroupName = nextNameList.join('-')
        const resultItem = {
          groupId,
          groupName,
          fullGroupName,
          deleteFlag,
        }
        groupListTreeFlat.push(resultItem)
        if (deleteFlag == 0) groupListTreeFlatFilter.push(resultItem)
        item.fullGroupName = fullGroupName
      }
      getGroupListTreeFlat(nextChildren, nextNameList)
    })
  }
  getGroupListTreeFlat(groupListTree)
  return {
    groupListTree,
    groupListTreeFlat,
    groupListTreeFlatFilter,
  }
}

Vue.prototype.$httpRequestList = []
router.beforeEach(async (to, from, next) => {
  // start progress bar
  document.title = getPageTitle(to?.meta?.title ?? '')
  NProgress.start()
  if (Vue.prototype.$httpRequestList.length) {
    while (Vue.prototype.$httpRequestList.length) {
      Vue.prototype.$httpRequestList.shift()('interrupt')
    }
  }
  try {
    if (!requested) {
      requested = true
      next()
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
