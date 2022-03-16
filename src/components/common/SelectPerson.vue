<template>
  <div class="select-person">
    <el-select
      v-model="selectSelectedList"
      clearable
      filterable
      remote
      :multiple="type == 'checkbox'"
      :collapse-tags="collapseTags"
      :placeholder="placeholder"
      :disabled="disabledAll || disabled"
      :remote-method="handleRemoteMethod"
      @focus="handleRemoteMethod('')"
    >
      <el-option v-for="item in dataList" :key="item.userId" :label="getName(item)" :value="getName(item)" />
    </el-select>
    <div v-if="!disabledAll" class="icon-wrap" @click="visible = true">
      <div class="icon">
        <i class="el-icon-s-operation"></i>
      </div>
    </div>
    <search-select
      :visible.sync="visible"
      :select-selected-list="mapSelectSelectedList"
      :type="type"
      business-type="person"
      :disabled-selected="disabled"
      :include-resign="includeResign"
      @selected-change="handleSelectedChange"
    />
  </div>
</template>
<script>
import SearchSelect from '@/components/common/SearchSelect'
import { mapState } from 'vuex'

export default {
  /*
    <select-person type="checkbox" @selected-change="handleSelectedChange" />
  */

  components: {
    SearchSelect,
  },

  props: {
    type: {
      // 类型：checkbox(多选)、radio(单选)
      type: String,
      default: 'checkbox',
    },
    placeholder: {
      // 占位文本
      type: String,
      default: '请选择',
    },
    collapseTags: {
      // 多选时是否折叠
      type: Boolean,
      default: true,
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false,
    },
    disabledAll: {
      // 是否禁用，且不展示弹窗按钮
      type: Boolean,
      default: false,
    },
    includeResign: {
      type: Boolean,
      default: false,
    },
    defaultAccount: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: [Number, String],
      default: '',
    },
    isNewAdd: {
      // 所在的场景是否是继续新建下一条，新建下一条会重置数据，该参数为true则会重新初始化赋值
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      searchTimer: null,
      selectSelectedList: null,
      mapSelectSelectedList: [],
      dataList: [],
      visible: false,
      teamMembers: [],
      loaded: false,
    }
  },

  computed: {
    ...mapState('user', ['userInfo', 'departmentMemberList', 'accountPersonsJson', 'namePersonsJson']),
  },

  watch: {
    selectSelectedList: {
      handler(newVal) {
        this.handleChange()
      },
      deep: true,
    },
    projectId(newVal, oldVal) {
      if (newVal != oldVal) {
        this.loaded = false
      }
    },
  },

  created() {
    this.dataInit()
  },

  beforeDestroy() {
    clearTimeout(this.searchTimer)
  },

  methods: {
    __clearSelected() {
      this.selectSelectedList = this.type == 'checkbox' ? [] : ''
      if (this.isNewAdd) {
        this.dataInit()
      }
    },
    __setSelected(selectedList) {
      if (!selectedList && selectedList !== 0) return
      const selfSelectedList = []
      ;[].concat(selectedList).forEach(item => {
        const userId = item?.userId ?? item
        const resultItem = this.accountPersonsJson[userId]
        if (resultItem) {
          selfSelectedList.push(this.getName(resultItem))
        } else {
          console.log('无法匹配到员工：', userId)
        }
      })
      this.selectSelectedList = this.type == 'checkbox' ? selfSelectedList : selfSelectedList[0] ?? ''
    },
    dataInit() {
      this.selectSelectedList = this.type == 'checkbox' ? [] : ''
      if (this.defaultAccount) {
        this.__setSelected(this.userInfo.account)
      }
    },
    getName(item) {
      const { alias, name, status } = item
      return `${alias}-${name}${status == 1 ? '（已离职）' : ''}`
    },
    getSelectedChangeList(selectedList) {
      const mapSelectedList = selectedList.map(item => {
        const { account, alias, name } = item
        return {
          userId: account,
          userName: `${alias}-${name}`,
        }
      })
      const [firstItem] = mapSelectedList
      if (this.type == 'checkbox') {
        return mapSelectedList
      } else {
        return firstItem?.userId ? firstItem : null
      }
    },
    async searchByKeyword(keyword) {
      if (!keyword.trim()) return
      const { includeResign } = this
      const res = await this.$services.searchByKeyword({ keyword, includeResign })
      const persons = res?.data?.persons ?? []
      this.dataList = persons
    },
    handleRemoteMethod(keyword) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        if (keyword) {
          this.searchByKeyword(keyword)
        } else {
          if (this.projectId) {
            this.projectGetTeamMembers()
          } else {
            this.dataList = this.departmentMemberList
          }
        }
      }, 300)
    },
    async projectGetTeamMembers() {
      if (this.loaded) {
        this.dataList = this.teamMembers
        return
      }
      const { projectId: id } = this
      const res = await this.$services.projectGetTeamMembers({ id })
      if (!res.data) return
      const teamMembers = []
      res.data.forEach(item => {
        const { userName, userId, quited } = item
        const [alias, name] = userName.split('-')
        const status = +quited
        const resultItem = {
          userId,
          alias,
          name,
          status,
        }
        if (this.includeResign || (!this.includeResign && !status)) {
          teamMembers.push(resultItem)
        }
      })
      this.teamMembers = teamMembers
      this.dataList = teamMembers
      this.loaded = true
    },
    handleChange() {
      const selectSelectedList = [].concat(this.selectSelectedList)
      const mapSelectSelectedList = []
      const selectedList = []
      selectSelectedList.forEach(item => {
        const [name] = item.split('（')
        const resultItem = this.namePersonsJson[name]
        if (resultItem) {
          mapSelectSelectedList.push(resultItem.account)
          selectedList.push(resultItem)
        }
      })
      this.mapSelectSelectedList = mapSelectSelectedList
      this.$emit('selected-change', this.getSelectedChangeList(selectedList))
    },
    handleSelectedChange(selectedList) {
      if (this.type == 'checkbox') {
        this.selectSelectedList = selectedList.map(item => this.getName(item))
      } else if (this.type == 'radio') {
        const [firstItem] = selectedList
        this.selectSelectedList = firstItem && Object.keys(firstItem).length ? this.getName(firstItem) : ''
      }
      this.$emit('selected-change', this.getSelectedChangeList(selectedList))
      this.$emit('selected-confirm', this.getSelectedChangeList(selectedList))
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
.select-person {
  @include selectPersonOrDepartment;
}
</style>
