<template>
  <div :class="{ 'select-business': true, [type]: true }">
    <div class="association-table">
      <div class="association-table__title">复选table</div>
      <table-wrap
        ref="tableWrap"
        :define-table="defineTable"
        :table-data.sync="tableData"
        :request-params.sync="form"
        :request-config="requestConfig"
        :paging-config="pagingConfig"
      />
    </div>
    <el-dialog title="选择" :visible.sync="visible" width="80%">
      <div class="content">
        <div class="content__title">
          <el-form ref="formDialog" :model="formDialog">
            <el-form-item label="字段1" prop="name">
              <el-input v-model="formDialog.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="字段2" prop="bizDomainIdList">
              <type-select ref="bizDomainIdList" :selected-list.sync="formDialog.bizDomainIdList" type="bizDomain" :show-deleted="true" />
            </el-form-item>
            <el-form-item label="字段3" prop="createDate">
              <el-date-picker
                v-model="formDialog.createDate"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="字段4" prop="createManInfoList">
              <select-person
                ref="createManInfoList"
                type="checkbox"
                :include-resign="true"
                @selected-change="handleSelectedChangeCreateManInfoList"
              />
            </el-form-item>
            <el-form-item label="字段5" prop="deptIdList">
              <select-department
                ref="deptIdList"
                type="checkbox"
                :include-deleted="true"
                @selected-change="handleSelectedChangeDeptIdList"
              />
            </el-form-item>
            <div class="handler">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button plain @click="resetForm">重置</el-button>
            </div>
          </el-form>
        </div>
        <div class="content__main">
          <table-wrap
            ref="tableWrapDialog"
            :define-table="defineTableDialog"
            :table-data.sync="tableDataDialog"
            :request-params.sync="formDialog"
            :request-config="requestConfigDialog"
            :paging-config="pagingConfigDialog"
            :table-attrs="{ height: '300px' }"
            @select="handleTableSelectedChange"
            @select-all="handleTableSelectedChange"
          />
        </div>
        <div class="content__end">
          <el-button plain @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="selectedConfirm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TableWrap from '@/components/common/TableWrap.vue'
import SelectPerson from '@/components/common/SelectPerson'
import SelectDepartment from './SelectDepartment'
import selectTableMixin from './mixins/selectTableMixin'
import { copyJson } from '@/utils/utils'

