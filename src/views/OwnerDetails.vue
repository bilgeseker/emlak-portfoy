<template>
    <div v-if="!isPending && owner" class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 font-sans">
        <div class="max-w-7xl mx-auto mb-6 flex justify-between items-center">
            <button @click="$router.back()"
                class="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-green-600 transition-colors">
                <i class="pi pi-arrow-left"></i>
                <span>Geri Dön</span>
            </button>
        </div>

        <div class="max-w-7xl mx-auto space-y-8">
            <!-- Owner Header / Info Card -->
            <div
                class="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-zinc-800">
                <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div class="flex items-center gap-6">
                        <div
                            class="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                            {{ getInitials(owner.owner_name, owner.owner_surname) }}
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {{ owner.owner_name }} {{ owner.owner_surname }}
                            </h1>
                            <div class="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-zinc-400">
                                <div class="flex items-center gap-1.5">
                                    <i class="pi pi-phone text-green-500"></i>
                                    <a :href="`tel:${owner.owner_phone}`"
                                        class="hover:text-green-600 transition-colors">
                                        {{ owner.owner_phone }}
                                    </a>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <i class="pi pi-briefcase text-indigo-500"></i>
                                    <span>%{{ owner.commission_rate || 0 }} Komisyon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Actions could go here (Edit/Delete) -->
                </div>

                <div v-if="owner.owner_notes" class="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notlar</h3>
                    <p class="text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {{ owner.owner_notes }}
                    </p>
                </div>
            </div>

            <!-- Estates List Section -->
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <i class="pi pi-building text-slate-400"></i>
                        Portföydeki Mülkler
                        <span
                            class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            {{ estates?.length || 0 }}
                        </span>
                    </h2>
                </div>

                <div v-if="estates && estates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="estate in estates" :key="estate.id" @click="goToEstateDetail(estate.id)"
                        class="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">

                        <!-- Estate Image / Placeholder -->
                        <div class="h-48 bg-slate-100 dark:bg-zinc-800 relative overflow-hidden">
                            <img :src="'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=200&q=80'"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt="Estate Image" />
                            <!-- <img v-if="estate.img_url" :src="getOptimizedUrl(estate.img_url)"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt="Estate Image" />
                            <div v-else class="flex flex-col items-center justify-center h-full text-slate-400">
                                <i class="pi pi-image text-3xl mb-2"></i>
                                <span class="text-xs">Görsel Yok</span>
                            </div> -->
                            <div
                                class="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 shadow-sm">
                                {{ formatPrice(estate.price) }}
                            </div>
                        </div>

                        <div class="p-5">
                            <div class="flex justify-between items-start mb-2">
                                <span
                                    class="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
                                    {{ getLabel(estate.property_type, propertyTypes) }}
                                </span>
                                <span class="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                    {{ new Date(estate.created_at).toLocaleDateString('tr-TR') }}
                                </span>
                            </div>

                            <h3
                                class="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {{ estate.title }}
                            </h3>

                            <p class="text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-1 mb-4">
                                <i class="pi pi-map-marker text-xs"></i>
                                <span class="truncate">{{ estate.district }} / {{ estate.neighborhood }}</span>
                            </p>

                            <div
                                class="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-zinc-800/50 text-xs font-medium text-slate-600 dark:text-zinc-400">
                                <span>{{ estate.m2_gross }} m²</span>
                                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                                <span v-if="estate.property_type !== 'arsa'">{{ getLabel(estate.rooms, roomTypeOptions)
                                }}</span>
                                <span v-else>Arsa</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else
                    class="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 border-dashed">
                    <div
                        class="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="pi pi-home text-2xl text-slate-400"></i>
                    </div>
                    <h3 class="text-slate-900 dark:text-white font-medium mb-1">Mülk Bulunamadı</h3>
                    <p class="text-sm text-slate-500 dark:text-zinc-400">Bu mülk sahibine ait kayıtlı ilan yok.</p>
                </div>
            </div>
        </div>
    </div>

    <div v-else-if="isPending" class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-8 flex items-center justify-center">
        <i class="pi pi-spin pi-spinner text-4xl text-indigo-500"></i>
    </div>

    <div v-else class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-8 flex items-center justify-center">
        <div class="text-center">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Mülk Sahibi Bulunamadı</h2>
            <Button label="Geri Dön" text @click="$router.back()" class="mt-2" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { supabase } from '@/supabase';
import Button from 'primevue/button';
import { propertyTypes, roomTypeOptions } from '../constants/constants.js';

const route = useRoute();
const router = useRouter();
const ownerId = route.params.id;

const fetchData = async () => {
    // 1. Fetch Owner
    const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('*')
        .eq('id', ownerId)
        .single();

    if (ownerError) throw ownerError;

    // 2. Fetch Estates
    const { data: estatesData, error: estatesError } = await supabase
        .from('estates')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

    if (estatesError) throw estatesError;

    return { owner: ownerData, estates: estatesData };
};

const { isPending, data } = useQuery({
    queryKey: ['ownerDetails', ownerId],
    queryFn: fetchData,
    enabled: !!ownerId
});

const owner = computed(() => data.value?.owner);
const estates = computed(() => data.value?.estates);

const getInitials = (name, surname) => {
    return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
};

const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};

const getLabel = (value, options) => {
    const found = options.find(opt => opt.value === value);
    return found ? found.label : value;
};

// const getOptimizedUrl = (url) => {
//     if (!url || !url.includes('cloudinary')) return url;
//     return url.replace('/upload/', '/upload/w_400,c_fill,q_auto,f_auto/');
// };

const goToEstateDetail = (id) => {
    router.push(`/estateDetails/${id}`);
};
</script>
