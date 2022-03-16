<template>
  <div class="type-select-remote">
    <el-select
      v-model="selectSelectedList"
      filterable
      remote
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :disabled="disabled"
      :clearable="clearable"
      :placeholder="placeholder"
      :remote-method="handleRemoteMethod"
      @focus="handleRemoteMethod('')"
      @change="handleChange"
    >
      <el-option v-for="item in selectDataList" :key="item.id" :label="getName(item)" :value="getName(item)" />
    </el-select>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { copyJson } from '@/utils/utils'

export default {
  /*
    <type-select-remote ref="projectIds" :selected-list.sync="form.projectIds" type="projectList" />
  */

  props: {
    type: {
      // 业务类型
      /*
        projectList：项目选择
      */
      type: String,
      default: 'projectList',
    },
    productLineId: {
      type: [Number, String],
      default: '',
    },
    status: {
      // 项目状态
      type: Array,
      default() {
        return []
      },
    },
    teamMembers: {
      type: Array,
      default() {
        return []
      },
    },
    showDefault: {
      // 是否展示默认选项
      type: Boolean,
      default: false,
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
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false,
    },
    clearable: {
      // 是否可清空
      type: Boolean,
      default: true,
    },
    placeholder: {
      // 占位文本
      type: String,
      default: '请选择',
    },
  },

  data() {
    return {
      searchTimer: null,
      selectSelectedList: null,
      selectDataListAll: [],
      selectDataList: [],
      defaultList: [
        {
          id: '0',
          name: '未关联项目',
          projectId: '0',
          projectName: '未关联项目',
        },
      ],
      nameJson: {},
      params: {
        pageNum: 1,
        pageSize: 10,
        name: '',
      },
    }
  },

  computed: {
    ...mapState('user', ['projectIdJson', 'projectNameJson']),
  },

  watch: {
    selectSelectedList(newVal) {
      this.selectedChange(newVal)
    },
  },

  created() {
    this.dataInit()
  },

  beforeDestroy() {
    clearTimeout(this.searchTimer)
  },

  methods: {
    ...mapMutations('user', ['CHANGE_PROJECT_JSON']),
    __clearSelected() {
      this.selectSelectedList = this.multiple ? [] : ''
    },
    __setSelected(selectedList) {
      if (!selectedList && selectedList !== 0) return
      const selfSelectedList = []
      ;[].concat(selectedList).forEach(id => {
        const resultItem = this.projectIdJson[id]
        if (resultItem) {
          selfSelectedList.push(resultItem.name)
        } else {
          console.log('无法匹配到项目名称：', id)
        }
      })
      this.selectSelectedList = this.multiple ? selfSelectedList : selfSelectedList[0] ?? ''
    },
    __setProjectJson(value) {
      const projectIdJson = {}
      const projectNameJson = {}
      const dataList = [].concat(value)
      dataList.forEach(item => {
        const { projectId, projectName } = item
        const resultItem = { ...item, id: projectId, name: projectName }
        projectIdJson[projectId] = resultItem
        projectNameJson[projectName] = resultItem
      })
      this.CHANGE_PROJECT_JSON({ projectIdJson, projectNameJson })
    },
    async projectList(name = '') {
      const params = { ...this.params, name }
      if (this.productLineId) params.productLineIds = [this.productLineId]
      if (this.status) params.status = this.status
      if (this.teamMembers) params.teamMembers = this.teamMembers
      const res = await this.$services.projectList(params)
      if (!res.data) return
      const resultList = res.data?.resultList ?? []
      this.selectDataList = resultList
      resultList.forEach(item => {
        const { name } = item
        this.nameJson[name] = item
      })
    },
    getRequest() {
      const { type, projectList } = this
      const requestJson = {
        projectList,
      }
      const request = requestJson[type]
      return request
    },
    dataInit() {
      this.__clearSelected()
      this.__setProjectJson(this.defaultList)
      if (!['projectList'].includes(this.type)) {
        this.getRequest()()
      }
    },
    getName(item) {
      const typeJson = {
        projectList: 'name',
      }
      const typeName = typeJson[this.type]
      return item[typeName]
    },
    getSelectedChangeList(selectedList) {
      const mapSelectedList = copyJson(selectedList)
      const [firstItem] = mapSelectedList
      if (this.multiple) {
        return mapSelectedList
      } else {
        return firstItem?.id ? firstItem : null
      }
    },
    async searchByKeyword(keyword) {
      if (!keyword.trim()) return
      this.getRequest()(keyword)
    },
    handleRemoteMethod(keyword) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        if (keyword) {
          this.searchByKeyword(keyword)
        } else {
          if (this.showDefault) {
            if (this.type == 'projectList') {
              this.selectDataList = this.defaultList
            }
          } else {
            this.selectDataList = []
          }
        }
      }, 300)
    },
    getSelectedList(value) {
      const selectSelectedList = [].concat(value)
      const selectedList = []
      const projectIdJson = {}
      const projectNameJson = {}
      selectSelectedList.forEach(name => {
        const resultItem = this.nameJson[name] || this.projectNameJson[name]
        if (resultItem) {
          selectedList.push(resultItem)
          projectIdJson[resultItem.id] = resultItem
          projectNameJson[name] = resultItem
        }
      })
      this.CHANGE_PROJECT_JSON({ projectIdJson, projectNameJson })
      return this.getSelectedChangeList(selectedList)
    },
    selectedChange(value) {
      this.$emit('selected-change', this.getSelectedList(value))
    },
    handleChange(value) {
      this.$emit('change', this.getSelectedList(value))
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
