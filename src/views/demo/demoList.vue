<template>
  <div class="business-list">
    <tabs-wrap
      :tab-active.sync="tabActive"
      :define-tabs="defineTabs"
      :show-spread-button="true"
      :spread-active.sync="spreadActive"
      @tab-click="resetForm(true)"
    >
      <template #form>
        <el-form ref="form" :model="form" class="form">
          <div class="basic">
            <el-form-item label="搜索字段1" prop="name">
              <el-input v-model="form.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="搜索字段2" prop="id">
              <el-input v-model.number="form.id" placeholder="请输入" type="number" clearable />
            </el-form-item>
            <el-form-item label="搜索字段3" prop="statusList">
              <type-select ref="statusList" :selected-list.sync="form.statusList" type="businessStatus" />
            </el-form-item>
          </div>
          <div :class="{ extend: true, 'extend--active': spreadActive }">
            <el-form-item label="时间" prop="createDate">
              <el-date-picker
                v-model="form.createDate"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item v-show="tabActive != '1'" label="人员" prop="receiveManInfoList">
              <select-person
                ref="receiveManInfoList"
                type="checkbox"
                :include-resign="true"
                @selected-change="handleSelectedChangeReceiveManInfoList"
              />
            </el-form-item>
            <el-form-item label="部门" prop="deptIdList">
              <select-department
                ref="deptIdList"
                type="checkbox"
                :include-deleted="true"
                @selected-change="handleSelectedChangeDeptIdList"
              />
            </el-form-item>
          </div>
        </el-form>
      </template>
      <template #buttonLeft>
        <el-button type="primary" @click="add">新增</el-button>
      </template>
      <template #buttonRight>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button plain @click="resetForm">重置</el-button>
      </template>
    </tabs-wrap>
    <table-wrap
      ref="tableWrap"
      :define-table="defineTable"
      :table-data.sync="tableData"
      :request-params.sync="form"
      :request-config="requestConfig"
      :paging-config="pagingConfig"
    />
  </div>
</template>
<script>
import TabsWrap from '@/components/common/TabsWrap'
import SelectPerson from '@/components/common/SelectPerson'
import SelectDepartment from '@/components/common/SelectDepartment'
import TableWrap from '@/components/common/TableWrap.vue'
import demoMixin from '../mixins/demoMixin'
import cacheDataMixin from '../mixins/cacheDataMixin'
import { copyJson } from '@/utils/utils'

