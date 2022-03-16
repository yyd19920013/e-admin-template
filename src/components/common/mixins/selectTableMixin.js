export default {
  data() {
    return {
      visible: false,
      selectedListPaging: [],
    }
  },

  watch: {
    tableDataDialog() {
      this.setCurrentPageSelected()
    },
  },

  methods: {
    handleTableSelectedChange(selectedList, selectedItem) {
      if (this.type == 'checkbox') {
        const { pageNum } = this.requestParams || this.formDialog
        this.selectedListPaging[pageNum] = selectedList
      } else {
        const { tableWrapDialog = {} } = this.$refs || {}
        const { elTable } = tableWrapDialog.$refs || {}
        if (!elTable) return
        elTable.clearSelection()
        elTable.toggleRowSelection(selectedItem, true)
        this.selectedListPaging = [selectedItem]
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
    getSelectedList() {
      return this.selectedListPaging.filter(item => item).flat(1)
    },
    setCurrentPageSelected() {
      this.$nextTick(() => {
        const { tableWrapDialog = {} } = this.$refs || {}
        const { elTable } = tableWrapDialog.$refs || {}
        if (!elTable) return
        const selectedList = this.getSelectedList()
        // console.log('setCurrentPageSelected', this.tableDataDialog, this.selectedListPaging, selectedList)
        elTable.clearSelection()
        this.tableDataDialog.forEach(row => {
          const item = selectedList.find(selectedItem => selectedItem.id == row.id)
          elTable.toggleRowSelection(row, !!item)
        })
      })
    },
    deleteListPaging(id) {
      if (this.type == 'checkbox') {
        this.selectedListPaging.findIndex((arr, arrIndex) => {
          if (arr) {
            return arr.findIndex((item, index) => {
              if (item.id == id) {
                this.selectedListPaging[arrIndex].splice(index, 1)
                return true
              }
            })
          } else {
            return false
          }
        })
      } else {
        const findIndex = this.selectedListPaging.findIndex(item => item.id == id)
        this.selectedListPaging.splice(findIndex, 1)
      }
    },
  },
}
