<template>
    <div v-if="!isPending" class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8">
        <div class="max-w-6xl mx-auto mb-6 flex justify-between items-center">
            <button @click="$router.back()"
                class="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-green-600 transition-colors">
                <i class="pi pi-arrow-left"></i>
                <span>Listeye Dön</span>
            </button>
            <!-- <div class="flex gap-2">
        <span :class="statusClass(selectedEstate.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
          {{ selectedEstate.status }}
        </span>
      </div> -->
        </div>

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div class="lg:col-span-7">
                <div
                    class="relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <img :src="getOptimizedUrl(selectedEstate?.img_url) || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'"
                        :alt="selectedEstate.title" class="w-full h-[400px] md:h-[500px] object-contain" />
                    <!-- <div
                        class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm backdrop-blur-sm">
                        <i class="pi pi-camera mr-2"></i> 1/1 Fotoğraf
                    </div> -->
                </div>

                <div
                    class="mt-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <h2 class="text-xl font-bold mb-4 dark:text-white">İlan Notları</h2>
                    <p class="text-slate-600 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap"> {{
                        selectedEstate.notes || 'Bu ilan için henüz bir not eklenmemiş.' }}
                    </p>
                </div>
            </div>

            <div class="lg:col-span-5 flex flex-col gap-6">

                <div
                    class="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                        {{ selectedEstate.title }}
                    </h1>
                    <p class="text-slate-500 dark:text-zinc-300 flex items-center gap-1 mb-6">
                        <i class="pi pi-map-marker text-green-600"></i>
                        {{ selectedEstate.city }} / {{ selectedEstate.district }} / {{ selectedEstate.neighborhood }}
                    </p>

                    <div class="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-6">
                        {{ formatPrice(selectedEstate.price) }}
                    </div>

                    <!-- <hr class="border-slate-100 dark:border-zinc-800 mb-6" /> -->
                    <!-- 
                    <div class="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div class="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                            <span class="block text-md text-slate-500 uppercase font-bold">{{ selectedEstate.m2_net }} m²</span>
                        </div>
                        <div class="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl">
                            <span class="block text-xs text-slate-500 uppercase font-bold">Tür</span>
                        </div>
                    </div> -->
                </div>

                <div
                    class="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <h3 class="font-bold mb-4 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">İlan
                        Bilgileri</h3>
                    <div class="flex flex-col gap-3">
                        <!-- <div class="flex justify-between text-sm">
                            <span class="text-slate-400">İlan No</span>
                            <span class="font-medium dark:text-zinc-300">#{{ selectedEstate.id }}</span>
                        </div> -->
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">İlan Tarihi</span>
                            <span class="font-medium dark:text-zinc-300">{{ new
                                Date(selectedEstate.created_at).toLocaleDateString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Emlak Tipi</span>
                            <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.property_type,
                                propertyTypes) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">m² (Brüt)</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.m2_gross }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">m² (Net)</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.m2_net }}</span>
                        </div>
                        <template v-if="selectedEstate.property_type !== 'arsa'">
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Oda</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.rooms,
                                    roomTypeOptions) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Bina Yaşı</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.building_age }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Bulunduğu Kat</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.floor_located }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Kat Sayısı</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.num_of_floors }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Isıtma</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.heating,
                                    heatingOptions) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Banyo Sayısı</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.num_of_bath }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Mutfak</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.kitchen,
                                    kitchenTypes) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Balkon</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.balcony,
                                    booleans) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Asansör</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.lift, booleans)
                                    }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Otopark</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.parking,
                                    parkingTypes) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Eşyalı</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.furnished,
                                    booleans2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Kullanım Durumu</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.usage_status,
                                    usageTypes) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Site İçerisinde</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.in_site,
                                    booleans2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Site Adı</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.site_name }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Aidat(TL)</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.member_fee }}</span>
                            </div>
                        </template>
                        <template v-if="selectedEstate.property_type === 'arsa'">
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">İmar Durumu</span>
                                <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.zoning_status,
                                    zoningStatusTypes) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Parsel No</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.parsel_no }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Pafta No</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.pafta_no }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Kaks (Emsal)</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.kaks }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-400">Gabari</span>
                                <span class="font-medium dark:text-zinc-300">{{ selectedEstate.gabari }}</span>
                            </div>
                        </template>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Krediye Uygun</span>
                            <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.credit, booleans2)
                                }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Tapu Durumu</span>
                            <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.deed_status,
                                deedStatus) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Takas</span>
                            <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.swap, booleans2)
                                }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div v-else class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 animate-pulse">
        <EstateDetailSkeleton />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { supabase } from '@/supabase';
import { useQuery } from '@tanstack/vue-query'
import { heatingOptions, roomTypeOptions, kitchenTypes, booleans, parkingTypes, propertyTypes, booleans2, usageTypes, deedStatus, zoningStatusTypes } from '../constants/constants.js';
import EstateDetailSkeleton from '@/components/EstateDetailSkeleton.vue';
const route = useRoute();

const estateId = computed(() => route.params.id);

const getLabel = (currentValue, optionsList) => {
    if (currentValue === null || currentValue === undefined) return '-';
    const found = optionsList.find(opt => opt.value === currentValue);
    return found ? found.label : currentValue;
};

const fetchEstate = async () => {
    const id = estateId.value;
    if (!id) return null;

    const { data, error } = await supabase
        .from("estates")
        .select(`*`)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Supabase Error:", error.message);
        throw error;
    }
    return data;
}

const { isPending, data: selectedEstate } = useQuery({
    queryKey: ['estate', estateId],
    queryFn: fetchEstate,
    enabled: computed(() => !!estateId.value),
    staleTime: 0,
});

const formatPrice = (value) => {
    if (!value) return "0 TL";
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};
const getOptimizedUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return url;
    return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/');
};

</script>
