<template>
  <div class="custom-columns">
    <div class="text-wrap" @click="openDrawer">
      <i class="el-icon-setting"></i>
      <span class="text">自定义列</span>
    </div>
    <el-drawer title="自定义列" :visible.sync="visible" direction="rtl">
      <div class="drawer-wrap">
        <div class="main">
          <table-wrap
            ref="tableWrap"
            :define-table="defineTable"
            :table-data.sync="tableData"
            @select="handleSelect"
            @select-all="handleSelectAll"
          />
        </div>
        <div class="end">
          <el-button plain @click="closeDrawer">取消</el-button>
          <el-button plain @click="initData">恢复默认</el-button>
          <el-button type="primary" @click="saveTableData">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import TableWrap from 'components/common/TableWrap'

export default {
  /*
    <custom-columns :raw-table="defineTable" @save-table-data="saveTableData" />

    methods: {
      saveTableData(defineTable) {
        defineTable.forEach((item, index) => {
          const { __hidden, fixed } = defineTable[index]
          this.$set(this.defineTable[index], '__hidden', __hidden)
          this.$set(this.defineTable[index], 'fixed', fixed)
        })
      },
    },
  */

  components: {
    TableWrap,
  },

  props: {
    rawTable: {
      // 表格定义处理前数据
      required: true,
      type: Array,
      default() {
        return []
      },
    },
    checkNum: {
      // 设置校验最少展示的列数量
      type: Number,
      default: 2,
    },
  },

  data() {
    return {
      visible: false,
      tableRef: null,
      defineTable: [],
      tableData: {},
      allSelectedInited: false,
    }
  },

  computed: {},

  watch: {
    visible(newVal) {
      if (!this.allSelectedInited && newVal) {
        this.allSelectedInited = true
        this.setAllSelected()
      }
    },
  },

  created() {
    this.initData()
  },

  methods: {
    initData() {
      this.defineTable = this.getDefineTable()
      this.tableData = this.getTableData()
      this.setAllSelected()
    },
    setAllSelected() {
      this.$nextTick(() => {
        const { tableWrap = {} } = this.$refs || {}
        const { elTable } = tableWrap.$refs || {}
        if (!elTable) return
        elTable.clearSelection()
        elTable.toggleAllSelection()
      })
    },
    getDefineTable() {
      const defineTable = [
        {
          label: '',
        },
        {
          label: '展示此列',
          prop: '__name',
        },
        {
          label: '固定此列',
          type: 'switch',
          model: 'fixed',
          __hideCol: true,
          click: ({ row, index }) => {
            this.$set(this.tableData[index], 'fixed', !row.fixed)
          },
        },
      ]
      return defineTable.map((item, index) => (index == 0 ? { ...item, type: 'selection' } : item))
    },
    getTableData() {
      const { rawTable = [] } = this
      return rawTable
        .filter(item => item.fixed != 'right')
        .map((item, index) => ({ ...item, __index: index, __name: item.label, fixed: false }))
    },
    showDrawerFn(show = false) {
      this.visible = show
    },
    openDrawer() {
      this.showDrawerFn(true)
    },
    closeDrawer() {
      this.showDrawerFn()
    },
    handleSelectAll(selection) {
      this.tableData.forEach(item => {
        const findItem = selection.find(selectionItem => selectionItem.__index == item.__index)
        item.__hidden = !findItem
      })
    },
    handleSelect(selection, row) {
      const item = selection.find(item => item.__index == row.__index)
      this.$set(this.tableData[row.__index], '__hidden', !item)
    },
    checkSave() {
      const showList = this.tableData.filter(item => !item.__hidden)
      if (showList.length < this.checkNum) {
        this.alerts(`最少展示${this.checkNum}例`)
        return true
      }
    },
    saveTableData() {
      if (this.checkSave()) return
      this.$emit('save-table-data', this.tableData)
      this.closeDrawer()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.custom-columns {
  display: flex;
  justify-content: flex-end;
  .text-wrap {
    display: flex;
    align-items: center;
    line-height: 30px;
    padding-bottom: 20px;
    cursor: pointer;
    .el-icon-setting {
      color: #999;
    }
    .text {
      padding-left: 5px;
      color: $main;
    }
  }
  ::v-deep .el-drawer {
    .el-drawer__header {
      margin: 0;
      height: 50px;
      line-height: 50px;
      padding: 0 16px !important;
      border-bottom: $border1;
      span {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
    .drawer-wrap {
      height: 100%;
      position: relative;
      .main {
        width: 100%;
        height: 100%;
        padding-bottom: 60px;
        overflow: auto;
        position: absolute;
        .table-wrap {
          padding: 0;
        }
      }
      .end {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        padding: 10px 16px;
        height: 60px;
        background-color: #fff;
        border-top: $border1;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 10;
      }
    }
  }
}
</style>
