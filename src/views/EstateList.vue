<template>
    <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 transition-colors duration-300 font-sans">
        <div class="max-w-8xl mx-auto space-y-6">
            <!-- Professional Header Section -->
            <div
                class="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm p-6 md:p-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                İlan Yönetimi
                            </h1>
                            <span
                                class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-semibold border border-slate-200 dark:border-zinc-700">
                                {{ estates?.length || 0 }} ilan
                            </span>
                        </div>
                        <p class="text-slate-500 dark:text-zinc-400 text-sm">
                            Portföyünüzdeki tüm emlak ilanlarını buradan yönetebilirsiniz.
                        </p>
                    </div>

                    <div class="flex gap-2 w-full md:w-auto">
                        <Button label="Filtrele" icon="pi pi-filter"
                            :badge="activeFilterCount > 0 ? activeFilterCount.toString() : null" @click="onOpenFilter"
                            outlined severity="secondary"
                            class="!border-slate-300 dark:!border-zinc-700 !text-slate-700 dark:!text-zinc-300 hover:!bg-slate-50 dark:hover:!bg-zinc-800 !font-medium" />
                        <!-- New Estate Button (Currently missing in original code logic, but consistent header structure is good practice. Keeping Filter only as per original) -->
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="grid grid-cols-1">
                <!-- Desktop Table View -->
                <div
                    class="hidden lg:block bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <DataTable v-if="!isPending" :value="filteredEstates" paginator :rows="8" dataKey="id"
                        class="p-datatable-lg" :pt="{
                            headerRow: { class: 'bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-500 text-xs uppercase tracking-wider font-medium' },
                            bodyRow: { class: 'hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-200 cursor-pointer border-b border-slate-50 dark:border-zinc-800/50 last:border-0' },
                            paginator: { class: 'bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800' }
                        }" @row-click="onRowClick">
                        <template #empty>
                            <div class="text-center py-20">
                                <div
                                    class="bg-slate-50 dark:bg-zinc-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="pi pi-home text-3xl text-slate-400 dark:text-zinc-600"></i>
                                </div>
                                <h3 class="text-base font-semibold text-slate-900 dark:text-white">İlan Bulunamadı</h3>
                                <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">Görünüşe göre henüz bir ilan
                                    eklenmemiş.</p>
                            </div>
                        </template>

                        <Column field="image" header="Görsel">
                            <template #body="slotProps">
                                <div
                                    class="w-20 h-16 rounded-lg overflow-hidden border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800">
                                    <img :src="'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=200&q=80'"
                                        :alt="slotProps.data.title" class="w-full h-full object-cover" />
                                </div>
                            </template>
                        </Column>

                        <Column field="title" header="İlan Başlığı" sortable style="min-width: 200px">
                            <template #body="{ data }">
                                <div class="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2"
                                    :title="data.title">
                                    {{ data.title }}
                                </div>
                            </template>
                        </Column>

                        <Column field="property_type" header="Kategori" sortable>
                            <template #body="{ data, field }">
                                <span
                                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                                    {{ getLabel(data[field], propertyTypes) }}
                                </span>
                            </template>
                        </Column>

                        <Column field="rooms" header="Oda" sortable>
                            <template #body="{ data, field }">
                                <span class="text-sm text-slate-600 dark:text-zinc-400">
                                    {{ getLabel(data[field], roomTypeOptions) }}
                                </span>
                            </template>
                        </Column>

                        <Column field="m2_gross" header="m² (Brüt)" sortable>
                            <template #body="{ data }">
                                <span class="text-sm text-slate-600 dark:text-zinc-400 tabular-nums">
                                    {{ data.m2_gross }}
                                </span>
                            </template>
                        </Column>

                        <Column header="Konum" sortable sortField="city">
                            <template #body="slotProps">
                                <div class="flex flex-col">
                                    <span class="font-medium text-slate-900 dark:text-white text-sm">
                                        {{ slotProps.data.district }}
                                    </span>
                                    <span class="text-xs text-slate-500 dark:text-zinc-500">
                                        {{ slotProps.data.city }}
                                    </span>
                                </div>
                            </template>
                        </Column>

                        <Column field="price" header="Fiyat" sortable style="min-width: 140px">
                            <template #body="slotProps">
                                <span
                                    class="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight tabular-nums">
                                    {{ formatCurrency(slotProps.data.price) }}
                                </span>
                            </template>
                        </Column>

                        <Column header="" style="width: 100px" alignFrozen="right" frozen>
                            <template #body="slotProps">
                                <div class="flex items-center justify-end gap-1">
                                    <Button icon="pi pi-pencil" text rounded severity="secondary"
                                        @click.stop="onEditEstate(slotProps.data.id)"
                                        class="!w-8 !h-8 !text-slate-500 dark:!text-zinc-400 hover:!bg-slate-100 dark:hover:!bg-zinc-800" />
                                    <Button icon="pi pi-trash" text rounded severity="danger"
                                        @click.stop="confirmDelete(slotProps.data.id)"
                                        class="!w-8 !h-8 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/10" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>

                    <!-- Custom Shimmer Loading -->
                    <div v-else class="divide-y divide-slate-100 dark:divide-zinc-800">
                        <div
                            class="bg-slate-50 dark:bg-zinc-800/30 h-10 border-b border-slate-100 dark:border-zinc-800">
                        </div>
                        <div v-for="i in 6" :key="i"
                            class="p-4 flex items-center gap-6 animate-pulse bg-white dark:bg-zinc-900">
                            <div class="w-20 h-16 bg-slate-100 dark:bg-zinc-800 rounded-lg"></div>
                            <div class="flex-1 space-y-2 py-1">
                                <div class="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-1/3"></div>
                                <div class="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/4"></div>
                            </div>
                            <div class="w-24 h-6 bg-slate-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- Verified Mobile Card View -->
                <div class="lg:hidden grid gap-4">
                    <div v-if="isPending" class="space-y-4">
                        <div v-for="i in 3" :key="i"
                            class="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800 animate-pulse h-32 flex gap-4">
                            <div class="w-28 h-24 bg-slate-100 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                            <div class="flex-1 space-y-2 py-2">
                                <div class="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-full"></div>
                                <div class="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    <template v-else>
                        <div v-for="item in filteredEstates" :key="item.id"
                            @click="router.push(`/estateDetails/${item.id}`)"
                            class="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800 active:bg-slate-50 dark:active:bg-zinc-800 transition-colors relative overflow-hidden flex gap-4">
                            <!-- Image Section -->
                            <div
                                class="w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 relative">
                                <img :src="'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=200&q=80'"
                                    class="w-full h-full object-cover" />
                                <div
                                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 flex justify-center">
                                    <span class="text-[10px] font-bold text-white tracking-wide">
                                        {{ item.rooms ? getLabel(item.rooms, roomTypeOptions) : '-' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Content Section -->
                            <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <div class="flex justify-between items-start">
                                        <h3
                                            class="text-sm font-bold text-slate-800 dark:text-zinc-100 line-clamp-2 leading-snug">
                                            {{ item.title }}
                                        </h3>
                                        <div class="flex gap-1 -mt-1 -mr-1">
                                            <Button icon="pi pi-pencil" rounded text severity="secondary" size="small"
                                                class="!w-8 !h-8 !p-0" @click.stop="onEditEstate(item.id)" />
                                            <Button icon="pi pi-trash" rounded text severity="danger" size="small"
                                                class="!w-8 !h-8 !p-0" @click.stop="confirmDelete(item.id)" />
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                        <i class="pi pi-map-marker text-[10px]"></i>
                                        <span>{{ item.district }} / {{ item.city }}</span>
                                    </div>
                                </div>
                                <div class="mt-2 flex items-center justify-between">
                                    <span
                                        class="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                                        {{ formatCurrency(item.price) }}
                                    </span>
                                    <span
                                        class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-medium h-fit">
                                        {{ getLabel(item.property_type, propertyTypes) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <Drawer v-model:visible="visibleFilter" header="Filtreleme" position="right"
            class="!w-full md:!w-[400px] dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800" :pt="{
                header: { class: '!p-5 !border-b !border-slate-100 dark:!border-zinc-800 !bg-white dark:!bg-zinc-900' },
                content: { class: '!p-0 !bg-white dark:!bg-zinc-900' },
                title: { class: '!text-lg !font-bold !text-slate-900 dark:!text-white' }
            }">
            <FilterDrawer v-model="filters" @reset="resetFilters" @apply="applyFilter" />
        </Drawer>
    </div>
    <EditEstate v-model="editEstate" :id="selectedId" />
    <ConfirmDialog />
    <Toast position="bottom-center" />
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
//import Skeleton from 'primevue/skeleton';
import Drawer from 'primevue/drawer';
//import DataView from 'primevue/dataview';
// import FloatLabel from 'primevue/floatlabel';
// import Select from 'primevue/select';
// import InputText from 'primevue/inputtext';
// import IconField from 'primevue/iconfield';
// import InputIcon from 'primevue/inputicon';
import { useRouter } from 'vue-router';
import EditEstate from '@/components/EditEstate.vue';
import { useConfirm } from "primevue/useconfirm";
import { supabase } from '@/supabase';
import { useQuery } from '@tanstack/vue-query';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useQueryClient } from '@tanstack/vue-query';
import { roomTypeOptions, propertyTypes } from '@/constants/constants.js'
import FilterDrawer from '@/components/FilterDrawer.vue';
// import { getCities } from 'turkey-neighbourhoods';

//const allCities = getCities();
const queryClient = useQueryClient()
const confirm = useConfirm();
const router = useRouter();
const editEstate = ref(false);
const visibleFilter = ref(false);
const selectedId = ref(null);
const toast = useToast();
const filters = ref(null);    //Drawer'a gidecek kopya filtre
const appliedFilters = ref({
    city: null, district: null, neighborhood: null, minPrice: null, maxPrice: null, rooms: null, m2_grossmin: null, m2_grossmax: null,
    m2_netmin: null, m2_netmax: null, in_sale: null, property_type: null, heating: null, kitchen: null, usage_status: null, deed_status: null, balcony: null,
    in_site: null, zoning_status: null, kaks: null, gabari: null
});  // Tabloyu filtreleyen asıl veri
const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};

const onOpenFilter = () => {
    filters.value = { ...appliedFilters.value };
    visibleFilter.value = true;
};
const activeFilterCount = computed(() => {
    return Object.values(appliedFilters.value).filter(value => {
        return value !== null && value !== undefined && value !== '';
    }).length;
});

const onRowClick = (event) => {
    const id = event.data.id;
    router.push(`/estateDetails/${id}`);
};

const onEditEstate = (id) => {
    editEstate.value = true;
    selectedId.value = id;
};

const getLabel = (currentValue, optionsList) => {
    if (currentValue === null || currentValue === undefined) return '-';
    const found = optionsList.find(opt => opt.value === currentValue);
    return found ? found.label : currentValue;
};

const confirmDelete = (id) => {
    confirm.require({
        message: 'Bu ilanı silmek istediğinize emin misiniz?',
        header: 'Silme Onayı',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'İptal',
        acceptLabel: 'Sil',
        rejectClass: 'p-button-secondary p-button-text',
        acceptClass: 'p-button-danger !text-white !bg-red-600',
        accept: async () => {
            try {
                const target = estates.value.find(e => e.id === id);
                console.log("Silinecek ilan:", target);
                const publicId = target?.img_id;

                console.log(publicId);
                const { error } = await supabase
                    .from('estates')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                if (publicId) {
                    await supabase.functions.invoke('cloudinary-delete', {
                        body: { public_id: publicId }
                    });
                }
                toast.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'İlan silindi',
                    life: 3000
                });

                queryClient.invalidateQueries(['estates']);

            } catch (err) {
                console.error("Silme hatası:", err.message);
                toast.add({ severity: 'error', summary: 'Hata', detail: 'İlan silinemedi', life: 3000 });
            }
        },
        reject: () => {
            console.log("Silme iptal edildi.");
            toast.add({ severity: 'warn', summary: 'İptal', detail: 'Silme işlemi iptal edilidi.', life: 3000 });
        }
    });
};

