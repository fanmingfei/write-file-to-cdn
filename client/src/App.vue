<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  font-family: aria;
}


#app .CodeMirror {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.input {
  box-sizing: content-box;
  border-radius: 3px;
  line-height: 28px;
  outline: none;
  border: 1px solid #bbb;
  font-size: 14px;
  text-indent: 12px;
  margin-right: 1vw;
}

.button {
  box-sizing: content-box;
  border-radius: 3px;
  line-height: 28px;
  outline: none;
  border: 1px solid #bbb;
  font-size: 14px;
}
</style>
