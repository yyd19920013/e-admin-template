<template>
  <div class="navbar">
    <div class="navbar-wrap">
      <div class="left">
        <div class="left__logo">
          <slot></slot>
          <!-- <img :src="require('images/logo.png')" alt="log" @click="toHome" /> -->
        </div>
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
            <el-dropdown-item @click.native="logout">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from 'src/components/Breadcrumb'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { sStore, cookie } from '@/utils/utils'

export default {
  components: {
    Breadcrumb,
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapGetters(['sidebar']),
    avatar() {
      return ''
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
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1999;
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
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
      float: right;
      padding-right: 30px;
      height: 100%;
      line-height: $navbarHeight;
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
    }
  }
}
</style>
