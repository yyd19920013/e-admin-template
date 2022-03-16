<template>
  <div class="test-search-select">
    <div>选择的人：</div>
    <div>
      <span v-for="(item, index) in userList" :key="index">
        {{ item.name }}
        <br />
      </span>
    </div>
    <el-button type="primary" @click="visible = true">点击弹出选择搜索框</el-button>
    <search-select :visible.sync="visible" type="checkbox" @selected-change="handleSelectedChange" />
    <select-person type="checkbox" @selected-change="handleSelectedChange1" />
    <select-person type="radio" @selected-change="handleSelectedChange1" />
    <select-department type="checkbox" @selected-change="handleSelectedChange1" />
    <select-department type="radio" @selected-change="handleSelectedChange1" />
    <select-product @selected-confirm="handleSelectedConfirm1" />
    <select-project @selected-confirm="handleSelectedConfirm2" />
    <select-business @selected-confirm="handleSelectedConfirm3" />
    <type-select :selected-list.sync="priorityBusiness" type="priorityBusiness" />
    <div>{{ priorityBusiness }}</div>
    <type-select :selected-list.sync="statusBusiness" type="statusBusiness" />
    <div>{{ statusBusiness }}</div>
    <type-select :selected-list.sync="bizDomain" type="bizDomain" />
    <div>{{ bizDomain }}</div>
    <type-select :selected-list.sync="productLine" type="productLine" />
    <div>{{ productLine }}</div>
    <div contenteditable @paste="paste">粘贴图片到此处</div>
    <el-button type="primary" @click="userOut">登录</el-button>
    <comment />
  </div>
</template>
<script>
import SearchSelect from '@/components/common/SearchSelect'
import SelectPerson from '@/components/common/SelectPerson'
import SelectDepartment from '@/components/common/SelectDepartment'
import TypeSelect from '@/components/common/TypeSelect'

export default {
  components: {
    SearchSelect,
    SelectPerson,
    SelectDepartment,
    TypeSelect,
  },

  data() {
    return {
      visible: false,
      userList: [],
      priorityBusiness: [],
      statusBusiness: [],
      bizDomain: [],
      productLine: [],
    }
  },

  mounted() {
    this.projectGet()
    this.projectList()
    this.getGroupListTree()
  },

  methods: {
    paste(event) {
      const items = (event.clipboardData || window.clipboardData).items
      if (items && items.length) {
        const reader = new FileReader()
        const file = items[0].getAsFile()
        reader.readAsDataURL(file)
        reader.onload = function(event) {
          console.log(items, file)
        }
      }
    },
    async projectGet() {
      const res = await this.$services.projectGet({ id: 1 })
      console.log(res)
    },
    async projectList() {
      const res = await this.$services.projectList({
        actualEndDate: '',
        actualStartDate: '',
        bizDomainId: [],
        id: 0,
        name: '',
        pageNum: 0,
        pageSize: 0,
        pd: [],
        planEndDate: '',
        planStartDate: '',
        pm: [],
        priority: 0,
        productLineId: [],
        status: 0,
        teamMember: [],
        type: 0,
      })
      console.log(res)
    },
    async userOut() {
      try {
        const res = await this.$services.userOut()
        console.log('try', res)
      } catch (err) {
        console.log('catch', err)
        if (!err.data) return
        location.href = err.data.loginUrl
      }
    },
    async getGroupListTree() {
      // const res = await this.$services.getGroupListTree({}, true)
      // console.log(res)
    },
    handleSelectedChange(selectedList) {
      console.log('handleSelectedChange', selectedList)
      this.userList = selectedList
    },
    handleSelectedChange1(selectedList) {
      console.log('handleSelectedChange1', selectedList)
    },
    handleSelectedConfirm1(selectedList) {
      console.log('handleSelectedConfirm1', selectedList)
    },
    handleSelectedConfirm2(selectedList) {
      console.log('handleSelectedConfirm2', selectedList)
    },
    handleSelectedConfirm3(selectedList) {
      console.log('handleSelectedConfirm3', selectedList)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';
</style>
