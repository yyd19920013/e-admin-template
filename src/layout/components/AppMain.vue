<template>
  <section class="app-main">
    <div class="app-wrap">
      <transition>
        <router-view :key="key" />
      </transition>
    </div>
  </section>
</template>
<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/variables.scss';
@import '~styles/public.scss';
.app-main {
  /*50 = navbar  */
  height: 100%;
  padding-left: 10px;
  padding-top: 10px;
  width: 100%;
  background-color: $bg;
  overflow: auto;
  .app-wrap {
    height: 100%;
    background-color: #fff;
    & > div {
      min-height: 100%;
      padding: 10px;
      padding-bottom: 20px;
      background-color: #fff;
      position: relative;
    }
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
