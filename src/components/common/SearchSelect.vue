<template>
  <div class="search-select">
    <el-dialog
      title=""
      :visible.sync="selfVisible"
      :append-to-body="true"
      :show-close="false"
      :before-close="dialogClose"
      width="720px"
      class="el-dialog-global"
    >
      <div class="content">
        <div class="content__title">{{ textJson.title }}</div>
        <div class="content__main">
          <div class="content__main__left">
            <div class="search-input">
              <el-input
                v-model="keyword"
                :placeholder="textJson.placeholder"
                suffix-icon="el-icon-search"
                clearable
                @input="searchByKeyword"
              />
            </div>
            <div v-if="!keyword" class="before-search">
              <div class="before-search__title">
                <div v-for="(item, index) in crumbs" :key="index" class="crumb" @click="toCrumb(item, index)">
                  <template v-if="crumbs.length <= 3 || (crumbs.length > 3 && [0, crumbs.length - 2, crumbs.length - 1].includes(index))">
                    <span :class="{ crumb__text: true, disabled: index == crumbs.length - 1 }">
                      {{ crumbs.length > 3 && index == crumbs.length - 2 ? '...' : item.groupName }}
                    </span>
                    <i v-if="index < crumbs.length - 1" class="el-icon-arrow-right"></i>
                  </template>
                </div>
              </div>
              <div class="before-search__list">
                <div v-if="type == 'checkbox'" class="item">
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    :disabled="!validDataList.length || (disabledSelected && checkAll)"
                    @change="handleCheckAllChange"
                  >
                    全选
                  </el-checkbox>
                </div>
                <component
                  :is="type == 'checkbox' ? 'el-checkbox-group' : 'el-radio-group'"
                  v-model="checkedList"
                  @change="handleCheckedChange"
                >
                  <template v-if="beforeDataList.length">
                    <div v-for="(item, index) in beforeDataList" :key="index">
                      <div v-if="includeDeleted || (!includeDeleted && !item.deleteFlag)" class="item">
                        <div class="item__left">
                          <component :is="type == 'checkbox' ? 'el-checkbox' : 'el-radio'" :label="item" :disabled="isDisabled(item)">
                            {{ item.groupId ? getGroupName(item) : getName(item) }}
                          </component>
                        </div>
                        <div v-if="item.childNode" class="item__right" @click="toLowerLevel(item, index)">
                          <i class="el-icon-caret-bottom"></i>
                          <span class="text">部门</span>
                        </div>
                        <div
                          v-else-if="businessType == 'person' && item.groupId"
                          class="item__right"
                          @click="toLowerLevel(item, index, true)"
                        >
                          <i class="el-icon-caret-bottom"></i>
                          <span class="text">成员</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <el-empty v-else :image-size="100" description="暂无相关部门/人员" />
                </component>
              </div>
            </div>
            <div v-else class="after-search">
              <div class="after-search__title">
                {{ textJson.resultTitle }}
              </div>
              <div class="after-search__list">
                <component
                  :is="type == 'checkbox' ? 'el-checkbox-group' : 'el-radio-group'"
                  v-model="checkedList"
                  @change="handleCheckedChange"
                >
                  <template v-if="afterDataList.length">
                    <div v-for="(item, index) in afterDataList" :key="index" class="item">
                      <div class="item__text">
                        <component :is="type == 'checkbox' ? 'el-checkbox' : 'el-radio'" :label="item" :disabled="isDisabled(item)">
                          {{ item.groupId ? getFullGroupName(item) : getName(item) }}
                        </component>
                      </div>
                    </div>
                  </template>
                  <el-empty v-else :image-size="100" description="暂无相关部门/人员" />
                </component>
              </div>
            </div>
          </div>
          <div class="content__main__right">
            <div class="selected">
              <div class="selected__title">
                <span class="selected__title__left">已选择({{ selectedCount }})</span>
                <el-button v-if="!disabledSelected" type="text" class="selected__title__right" @click="clearCheckedList">
                  清空
                </el-button>
              </div>
              <div class="selected__main">
                <template v-if="Object.keys(checkedList).length">
                  <div v-for="(item, index) in [].concat(checkedList)" :key="index" class="tag">
                    <span class="tag__text">{{ item.groupId ? getFullGroupName(item) : getName(item) }}</span>
                    <i v-if="!disabledSelected" class="el-icon-close" @click="deleteChecked(index)"></i>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="content__end">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { copyJson } from 'utils/utils'

