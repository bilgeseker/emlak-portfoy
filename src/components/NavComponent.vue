<template>
    <div v-if="!localCollapsed" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="closeMenu"></div>

    <aside :class="[
        'h-screen bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 flex flex-col z-50',
        // MASAÜSTÜ: isCollapsed ise 20 birim (sadece ikon), değilse 64 birim
        localCollapsed ? 'lg:w-18' : 'lg:w-64',
        // MOBİL: isCollapsed ise ekranın dışına at (-w-full), değilse üstüne getir (fixed)
        'fixed lg:relative',
        localCollapsed ? '-left-full lg:left-0' : 'left-0 w-64'
    ]">

        <!-- <nav class="flex-1 px-3 space-y-2 mt-4 overflow-x-hidden">
            <router-link v-for="item in menuItems" :key="item.label" :to="item.route" @click="closeOnMobile"
                class="flex items-center gap-4 px-4 py-3 rounded-xl no-underline text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                <i :class="[item.icon, 'text-lg group-hover:text-indigo-600 flex-shrink-0']"></i>
                <span v-if="!localCollapsed" class="font-medium text-sm whitespace-nowrap">{{ item.label }}</span>
            </router-link>
        </nav> -->

        <nav class="flex-1 px-3 space-y-2 mt-4 overflow-x-hidden">
            <router-link v-for="item in menuItems" :key="item.label" :to="item.route" @click="closeOnMobile"
                v-slot="{ isActive }">
                <div :class="[
                    'flex items-center gap-4 px-4 py-3 mb-2 rounded-xl transition-all group cursor-pointer',
                    isActive
                        ? 'bg-purple-500 dark:bg-purple-800 text-purple-50 dark:text-purple-100 shadow-sm'
                        : 'text-slate-600 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-700'
                ]">
                    <i :class="[
                        item.icon,
                        'text-sm flex-shrink-0',
                        isActive
                            ? 'text-purple-50 dark:text-purple-200'
                            : 'text-slate-600 dark:text-zinc-100'
                    ]"></i>

                    <span v-if="!localCollapsed" class="font-bold text-sm dark:font-bold">
                        {{ item.label }}
                    </span>

                    <!-- 🔥 Aktif bar -->
                    <span v-if="isActive" class="ml-auto w-2 h-2  rounded-full bg-purple-300"></span>
                </div>
            </router-link>
        </nav>


        <div class="p-4 border-t dark:border-slate-500 space-y-2">
            <button @click="toggleTheme"
                class="w-full flex items-center gap-4 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
                :class="[localCollapsed ? 'justify-center' : '']">
                <i :class="['pi text-slate-500 dark:text-slate-200', isDark ? 'pi-sun' : 'pi-moon']"></i>
                <span v-if="!localCollapsed" class="text-sm font-medium dark:text-slate-400">Mod</span>
            </button>
            <button @click="handleLogout"
                class="w-full flex items-center text-red-500 dark:text-red-400 gap-4 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-200/10 rounded-lg"
                :class="[localCollapsed ? 'justify-center' : '']">
                <i class="pi pi-sign-out"></i>
                <span v-if="!localCollapsed" class="text-sm font-medium">Çıkış</span>
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
    // { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/dashboard' },
    { label: 'İlanlarım', icon: 'pi pi-home', route: '/estateList' },
    { label: 'Müşteriler', icon: 'pi pi-users', route: '/ownerList' },
    { label: 'İlan ekle', icon: 'pi pi-plus-circle', route: '/addEstate' },
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