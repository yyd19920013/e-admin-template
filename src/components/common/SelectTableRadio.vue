<template>
  <div :class="{ 'select-project': true, [type]: true }">
    <div class="association-table">
      <div class="association-table__title">单选table</div>
      <table-wrap
        ref="tableWrap"
        :define-table="defineTable"
        :table-data.sync="tableData"
        :request-params.sync="form"
        :request-config="requestConfig"
      />
    </div>
    <el-dialog title="选择" :visible.sync="visible" width="80%">
      <div class="content">
        <div class="content__title">
          <el-form ref="formDialog" :model="formDialog">
            <el-form-item label="字段1" prop="name">
              <el-input v-model="formDialog.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="字段2" prop="status">
              <type-select ref="status" :selected-list.sync="formDialog.status" type="projectStatusDialog" />
            </el-form-item>
            <el-form-item label="字段3" prop="pds">
              <select-person ref="pds" type="checkbox" :include-resign="true" @selected-change="handleSelectedChangePds" />
            </el-form-item>
            <el-form-item label="字段4" prop="planStartDate">
              <el-date-picker
                v-model="formDialog.planStartDate"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="字段5" prop="planEndDate">
              <el-date-picker
                v-model="formDialog.planEndDate"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
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
import selectTableMixin from './mixins/selectTableMixin'
import { copyJson } from '@/utils/utils'

export default {
  /*
    <select-project ref="selectProject" :product-demand-id="toId" />
  */

  components: {
    TableWrap,
    SelectPerson,
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
      default: 'radio',
    },
    showButton: {
      // 是否显示按钮
      type: Boolean,
      default: true,
    },
  },

  data() {
    const { productDemandId } = this

    return {
      // 表格配置
      defineTable: [
        {
          label: '字段1',
          prop: 'name',
          width: 160,
        },
        {
          label: '字段2',
          prop: 'pmName',
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
                  path: '/projectManagement/edit',
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
                  productDemandIds: [productDemandId],
                  projectId: row.id,
                  type: 1,
                }
                const res = await this.$services.projectLinkOrUnLinkProductDemand(params)
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
        productDemandId,
      },
      requestConfig: {
        // 请求配置
        request: params => {
          if (!this.productDemandId) return []
          return this.$services.productDemandLinkProjectList(params)
        },
        render: true, // 是否开启渲染数据，不开启的话，在success函数里自行处理
        failReturn: false,
        custom: res => {
          // 是否自定义渲染数据，不自定义的话，默认渲染res.data.list
          return res.data ? [res.data] : []
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
          width: 120,
          custom: ({ row, filters }) => {
            return filters.date(row.planStartDate, 'yyyy-MM-dd')
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
          const { planStartDate, planEndDate } = copyParams
          const [planStartDateLeft = '', planStartDateRight = ''] = planStartDate ?? []
          const [planEndDateLeft = '', planEndDateRight = ''] = planEndDate ?? []

          copyParams.planStartDateLeft = planStartDateLeft
          copyParams.planStartDateRight = planStartDateRight
          copyParams.planEndDateLeft = planEndDateLeft
          copyParams.planEndDateRight = planEndDateRight
          delete copyParams.planStartDate
          delete copyParams.planEndDate
          return this.$services.productDemandMatchProjectList(copyParams)
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
    tableData(newVal) {
      this.$emit('update:showButton', !newVal.length)
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
    getTableList() {
      const { getTableData } = this.$refs.tableWrap
      getTableData()
    },
    handleSelectedChangePds(selectedList) {
      this.formDialog.pds = selectedList.map(item => item.userId)
    },
    handleSelectedChangePms(selectedList) {
      this.formDialog.pms = selectedList.map(item => item.userId)
    },
    handleSelectedChangeTeamMembers(selectedList) {
      this.formDialog.teamMembers = selectedList.map(item => item.userId)
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
        priorities: [],
        bizDomainIds: [],
        productLineIds: [],
        types: [],
        status: [],
        pds: [],
        pms: [],
        teamMembers: [],

        planStartDate: '',
        planStartDateLeft: '',
        planStartDateRight: '',

        planEndDate: '',
        planEndDateLeft: '',
        planEndDateRight: '',
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
    async projectLinkOrUnLinkProductDemand(selectedList) {
      if (!selectedList.length) return
      const { productDemandId } = this
      const projectId = selectedList.map(item => item.id)[0]
      const params = {
        productDemandIds: [productDemandId],
        projectId,
        type: 0,
      }
      const res = await this.$services.projectLinkOrUnLinkProductDemand(params)
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
      this.projectLinkOrUnLinkProductDemand(selectedList)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.select-project {
  @include dialogSearch;
}
</style>
