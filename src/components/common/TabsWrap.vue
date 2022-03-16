<template>
  <div class="tabs-wrap">
    <el-tabs v-if="defineTabs.length" v-model="insideTabActive" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in defineTabs" :key="index" :name="`${index}`">
        <span slot="label">
          {{ item }}
          <el-tooltip
            v-show="content"
            slot="label"
            :content="content"
            placement="top"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
      </el-tab-pane>
    </el-tabs>
    <div class="form-wrap">
      <slot name="form"></slot>
    </div>
    <div v-if="showHandler" :class="{ 'button-wrap': true, 'button-wrap--active': spreadActive, 'button-wrap--spread': showSpreadButton }">
      <div class="button__left">
        <slot name="buttonLeft"></slot>
      </div>
      <div class="button__right">
        <slot name="buttonRight"></slot>
        <div v-if="showSpreadButton" :class="{ spread: true, 'spread--active': spreadActive }" @click="spreadActiveChange">
          <span class="spread__text">{{ !spreadActive ? '展开' : '收起' }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  /*
    <tabs-wrap
      :tab-active.sync="tabActive"
      :define-tabs="defineTabs"
      :show-spread-button="true"
      :spread-active.sync="spreadActive"
      @tab-click="handleTabClick"
    >
      <template #form>
      </template>
      <template #buttonLeft>
        <el-button type="primary" @click="add">新增</el-button>
      </template>
      <template #buttonRight>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button plain @click="resetForm">重置</el-button>
      </template>
    </tabs-wrap>
  */

  props: {
    content: {
      type: String,
      default: '',
    },
    tabActive: {
      // 选项卡绑定的选中项
      require: true,
      type: String,
      default: '0',
    },
    defineTabs: {
      // 定义选项卡
      require: true,
      type: Array,
      default() {
        return []
      },
    },
    showSpreadButton: {
      // 是否显示展开按钮
      type: Boolean,
      default: false,
    },
    spreadActive: {
      // 是否显示展开的内容
      type: Boolean,
      default: false,
    },
    showHandler: {
      // 是否显示按钮区域
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      insideTabActive: '',
      activeNames: ['1'],
    }
  },

  watch: {
    insideTabActive(newVal) {
      this.$emit('update:tabActive', newVal)
    },
    tabActive(newVal) {
      this.insideTabActive = newVal
    }
  },

  created() {
    this.initData()
  },

  methods: {
    initData() {
      this.insideTabActive = this.tabActive
    },
    spreadActiveChange() {
      this.$emit('update:spreadActive', !this.spreadActive)
    },
    handleTabClick() {
      this.$nextTick(() => {
        this.$emit('tab-click', this.insideTabActive)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.tabs-wrap {
  .el-tabs {
    padding: 0 10px;
  }
  .form-wrap {
    padding-top: 10px;
    ::v-deep .el-form {
      .basic,
      .extend {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          display: flex;
          flex: 0 0 33.3333%;
          max-width: 33.3333%;
          padding: 0 10px;
          margin-bottom: 20px;
          .el-form-item__label {
            min-width: 130px;
            line-height: 30px;
            text-align: right;
          }
          .el-form-item__content {
            flex: 1;
            line-height: 0;
            margin-left: 0 !important;
          }
          .el-select,
          .el-date-editor {
            width: 100%;
          }
        }
      }
      .extend {
        overflow: hidden;
        height: 0;
        padding: 0;
        margin-top: -10px;
        transition: padding 0.1s ease-out;
        &--active {
          height: auto;
          padding: 10px 0;
        }
      }
    }
  }
  .button-wrap {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 20px;
    &--active {
      margin-top: -20px;
    }
    &--spread {
      padding-top: 10px;
    }
    .button__right {
      display: flex;
      .spread {
        padding-left: 16px;
        line-height: 32px;
        text-align: center;
        color: $main;
        cursor: pointer;
        &__text {
          padding-right: 5px;
        }
        .el-icon-arrow-down {
          transition: transform 0.3s ease-out;
          transform: rotate3d(0, 0, 1, 0deg);
        }
        &--active {
          .el-icon-arrow-down {
            transform: rotate3d(0, 0, 1, -180deg);
          }
        }
      }
    }
  }
}
</style>
