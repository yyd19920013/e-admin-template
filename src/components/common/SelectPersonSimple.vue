<template>
  <div class="select-person-simple">
    <el-select
      v-model="selectSelectedList"
      clearable
      filterable
      remote
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :placeholder="placeholder"
      :remote-method="handleRemoteMethod"
      @focus="handleRemoteMethod('')"
      @change="handleChange"
    >
      <el-option v-for="item in selectDataList" :key="item.userId" :label="item.userName" :value="item.userName" />
    </el-select>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  /*
    <select-person-simple
      ref="executors"
      :project-id="projectId"
      type="projectMembers"
      @selected-change="handleSelectedChangeExecutorIds"
    />
  */

  props: {
    type: {
      // 业务类型
      /*
        departmentMember：
        projectMembers：
      */
      type: String,
      default: 'departmentMember',
    },
    projectId: {
      // 项目id，type=projectMembers必填
      type: [Number, String],
      default: '',
    },
    multiple: {
      // 是否是多选
      type: Boolean,
      default: true,
    },
    collapseTags: {
      // 是否折叠多选
      type: Boolean,
      default: true,
    },
    placeholder: {
      // 占位文本
      type: String,
      default: '请选择',
    },
    includeQuited: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      searchTimer: null,
      selectSelectedList: null,
      selectDataListAll: [],
      selectDataList: [],
    }
  },

  computed: {
    ...mapState('user', ['userInfo', 'departmentMemberList', 'accountPersonsJson', 'namePersonsJson']),
  },

  watch: {
    selectSelectedList(newVal) {
      this.selectedChange(newVal)
    },
    departmentMemberList(newVal) {
      if (newVal.length && this.type == 'departmentMember') {
        this.dataInit()
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
      this.selectSelectedList = this.multiple ? [] : ''
    },
    __setSelected(selectedList) {
      if (!selectedList && selectedList !== 0) return
      const selfSelectedList = []
      ;[].concat(selectedList).forEach(item => {
        const { userId } = item
        const resultItem = this.accountPersonsJson[userId]
        if (resultItem) {
          selfSelectedList.push(this.getName(resultItem))
        } else {
          console.log('无法匹配到员工：', userId)
        }
      })
      this.selectSelectedList = this.multiple ? selfSelectedList : selfSelectedList[0] ?? ''
    },
    getDepartmentMemberList() {
      this.selectDataListAll = this.departmentMemberList.map(item => {
        const { account: userId } = item
        const userName = this.getName(item)
        return {
          userId,
          userName,
        }
      })
      this.selectDataList = this.selectDataListAll
      const userId = this.userInfo?.account
      if (userId && !this.selectSelectedList.length) {
        this.__setSelected({ userId })
      }
    },
    async projectGetTeamMembers() {
      const { projectId: id } = this
      const res = await this.$services.projectGetTeamMembers({ id })
      if (!res.data) return
      const teamMembers = []
      res.data.forEach(item => {
        const { userName, quited } = item
        item.userName = `${userName}${quited ? '（已离职）' : ''}`
        if (this.includeQuited || (!this.includeQuited && !quited)) {
          teamMembers.push(item)
        }
      })
      this.selectDataListAll = teamMembers
      this.selectDataList = this.selectDataListAll
    },
    dataInit() {
      this.__clearSelected()
      const { type, getDepartmentMemberList: departmentMember, projectGetTeamMembers: projectMembers } = this
      const requestJson = {
        departmentMember,
        projectMembers,
      }
      const request = requestJson[type]
      request()
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
      if (this.multiple) {
        return mapSelectedList
      } else {
        return firstItem?.userId ? firstItem : null
      }
    },
    async searchByKeyword(keyword) {
      if (!keyword.trim()) return
      this.selectDataList = this.selectDataListAll.filter(item => {
        const { userName, userId } = item
        return [userName, userId].find(findItem => findItem.includes(keyword))
      })
    },
    handleRemoteMethod(keyword) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        if (keyword) {
          this.searchByKeyword(keyword)
        } else {
          this.selectDataList = this.selectDataListAll
        }
      }, 300)
    },
    getSelectedList(value, callback) {
      if (!value.length) {
        callback && callback([])
        return
      }
      const selectSelectedList = [].concat(value)
      const selectedList = []
      selectSelectedList.forEach(item => {
        const [name] = item.split('（')
        const resultItem = this.namePersonsJson[name]
        if (resultItem) {
          selectedList.push(resultItem)
        }
        callback && callback(this.getSelectedChangeList(selectedList))
      })
    },
    selectedChange(value) {
      this.getSelectedList(value, selectedList => {
        this.$emit('selected-change', selectedList)
      })
    },
    handleChange(value) {
      this.getSelectedList(value, selectedList => {
        this.$emit('change', selectedList)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
