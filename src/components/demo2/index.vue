/*
 * @Author: liuxia
 * @Date: 2019-07-09 17:48:13
 * @Last Modified by: liuxia
 * @Last Modified time: 2019-07-10 16:22:23
 */

<template>
  <div class="components-container">
    <h2>
      element dialog 拖拽
    </h2>
    <el-button
      type="primary"
      @click="dialogTableVisible = true">弹一下吧</el-button>
    <el-dialog
      v-drag-dialog
      :visible.sync="dialogTableVisible"
      title="拖拽弹窗试试"
      @dragDialog="handleDrag">
      请在header区域进行拖拽哦~
    </el-dialog>
  </div>
</template>

<script>
import dragDialog from '@/directives/dragDialog'
export default {
  name: 'demo2-element-dialog拖拽指令',
  directives: {
    dragDialog
  },
  data () {
    return {
      dialogTableVisible: false
    }
  },
  methods: {
    handleDrag () {
      console.log('你接着拖')
    }
  }
}
</script>
