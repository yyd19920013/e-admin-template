<template>
  <div class="select-department">
    <el-select
      v-model="selectSelectedList"
      clearable
      filterable
      collapse-tags
      :multiple="type == 'checkbox'"
      :placeholder="placeholder"
      @change="handleChange"
    >
      <el-option v-for="(item, index) in dataList" :key="index" :label="getFullGroupName(item)" :value="item.groupId" />
    </el-select>
    <div class="icon-wrap" @click="visible = true">
      <div class="icon">
        <i class="el-icon-s-operation"></i>
      </div>
    </div>
    <search-select
      :visible.sync="visible"
      :select-selected-list="selectSelectedList"
      :type="type"
      :include-deleted="includeDeleted"
      business-type="department"
      @selected-change="handleSelectedChange"
    />
  </div>
</template>
<script>
import SearchSelect from '@/components/common/SearchSelect'
import { mapState } from 'vuex'
import { copyJson } from '@/utils/utils'

export default {
  /*
    <select-department type="checkbox" @selected-change="handleSelectedChange" />
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
    includeDeleted: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      searchTimer: null,
      selectSelectedList: null,
      visible: false,
    }
  },

  computed: {
    ...mapState('user', ['groupListTreeFlat', 'groupListTreeFlatFilter']),
    dataList() {
      const { includeDeleted, groupListTreeFlat, groupListTreeFlatFilter } = this
      return includeDeleted ? groupListTreeFlat : groupListTreeFlatFilter
    },
  },

  created() {
    this.dataInit()
  },

  methods: {
    __clearSelected() {
      this.selectSelectedList = this.type == 'checkbox' ? [] : ''
    },
    __setSelected(selectedList) {
      if (!selectedList && selectedList !== 0) return
      this.selectSelectedList = selectedList
    },
    dataInit() {
      this.selectSelectedList = this.type == 'checkbox' ? [] : ''
    },
    getFullGroupName(item) {
      const { fullGroupName, deleteFlag } = item
      return `${fullGroupName}${deleteFlag == 1 ? '（已删除）' : ''}`
    },
    getSelectedChangeList(selectedList) {
      const mapSelectedList = copyJson(selectedList)
      const [firstItem] = mapSelectedList
      if (this.type == 'checkbox') {
        return mapSelectedList
      } else {
        return firstItem?.groupId ? firstItem : null
      }
    },
    handleChange() {
      const { selectSelectedList = [] } = this
      const selectedList = [].concat(selectSelectedList).map(groupId => this.groupListTreeFlat.find(item => item.groupId == groupId))
      this.$emit('selected-change', this.getSelectedChangeList(selectedList))
    },
    handleSelectedChange(selectedList) {
      if (this.type == 'checkbox') {
        this.selectSelectedList = selectedList.map(item => item.groupId)
      } else if (this.type == 'radio') {
        this.selectSelectedList = selectedList.length ? selectedList[0].groupId : ''
      }
      this.$emit('selected-change', this.getSelectedChangeList(selectedList))
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
.select-department {
  @include selectPersonOrDepartment;
}
</style>
