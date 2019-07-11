<template>
  <div>
    <h2>element-table-封装</h2>
    <!--showSelection cacheColumnsKey用以列缓存  -->
    <grid
      ref="refGridUnit"
      :columns.sync="columns"
      showSelection
      :cacheColumnsKey="`${$options.name}`"
      showScreeningBtn
      @selection-change="selectionChange"
      :url="urlList"
      :formOptions="formData"
      :height="tableHeight"
      >

      <template slot="slot_name" slot-scope="scope">
        <span>{{ scope.row.customer.customerName }}</span>
      </template>
      <template slot="slot_pm" slot-scope="scope">
        <span>{{ scope.row.pm.userName }}</span>
      </template>

      <template slot="handle" slot-scope="">
        <el-button type="primary"
          icon="icon-icon_detail" size="small"
        >
          查看详情
        </el-button>
      </template>
    </grid>
  </div>
</template>

<script>
import grid from './children/grid'
export default {
  name: 'demo5-element-table封装',
  components: {
    grid
  },
  data () {
    return {
      tableHeight: 300,
      formData: {},
      urlList: 'www.baidu.com',
      columns: [
        { label: '客户名称', slotName: 'slot_name' },
        { prop: 'orderNo', label: '订单编号' },
        { prop: 'orderContentNo', label: '内容编号' },
        { label: '操作', slotName: 'handle', width: 140, fixed: 'right' }
      ]
    }
  },
  methods: {
    selectionChange (selectArr) {
      this.multipleSelection = selectArr
    }
  },
  mounted () {
    console.log(this.$options.name)
  }
}
</script>

<style scoped>

</style>