const fetchEstates = async () => {
    try {
        const { data, error } = await supabase.from("estates").select(`*`).order('city', { ascending: true });
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

const { isPending, data: estates } = useQuery({
    queryKey: ['estates'],
    queryFn: fetchEstates,
});

// const filteredEstates = computed(() => {
//     if (!estates.value) return []; 
//     console.log(filters)
//     return estates.value.filter(estate => {
//         const matchesCity = !filters.value.city || 
//             estate.city?.toLowerCase() === filters.value.city.toLowerCase();
//         return matchesCity;
//     });
// });

const filteredEstates = computed(() => {
    if (!estates.value) return [];
    return estates.value.filter(estate => {
        const matchesCity = !appliedFilters.value.city || estate.city?.toLowerCase() === appliedFilters.value.city.name.toLowerCase();
        const matchesDistrict = !appliedFilters.value.district || estate.district?.toLowerCase() === appliedFilters.value.district.toLowerCase();
        const matchesNeighborhood = !appliedFilters.value.neighborhood || estate.neighborhood?.toLowerCase() === appliedFilters.value.neighborhood.toLowerCase();
        const matchesMinPrice = !appliedFilters.value.minPrice || estate.price >= appliedFilters.value.minPrice;
        const matchesMaxPrice = !appliedFilters.value.maxPrice || estate.price <= appliedFilters.value.maxPrice;
        const matchesMinM2Gross = !appliedFilters.value.m2_grossmin || estate.m2_gross >= appliedFilters.value.m2_grossmin;
        const matchesMaxM2Gross = !appliedFilters.value.m2_grossmax || estate.m2_gross <= appliedFilters.value.m2_grossmax;
        const matchesMinM2Net = !appliedFilters.value.m2_netmin || estate.m2_net >= appliedFilters.value.m2_netmin;
        const matchesMaxM2Net = !appliedFilters.value.m2_netmax || estate.m2_net <= appliedFilters.value.m2_netmax;
        const matchesInsale = !appliedFilters.value.in_sale || estate.in_sale === appliedFilters.value.in_sale;
        const matchesPropertyType = !appliedFilters.value.property_type || estate.property_type === appliedFilters.value.property_type;
        const matchesDeed = !appliedFilters.value.deed_status ||
            appliedFilters.value.deed_status.length === 0 ||
            appliedFilters.value.deed_status.includes(estate.deed_status);
        // if (appliedFilters.value?.property_type !== 'arsa') {
        const matchesBalcony = !appliedFilters.value.balcony || estate.balcony === appliedFilters.value.balcony;
        const matchesRooms = !appliedFilters.value.rooms ||
            appliedFilters.value.rooms.length === 0 ||
            appliedFilters.value.rooms.includes(estate.rooms);
        const matchesKitchen = !appliedFilters.value.kitchen || estate.kitchen === appliedFilters.value.kitchen;
        const matchesHeating = !appliedFilters.value.heating ||
            appliedFilters.value.heating.length === 0 ||
            appliedFilters.value.heating.includes(estate.heating);
        const matchesUsage = !appliedFilters.value.usage_status ||
            appliedFilters.value.usage_status.length === 0 ||
            appliedFilters.value.usage_status.includes(estate.usage_status);

        const matchesInSite = !appliedFilters.value.in_site || estate.in_site === appliedFilters.value.in_site;
        // }

        const matchesZoning = !appliedFilters.value.zoning_status ||
            appliedFilters.value.zoning_status.length === 0 ||
            appliedFilters.value.zoning_status.includes(estate.zoning_status);

        const matchesKaks = !appliedFilters.value.kaks ||
            appliedFilters.value.kaks.length === 0 ||
            appliedFilters.value.kaks.includes(estate.kaks);
        const matchesGabari = !appliedFilters.value.gabari ||
            appliedFilters.value.gabari.length === 0 ||
            appliedFilters.value.gabari.includes(estate.gabari);
        return matchesCity && matchesDistrict && matchesNeighborhood && matchesMinPrice && matchesMaxPrice && matchesRooms &&
            matchesMinM2Gross && matchesMaxM2Gross && matchesMinM2Net && matchesMaxM2Net && matchesInsale && matchesPropertyType &&
            matchesHeating && matchesKitchen && matchesUsage && matchesDeed && matchesBalcony && matchesInSite && matchesZoning && matchesKaks &&
            matchesGabari;
    });
});

const applyFilter = () => {
    appliedFilters.value = { ...filters.value };
    visibleFilter.value = false;
};

const resetFilters = () => {
    filters.value = { city: null };
    appliedFilters.value = { city: null };
    // visibleFilter.value = false;
};

// const applyFilter = () => {
//     visibleFilter.value = false;
// }

// script setup içine ekleyin
// const getOptimizedUrl = (url) => {
//     if (!url || !url.includes('cloudinary')) return url;
//     return url.replace('/upload/', '/upload/w_150,c_thumb,q_auto,f_auto/');
// };

// const totalEstates = computed(() => {
//     return estates.value?.length || 0;
// });

// const newThisMonth = computed(() => {
//     if (!estates.value) return 0;
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     return estates.value.filter(estate => {
//         const createdDate = new Date(estate.created_at);
//         return createdDate >= startOfMonth;
//     }).length;
// });
</script>
<style scoped>
/* Gradient Text Support */
.text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Custom Scrollbar for specific containers */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}

.dark .custom-scrollbar {
    scrollbar-color: #3f3f46 transparent;
}

/* Remove default table borders if needed */
:deep(.p-datatable-wrapper) {
    border-radius: 0 !important;
}

:deep(.p-datatable-header) {
    background: transparent !important;
    border: none !important;
}

/* Row Hover Animation */
:deep(.p-datatable-tbody > tr) {
    transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .p-dialog {
        width: 95vw !important;
    }
}
</style>