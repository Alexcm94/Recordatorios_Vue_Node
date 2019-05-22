<template>
  <div id="app">
    <div id="nav">
      <router-link class="text-light" to="/">Recordatorios</router-link> |
      <router-link class="text-light" to="/about">Tiempo</router-link>
    </div>
    <router-view/>
    <Pie url="https://github.com/Alexcm94/Recordatorios_Vue"></Pie>
  </div>
</template>
<script>
import Pie from '@/components/Pie.vue'


export default {
  name: 'app',
  components: {
    Pie,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background: #1b1b1b;
}
</style>
