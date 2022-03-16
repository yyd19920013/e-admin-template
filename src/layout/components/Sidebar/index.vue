<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <div class="logo-con">
      <img :src="require('images/bug.png')" style="position: absolute; z-index: -1" />
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- <sidebar-item v-for="route in menuTree" :key="route.path" :item="route" :base-path="route.path" /> -->
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
// import Logo from './Logo'
// import Hamburger from 'src/components/Hamburger'
import SidebarItem from './SidebarItem'
import variables from 'src/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapState('user', ['menuTree']),
    ...mapGetters(['sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return false
      // return !this.sidebar.opened
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
  },
}
</script>
<style lang="scss" scoped>
.logo-con {
  height: 70px;
  padding: 20px 10% 14px;
  img {
    height: 31px;
    margin: 0 4px;
    width: auto;
  }
}
::v-deep .el-menu {
  border-right: none;
}
</style>
