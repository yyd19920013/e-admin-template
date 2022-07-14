<template>
  <div class="table-wrap">
    <div class="table">
      <el-table
        ref="elTable"
        :data="tableData"
        border
        style="width: 100%"
        v-bind="tableAttrs"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
      >
        <template v-for="(item, index) in defineTable">
          <el-table-column
            v-if="!item.__hidden"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.Width"
            :min-width="item.width"
            :fixed="getFixed(item, index)"
            :type="isElType(item.type) ? item.type : ''"
            :show-overflow-tooltip="getShowOverflowTooltip(item)"
            :align="item.handleList && item.handleList.length ? 'center' : 'left'"
            :render-header="item.renderHeader"
          >
            <template v-if="!isElType(item.type)" #default="scope">
              <template v-if="!item.__hideCol || !scope.row.__hidden">
                <el-tooltip v-if="item.tip && item.tip({ row: scope.row, index: scope.$index, filters: filters })" placement="top">
                  <span class="tooltip-text">{{ item.tip({ row: scope.row, index: scope.$index, filters: filters }) }}</span>
                  <template v-if="item.getTips" slot="content">
                    <div
                      v-for="(item1, index1) in item.getTips({ row: scope.row, index: scope.$index, filters: filters })"
                      :key="`tips-${index}-${index1}`"
                      class="tip-content__item"
                    >
                      {{ item1 }}
                    </div>
                  </template>
                </el-tooltip>
                <div v-if="item.handleList" class="handle-list">
                  <div v-for="(item1, index1) in item.handleList" :key="`handleList-${index}-${index1}`">
                    <div
                      v-if="!item1.render || (item1.render && item1.render({ row: scope.row, index: scope.$index }))"
                      class="handle-item"
                    >
                      <el-button
                        v-if="item1.type == 'button'"
                        type="text"
                        @click="item1.click && item1.click({ row: scope.row, index: scope.$index })"
                      >
                        {{ item1.text }}
                      </el-button>
                      <div v-else-if="item1.type == 'switch'" class="switch-wrap">
                        <el-switch v-model="scope.row[item1.model]" />
                        <div class="switch-mask" @click="item1.click && item1.click({ row: scope.row, index: scope.$index })"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-else-if="item.type">
                  <el-button
                    v-if="item.type == 'button'"
                    type="text"
                    @click="item.click && item.click({ row: scope.row, index: scope.$index })"
                  >
                    <span
                      class="button__inner"
                      :style="item.styleFn ? item.styleFn({ row: scope.row, index: scope.$index, filters: filters }) : item.style"
                    >
                      <template v-if="item.custom">
                        {{ getDefaultResult(item.custom({ row: scope.row, index: scope.$index, filters: filters })) }}
                      </template>
                      <template v-else-if="item.prop">
                        {{ getDefaultResult(scope.row[item.prop]) }}
                      </template>
                      <template v-else>
                        {{ item.text }}
                      </template>
                    </span>
                  </el-button>
                  <div v-else-if="item.type == 'switch'" class="switch-wrap">
                    <el-switch v-model="scope.row[item.model]" />
                    <div class="switch-mask" @click="item.click && item.click({ row: scope.row, index: scope.$index })"></div>
                  </div>
                  <div v-else-if="item.type == 'pre'" class="pre-wrap">
                    <pre>{{ scope.row[item.prop] }}</pre>
                  </div>
                </template>
                <template v-else-if="item.custom">
                  {{ getDefaultResult(item.custom({ row: scope.row, index: scope.$index, filters: filters })) }}
                </template>
                <template v-else>
                  {{ getDefaultResult(scope.row[item.prop]) }}
                </template>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div v-if="pagingShow" class="pagination-wrap">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :page-size="requestParams[pageSize]"
        :current-page="requestParams[pageNum]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import * as filters from '@/filters'
import { copyJson } from 'utils/utils'