export default {
  components: {
    TabsWrap,
    SelectPerson,
    SelectDepartment,
    TableWrap,
  },

  mixins: [demoMixin, cacheDataMixin],

  data() {
    const { tabActive = '0', ascription } = this.$route.query

    return {
      cacheDataName: 'BusinessList',
      tabActive,
      ascription,
      spreadActive: false,

      defineTable: [
        {
          label: '字段1',
          prop: 'name',
          width: 160,
        },
        {
          label: '字段2',
          prop: 'id',
        },
        {
          label: '字段3',
          prop: 'priorityText',
        },
        {
          label: '字段4',
          prop: 'bizDomainName',
          width: 120,
        },
        {
          label: '字段5',
          prop: 'productLineName',
          width: 120,
        },
        {
          label: '时间',
          width: 160,
          custom: ({ row, filters }) => {
            return filters.date(row.createDate, 'yyyy-MM-dd hh:mm:ss')
          },
        },
        {
          // 定义为操作列表
          label: '操作',
          fixed: 'right',
          width: 140,
          handleList: [
            {
              type: 'button',
              text: '查看',
              click: ({ row }) => {
                const { id } = row
                this.$router.push({
                  path: '/demo/edit',
                  query: {
                    id,
                    type: 'check',
                  },
                })
              },
            },
            {
              type: 'button',
              text: '编辑',
              render: ({ row }) => {
                return this.statusGetPermission([0, 10, -10], row)
              },
              click: ({ row }) => {
                const { id } = row
                this.openNewHref({
                  path: '/demo/edit',
                  query: {
                    id,
                  },
                })
              },
            },
            {
              type: 'button',
              text: '作废',
              render: ({ row }) => {
                return this.statusGetPermission([0, 10, -10], row)
              },
              click: ({ row }) => {
                this.businessCancel(row.id, true)
              },
            },
          ],
        },
      ],

      tableData: [],
      form: {},

      requestConfig: {
        // 请求配置
        firstRequest: false,
        request: params => {
          const copyParams = copyJson(params)
          const ascription = this.ascription || this.ascriptionJson[this.tabActive]
          this.ascription = ''
          const { createDate } = copyParams
          const [createDateStart = '', createDateEnd = ''] = createDate ?? []

          copyParams.ascription = ascription
          copyParams.createDateStart = createDateStart
          copyParams.createDateEnd = createDateEnd
          delete copyParams.createDate
          return this.$services.bizDemandList(copyParams)
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
    }
  },

  computed: {
    defineTabs() {
      const isLeader = this.isLeader()
      const tabs = ['tab1', 'tab2', 'tab3']
      const leaderTabs = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5']
      const resultTabs = isLeader ? leaderTabs : tabs

      if (this.buttonList.includes('/demo/list/tabAll')) {
        resultTabs.push('全部业务需求')
      }
      return resultTabs
    },
    ascriptionJson() {
      const isLeader = this.isLeader()
      const ascription = {
        0: 'CURRENT_USER',
        1: 'RECEIVE',
        2: 'COPIER',
        3: 'ALL',
      }
      const leaderAscription = {
        0: 'CURRENT_USER',
        1: 'RECEIVE',
        2: 'TEAM_SUBMIT',
        3: 'TEAM_RECEIVE',
        4: 'COPIER',
        5: 'ALL',
      }

      return isLeader ? leaderAscription : ascription
    },
  },

  created() {
    this.dataInit()
  },

  mounted() {},

  methods: {
    getDeptName(item) {
      const { deptName, deptDeleteFlag } = item
      return `${deptName}${deptDeleteFlag == 1 ? '（已删除）' : ''}`
    },
    statusGetPermission(statusList = [], row) {
      const status = row?.status
      const userId = row?.createManInfo?.userId
      return this.getPermission(statusList, status, [userId], userId)
    },
    dataInit(isReset = false) {
      this.getCacheData(!isReset, () => {
        const rawStatusList = this.$route.query?.statusList
        const statusList = rawStatusList && !isReset ? JSON.parse(rawStatusList) : []
        if (statusList.length) {
          this.$nextTick(() => {
            this.$refs.statusList.__setSelected(statusList)
          })
        }
        this.form = {
          // 请求参数
          /*
          CURRENT_USER("我的"),
          FOLLOWER("我下属的"),
          TEAM("我团队的"),
          TEAM_SUBMIT("我团队提交的"),
          TEAM_RECEIVE("我团队接收的"),
          DEPARTMENT("我部门的"),
          COPIER("抄送我的"),
          RECEIVE("我接收的"),
          ALL("全部");
        */
          statusList,
          ascription: '',
          pageNum: 1,
          pageSize: 10,

          name: '',
          id: '',
          priorityList: [],
          bizDomainIdList: [],
          productLineIdList: [],

          planReleaseDateList: [],
          receiveManInfoList: [],
          deptIdList: [],
          createManInfoList: [],

          createDate: [],
          createDateStart: '',
          createDateEnd: '',
        }
      })
    },
    add() {
      this.openNewHref('/demo/edit')
    },
    search() {
      this.form.pageNum = 1
      this.$nextTick(() => {
        const { getTableData } = this.$refs.tableWrap
        getTableData()
      })
    },
    resetForm(isClose = false) {
      if (isClose === true) this.spreadActive = false
      this.dataInit(true)
      this.$refs.form.resetFields()
      Object.values(this.$refs).forEach(ref => {
        ref.__clearSelected && ref.__clearSelected()
      })
      this.search()
    },
    handleSelectedChangeReceiveManInfoList(selectedList) {
      this.form.receiveManInfoList = selectedList
    },
    handleSelectedChangeDeptIdList(selectedList) {
      this.form.deptIdList = selectedList.map(item => item.groupId)
    },
    handleSelectedChangeCreateManInfoList(selectedList) {
      this.form.createManInfoList = selectedList
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
