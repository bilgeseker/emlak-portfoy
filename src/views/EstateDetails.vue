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
                    <img :src="selectedEstate?.image || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'" :alt="selectedEstate.title"
                        class="w-full h-[400px] md:h-[500px] object-contain" />
                    <!-- <div
                        class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm backdrop-blur-sm">
                        <i class="pi pi-camera mr-2"></i> 1/1 Fotoğraf
                    </div> -->
                </div>

                <div
                    class="mt-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <h2 class="text-xl font-bold mb-4 dark:text-white">İlan Açıklaması</h2>
                    <p class="text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {{ selectedEstate.district }} lokasyonunda bulunan bu muhteşem {{ selectedEstate.property_type?.toLowerCase()
                        }}, modern mimarisi ve geniş kullanım alanıyla konforlu bir yaşam sunuyor. Ulaşım akslarına
                        yakınlığı ve yüksek yatırım değeriyle kaçırılmayacak bir fırsat.
                    </p>
                </div>
            </div>

            <div class="lg:col-span-5 flex flex-col gap-6">

                <div
                    class="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                        {{ selectedEstate.title }}
                    </h1>
                    <p class="text-slate-500 dark:text-zinc-400 flex items-center gap-1 mb-6">
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
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">İlan No</span>
                            <span class="font-medium dark:text-zinc-300">#{{ selectedEstate.id }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">İlan Tarihi</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.created_at }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Emlak Tipi</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.property_type }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">m² (Brüt)</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.m2_gross }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">m² (Net)</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.m2_net }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Bina Yaşı</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.building_age }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Bulunduğu Kat</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.floor_located }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Kat Sayısı</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.num_of_floors }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Isıtma</span>
                            <span class="font-medium dark:text-zinc-300">{{ getLabel(selectedEstate.heating, heatingOptions) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Banyo Sayısı</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.num_of_bath }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Mutfak</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.kitchen }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Balkon</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.balcony }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Asansör</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.lift }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Otopark</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.parking }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Eşyalı</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.furnished }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Kullanım Durumu</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.usage_status }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Site İçerisinde</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.in_site }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Site Adı</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.site_name }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Aidat</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.member_fee }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Aidat(TL)</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.member_fee }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Krediye Uygun</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.credit }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Tapu Durumu</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.deed_status }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Takas</span>
                            <span class="font-medium dark:text-zinc-300">{{ selectedEstate.swap }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div v-else class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 animate-pulse">
        <div class="max-w-6xl mx-auto mb-6 flex justify-between">
            <div class="h-6 w-32 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div class="lg:col-span-7">
                <div class="w-full h-[400px] md:h-[500px] bg-slate-200 dark:bg-zinc-800 rounded-2xl mb-8"></div>

                <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <div class="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
                    <div class="space-y-3">
                        <div class="h-4 w-full bg-slate-100 dark:bg-zinc-800/50 rounded"></div>
                        <div class="h-4 w-full bg-slate-100 dark:bg-zinc-800/50 rounded"></div>
                        <div class="h-4 w-2/3 bg-slate-100 dark:bg-zinc-800/50 rounded"></div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-5 flex flex-col gap-6">
                <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <div class="h-8 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
                    <div class="h-4 w-1/4 bg-slate-100 dark:bg-zinc-800/50 rounded mb-6"></div>

                    <div class="h-10 w-1/2 bg-green-100 dark:bg-green-900/20 rounded mb-8"></div>

                    <div class="grid grid-cols-3 gap-4">
                        <div class="h-16 bg-slate-50 dark:bg-zinc-800/50 rounded-xl"></div>
                        <div class="h-16 bg-slate-50 dark:bg-zinc-800/50 rounded-xl"></div>
                        <div class="h-16 bg-slate-50 dark:bg-zinc-800/50 rounded-xl"></div>
                    </div>
                </div>

                <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <div class="h-6 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded mb-6"></div>
                    <div class="space-y-4">
                        <div class="flex justify-between">
                            <div class="h-4 w-20 bg-slate-100 dark:bg-zinc-800/50 rounded"></div>
                            <div class="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                        <div class="flex justify-between">
                            <div class="h-4 w-20 bg-slate-100 dark:bg-zinc-800/50 rounded"></div>
                            <div class="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                        <div class="flex justify-between">
                            <div class="h-4 w-20 bg-slate-100 dark:bg-zinc-800/50 rounded"></div>
                            <div class="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { supabase } from '@/supabase';
import { useQuery } from '@tanstack/vue-query'
import {heatingOptions} from '../constants/heating_types.js';

const route = useRoute();

// ID'yi reactive (izlenebilir) hale getiriyoruz
const estateId = computed(() => route.params.id);

const getLabel = (currentValue, optionsList) => {
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

</script>
