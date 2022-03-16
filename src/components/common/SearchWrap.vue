<template>
  <div class="search-wrap">
    <el-form ref="form" :model="searchParams" label-width="90px">
      <el-form-item
        v-for="(item, index) in defineSearch"
        :key="index"
        :label="item.label"
        :label-width="item.width ? item.width : '120px'"
        :class="{ [`multiColumn${column}`]: true }"
      >
        <el-input
          v-if="item.type == 'input'"
          v-model="searchParams[item.model]"
          v-bind="Object.assign({ placeholder: '请输入', clearable: true }, item.attrs || {})"
          v-on="item.methods || {}"
        />
        <el-select
          v-else-if="item.type == 'select'"
          v-model="searchParams[item.model]"
          v-bind="Object.assign({ placeholder: '请选择', clearable: true, filterable: true }, item.selectAttrs || {})"
          v-on="item.selectMethods || {}"
        >
          <el-option
            v-for="(item1, index1) in item.options"
            :key="index1"
            :label="item1[item.optionAttrs ? item.optionAttrs.label : 'label']"
            :value="item1[item.optionAttrs ? item.optionAttrs.value : 'value']"
          />
        </el-select>
        <el-cascader
          v-else-if="item.type == 'cascader'"
          v-model="searchParams[item.model]"
          :options="item.options"
          v-bind="Object.assign({ 请选择: '请输入', clearable: true, filterable: true }, item.attrs || {})"
          v-on="item.methods || {}"
        />
        <el-time-picker
          v-else-if="item.type == 'timePicker'"
          v-model="searchParams[item.model]"
          :picker-options="item.pickerOptions"
          v-bind="Object.assign({ placeholder: '选择时间', clearable: true }, item.attrs || {})"
          v-on="item.methods || {}"
        />
        <el-date-picker
          v-else-if="['datePicker', 'dateRangePicker'].includes(item.type)"
          v-model="searchParams[item.model]"
          :picker-options="item.pickerOptions"
          v-bind="Object.assign({ placeholder: '选择日期', clearable: true }, item.attrs || {})"
          v-on="item.methods || {}"
        />
      </el-form-item>
      <div
        v-if="handlerConfig.handleList && defineSearch.length < column && ['auto', 'oneLine', undefined].includes(handlerConfig.direction)"
        :class="{ 'handle-list': true, [handlerConfig.direction]: true }"
      >
        <el-button v-for="(item, index) in handlerConfig.handleList" :key="index" v-bind="item.attrs || {}" v-on="item.methods || {}">
          {{ item.text }}
        </el-button>
      </div>
    </el-form>
    <div
      v-if="handlerConfig.handleList && defineSearch.length >= column && handlerConfig.direction != 'oneLine'"
      :class="{ 'handle-list': true, [handlerConfig.direction]: true }"
    >
      <el-button v-for="(item, index) in handlerConfig.handleList" :key="index" v-bind="item.attrs || {}" v-on="item.methods || {}">
        {{ item.text }}
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  /*
    <search-wrap :define-search="defineSearch" :search-params="requestParams" :handler-config="handlerConfig" />
  */

  props: {
    defineSearch: {
      // 搜索定义
      required: true,
      type: Array,
      default() {
        return []
      },
    },
    searchParams: {
      // 搜索参数
      type: Object,
      default() {
        return {}
      },
    },
    handlerConfig: {
      // 操作配置
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {}
  },

  computed: {
    column() {
      const { column = 3 } = this.handlerConfig || {}

      return column
    },
  },

  methods: {},
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.search-wrap {
  line-height: 40px;
  > span {
    font-size: 16px;
    color: #000;
  }
  ::v-deep {
    .el-form {
      overflow: hidden;
      .el-form-item {
        float: left;
        @for $i from 1 through 10 {
          &.multiColumn#{$i} {
            width: percentage(1 / $i);
          }
        }
        .el-input,
        .el-select,
        .el-cascader,
        .el-date-editor {
          width: 100%;
        }
      }
    }
  }
  .handle-list {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 20px;
    &.left {
      justify-content: flex-start;
    }
    &.center {
      justify-content: center;
    }
    &.right {
      justify-content: flex-end;
    }
  }
}
</style>
