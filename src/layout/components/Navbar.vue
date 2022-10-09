<template>
  <div class="navbar">
    <div class="navbar-wrap">
      <div class="left">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <div class="left__title">
          <breadcrumb class="breadcrumb-container" />
        </div>
      </div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar icon="el-icon-user-solid" />
            <div class="user-name">{{ userInfo.alias }}</div>
            <i class="el-icon-arrow-down"></i>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item :style="itemsCenter" @click.native="logout">
              <i class="el-icon-switch-button"></i>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="showOpenUrl" class="handler-container" trigger="hover">
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item :style="itemsCenter" @click.native="open">
              <i class="el-icon-monitor"></i>
              <span>在浏览器打开</span>
            </el-dropdown-item>
            <el-dropdown-item v-clipboard:copy="openUrl" v-clipboard:success="onCopy" v-clipboard:error="onError" :style="itemsCenter">
              <i class="el-icon-link"></i>
              <span>复制链接</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from 'src/components/Breadcrumb'
import Hamburger from 'src/components/Hamburger'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { sStore, cookie, isDingTalk } from '@/utils/utils'
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    const showOpenUrl = isDingTalk()
    return {
      showOpenUrl,
      openUrl: location.href,
      itemsCenter: {
        display: 'flex',
        alignItems: 'center',
      },
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapGetters(['sidebar']),
    avatar() {
      return ''
    },
  },
  watch: {
    $route(newVal) {
      this.openUrl = location.href
    },
  },
  methods: {
    ...mapMutations('user', ['CHANGE_USERINFO']),
    toHome() {
      this.$router.push('/')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      sStore.clear()
      cookie.clear()
      this.CHANGE_USERINFO({})
      location.href = this.$services.userOut()
    },
    open() {
      window.open(this.openUrl)
    },
    onCopy(e) {
      this.alerts('复制成功', 'success')
    },
    onError(e) {
      this.alerts('复制失败')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~styles/variables.scss';
.navbar {
  height: $navbarHeight;
  .navbar-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: $navbarHeight;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1999;
    .hamburger-container {
      display: flex;
      align-items: center;
      padding: 0 !important;
      margin-left: 20px;
      height: 40px;
      line-height: 40px;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
    }
    .breadcrumb-container {
      float: left;
    }
    .left {
      display: flex;
      align-items: center;
      &__logo {
        // width: 252px;
        padding-left: 20px;
        img {
          height: 25px;
        }
      }
      &__title {
        padding: 0 20px;
        font-size: 16px;
        position: relative;
      }
    }
    .right-menu {
      display: flex;
      align-items: center;
      float: right;
      padding-right: 30px;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;
          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }
      .avatar-container {
        .avatar-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          .el-avatar {
            width: 30px;
            height: 30px;
            line-height: 30px;
          }
          .user-name {
            padding-left: 8px;
            padding-right: 4px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
      .handler-container {
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }
}
</style>
