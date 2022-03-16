<template>
  <div id="app">
    <router-view />
    <Loading :show-loading="isLoading" :show-refresh-bt="showRefreshBt" :status="status" />
  </div>
</template>
<script>
import Loading from './components/common/Loading'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Loading,
  },
  computed: {
    ...mapState({
      isLoading(state) {
        return state.isLoading
      },
      showRefreshBt(state) {
        return state.showRefreshBt
      },
      status(state) {
        return state.status
      },
    }),
  },
}
</script>
