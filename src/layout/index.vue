<template>
  <div class="main">
    <div class="sidebar-menu-con" :style="{ width: sideBarWidth + 'px' }">
      <sidebar />
    </div>
    <div class="main-header-con" :style="{ paddingLeft: sideBarWidth + 'px' }">
      <navbar>
        <i class="el-icon-s-unfold"
           :style="{ paddingLeft: sideBarWidth + 'px', fontSize: '20px', cursor: 'pointer' }"
           @click="toggleClick"
        >
        </i>
      </navbar>
    </div>
    <div class="single-page-con" :style="{ left: sideBarWidth + 'px' }">
      <div
        class="single-page"
        style="margin: 0; width: 100%; height: 100%"
      >
        <app-main />
      </div>
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  mixins: [ResizeMixin],
  data () {
    return {
      sideBarWidth: 200,
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    toggleClick() {
      this.sideBarWidth === 200
        ? (this.sideBarWidth = 0)
        : (this.sideBarWidth = 200)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~src/styles/mixin.scss';
@import '~src/styles/variables.scss';
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  // padding-bottom: 80px;
  overflow-x: hidden;
  .sidebar-menu-con {
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 21;
    overflow: hidden;
    background: #2b2e33 !important;
    transition: width 0.5s;
  }
  &-header-con {
    box-sizing: border-box;
    position: fixed;
    display: block;
    padding-left: 250px;
    width: 100%;
    height: 60px;
    z-index: 20;
    transition: padding 0.5s;
  }
  .single-page-con {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    /*background-color: #F0F0F0;*/
    transition: left 0.5s;
    .single-page {
      margin: 10px;
    }
    &:first-child {
      height: 100% !important;
    }
  }
}
::v-deep .el-scrollbar__wrap{
 height: 90vh;
}
</style>
