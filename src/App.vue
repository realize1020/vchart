<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <simple-line />
    <simple-map/> -->
    <!-- <login-component/> -->
    <router-view />
    <!-- <map/> -->
  </div>
</template>

<script>
// import SimpleLine from './components/SimpleLine.vue'
// import SimpleMap from './components/SimpleMap.vue'
import LoginComponent from './components/LoginComponent.vue'
import Main from './views/Main.vue'
export default {
  name: 'App',
  components: {
    // SimpleLine,
    // SimpleMap,
    // LoginComponent,
    // Main
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
