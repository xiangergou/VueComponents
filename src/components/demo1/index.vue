/*
 * @Author: liuxia
 * @Date: 2019-07-05 20:31:14
 * @Last Modified by: liuxia
 * @Last Modified time: 2019-07-10 15:50:36
 */

<template>
   <el-form class="quarter__container">
     <h2> 基于element 季度组件</h2>
    <!-- 遮罩层   后续研究eleemnt实现方法 监听全局点击事件-->
    <mark
      v-show="showSeason"
      @click.stop="showSeason=false"
    ></mark>

    <el-input placeholder="请选择季度"
      v-model="showValue"
      :style="{width: width}"
      :size="size"
      @focus="showSeason=true">
        <i slot="prefix" class="el-input__icon el-icon-date"></i>
    </el-input>
    <el-card
      :style="{width: width}"
      class="box-card"
      v-show="showSeason"
    >
      <div slot="header" class="clearfix"
        style="text-align:center;padding:0">
        <button
          type="button"
          aria-label="前一年"
          class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
          @click="prev"
        ></button>
        <span role="button" class="el-date-picker__header-label">{{year}}年</span>
        <button
          type="button"
          aria-label="后一年"
          @click="next"
          class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
        ></button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
          :disabled="timeDisabled(0)"
          type="text"
          size="medium"
          style="width:40%;color: #606266;float:left;"
          @click="selectSeason(0)"
        >第一季度</el-button>
        <el-button
          :disabled="timeDisabled(1)"
          type="text"
          size="medium"
          style="float:right;width:40%;color: #606266;"
          @click="selectSeason(1)"
        >第二季度</el-button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
          :disabled="timeDisabled(2)"
          type="text"
          size="medium"
          style="width:40%;color: #606266;float:left;"
          @click="selectSeason(2)"
        >第三季度</el-button>
        <el-button
          :disabled="timeDisabled(3)"
          type="text"
          size="medium"
          style="float:right;width:40%;color: #606266;"
          @click="selectSeason(3)"
        >第四季度</el-button>
      </div>
    </el-card>
  </el-form>
</template>

<script>
export default {
  name: 'demo1-element季度组件',
  props: {
    width: {
      type: String,
      default: '230px'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: +new Date()
    },
    size: {
      type: String,
      default: 'mini'
    },
    valueArr: {
      type: Array,
      default: () => ['01-03', '04-06', '07-09', '10-12']
    }
  },
  data () {
    return {
      showValue: '',
      showSeason: '',
      season: '',
      year: new Date().getFullYear()
    }
  },
  methods: {
    one () {
      this.showSeason = false
    },
    prev () {
      this.year = this.year * 1 - 1
    },
    next () {
      this.year = this.year * 1 + 1
    },
    // 计算季度时间戳
    getStamp (i) {
      let startTimeStr
      let endTimeStr
      switch (i) {
        case 0:
          startTimeStr = `${this.year}/1/1`
          endTimeStr = `${this.year}/3/31`
          break
        case 1:
          startTimeStr = `${this.year}/4/1`
          endTimeStr = `${this.year}/6/30`
          break
        case 2:
          startTimeStr = `${this.year}/7/1`
          endTimeStr = `${this.year}/9/30`
          break
        case 3:
          startTimeStr = `${this.year}/10/1`
          endTimeStr = `${this.year}/12/31`
          break
      }
      return {
        startTime: +new Date(startTimeStr),
        endTime: +new Date(endTimeStr)
      }
    },
    timeDisabled (i) {
      const result = (+this.getStamp(i).startTime < this.min && this.min < +this.getStamp(i).endTime) || (+this.getStamp(i).startTime < this.max && this.min < +this.getStamp(i).endTime)

      return !result
    },
    selectSeason (i) {
      const that = this
      that.season = i + 1
      // const arr = that.valueArr[i].split('-')
      that.showSeason = false
      this.showValue = `${this.year}年${this.season}季度`

      console.log({
        startTime: this.getStamp(i).startTime,
        endTime: this.getStamp(i).endTime
      })
      return {
        startTime: this.getStamp(i).startTime,
        endTime: this.getStamp(i).endTime
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.quarter__container{
  position:relative;
  display:inline;
  mark{
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background:rgba(0,0,0,0);
    z-index:999;
    margin: auto;
  }
  .box-card{
    padding: 0 3px 20px;
    position:absolute;
    z-index:9999;
    right: 0px;
    top: 35px;
  }
}
</style>
