<template>
  <div :class="{ logo: true, collapse: collapse }">
    <img :src="collapse ? logoCollapse : logo" class="sidebar-logo" />
  </div>
</template>
<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      logo: require('images/bug.png'),
      logoCollapse: require('images/bug.png'),
    }
  },
}
</script>
<style lang="scss" scoped>
.logo {
  height: 70px;
  padding: 20px 20px 20px;
  &.collapse {
    padding: 20px 10px 20px;
  }
  img {
    height: 31px;
    margin: 0 4px;
    width: auto;
  }
}
</style>
