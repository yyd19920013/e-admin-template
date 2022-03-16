import { mapState, mapMutations } from 'vuex'
import { copyJson } from '@/utils/utils'

export default {
  computed: {
    ...mapState('user', ['cacheData']),
  },

  mounted() {
    this.clearCacheData()
  },

  beforeDestroy() {
    this.setCacheData()
  },

  methods: {
    ...mapMutations('user', ['CHANGE_CACHEDATA']),
    getTableData() {
      this.$nextTick(() => {
        const { getTableData } = this.$refs.tableWrap
        getTableData()
      })
    },
    clearCacheData() {
      const { cacheDataName } = this
      const { componentName } = this.cacheData
      if (cacheDataName && componentName && cacheDataName != componentName) {
        this.CHANGE_CACHEDATA({
          componentName: cacheDataName,
        })
      }
    },
    setCacheData() {
      const { cacheDataName } = this

      if (cacheDataName) {
        const { tabActive, ascription, spreadActive } = this
        const form = copyJson(this.form)
        const cacheData = { componentName: cacheDataName, tabActive, ascription, spreadActive, form }
        this.CHANGE_CACHEDATA(cacheData)
      }
    },
    getCacheData(useCacheData, dataInit) {
      const { cacheDataName } = this
      const { componentName, tabActive, ascription, spreadActive } = this.cacheData
      const form = copyJson(this.cacheData?.form ?? {})
      const tableInit = () => {
        dataInit && dataInit()
        this.getTableData()
      }

      if (useCacheData) {
        if (cacheDataName == componentName) {
          this.tabActive = tabActive
          this.ascription = ascription
          this.spreadActive = spreadActive
          if (form) {
            dataInit && dataInit()
            for (const attr in this.form) {
              this.form[attr] = form[attr]
            }
            this.getTableData()
            this.$nextTick(() => {
              for (const attr in form) {
                const ref = this.$refs[attr]
                if (ref && ref.__setSelected) {
                  ref.__setSelected(form[attr])
                }
              }
            })
          } else {
            tableInit()
          }
        } else {
          tableInit()
        }
      } else {
        tableInit()
      }
    },
  },
}
