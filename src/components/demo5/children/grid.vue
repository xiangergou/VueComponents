<template>
  <div class="model-table-pagenation">
    <div class="model-table">
      <el-table
        v-loading.lock="loading"
        ref="gridUnit"
        :data="tableData"
        :border="border"
        :stripe="stripe"
        :height="height"
        :max-height="maxHeight"
        :fit="fit"
        :size="size"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :current-row-key="currentRowKey"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :row-ket="rowKey"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :expand-row-keys="expandRowKeys"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        :show-summary="showSummary"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        :cell-class-name="cellClassName"
        style="width: 100%;"
        @select="(selection, row) => emitEventHandler('select', selection, row)"
        @select-all="selection => emitEventHandler('select-all', selection)"
        @selection-change="selection => emitEventHandler('selection-change', selection)"
        @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
        @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
        @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
        @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
        @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
        @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
        @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
        @header-click="(column, event) => emitEventHandler('header-click', column, event)"
        @sort-change="args => emitEventHandler('sort-change', args)"
        @filter-change="filters => emitEventHandler('filter-change', filters)"
        @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
        @header-dragend="(newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)"
        @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)" >
        <el-table-column
          v-if="showRowIndex"
          type="index"
          width="40"
          align="center"/>
        <el-table-column
          v-if="showExpand"
          type="expand"
          width="40">
          <template>
            <slot name="expandTable"/>
            <slot name="expandForm"/>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showSelection"
          type="selection"
          width="40"/>
        <el-table-column
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          :column-key="column.columnKey"
          :prop="column.prop"
          :label="column.label"
          :width="column.minWidth ? '-' : (column.width || `auto`)"
          :min-width="column.minWidth || column.width || 100"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sortable"
          :sort-method="column.method"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip || true"
          :align="column.align || `left`"
          :header-align="column.headerAlign || column.align"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :selectable="column.selectable"
          :reserve-selection="column.reserveSelection"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue">
          <template slot-scope="scope">
            <!-- 全局过滤器 -->
            <span v-if="column.filter">
              <i
                v-if="column.filter === 'parseTime'
                  && scope.row[column.prop]
                && scope.row[column.prop] != ''"
                class="el-icon-time"/>
              {{ Vue.filter(column['filter'])(scope.row[column.prop]) }}
            </span>
            <!-- 图片 -->
            <div
              v-else-if="column.type === 'img'"
              style="display: flex;">
              <img
                v-lazy="scope.row[column.prop]"
                width="40"
                height="40"
                class="image preview-img image-center"
                @click="previewImage(scope.row[column.prop])" >
            </div>
            <!-- 链接 -->
            <a
              v-else-if="column.type === 'link'"
              :href="scope.row[column.prop]"
              target="_blank"
              style="color:#409eff">
              {{ scope.row[column.prop] }}
            </a>
            <!-- tags渲染
              * renderStatusType： 渲染tag type
              * renderStatusValue： 渲染tag 内容
            -->
            <el-tag
              v-else-if="column.type === 'status' && column.unitFilters"
              :type="column.unitFilters.renderStatusType(scope.row[column.prop])">
              {{ column.unitFilters.renderStatusValue(scope.row[column.prop]) }}
            </el-tag>
            <!-- slot插槽 基本上是适配操作列的 -->
            <span v-else-if="column.slotName">
              <slot
                :name="column.slotName"
                :row="scope.row"
                :$index="scope.$index" />
            </span>
            <span v-else>
              {{ column.render ? column.render(scope.row) : scope.row[column.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      v-if="showPagination"
      class="model-pagenation">
      <el-pagination
        :background="pagenationBg"
        :current-page="pagination.pageNo"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import props from './props'
import fetch from '@/utils/fetch'
import { ObjectMap, deepClone } from '@/utils'
export default {
  name: 'grid',
  components: {},
  props,
  data () {
    return {
      Vue,
      pagination: {
        pageNo: 1,
        pageSize: this.pageSizes ? this.pageSizes[0] : 20
      },
      total: 0,
      loading: false,
      tableData: [], // 表格数据
      searchParams: {},
      multipleSelection: [], // 当前页已选择数据
      multipleSelectionAll: [] // 所有页已选择数据
    }
  },
  computed: {
  },
  watch: {
    formOptions: {
      handler (val) {
        this.searchParams = Object.assign(val, this.params)
      },
      deep: true
    },
    params: {
      handler (val) {
        this.searchParams = Object.assign(val, this.params)
      },
      deep: true
    }
  },
  mounted () {
    this.$refs['gridUnit'].$on('expand-change', (row, expanded) => this.emitEventHandler('expand-change', row, expanded))
    const { type, autoLoad, formOptions, params, data } = this
    if (type === 'remote' && autoLoad) {
      this.searchParams = formOptions ? Object.assign(formOptions, params) : params
      this.fetchHandler()
    } else if (type === 'local' && Array.isArray(data)) {
      this.tableData = data
      this.total = data.length
    } else {
      this.$message.error('请联系柏林Grid组件使用姿势')
    }
  },
  methods: {
    /* 查看图片 */
    previewImage (imageUrl) {
      if (!imageUrl) {
        return false
      }
      let previewObj = {src: imageUrl}
      let _img = new Image()
      _img.src = imageUrl
      _img.onload = function () {
        previewObj.w = _img.width || 800
        previewObj.h = _img.height || 600
        Vue.$preview.open(0, [previewObj])
      }
    },
    /* changeSize */
    handleSizeChange (size) {
      this.pagination.pageSize = size
      this.fetchHandler('selection')
    },
    /* change pageNo */
    handleCurrentChange (pageNo) {
      this.pagination.pageNo = pageNo
      this.changePageHoldSelection()
      this.fetchHandler('selection')
    },
    // 数据查询
    searchHandler (options) {
      this.pagination.pageNo = 1
      if (options && options.type === 'clear') {
        this.searchParams = options.data
      }
      this.fetchHandler()
    },
    // 请求数据
    fetchHandler (fetchType) {
      this.loading = true
      let params
      const {
        url, dataMethod, isMock,
        listField, pageNoKey, pageSizeKey,
        totalField, showPagination, pagination
      } = this
      params = ObjectMap(deepClone(this.searchParams))
      if (showPagination) {
        params = Object.assign(params, {
          [pageNoKey]: pagination.pageNo,
          [pageSizeKey]: pagination.pageSize
        })
      }
      if (!fetch) {
        this.$message.error(`请联系柏林如何在Grid组件中使用axios请求`)
        this.loading = false
        return false
      }
      fetch(url, {
        method: dataMethod,
        params
      }, {
        isMock
      }).then(response => {
        let result = response
        if (response && !(response instanceof Array)) {
          if (listField && listField.indexOf('.') !== -1) {
            listField.split('.').forEach(vv => {
              result = result[vv]
            })
          } else {
            result = response[listField]
          }
        }
        if (!result || !(result instanceof Array)) {
          this.$message.error(`${listField}必须是Array哦. 后端童鞋注意下`)
          this.loading = false
          return false
        }
        if (this.dataHandler) {
          this.tableData = result.map(this.dataHandler)
        } else {
          this.tableData = result
        }
        let totalValue = response
        if (Object.prototype.toString.call(response) === '[object Array]') {
          totalValue = response.length
        } else if (typeof response === 'object') {
          if (totalField && totalField.indexOf('.') !== -1) {
            totalField.split('.').forEach(vv => {
              totalValue = totalValue[vv]
            })
          } else {
            totalValue = response[totalField]
          }
        } else {
          totalValue = 0
        }
        this.total = totalValue
        this.loading = false
        if (fetchType === 'selection') {
          setTimeout(() => {
            this.setSelectRow()
          }, 0)
        } else {
          this.multipleSelection = []
          this.multipleSelectionAll = []
        }
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    // 父子组件通信
    emitEventHandler (event) {
      if (event === 'selection-change') {
        this.multipleSelection = [...Array.from(arguments).slice(1)][0]
        setTimeout(() => {
          this.changePageHoldSelection()
        }, 0)
      }
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    // 切换表格selection
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return
      }
      let selectionKey = this.selectionKey
      let selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[selectionKey])
      })
      this.$refs.gridUnit.clearSelection()
      for (let i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.includes(this.tableData[i][selectionKey])) {
          this.$refs.gridUnit.toggleRowSelection(this.tableData[i], true)
        }
      }
    },
    // 跨页选择保留选项
    changePageHoldSelection () {
      let selectionKey = this.selectionKey
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      let selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[selectionKey])
      })
      let selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[selectionKey])
        if (!selectAllIds.includes(row[selectionKey])) {
          this.multipleSelectionAll.push(row)
        }
      })
      // 当前页没有选中的id
      let noSelectIds = []
      this.tableData.forEach(row => {
        if (!selectIds.includes(row[selectionKey])) {
          noSelectIds.push(row[selectionKey])
        }
      })
      // 如果所有已选择列表中有未被选中的，删除
      noSelectIds.forEach(id => {
        if (selectAllIds.includes(id)) {
          for (let i = 0; i < this.multipleSelectionAll.length; i++) {
            if (this.multipleSelectionAll[i][selectionKey] === id) {
              this.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.model-table {
  // border: 1px solid #e6ebf5;
  .expandHeader {
    background-color: #f5f7fa !important;
  }
  .el-table__expanded-cell .el-table {
    // border: 1px solid #e6ebf5;
    border-bottom: 0;
  }
}
.model-pagenation {
  padding-top: 20px;
  text-align: right;
}
.table-expand {
  font-size: 0;
  .el-form-item__content {
    font-size: 12px;
  }
  .el-form-item__label {
    font-size: 12px;
  }
}
.table-expand label {
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33%;
}
</style>