export default {
  /*
    <select-business ref="selectBusiness" :product-demand-id="toId" />
  */

  components: {
    TableWrap,
    SelectPerson,
    SelectDepartment,
  },

  mixins: [selectTableMixin],

  props: {
    productDemandId: {
      // 产品需求id
      type: [Number, String],
      default: '',
      required: true,
    },
    type: {
      // 类型：checkbox(多选)，radio(单选)
      type: String,
      default: 'checkbox',
    },
  },

  data() {
    const { productDemandId } = this

    return {
      // 表格配置
      defineTable: [
        {
          label: '序号',
          custom: ({ row, index }) => {
            return index + 1
          },
        },
        {
          label: '字段1',
          prop: 'name',
          width: 160,
        },
        {
          // 定义为操作列表
          label: '操作',
          fixed: 'right',
          width: 120,
          handleList: [
            {
              type: 'button',
              text: '查看',
              click: ({ row }) => {
                const { id } = row
                this.openNewHref({
                  path: '/businessManagement/edit',
                  query: {
                    id,
                    type: 'check',
                  },
                })
              },
            },
            {
              type: 'button',
              text: '删除',
              click: async ({ row, index }) => {
                const isConfirm = await this.isConfirm('提示内容')
                if (!isConfirm) return
                if (!this.productDemandId) {
                  this.tableData.splice(index, 1)
                  this.deleteListPaging(row.id)
                  return
                }
                const params = {
                  bizDemandIds: [row.id],
                  productDemandId,
                  type: 1,
                }
                const res = await this.$services.productDemandLinkOrUnLinkBizDemand(params)
                if (!res.data) return
                this.alerts('删除成功', 'success')
                this.getTableList()
                this.$emit('status-change', res.data)
              },
            },
          ],
        },
      ],
      tableData: [],
      form: {
        pageNum: 1,
        pageSize: 10,
        productDemandId,
      },
      requestConfig: {
        // 请求配置
        request: params => {
          if (!this.productDemandId) return []
          return this.$services.productDemandLinkBizDemandList(params)
        },
        render: true, // 是否开启渲染数据，不开启的话，在success函数里自行处理
        custom: res => {
          // 是否自定义渲染数据，不自定义的话，默认渲染res.data.list
          if (!res.data) return
          const { resultList } = res.data
          return resultList ?? []
        },
      },
      // 分页配置
      pagingConfig: {
        total: detail => {
          return detail?.totalItems ?? 0
        },
      },

      // 表格配置
      defineTableDialog: [
        {
          label: '',
          type: 'selection',
        },
        {
          label: '字段1',
          prop: 'name',
          width: 160,
        },
        {
          label: '字段2',
          width: 160,
          custom: ({ row, filters }) => {
            return filters.date(row.createDate, 'yyyy-MM-dd hh:mm:ss')
          },
        },
      ],
      tableDataDialog: [],
      formDialog: {},
      requestConfigDialog: {
        // 请求配置
        firstRequest: false,
        request: params => {
          const copyParams = copyJson(params)
          const { createDate } = copyParams
          const [createDateStart = '', createDateEnd = ''] = createDate ?? []

          copyParams.createDateStart = createDateStart
          copyParams.createDateEnd = createDateEnd
          delete copyParams.createDate
          return this.$services.productDemandMatchBizDemandList(copyParams)
        },
        render: true, // 是否开启渲染数据，不开启的话，在success函数里自行处理
        custom: res => {
          // 是否自定义渲染数据，不自定义的话，默认渲染res.data.list
          if (!res.data) return
          const { resultList } = res.data
          return resultList ?? []
        },
      },
      // 分页配置
      pagingConfigDialog: {
        total: detail => {
          return detail?.totalItems ?? 0
        },
      },
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.search()
      } else {
        this.resetForm(false)
      }
    },
  },

  created() {
    this.dataInit()
  },

  methods: {
    __clearSelected() {
      this.tableData = []
      this.selectedListPaging = []
    },
    getDeptName(item) {
      const { deptName, deptDeleteFlag } = item
      return `${deptName}${deptDeleteFlag == 1 ? '（已删除）' : ''}`
    },
    getTableList() {
      const { getTableData } = this.$refs.tableWrap
      getTableData()
    },
    handleSelectedChangeCreateManInfoList(selectedList) {
      this.formDialog.createManInfoList = selectedList
    },
    handleSelectedChangeReceiveManInfoList(selectedList) {
      this.formDialog.receiveManInfoList = selectedList
    },
    handleSelectedChangeDeptIdList(selectedList) {
      this.formDialog.deptIdList = selectedList.map(item => item.groupId)
    },
    dataInit() {
      const { productDemandId } = this
      this.formDialog = {
        // 请求参数
        productDemandId,
        pageNum: 1,
        pageSize: 10,

        name: '',
        id: '',
        priorityList: [],
        bizDomainIdList: [],
        productLineIdList: [],
        statusList: [],
        createManInfoList: [],
        receiveManInfoList: [],
        deptIdList: [],

        createDate: [],
        createDateStart: '',
        createDateEnd: '',
      }
    },
    search() {
      this.formDialog.pageNum = 1
      this.$nextTick(() => {
        const { getTableData } = this.$refs.tableWrapDialog
        getTableData()
      })
    },
    resetForm(isRequest = true) {
      this.dataInit()
      this.$refs.formDialog.resetFields()
      Object.values(this.$refs).forEach(ref => {
        ref.__clearSelected && ref.__clearSelected()
      })
      if (isRequest) this.search()
    },
    async productDemandLinkOrUnLinkBizDemand(selectedList) {
      if (!selectedList.length) return
      const { productDemandId } = this
      const bizDemandIds = selectedList.map(item => item.id)
      const params = {
        bizDemandIds,
        productDemandId,
        type: 0,
      }
      const res = await this.$services.productDemandLinkOrUnLinkBizDemand(params)
      if (!res.data) return
      this.alerts('保存成功', 'success')
      this.getTableList && this.getTableList()
      this.$emit('selected-confirm-success', res)
      this.$emit('status-change', res.data)
    },
    selectedConfirm() {
      const selectedList = this.getSelectedList()
      this.$emit('selected-confirm', selectedList)
      this.closeDialog()
      if (!this.productDemandId) {
        this.tableData = selectedList
        return
      }
      this.selectedListPaging = []
      this.productDemandLinkOrUnLinkBizDemand(selectedList)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.select-business {
  @include dialogSearch;
}
</style>
