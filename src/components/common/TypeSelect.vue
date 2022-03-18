<template>
  <div class="type-select">
    <el-select
      v-model="selfSelectedList"
      popper-class="popper-select"
      filterable
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :disabled="disabled"
      :clearable="clearable !== null ? clearable : selfClearable"
      :placeholder="placeholder"
      @change="handleChange"
    >
      <el-option
        v-for="(item, index) in selectDataList"
        :key="index"
        :label="item.label"
        :value="item.value"
        :disabled="isDisabled(item)"
      />
    </el-select>
  </div>
</template>
<script>
import dictionaries from '@/dictionaries'
import { mapState } from 'vuex'
import { Type } from '@/utils/utils'

export default {
  /*
    <type-select :selected-list.sync="priorityBusiness" type="priorityBusiness" />
  */

  props: {
    type: {
      // 业务类型
      /*
        bizDomain：业务域
        productLine：产品线
        projectProductLine：项目下的产品线
        department：需求部门

        whether：是否
        os：操作系统
        processor：处理器
        onlineTime：预计上线时间
        reason：驳回理由

        businessPriority：业务优先级
        businessStatus：业务需求状态
        productPriority：产品优先级
        productStatus：产品需求状态
        productType：产品需求类型
        projectPriority：项目优先级
        projectStatus：项目需求状态
        projectType：项目需求类型
        taskStatus：任务状态
        taskStage：所属阶段
      */
      type: String,
      default: 'priorityBusiness',
    },
    projectId: {
      // 项目id，type=projectProductLine必填
      type: [Number, String],
      default: '',
    },
    selectedList: {
      // 选中的列表
      type: [Array, Object, Number, String, Boolean],
      default() {
        return []
      },
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
      default: null,
    },
    placeholder: {
      // 占位文本
      type: String,
      default: '请选择',
    },
    showDeleted: {
      // 是否显示被逻辑删除业务域和产品线
      type: Boolean,
      default: false,
    },
    includeDeleteDept: {
      // 是否包含已删除的部门
      type: Boolean,
      default: false,
    },
    isNewAdd: {
      // 所在的场景是否是继续新建下一条，新建下一条会重置数据，该参数为true则会重新初始化赋值
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      timer: null,
      selfClearable: true,
      selectDataList: [],
      selfSelectedList: [],
    }
  },

  computed: {
    ...mapState('user', ['userInfo', 'bizDomainList', 'productLineList']),
    groupList() {
      const groupList = (this?.userInfo?.groupList ?? []).filter(item => item.depth != 1)
      if (this.includeDeleteDept) {
        return groupList
      } else {
        return groupList.filter(item => item.deleteFlag == 0)
      }
    },
  },

  watch: {
    selfSelectedList(newVal) {
      this.$emit('update:selectedList', newVal)
    },
    selectedList(newVal) {
      this.selectedChange(newVal)
    },
    bizDomainList(newVal) {
      if (this.type == 'bizDomain' && newVal.length) {
        this.dataInit()
      }
    },
    productLineList(newVal) {
      if (this.type == 'productLine' && newVal.length) {
        this.dataInit()
      }
    },
  },

  created() {
    this.dataInit()
  },

  beforeDestroy() {
    clearTimeout(this.timer)
  },

  methods: {
    __clearSelected() {
      this.selfSelectedList = this.multiple ? [] : ''
      if (this.isNewAdd && ['projectProductLine', 'department'].includes(this.type)) {
        this.dataInit()
      }
    },
    __setSelected(selectedList) {
      if (!selectedList && ![0, false].includes(selectedList)) return
      if (this.type == 'department') {
        if (!['array', 'object'].includes(Type(selectedList))) return
        const selectedArr = [].concat(selectedList)
        selectedArr.forEach(selectedItem => {
          const { groupId, groupName: label } = selectedItem
          const findItem = this.selectDataList.find(item => item.value == groupId)
          if (!findItem) {
            this.selectDataList.push({
              label,
              value: +groupId,
              disabled: true,
            })
          }
        })
        if (this.multiple) {
          this.selfSelectedList = selectedArr.map(item => +item.groupId)
        } else {
          const [firstItem] = selectedArr
          this.selfSelectedList = firstItem ? +firstItem.groupId : ''
        }
      } else if (this.multiple) {
        if (Type(selectedList) != 'array') return
        this.selfSelectedList = selectedList.map(item => (Type(item) == 'string' ? +item : item))
      } else {
        this.selfSelectedList = Type(selectedList) == 'string' ? +selectedList : selectedList
      }
    },
    isDisabled(item) {
      return item.disabled || (!this.showDeleted && item.isDeleted)
    },
    getName(item) {
      const { alias, name, status } = item
      return `${alias}-${name}${status == 1 ? '（已离职）' : ''}`
    },
    getGroupName(item) {
      const { groupName, deleteFlag } = item
      return `${groupName}${deleteFlag == 1 ? '（已删除）' : ''}`
    },
    getMapDataList(dataList) {
      return dataList.map(item => {
        const { name, id } = item
        item.label = `${name}${item.isDeleted ? '（已删除）' : ''}`
        item.value = +id
        return item
      })
    },
    getBizDomainList() {
      this.selectDataList = this.getMapDataList(this.bizDomainList)
    },
    getProductLineList() {
      this.selectDataList = this.getMapDataList(this.productLineList)
    },
    async projectGetProductLines() {
      const { projectId: id } = this
      const res = await this.$services.projectGetProductLines({ id })
      if (!res.data) return
      this.selectDataList = this.getMapDataList(res.data)
      if (this.selectDataList.length == 1) {
        const [firstItem] = this.selectDataList
        this.__setSelected(firstItem.id)
        this.selfClearable = false
      }
    },
    getDepartmentList() {
      this.selectDataList = this.groupList.map(item => {
        const { groupId } = item
        return {
          label: this.getGroupName(item),
          value: +groupId,
        }
      })

      if (this.selectDataList.length == 1) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          const [firstItem] = this.selectDataList
          this.__setSelected({ groupId: firstItem.value })
          this.selfClearable = false
        })
      }
    },
    dataInit() {
      const {
        type,
        getBizDomainList: bizDomain,
        getProductLineList: productLine,
        projectGetProductLines: projectProductLine,
        getDepartmentList: department,
      } = this
      const requestJson = {
        bizDomain,
        productLine,
        projectProductLine,
        department,
      }
      const request = requestJson[type]

      if (request) {
        request()
      } else {
        this.selectDataList = dictionaries[type] ?? []
      }
    },
    selectedChange(value) {
      const selectedList = value || value === 0 ? [].concat(value).map(id => this.selectDataList.find(item => item.value === id)) : []
      this.$emit('selected-change', selectedList)
    },
    handleChange(value) {
      const { selectDataList } = this
      let selectedList = []
      if (this.multiple) {
        selectedList = value.map(id => selectDataList.find(item => item.value === id))
      } else {
        selectedList = selectDataList.find(item => item.value === value)
      }
      this.$emit('change', selectedList)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
<style lang="scss">
.el-select-dropdown.el-popper.popper-select {
  .el-select-dropdown__list {
    .el-select-dropdown__item.is-disabled {
      display: none;
    }
  }
}
</style>
