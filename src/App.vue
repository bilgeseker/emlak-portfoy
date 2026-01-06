<template>
  
  <RouterView />
</template>

<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { RouterView } from 'vue-router';

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

html,
body {
  /* Sayfayı yukarıdan çekince yenilenmesini engeller */
  overscroll-behavior-y: contain;

  /* PWA'larda alt tarafta oluşan boşlukları ve kaymaları engellemek için */
  overflow: hidden;
  height: 100%;
}
</style>
