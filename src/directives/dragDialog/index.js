/*
 * @Author: liuxia
 * @Date: 2019-07-09 16:49:47
 * @Last Modified by: liuxia
 * @Last Modified time: 2019-07-09 17:46:22
 */

import drag from './drag'

// 支持全局引入
const install = (Vue) => {
  Vue.directive('drag-dialog', drag)
}

drag.install = install
export default drag
