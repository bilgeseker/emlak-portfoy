<template>
    <div v-if="!localCollapsed" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="closeMenu"></div>

    <aside :class="[
        'h-screen bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 flex flex-col z-50',
        localCollapsed ? 'lg:w-20' : 'lg:w-64',
        'fixed lg:relative',
        localCollapsed ? '-left-full lg:left-0' : 'left-0 w-64'
    ]">

        <!-- Brand Header -->
        <!-- <div class="h-16 flex items-center justify-center border-b border-slate-100 dark:border-zinc-800"
            :class="localCollapsed ? 'px-2' : 'px-6'">
            <div class="flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
                    <i class="pi pi-building text-white text-sm"></i>
                </div>
                <span v-if="!localCollapsed"
                    class="font-bold text-slate-800 dark:text-white text-lg tracking-tight whitespace-nowrap">
                    EmlakPort
                </span>
            </div>
        </div> -->

        <!-- Navigation Links -->
        <nav class="flex-1 px-3 space-y-1.5 mt-6 overflow-x-hidden overflow-y-auto custom-scrollbar">
            <router-link v-for="item in menuItems" :key="item.label" :to="item.route" @click="closeOnMobile"
                v-slot="{ isActive }">
                <div :class="[
                    'flex items-center mt-2 gap-3 px-3 py-2.5 rounded-lg transition-all group cursor-pointer relative overflow-hidden',
                    isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
                ]">
                    <!-- Active Indicator Bar -->
                    <div v-if="isActive"
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>

                    <i :class="[
                        item.icon,
                        'text-lg transition-colors flex-shrink-0',
                        localCollapsed ? 'mx-auto' : '',
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300'
                    ]"></i>

                    <span v-if="!localCollapsed" class="text-sm">
                        {{ item.label }}
                    </span>
                </div>
            </router-link>
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
            <button @click="toggleTheme"
                class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 transition-colors group"
                :class="[localCollapsed ? 'justify-center' : '']">
                <i
                    :class="['pi transition-colors', isDark ? 'pi-sun text-amber-500' : 'pi-moon text-slate-400 group-hover:text-slate-600']"></i>
                <span v-if="!localCollapsed" class="text-sm font-medium">Görünüm</span>
            </button>

            <button @click="handleLogout"
                class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                :class="[localCollapsed ? 'justify-center' : '']">
                <i
                    class="pi pi-sign-out text-slate-400 dark:text-zinc-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors"></i>
                <span v-if="!localCollapsed" class="text-sm font-medium">Çıkış Yap</span>
            </button>
        </div>
    </aside>
</template>

<script setup>
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { useTheme } from '@/composables/useTheme'

// const { toggleTheme } = useTheme()

const { isDark, toggleTheme } = useTheme()
const router = useRouter();
const props = defineProps({ isCollapsed: Boolean });
const emit = defineEmits(['update:isCollapsed']);
// const localCollapsed = ref(props.isCollapsed);
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md')
const localCollapsed = ref(isMobile.value ? true : props.isCollapsed);

watch(() => props.isCollapsed, (newVal) => {
    localCollapsed.value = newVal;
});

const menuItems = [
    { label: 'İlanlarım', icon: 'pi pi-home', route: '/estateList' },
    { label: 'Müşteriler', icon: 'pi pi-users', route: '/ownerList' },
    { label: 'İlan ekle', icon: 'pi pi-plus-circle', route: '/addEstate' },
    { label: 'Yapılacaklar', icon: 'pi pi-file-check', route: '/todo' },
];

const closeMenu = () => {
    localCollapsed.value = true;
    emit('update:isCollapsed', true);
};

const closeOnMobile = () => {
    if (window.innerWidth < 1024) closeMenu();
};
// const toggleDarkMode = () => { 
//     isDark.value = !isDark.value;
//     if (isDark.value) {
//     document.documentElement.classList.add('dark')
//   } else {
//     document.documentElement.classList.remove('dark')
//   }
// };
const handleLogout = async () => {
    await supabase.auth.signOut(); router.push('/');
    document.documentElement.classList.remove('dark');
};

onMounted(() => { isDark.value = document.documentElement.classList.contains('dark'); });
</script>