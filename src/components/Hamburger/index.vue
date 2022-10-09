<template>
  <div style="padding: 0 15px" @click="toggleClick">
    <i :class="{ 'el-icon-s-unfold': true, hamburger: true, 'is-active': isActive }"></i>
  </div>
</template>
<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    },
  },
}
</script>
<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  font-size: 20px;
  color: #666;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
