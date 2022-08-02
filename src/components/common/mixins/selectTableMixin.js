import { copyJson } from '@/utils/utils'

export default {
  data() {
    return {
      visible: false,
      selectedListPaging: [],
      linkedIds: [],
      loaded: false,
    }
  },

  watch: {
    tableDataDialog() {
      this.setLinkedIds()
      this.setCurrentPageSelected()
    },
  },

  methods: {
    __clearSelected(clearTableData = false) {
      if (clearTableData) this.tableData = []
      const { tableWrapDialog = {} } = this.$refs || {}
      const { elTable } = tableWrapDialog.$refs || {}
      if (!elTable) return
      elTable.clearSelection()
      this.selectedListPaging = []
      this.linkedIds = []
      this.loaded = false
    },
    __getSelectedTableData() {
      return copyJson(this.tableData)
    },
    getSelectedList() {
      return copyJson(this.selectedListPaging)
    },
    getLinkedIds() {
      return copyJson(this.linkedIds)
    },
    setLinkedIds() {
      if (!this.tableDataDialog[0] || this.loaded) return
      const [firstItem] = this.tableDataDialog || []
      const linkedIds = firstItem?.linkedIds ?? []
      this.linkedIds = linkedIds.map(item => `${item}`)
      this.loaded = true
    },
    getSelectedIdsAndLinkedIds() {
      const selectedList = this.getSelectedList()
      const selectedIds = selectedList.map(item => item.id)
      const linkedIds = this.getLinkedIds()
      const allIds = [...selectedIds, ...linkedIds]
      const result = Array.from(new Set(allIds))
      return result
    },
    handleTableSelectedChange(selectedList, selectedItem) {
      if (this.type == 'checkbox') {
        const copySelectedList = copyJson(selectedList)
        this.selectedListPaging = copySelectedList
      } else {
        const { tableWrapDialog = {} } = this.$refs || {}
        const { elTable } = tableWrapDialog.$refs || {}
        if (!elTable) return
        const copySelectedItem = copyJson(selectedItem)
        elTable.clearSelection()
        elTable.toggleRowSelection(selectedItem, true)
        this.selectedListPaging = [copySelectedItem]
      }
    },
    showDialogFn(show = false) {
      this.visible = show
    },
    openDialog() {
      this.showDialogFn(true)
    },
    closeDialog() {
      this.showDialogFn()
    },
    setCurrentPageSelected() {
      this.$nextTick(() => {
        const { tableWrapDialog = {} } = this.$refs || {}
        const { elTable } = tableWrapDialog.$refs || {}
        if (!elTable) return
        if (this.linkedIds.length) {
          this.tableDataDialog.forEach(row => {
            const posIndex = this.linkedIds.indexOf(row.id)
            if (~posIndex) {
              elTable.toggleRowSelection(row, true)
              this.linkedIds.splice(posIndex, 1)
            }
          })
        }
      })
    },
    deleteListPaging(id) {
      const { tableWrapDialog = {} } = this.$refs || {}
      const { elTable } = tableWrapDialog.$refs || {}
      if (!elTable) return
      const findItem = elTable.selection.find(item => item.id === id)
      elTable.toggleRowSelection(findItem, false)
    },
  },
}
