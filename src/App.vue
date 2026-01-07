<template>
  <div class="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">

    <NavComponent v-if="route.name !== 'giris'" v-model:isCollapsed="isCollapsed"/>

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center px-6 pl-1 "
        v-if="route.name !== 'giris'">
        <!-- <ToggleButton v-model="isCollapsed" onLabel="" offLabel="" onIcon="pi pi-bars" offIcon="pi pi-bars" class="w-12 toggleButton mr-3" /> -->
        <Button icon="pi pi-bars" aria-label="Save" class="ml-0 mr-3 !bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100 !border-white dark:!border-slate-800 hover:!bg-slate-50 dark:hover:!bg-slate-700 " @click="isCollapsed = !isCollapsed"/>
        <img :src="isDark ? logowhite : logo" class="w-40">
      </header>

      <div :class="['flex-1 overflow-y-auto' , route.name === 'giris' ? '' : 'p-6']">
        <RouterView  class=""/>
      </div>
    </main>

    <Toast />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavComponent from './components/NavComponent.vue';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue'
// import { ToggleButton } from 'primevue';
import { Button } from 'primevue';
import logo from '@/assets/logowoback.png'
import logowhite from '@/assets/logowhitewoback.png'
// import { useDark } from '@vueuse/core';
// import { useDark } from '@vueuse/core';
import { useTheme } from '@/composables/useTheme'

const { isDark, initTheme } = useTheme()
const isCollapsed = ref(false)
const route = useRoute();

onMounted(() => {
  initTheme()
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
.toggleButton{
  background-color: white !important;
  border: none !important;
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
