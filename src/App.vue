<template>
  <div class="flex h-screen w-full bg-slate-50 dark:bg-zinc-950 overflow-hidden">

    <NavComponent v-if="route.name !== 'giris'" v-model:isCollapsed="isCollapsed" />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-20 border-b border-slate-200 dark:border-zinc-950 bg-white dark:bg-zinc-950 flex items-center px-6 pl-1 "
        v-if="route.name !== 'giris'">
        <!-- <ToggleButton v-model="isCollapsed" onLabel="" offLabel="" onIcon="pi pi-bars" offIcon="pi pi-bars" class="w-12 toggleButton mr-3" /> -->
        <Button icon="pi pi-bars" aria-label="Save"
          class="ml-0 mr-3 !bg-white dark:!bg-zinc-950 !text-slate-900 dark:!text-slate-100 !border-white dark:!border-zinc-950 hover:!bg-slate-50 dark:hover:!bg-zinc-700 "
          @click="isCollapsed = !isCollapsed" />
        <!-- <img :src="isDark ? logowhite : logo" class="w-40"> -->
      </header>

      <div :class="['flex-1 overflow-y-auto', route.name === 'giris' ? '' : 'p-2']">
        <RouterView />
        <VueQueryDevtools :initial-is-open="true" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavComponent from './components/NavComponent.vue';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue'
// import { ToggleButton } from 'primevue';
import { Button } from 'primevue';
// import logo from '@/assets/logowoback.png'
// import logowhite from '@/assets/logowhitewobacknew.png'
// import { useDark } from '@vueuse/core';
import { useTheme } from '@/composables/useTheme'

// const { isDark, initTheme } = useTheme()
const { initTheme } = useTheme()
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

.toggleButton {
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

/* Sadece dark mod aktifken tablo renklerini zorla değiştir */
.dark {
  /* Tablo genel arka planı */
  /* --p-datatable-background: #1e293b !important; slate-800 */
  --p-datatable-background: #09090b !important;
  /* slate-800 */
  --p-datatable-header-cell-background: #09090b !important;
  --p-datatable-row-background: #09090b !important;

  /* Satır aralarındaki çizgiler (stripedRows için) */
  --p-datatable-row-striped-background: #18181b !important;
  /* Biraz daha koyu slate */

  /* Satırın üzerine gelince (Hover) */
  --p-datatable-row-hover-background: rgb(54, 56, 58) !important;
  /* slate-700 */

  /* Alt kısımdaki sayfalama (Paginator) */
  --p-paginator-background: #09090b !important;
}

/* Çizgileri ve kenarlıkları da slate tonuna çekelim */
.dark .p-datatable-thead>tr>th,
.dark .p-datatable-tbody>tr>td {
  border-color: #09090b !important;
  /* slate-700 border */
  background-color: inherit !important;
}
</style>
