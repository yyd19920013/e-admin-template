<template>
  <div
    :class="{
      loading: true,
      active: showLoading,
      active1: showRefreshBt,
    }"
  >
    <div class="error-wrap">
      <div class="error-content">
        <div class="error-text">
          <h3>服务器错误 {{ status }}</h3>
          <h4>点击下方按钮刷新重试</h4>
        </div>
        <a class="refresh" @click="refresh">
          刷新重试
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  /*
      <Loading
          :show="isLoading"
      />
  */

  props: {
    showLoading: {
      // 是否显示Loading
      type: Boolean,
      default: false,
    },
    showRefreshBt: {
      // 是否显示刷新按钮
      type: Boolean,
      default: false,
    },
    status: {
      type: [Number, String], // 请求服务器状态
      default: '',
    },
  },

  methods: {
    refresh() {
      window.webviewRefresh()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/public.scss';

.loading {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background: url('../../assets/images/loading.gif') no-repeat center center;
  background-size: 30px;
  display: none;
  .error-wrap {
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.9);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
    .error-content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      h3 {
        line-height: 30px;
        font-size: 18px;
        font-weight: bold;
        color: #f35c59;
        word-break: break-all;
      }
      h4 {
        line-height: 20px;
      }
      .refresh {
        display: inline-block;
        width: 80px;
        margin-top: 20px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #3385ff;
        border-radius: 5px;
        background-color: #fff;
        color: #3385ff;
      }
    }
  }
  &.active {
    display: block;
  }
  &.active1 {
    background-image: none-;
    .error-wrap {
      display: block-;
    }
  }
}
</style>