export default {
  /*
    <table-wrap
      ref="tableWrap"
      :define-table="defineTable"
      :table-data.sync="tableData"
      :request-params.sync="requestParams"
      :request-config="requestConfig"
      :paging-config="pagingConfig"
    />
  */

  props: {
    defineTable: {
      // 表格定义
      required: true,
      type: Array,
      default() {
        return []
      },
    },
    tableData: {
      // 表格数据
      type: Array,
      default() {
        return []
      },
    },
    requestParams: {
      // 请求接口参数
      type: Object,
      default() {
        return null
      },
    },
    requestConfig: {
      // 请求接口配置
      type: Object,
      default() {
        return null
      },
    },
    pagingConfig: {
      // 分页配置
      type: Object,
      default() {
        return null
      },
    },
    tableAttrs: {
      // table属性配置
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      delayRequestTimer: null,
      initParams: {},
      detail: {},
      filters,
    }
  },

  computed: {
    pagingShow() {
      if (!this.pagingConfig) return false
      // 是否显示分页
      const { pagingShow = true } = this.pagingConfig

      return pagingShow
    },
    pageSizes() {
      // 分页大小选择
      const { pageSizes = [10, 20, 40, 100] } = this.pagingConfig

      return pageSizes
    },
    pageSize() {
      // 分页大小的key，根据requestParams
      const { pageSize = 'pageSize' } = this.pagingConfig

      return pageSize
    },
    pageNum() {
      // 分页页码的key，根据requestParams
      const { pageNum = 'pageNum' } = this.pagingConfig

      return pageNum
    },
    total() {
      // 分页总数
      const { total: totalFn } = this.pagingConfig
      const { pageInfo = {} } = this.detail
      const { total = 0 } = pageInfo

      return totalFn ? totalFn(this.detail) : total
    },
  },

  created() {
    this.setInitParams()
  },

  mounted() {
    this.getTableDataFirst()
  },

  beforeDestroy() {
    clearTimeout(this.delayRequestTimer)
  },

  methods: {
    getFixed(item, index) {
      const { defineTable } = this
      const { fixed } = item
      const defaultFixedLeft = index == 0 || (index == 1 && !defineTable[0].label)

      if (fixed !== undefined) {
        return fixed
      } else if (defaultFixedLeft) {
        return 'left'
      }
    },
    getDefaultResult(result) {
      return result || result === 0 ? result : '--'
    },
    getShowOverflowTooltip(item) {
      let { showOverflowTooltip = true } = item
      if (item.handleList) {
        showOverflowTooltip = false
      }
      return showOverflowTooltip
    },
    isElType(type) {
      return ['selection', 'index', 'expand'].includes(type)
    },
    setInitParams() {
      // 只调用一次，请勿再次使用
      const { requestParams } = this

      this.initParams = copyJson(requestParams)
    },
    resetParams() {
      this.$emit('update:requestParams', copyJson(this.initParams))
    },
    getTableDataFirst() {
      const { firstRequest = true } = this.requestConfig || {}
      if (!firstRequest) return
      this.getTableData()
    },
    getTableData() {
      clearTimeout(this.delayRequestTimer)
      this.delayRequestTimer = setTimeout(async () => {
        const { request, render = true, custom, success, fail, failReturn = true } = this.requestConfig || {}
        const { requestParams } = this
        if (!request || !requestParams) return
        const res = await request(requestParams)
        if (!res.data && failReturn) return fail && fail(res)

        if (render) {
          const { list = [] } = res.data || {}
          const data = custom ? custom(res) : list

          this.$emit('update:tableData', data)
        }
        this.detail = res.data
        success && success(res)
      })
    },
    handleSizeChange(val) {
      // console.log('handleSizeChange', val)
      this.$emit(
        'update:requestParams',
        Object.assign({}, this.requestParams, {
          [this.pageSize]: val,
        })
      )
      this.getTableData()
    },
    handleCurrentChange(val) {
      // console.log('handleCurrentChange', val)
      this.$emit(
        'update:requestParams',
        Object.assign({}, this.requestParams, {
          [this.pageNum]: val,
        })
      )
      this.getTableData()
    },
    handleSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    handleSelectAll(selection) {
      this.$emit('select-all', selection)
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.table-wrap {
  padding: 0 10px;
  &.hidden-selection {
    ::v-deep {
      .el-table-column--selection {
        .el-checkbox {
          display: none;
        }
      }
    }
  }
  .table {
    border: 1px solid #ebeef5;
    ::v-deep {
      .el-table {
        border: none;
        th,
        td {
          padding: 5px 0;
          .cell {
            line-height: 32px;
          }
          .el-button--text {
            color: #1063f1;
          }
          .tooltip-text {
            color: $main;
            cursor: pointer;
          }
        }
      }
      .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        display: none !important;
      }
      .el-table__body {
        border-right: none;
        tr {
          &:last-of-type {
            td {
              border-bottom: none;
            }
          }
        }
      }
      .el-table__empty-text {
        padding-top: 100px;
        background: url('../../assets/images/empty.png') no-repeat center 20px;
        background-size: auto 100px;
      }
      .el-table__fixed-right::before,
      .el-table__fixed::before {
        display: none;
      }
    }
    .handle-list {
      display: flex;
      justify-content: center;
      align-items: center;
      .handle-item {
        padding: 0 5px;
        .el-button--text {
          color: #1063f1;
        }
      }
    }
    .switch-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 30px;
      position: relative;
      .switch-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
      }
    }
    .pre-wrap {
      width: 100%;
      text-align: left;
      overflow: auto;
      pre {
        width: 100%;
      }
    }
  }
  .pagination-wrap {
    padding-top: 20px;
    .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
