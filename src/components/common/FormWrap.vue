<template>
  <div :class="{ 'form-wrap': true, [`form-wrap--${type}`]: true }">
    <div class="form">
      <div class="form__box">
        <slot name="form"></slot>
      </div>
    </div>
    <div v-if="showHander" class="handler">
      <slot name="handler"></slot>
    </div>
  </div>
</template>
<script>
export default {
  /*
    <form-wrap :type="type">
      <template #form></template>
      <template #handler></template>
    </form-wrap>
  */

  props: {
    type: {
      // 当前类型：check(不显示表单验证的*号)
      type: String,
      default: 'add',
    },
  },

  data() {
    return {}
  },

  computed: {
    showHander() {
      if (!this.$slots.handler) return false
      const { handler = [] } = this.$slots
      const findItem = handler.find(item => {
        const { tag, text } = item
        return tag || text
      })
      const hasItem = !!findItem
      return hasItem
    },
  },

  methods: {},
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.form-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  &--check {
    ::v-deep .el-form.form-main {
      > .el-form-item.is-required {
        .el-form-item__label {
          &::before {
            display: none;
          }
        }
      }
    }
  }
  ::v-deep .form {
    flex: 1;
    position: relative;
    &__box {
      width: 100%;
      padding: 10px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      position: absolute;
      left: 0;
      top: 0;
      .form-main.el-form {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 20px;
        .text-wrap {
          display: flex;
          width: 100%;
          .el-form-item {
            flex: 1;
            max-width: auto;
          }
        }
        .hint {
          &--orange,
          &--gray {
            padding: 5px 0;
            line-height: 20px;
            font-size: 12px;
          }
          &--orange {
            color: $orange;
          }
          &--gray {
            color: $gray;
          }
        }
        > .el-form-item,
        > .text-wrap .el-form-item {
          display: flex;
          flex-direction: column;
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0 10px;
          .el-form-item__label {
            text-align: left;
            line-height: 30px;
          }
          .el-form-item__content {
            line-height: 30px;
            margin-left: 0 !important;
            .text {
              padding: 5px 0;
              line-height: 20px;
              .list {
                display: flex;
                flex-wrap: wrap;
                .item {
                  display: flex;
                  flex-wrap: wrap;
                  flex: 0 0 50%;
                  max-width: 50%;
                  padding-right: 50px;
                  line-height: 20px;
                  &__name {
                    width: 150px;
                    padding-right: 10px;
                  }
                  &:nth-of-type(2n) {
                    padding-left: 10px;
                  }
                }
              }
              &--hover {
                &:hover {
                  color: $main;
                  cursor: pointer;
                }
              }
            }
          }
          .el-select,
          .el-date-editor {
            width: 100%;
          }
          &.one-line {
            flex: 0 0 100%;
            max-width: 100%;
          }
          &.no-bottom {
            margin-bottom: 0;
          }
        }
        > .text-wrap {
          &.three-col {
            .el-form-item {
              flex: 0 0 33.3333%;
              max-width: 33.3333%;
            }
          }
        }
      }
    }
  }
  > .handler {
    width: 100%;
    padding: 0 10px;
    height: 60px;
    max-height: 60px;
    line-height: 60px;
    border-top: $border1;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    .el-checkbox {
      float: right;
    }
  }
  ::v-deep {
    .hint {
      padding: 6px 12px;
      margin-bottom: 10px;
      line-height: 20px;
      background-color: #f5f5f5;
      color: #666;
    }
    .hint-title {
      padding: 20px 10px 10px;
      &.hint-title--between {
        display: flex;
        justify-content: space-between;
      }
      &__row1 {
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
      }
      &__row2 {
        font-size: 12px;
      }
    }
  }
}
</style>