export default {
  /*
    <search-select :visible.sync="visible" type="checkbox" @selected-change="handleSelectedChange" />

    methods: {
      handleSelectedChange(selectedList) {
        console.log('handleSelectedChange', selectedList)
      },
    },
  */

  props: {
    visible: {
      // 是否显示搜索选择弹窗
      require: true,
      type: Boolean,
      default: false,
    },
    type: {
      // 类型：checkbox(多选)、radio(单选)
      type: String,
      default: 'checkbox',
    },
    businessType: {
      // 业务类型：person(选人)、department(部门)
      type: String,
      default: 'person',
    },
    textType: {
      // 业务类型：person(选人)、department(部门)、transfer(转交)
      type: String,
      default: '',
    },
    selectSelectedList: {
      // 外部选中的列表
      type: [Array, String],
      default() {
        return []
      },
    },
    disabledSelected: {
      // 是否禁用已选的
      type: Boolean,
      default: false,
    },
    includeResign: {
      type: Boolean,
      default: false,
    },
    includeDeleted: {
      type: Boolean,
      default: false,
    },
    required: {
      // 是否必选值，必选值为空则不关闭弹窗并提示
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      typeTextJson: {
        person: {
          title: '选择人员',
          resultTitle: '人员',
          placeholder: '搜索人员',
        },
        department: {
          title: '选择部门',
          resultTitle: '部门',
          placeholder: '搜索部门',
        },
        transfer: {
          title: '转交',
          resultTitle: '处理人',
          placeholder: '输入处理人名称',
        },
      },
      searchTimer: null,
      selfVisible: false,
      keyword: '',
      isIndeterminate: false,
      checkAll: false,
      checkedList: [],
      beforeDataList: [],
      afterDataList: [],
      crumbs: [],
    }
  },

  computed: {
    ...mapState('user', ['persons', 'groupListTree', 'groupListTreeFlat', 'groupListTreeFlatFilter', 'firstGroupPersons']),
    selectDataList() {
      const { persons, groupListTreeFlat } = this
      return this.businessType == 'person' ? persons : groupListTreeFlat
    },
    textJson() {
      const { typeTextJson, textType, businessType } = this
      return typeTextJson[textType] || typeTextJson[businessType] || {}
    },
    selectedCount() {
      const { type, checkedList } = this
      return type == 'checkbox' ? checkedList.length : +!!Object.keys(checkedList).length
    },
    validDataList() {
      const { businessType, beforeDataList } = this
      return beforeDataList.filter(item => (businessType == 'person' && item.account) || businessType == 'department')
    },
  },

  watch: {
    visible(newVal) {
      this.dataInit()
      if (newVal) {
        this.setDataList()
      }
    },
    checkedList(newVal) {
      if (this.type == 'checkbox' && !newVal.length) this.isIndeterminate = false
    },
  },

  created() {
    this.dataInit()
  },

  beforeDestroy() {
    clearTimeout(this.searchTimer)
  },

  methods: {
    dataInit() {
      this.selfVisible = this.visible
      if (this.selfVisible) this.keyword = ''
      this.crumbs.splice(1, this.crumbs.length)
      this.clearCheckedList()
    },
    isDisabled(item) {
      const { businessType, checkedList, disabledSelected } = this
      const { groupId, account } = item
      const itemId = businessType == 'person' ? account : groupId
      const findItem = [].concat(checkedList).find(checkedItem => {
        const { account: checkedAccount, groupId: checkedGroupId } = checkedItem
        const checkedId = this.businessType == 'person' ? checkedAccount : checkedGroupId
        return itemId == checkedId
      })

      return !!((businessType == 'person' && groupId) || (disabledSelected && findItem))
    },
    getName(item) {
      const { alias, name, status } = item
      return `${alias}-${name}${status == 1 ? '（已离职）' : ''}`
    },
    getGroupName(item) {
      const { groupName, deleteFlag } = item
      return `${groupName}${deleteFlag == 1 ? '（已删除）' : ''}`
    },
    getFullGroupName(item) {
      const { fullGroupName, deleteFlag } = item
      return `${fullGroupName}${deleteFlag == 1 ? '（已删除）' : ''}`
    },
    setDataList() {
      const [firstItem] = this.groupListTree
      if (!firstItem) return
      const { groupId, groupName, parentId, parentName } = firstItem
      this.crumbs = [{ groupId, groupName, parentId, parentName, index: 0 }]
      this.beforeDataList = firstItem.childNode
      this.syncCheckedList()
      this.getByGroup(groupId, true)
    },
    async getByGroup(groupId, isFirst) {
      if (this.businessType == 'department') return
      const res = isFirst ? this.firstGroupPersons : await this.$services.getByGroup({ groupId })
      const personList = res?.personList ?? []
      this.beforeDataList = [...this.beforeDataList, ...personList]
      this.setCheckedList(this.beforeDataList)
    },
    async getAllByGroup(groupId) {
      if (this.businessType == 'department') return
      const res = await this.$services.getAllByGroup({ groupId })
      const personList = res?.personList ?? []
      this.beforeDataList = [...this.beforeDataList, ...personList]
      this.setCheckedList(this.beforeDataList)
    },
    searchByKeywordDepartment({ keyword }) {
      return new Promise((resolve, reject) => {
        const { includeDeleted, groupListTreeFlat, groupListTreeFlatFilter } = this
        const groupListTreeFlatResult = includeDeleted ? groupListTreeFlat : groupListTreeFlatFilter
        const searchResult = groupListTreeFlatResult.filter(item => item.fullGroupName.includes(keyword))
        return resolve(searchResult)
      })
    },
    searchByKeyword() {
      if (!this.keyword.trim()) return
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(async () => {
        const { keyword, includeResign } = this
        const api = this.businessType == 'person' ? this.$services.searchByKeyword : this.searchByKeywordDepartment
        const res = await api({ keyword, includeResign })
        const persons = res?.data?.persons ?? []
        this.afterDataList = this.businessType == 'person' ? persons : res
        this.setCheckedList(this.afterDataList)
      }, 300)
    },
    radioChecked() {
      if (this.type == 'radio') {
        const [firstItem = {}] = this.checkedList
        this.checkedList = firstItem
      }
    },
    setCheckedList(dataList = []) {
      if (dataList.length && (this.checkedList.length || Object.keys(this.checkedList).length)) {
        this.checkedList = [].concat(this.checkedList).map(checkedItem => {
          const { account: checkedAccount, groupId: checkedGroupId } = checkedItem
          const checkedId = this.businessType == 'person' ? checkedAccount : checkedGroupId
          const dataItem = dataList.find(item => {
            const { account, groupId } = item
            const itemId = this.businessType == 'person' ? account : groupId
            return itemId == checkedId
          })
          return dataItem || checkedItem
        })
        this.radioChecked()
        this.handleCheckedChange()
      } else {
        this.checkAll = false
        this.isIndeterminate = false
      }
    },
    syncCheckedList() {
      const { selectDataList } = this
      const selectSelectedList = [].concat(this.selectSelectedList)
      if (selectDataList && selectDataList.length && selectSelectedList && selectSelectedList.length) {
        const allList = [...this.beforeDataList, ...this.afterDataList, ...selectDataList]
        this.checkedList = selectSelectedList.map(checkedId => {
          const resultItem = allList.find(item => {
            const { account, groupId } = item
            const itemId = this.businessType == 'person' ? account : groupId
            return itemId == checkedId
          })
          return resultItem
        })
        this.radioChecked()
        this.handleCheckedChange()
      }
    },
    handleCheckedChange(checkedData) {
      if (this.type != 'checkbox') return
      const { businessType } = this
      checkedData = this.validDataList.filter(item =>
        this.checkedList.find(checkedItem => {
          if (businessType == 'person') {
            return item.account == checkedItem.account
          } else if (businessType == 'department') {
            return item.groupId == checkedItem.groupId
          }
        })
      )
      const checkedCount = checkedData.length
      const validListLength = this.validDataList.length
      this.checkAll = checkedCount > 0 && checkedCount == validListLength
      this.isIndeterminate = checkedCount > 0 && checkedCount < validListLength
    },
    handleCheckAllChange(isChecked) {
      this.isIndeterminate = false
      if (isChecked) {
        const signJson = {}
        this.checkedList = [...this.checkedList, ...this.validDataList].reduce((prev, next) => {
          const { account, groupId } = next
          const itemId = this.businessType == 'person' ? account : groupId
          if (!signJson[itemId]) {
            signJson[itemId] = `${prev.length}`
            prev.push(next)
          } else {
            prev[signJson[itemId]] = next
          }
          return prev
        }, [])
      } else {
        const validDataListId = this.validDataList.map(item => {
          const { account, groupId } = item
          const itemId = this.businessType == 'person' ? account : groupId
          return itemId
        })
        this.checkedList = this.checkedList.filter(item => {
          const { account, groupId } = item
          const itemId = this.businessType == 'person' ? account : groupId
          return !validDataListId.includes(itemId)
        })
      }
    },
    toLowerLevel(item, index, isMember) {
      const { groupId, groupName, parentId, parentName } = item
      const childNode = item?.childNode ?? []
      this.crumbs.push({ groupId, groupName, parentId, parentName, index })
      this.beforeDataList = childNode || []
      if (isMember) {
        this.getAllByGroup(groupId)
      } else {
        this.setCheckedList(this.beforeDataList)
      }
      this.keyword = ''
      if (childNode.length) {
        this.getByGroup(groupId)
      }
    },
    toCrumb(item, index) {
      if (index == this.crumbs.length - 1) return
      this.crumbs.splice(index + 1, this.crumbs.length)
      let targetList = this.groupListTree
      this.crumbs.forEach(item => {
        targetList = targetList[item.index].childNode
      })
      this.beforeDataList = targetList
      this.setCheckedList(this.beforeDataList)
      this.getByGroup(item.groupId, !item.parentId)
    },
    showDialogFn(bool = false) {
      this.selfVisible = bool
      this.$emit('update:visible', bool)
    },
    dialogOpen() {
      this.showDialogFn(true)
    },
    dialogClose() {
      this.showDialogFn()
    },
    clearCheckedList() {
      if (this.type == 'checkbox') {
        this.checkedList = []
      } else if (this.type == 'radio') {
        this.checkedList = {}
      }
      this.checkAll = false
      this.isIndeterminate = false
    },
    deleteChecked(index) {
      if (this.type == 'checkbox') {
        this.checkedList.splice(index, 1)
        this.handleCheckedChange()
      } else if (this.type == 'radio') {
        this.checkedList = {}
      }
    },
    handleConfirm() {
      const hasValue = Object.keys(this.checkedList).length
      const checkedList = hasValue ? copyJson([].concat(this.checkedList)) : []
      this.$emit('selected-change', checkedList)
      if (this.required) {
        if (hasValue) {
          this.dialogClose()
        } else {
          this.alerts(`请选择${this.textJson.resultTitle}`)
        }
      } else {
        this.dialogClose()
      }
    },
  },
}
</script>
<style lang="scss">
@import '~styles/public.scss';
@mixin searchTitleAndList() {
  &__title {
    display: flex;
    padding: 10px;
    line-height: 20px;
    align-items: center;
    font-size: 12px;
    color: $gray;
  }
  &__list {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 40px;
      border-radius: 2px;
      &__left,
      &__text {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
      }
      &__left {
        display: flex;
        align-items: center;
      }
      &__right {
        display: flex;
        align-items: center;
        min-width: 50px;
        height: 100%;
        text-align: left;
        font-size: 12px;
        color: $main;
        cursor: pointer;
      }
    }
    .el-checkbox-group,
    .el-radio-group {
      width: 100%;
      height: 360px;
      overflow: hidden;
      overflow-y: auto;
      .el-checkbox,
      .el-radio {
        display: flex;
        align-items: center;
        height: 100%;
        .el-checkbox__label,
        .el-radio__label {
          display: block;
          width: 260px;
          @include overflow;
        }
      }
      .item:hover {
        background-color: $bg;
      }
    }
  }
}
.el-dialog-global {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    .content {
      &__title {
        padding: 0 20px;
        line-height: 40px;
        border-bottom: $border1;
        font-size: 16px;
      }
      &__main {
        display: flex;
        &__left,
        &__right {
          width: 50%;
          border-right: $border1;
        }
        &__left {
          padding: 15px 10px;
          padding-bottom: 0;
          .search-input {
            padding: 0 10px;
            .el-input__validateIcon {
              display: none;
            }
          }
          .before-search {
            @include searchTitleAndList;
            &__title {
              overflow: hidden;
              .crumb {
                flex: 0 0 auto;
                &__text {
                  color: #666;
                  &:hover {
                    color: $main;
                    cursor: pointer;
                  }
                  &.disabled {
                    color: $gray;
                    cursor: unset;
                  }
                }
                .el-icon-arrow-right {
                  margin: 0 5px;
                }
              }
            }
          }
          .after-search {
            @include searchTitleAndList;
            .el-checkbox-group {
              height: 400px !important;
            }
            .item {
              &__text {
                .el-checkbox__label {
                  width: 300px !important;
                }
              }
            }
          }
        }
        &__right {
          border-right-color: transparent;
          .selected {
            padding: 0 15px;
            &__title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 5px;
              line-height: 40px;
              &__left {
                color: #999;
              }
            }
            &__main {
              height: 450px;
              overflow: hidden;
              overflow-y: auto;
              .tag {
                float: left;
                line-height: 20px;
                padding: 5px 10px;
                margin: 4px;
                background-color: $bg;
                border-radius: 4px;
                font-size: 12px;
                .el-icon-close {
                  margin-left: 5px;
                  color: #666;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
      &__end {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 20px;
        height: 60px;
        border-top: $border1;
      }
    }
  }
}
</style>
