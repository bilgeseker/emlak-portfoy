<template>
    <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8">
        <!-- <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İlan Yönetimi</h1>
        </div> -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İlan Yönetimi</h1>

            <div class="flex gap-2">
                <Button type="button" icon="pi pi-filter"
                    :label="`Filtrele ${activeFilterCount > 0 ? '(' + activeFilterCount + ')' : ''}`"
                    @click="onOpenFilter" :severity="activeFilterCount > 0 ? 'primary' : 'secondary'" outlined />
            </div>
        </div>
        <div
            class="hidden lg:block bg-white rounded-xl dark:bg-zinc-900 shadow-sm  border border-slate-200 dark:border-zinc-900 overflow-hidden">

            <Skeleton v-if="isPending"></Skeleton>
            <DataTable v-else :value="filteredEstates" paginator :rows="8" dataKey="id" filterDisplay="menu" stripedRows
                sortMode="multiple" responsiveLayout="scroll" class="p-datatable-sm cursor-pointer dark:!bg-zinc-900"
                @row-click="onRowClick" rowHover columnResizeMode="fit" :pt="{
                    thead: {
                        class: 'h-10'
                    }
                }">

                <Column field="image">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=200&q=80'"
                            :alt="slotProps.data.title"
                            class="w-30 h-24 object-contain rounded shadow border border-slate-100 dark:border-zinc-800" />
                    </template>
                </Column>

                <Column field="title" header="İlan Başlığı" sortable></Column>

                <Column field="rooms" header="Oda" sortable>
                    <template #body="{ data, field }">
                        {{ getLabel(data[field], roomTypeOptions) }}
                    </template>
                </Column>

                <Column field="m2_gross" header="m² (Brüt)" sortable></Column>

                <Column header="İl / İlçe" sortable sortField="city">
                    <template #body="slotProps">
                        <div class="flex items-center gap-1">
                            <span class="font-medium text-slate-700 dark:text-zinc-200">
                                {{ slotProps.data.city }}
                            </span>
                            <span class="text-slate-400">/</span>
                            <span class="font-medium text-slate-700 dark:text-zinc-200">
                                {{ slotProps.data.district }}
                            </span>
                        </div>
                    </template>
                </Column>

                <Column field="price" header="Fiyat" sortable>
                    <template #body="slotProps">
                        <span class="text-md font-black text-indigo-500 dark:text-purple-300 tracking-tight">
                            {{ formatCurrency(slotProps.data.price) }}
                        </span>
                    </template>
                </Column>

                <Column header="İşlemler" style="min-width: 8rem">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" severity="contrast" @click="onEditEstate(slotProps.data.id)"
                                rounded outlined />
                            <Button icon="pi pi-trash" severity="danger" rounded outlined
                                @click="confirmDelete(slotProps.data.id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div
            class="lg:hidden flex flex-col bg-slate-100 dark:bg-zinc-950 gap-[1px] border-y border-slate-200 dark:border-zinc-800">
            <div v-if="isPending" class="p-4 space-y-4">
                <div v-for="i in 5" :key="i" class="flex gap-3 animate-pulse">
                    <div class="w-32 h-24 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4"></div>
                        <div class="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <div v-else v-for="item in filteredEstates" :key="item.id"
                class="flex flex-col p-4 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">

                <div class="flex gap-4">
                    <div @click="router.push(`/estateDetails/${item.id}`)" class="cursor-pointer flex-shrink-0">
                        <img :src="item.image || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=200&q=80'"
                            class="w-24 h-20 object-cover rounded-lg shadow-sm" />
                    </div>

                    <div class="flex-1 min-w-0">
                        <div @click="router.push(`/estateDetails/${item.id}`)" class="cursor-pointer">
                            <h3 class="text-[14px] font-bold text-slate-800 dark:text-zinc-100 line-clamp-1">
                                {{ item.title }}
                            </h3>
                            <div class="flex items-center gap-1 mt-1 text-[12px] text-slate-500 dark:text-zinc-400">
                                <i class="pi pi-map-marker text-[10px]"></i>
                                <span>{{ item.city }} / {{ item.district }}</span>
                            </div>
                            <div class="mt-1">
                                <span class="text-md font-black text-indigo-500 dark:text-purple-300 tracking-tight">
                                    {{ formatCurrency(item.price) }}
                                </span>
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 mt-3">
                            <Button icon="pi pi-pencil" severity="contrast" size="small" outlined label="Düzenle"
                                class="!text-xs !py-1" @click.stop="onEditEstate(item.id)" />
                            <Button icon="pi pi-trash" severity="danger" size="small" outlined label="Sil"
                                class="!text-xs !py-1" @click.stop="confirmDelete(item.id)" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <Drawer v-model:visible="visibleFilter" header="Filtreleme" position="left"
            class="!w-full md:!w-[400px] dark:bg-zinc-900">
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
import Skeleton from 'primevue/skeleton';
import Drawer from 'primevue/drawer';
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
import { roomTypeOptions } from '@/constants/constants.js'
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
    m2_netmin: null, m2_netmax: null, in_sale: null, property_type: null, heating: null, kitchen: null, usage_status: null, deed_status: null, balcony: null
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
                const { error } = await supabase
                    .from('estates')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
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
        const { data, error } = await supabase.from("estates").select(`*`).order('created_at', { ascending: true });
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
        // }
        return matchesCity && matchesDistrict && matchesNeighborhood && matchesMinPrice && matchesMaxPrice && matchesRooms &&
            matchesMinM2Gross && matchesMaxM2Gross && matchesMinM2Net && matchesMaxM2Net && matchesInsale && matchesPropertyType &&
            matchesHeating && matchesKitchen && matchesUsage && matchesDeed && matchesBalcony;
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
</script>
<style scoped>
.p-paginator {
    border-radius: 0px;
}
</style>