<template>
  <div>
    <el-button v-waves>点我试试</el-button>
  </div>
</template>

<script>
import waves from '@/directives/waves'
import Vue from 'vue'

Vue.use(waves)
export default {
  name: 'demo4-btn波纹指令'
}
</script>

<style scoped>

</style>
