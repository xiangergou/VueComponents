/*
 * @Author: liuxia
 * @Date: 2019-07-05 17:52:26
 * @Last Modified by: liuxia
 * @Last Modified time: 2019-07-05 17:52:58
 */

import Vue from 'vue'
import Router from 'vue-router'
import {capitalizeFirstLetter} from '@/utils'

Vue.use(Router)

/**
 * 对符合'xx/xx.vue'组件格式的组件取组件名
 * @param str fileName
 * @example abc/bcd/def/basicTable.vue
 * @return {string} BasicTable
 */
function validateFileName (str) {
  return /^\S+\.vue$/.test(str) &&
    str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => {
      return capitalizeFirstLetter($1)
    })
}

const requireComponent = require.context('../components', true, /\.vue$/)

const routes = requireComponent.keys().map((filePath) => {
  const componentConfig = requireComponent(filePath)
  const fileName = validateFileName(filePath)
  const componentName = fileName.toLowerCase() === 'index'
    ? capitalizeFirstLetter(componentConfig.default.name)
    : fileName
  // 全局注册组件
  const component = Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
  return {
    path: `/${componentName}`,
    name: componentName,
    component
    /**
     * 动态加载路由
     * 需要babel的设置，babel@6需要插件babel-plugin-syntax-dynamic-import， babel@7@babel/plugin-syntax-dynamic-import
     * 同时为了防止eslint报错：Parsing error: Unexpected token import，需要使用babel-eslint
     * 方法：https://stackoverflow.com/questions/47815775/dynamic-imports-for-code-splitting-cause-eslint-parsing-error-import
     */
    // component: () => import('@/components/demos/demo1.vue')
  }
})

routes.unshift()
export default new Router({
  routes
})
