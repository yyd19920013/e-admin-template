import Vue from 'vue'
import { fileType, alerts } from 'utils/utils'
import TypeSelect from '@/components/common/TypeSelect'
import TypeRadio from '@/components/common/TypeRadio'
import dictionaries from '@/dictionaries'
import { mapState } from 'vuex'

const getDictionariesJson = () => {
  const dictionariesJson = {}

  for (const key in dictionaries) {
    const valueJson = {}
    const value = dictionaries[key]
    for (const item of value) {
      valueJson[item.value] = item.label
    }
    dictionariesJson[key] = valueJson
  }
  return dictionariesJson
}
const dictionariesJson = getDictionariesJson()

export default {
  install() {
    Vue.mixin({
      components: {
        TypeSelect,
        TypeRadio,
      },

      data() {
        return {
          dictionariesJson,
        }
      },

      computed: {
        ...mapState('user', ['subordinate', 'buttonList', 'imagesJson']),
        subordinateName() {
          return this.teamlist.map(item => {
            const { alias, name } = item
            return `${alias}-${name}`
          })
        },
      },

      methods: {
        alerts,
        goback(index = -1) {
          this.$router.go(index)
        },
        openNewHref(options) {
          const newHref = this.$router.resolve(options).href
          window.open(newHref)
        },
        getDefaultResult(result) {
          return result ?? '--'
        },
        isLeader() {
          const { subordinate } = this
          return !!(subordinate && subordinate.length)
        },
        getPermission(vaildStatusList = [], status, vaildRoleList = [], subordinateAccount) {
          const userInfo = this.$store.state?.user?.userInfo
          const { account, alias, name } = userInfo
          const aliasAndName = `${alias}-${name}`
          const isVaildStatus = vaildStatusList.includes(status)
          const vaildRoleListFlat = vaildRoleList.map(item => (item ? item.split(',') : '')).flat(1)
          const isVaildRole = vaildRoleListFlat.includes(account) || vaildRoleListFlat.includes(aliasAndName)
          const isLeader = this.subordinate.includes(subordinateAccount)
          // console.log('getPermission', vaildRoleListFlat, account, aliasAndName, isVaildRole, subordinateAccount)
          if (vaildStatusList && vaildStatusList.length && vaildRoleList && vaildRoleList.length) {
            return isVaildStatus && (isVaildRole || isLeader)
          } else if (vaildStatusList && vaildStatusList.length) {
            return isVaildStatus
          } else if (vaildRoleList && vaildRoleList.length) {
            return isVaildRole || isLeader
          } else if (subordinateAccount) {
            return isLeader
          }
          return true
        },
        safeSetData(targetData, resData, refs) {
          if (!targetData || !resData) return
          for (const attr in targetData) {
            const value = resData[attr]
            if (value || [0, false].includes(value)) {
              targetData[attr] = value
              if (refs && refs[attr] && refs[attr].__setSelected) {
                refs[attr].__setSelected(value)
              }
            }
          }
        },
        typeArrJoinValue(type, arr = [], joinStr = ',') {
          if (!arr && arr !== 0) return ''
          const resultJson = this.dictionariesJson[type] || {}
          return []
            .concat(arr)
            .map(key => resultJson[key])
            .join(joinStr)
        },
        arrJoinValue(arr = [], key = 'userName', joinStr = ',') {
          if (!arr && arr !== 0) return ''
          return []
            .concat(arr)
            .map(item => item[key])
            .join(joinStr)
        },
        isConfirm(message, confirmButtonText, cancelButtonText, dangerouslyUseHTMLString = false, title = '??????') {
          return new Promise((resolve, reject) => {
            this.$msgbox({
              title,
              message,
              dangerouslyUseHTMLString,
              showCancelButton: true,
              confirmButtonText: confirmButtonText || '??????',
              cancelButtonText: cancelButtonText || '??????',
            })
              .then(() => {
                return resolve(true)
              })
              .catch(() => {
                return resolve(false)
              })
          })
        },
        onlyConfirm(message, confirmButtonText, dangerouslyUseHTMLString = false, title = '??????') {
          return new Promise((resolve, reject) => {
            this.$msgbox({
              title,
              message,
              dangerouslyUseHTMLString,
              showCancelButton: false,
              confirmButtonText: confirmButtonText || '??????',
            }).then(() => {
              return resolve(true)
            })
          })
        },
        isImageAndLimit(file = {}) {
          const { name = '', size = 0 } = file
          const arr = name.split('.')
          const isImage = fileType(arr[arr.length - 1]) == 'image'
          const isLt = size / 1024 / 1024 < 5

          console.log('isImageAndLimit', name)
          if (!isImage) {
            alerts('???????????????????????????', 'warning')
          }
          if (!isLt) {
            alerts('??????????????????????????????5MB', 'warning')
          }
          return isImage && isLt
        },
        isExcelAndLimit(file = {}) {
          const isSheet = fileType(file.name.split('.')[1]) == 'excel'
          const isLt = file.size / 1024 / 1024 < 5

          if (!isSheet) {
            alerts('???????????????????????????????????????Excel??????', 'warning')
          }
          if (!isLt) {
            alerts('?????????????????????5M??????????????????Excel??????', 'warning')
          }
          return isSheet && isLt
        },
      },
    })
  },
}
