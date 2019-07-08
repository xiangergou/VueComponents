<template>
<div id="app" class="app_container">
  <ul class="nav">
    <li>
      <router-link to="/" exact>Home</router-link>
    </li>
    <li v-for="demo of demos" :key="demo">
      <router-link :to="`Demo${demo}`">Demo-{{needZero(demo)}}{{demo}}</router-link>
    </li>
  </ul>
  <div class="content">
    <router-view :identity="identity"/>
  </div>
</div>
</template>

<script>
const requireComponent = require.context('./components', true, /\.vue$/)
const DEMO_NUMBER = requireComponent.keys().length

export default {
  name: 'App',
  data: function () {
    return {
      demos: DEMO_NUMBER,
      identity: {
        id: 123,
        role: 123
      }
    }
  },
  methods: {
    getDemoArray () {
      let arr = []
      for (let i = 0; i < DEMO_NUMBER; i++) {
        arr.push(i + 1)
      }
      return arr
    },
    needZero (number) {
      return number < 10 ? '0' : null
    }
  }
}
</script>

<style lang="scss">
@import './style/reset.scss';
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  width: 100%;
  min-height: 100%;
  h1, h2 {
    font-weight: normal;
  }
  ul, ol {
    list-style-type: none;
    padding: 0;
    text-align: left;
  }
  .nav {
    border-right: 1px solid gray;
    padding: 50px 0 0 40px;
    width: 120px;
    flex-shrink: 0;
  }
  .nav li {
    margin: 20px 0;
  }
  .content {
    padding: 30px 20px;
    flex-grow: 1;
    box-sizing: border-box;
  }
  .inner-content {
    margin-top: 30px;
  }
  a {
    color: gray
  }
  .router-link-active {
    color: #42b983;
  }
  h1 {
    font-size: 36px;
    font-weight: bold;
    color: darkkhaki;
  }
  p {
    margin: 10px 0;
  }
  .title {
    display: inline-block;
    width: 150px;
    margin-right: 15px;
    color: crimson;
  }
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}

</style>
