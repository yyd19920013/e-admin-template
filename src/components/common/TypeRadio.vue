<template>
  <div class="type-select">
    <el-radio-group v-model="selfSelected">
      <el-radio v-for="(item, index) in selectDataList" :key="index" :label="item.value">{{ item.label }}</el-radio>
    </el-radio-group>
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

      */
      type: String,
      default: 'priorityBusiness',
    },
    selected: {
      // 选中的值
      type: [Number, String, Boolean],
      default() {
        return []
      },
    },
    multiple: {
      // 是否是多选
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
      selectDataList: [],
      selfSelected: '',
    }
  },

  computed: {
    ...mapState('user', ['userInfo', 'bizDomainList', 'productLineList']),
    groupList() {
      const groupList = this?.userInfo?.groupList ?? []
      return groupList
    },
  },

  watch: {
    selfSelected(newVal) {
      this.$emit('update:selected', newVal)
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

  methods: {
    __clearSelected() {
      this.selfSelected = ''
    },
    __setSelected(selected) {
      if (!selected && ![0, false].includes(selected)) return
      this.selfSelected = Type(selected) == 'string' ? +selected : selected
    },
    getMapDataList(dataList) {
      return dataList.map(item => ({ label: `${item.name}-${item.owner}`, value: +item.id }))
    },
    getBizDomainList() {
      this.selectDataList = this.getMapDataList(this.bizDomainList)
    },
    getProductLineList() {
      this.selectDataList = this.getMapDataList(this.productLineList)
    },
    getDepartmentList() {
      this.selectDataList = this.groupList.map(item => {
        const { parentName, groupName, groupId } = item
        return {
          label: `${parentName}-${groupName}`,
          value: +groupId,
        }
      })
    },
    dataInit() {
      const { type, getBizDomainList: bizDomain, getProductLineList: productLine, getDepartmentList: department } = this
      const requestJson = {
        bizDomain,
        productLine,
        department,
      }
      const request = requestJson[type]

      if (request) {
        request()
      } else {
        this.selectDataList = dictionaries[type] ?? []
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
