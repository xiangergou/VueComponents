<template>
  <div :class="{drag:dragging}">
    <h2>基于vuedraggable div拖拽</h2>
    <h3 style="margin-bottom: 20px;">cnpm i vuedraggable -S</h3>
    <div class="layout-container">
      <div :class="key" v-for="(item, key) in mainData" :key="key">
        <draggable
          v-bind="dragOptions"
          class="list-group"
          :list="item"
          @end="onEnd"
          @start="onStart"
        >
          <transition-group name="list">
            <div class="list-group-item" v-for="element in item" :key="element.id">
              <div class="drag-handle">{{ element.title }}</div>
              <div class="component-box">
                <component :is="element.name"/>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import {
  test1,
  test2,
  test3
} from './children'

export default {
  name: 'demo3',
  components: {
    draggable,
    test1,
    test2,
    test3
  },
  data () {
    return {
      dragging: false,
      componentList: [
        { name: 'test1', title: 'test1', id: '5' },
        { name: 'test2', title: 'test2', id: '4' },
        { name: 'test3', title: 'test3', id: '1' }
      ],
      layout: {
        left: ['5', '1'],
        right: ['4']
      },
      mainData: {}
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 30,
        handle: '.drag-handle',
        group: 'description',
        ghostClass: 'ghost',
        chosenClass: 'sortable',
        forceFallback: true
      }
    }
  },
  mounted () {
    this.getLayout()
  },
  methods: {
    onStart () {
      this.dragging = true
    },
    onEnd () {
      this.dragging = false
      this.setLayout()
    },
    getLayout () {
      let myLayout = JSON.parse(window.localStorage.getItem('kon'))
      if (!myLayout || Object.keys(myLayout).length === 0) { myLayout = this.layout }
      const newLayout = {}
      for (const side in myLayout) {
        newLayout[side] = myLayout[side].map(i => {
          return this.componentList.find(c => c.id === i)
        })
      }
      this.mainData = newLayout
    },
    setLayout () {
      const res = {}
      for (const side in this.mainData) {
        const item = this.mainData[side].map(i => i.id)
        res[side] = item
      }
      window.localStorage.setItem('kon', JSON.stringify(res))
    }
  }
}
</script>
<style lang="scss" scoped>
.layout-container {
  height: 100%;
  display: flex;
  .left {
    flex: 1;
    margin-right: 40px;
  }
  .right {
    max-width: 550px;
    width: 550px;
  }
  .list-group-item {
    margin-bottom: 20px;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
  }
  .component-box {
    padding: 20px;
  }
  .drag-handle {
    cursor: move;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    padding: 0 20px;
    background: #6cf;
  }
}
.drag {
  .component-box {
    display: none;
  }
}

.list-enter-active {
  transition: all .3s linear;

}
.list-enter,
.list-leave-to {
  opacity: .5;
}

.sortable {
  .component-box {
    display: none;
    height: 0;
  }
}
.list-group {
  > span {
    display: block;
    min-height: 20px;
  }
}

.ghost {
  .drag-handle {
    background: rgb(129, 168, 187);
  }
}
</style>
