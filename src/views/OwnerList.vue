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
                                Müşteri Portföyü
                            </h1>
                            <span
                                class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-semibold border border-slate-200 dark:border-zinc-700">
                                {{ owners?.length || 0 }}
                            </span>
                        </div>
                        <p class="text-slate-500 dark:text-zinc-400 text-sm">
                            Kayıtlı müşterilerinizi yönetin ve takip edin.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full md:w-auto">
                        <Button label="Filtrele" icon="pi pi-filter"
                            :badge="activeFilterCount > 0 ? activeFilterCount.toString() : null" @click="onOpenFilter"
                            outlined severity="secondary"
                            class="!border-slate-300 dark:!border-zinc-700 !text-slate-700 dark:!text-zinc-300 hover:!bg-slate-50 dark:hover:!bg-zinc-800 !font-medium" />
                        <Button icon="pi pi-plus" label="Yeni Müşteri" @click="onAddOwner"
                            class="!bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 !border-none hover:!bg-slate-800 dark:hover:!bg-zinc-100 !font-semibold !shadow-none" />
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="grid grid-cols-1">
                <!-- Desktop Table View -->
                <div
                    class="hidden lg:block bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <DataTable v-if="!isPending" :value="filteredOwners" paginator :rows="8" dataKey="id"
                        class="p-datatable-lg" :pt="{
                            headerRow: { class: 'bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-500 text-xs uppercase tracking-wider font-medium' },
                            bodyRow: { class: 'hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors duration-200 cursor-pointer border-b border-slate-50 dark:border-zinc-800/50 last:border-0' },
                            paginator: { class: 'bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800' }
                        }" @row-click="onRowClick">
                        <template #empty>
                            <div class="text-center py-20">
                                <div
                                    class="bg-slate-50 dark:bg-zinc-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="pi pi-users text-3xl text-slate-400 dark:text-zinc-600"></i>
                                </div>
                                <h3 class="text-base font-semibold text-slate-900 dark:text-white">Kayıt Bulunamadı</h3>
                                <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">Henüz bir müşteri eklenmemiş
                                    veya filtrelerle eşleşmiyor.</p>
                            </div>
                        </template>

                        <Column field="owner_name" header="Müşteri" sortable style="min-width: 250px">
                            <template #body="{ data }">
                                <div class="flex items-center gap-4 py-3">
                                    <div class="relative">
                                        <div :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-black/5 dark:border-white/5',
                                            getAvatarColor(data.id)
                                        ]">
                                            {{ getInitials(data.owner_name, data.owner_surname) }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-slate-900 dark:text-white text-sm">
                                            {{ data.owner_name }} {{ data.owner_surname }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column field="owner_phone" header="Telefon" sortable style="min-width: 200px">
                            <template #body="{ data }">
                                <div class="flex items-center gap-4 py-3">
                                    <div>
                                        <div class="font-semibold text-slate-900 dark:text-white text-sm">
                                            {{ data.owner_phone }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column field="commission_rate" header="Komisyon" sortable style="min-width: 150px">
                            <template #body="{ data }">
                                <span
                                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-transparent border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 tabular-nums shadow-sm">
                                    %{{ data.commission_rate || 0 }}
                                </span>
                            </template>
                        </Column>

                        <Column field="notes" header="Not" style="min-width: 250px">
                            <template #body="{ data }">
                                <div class="max-w-xs">
                                    <p class="text-sm text-slate-600 dark:text-zinc-400 truncate"
                                        v-if="data.owner_notes">
                                        {{ data.owner_notes }}
                                    </p>
                                    <span class="text-sm text-slate-400 dark:text-zinc-600" v-else>-</span>
                                </div>
                            </template>
                        </Column>

                        <Column header="" style="width: 100px" alignFrozen="right" frozen>
                            <template #body="{ data }">
                                <div class="flex items-center justify-end gap-1">
                                    <Button icon="pi pi-pencil" text rounded severity="secondary"
                                        @click.stop="onEditOwner(data.id)"
                                        class="!w-8 !h-8 !text-slate-500 dark:!text-zinc-400 hover:!bg-slate-100 dark:hover:!bg-zinc-800" />
                                    <Button icon="pi pi-trash" text rounded severity="danger"
                                        @click.stop="confirmDelete(data.id)"
                                        class="!w-8 !h-8 !text-slate-400 dark:!text-zinc-500 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/10" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>

                    <!-- Professional Loading State (Custom Shimmer) -->
                    <div v-else class="divide-y divide-slate-100 dark:divide-zinc-800">
                        <div
                            class="bg-slate-50 dark:bg-zinc-800/30 h-10 border-b border-slate-100 dark:border-zinc-800">
                        </div>
                        <div v-for="i in 6" :key="i"
                            class="p-4 flex items-center gap-4 animate-pulse bg-white dark:bg-zinc-900">
                            <div class="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-full"></div>
                            <div class="flex-1 space-y-2 py-1">
                                <div class="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-1/4"></div>
                                <div class="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-1/3"></div>
                            </div>
                            <div class="w-16 h-6 bg-slate-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- Verified Mobile Card View -->
                <div class="lg:hidden grid gap-4">
                    <div v-if="isPending" class="space-y-4">
                        <div v-for="i in 3" :key="i"
                            class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 animate-pulse h-40">
                        </div>
                    </div>
                    <template v-else>
                        <div v-for="item in filteredOwners" :key="item.id" @click="onRowClick({ data: item })"
                            class="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-zinc-800 active:bg-slate-50 dark:active:bg-zinc-800 transition-colors relative overflow-hidden">
                            <div class="flex items-start gap-4">
                                <div :class="[
                                    'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border border-black/5 dark:border-white/5',
                                    getAvatarColor(item.id)
                                ]">
                                    {{ getInitials(item.owner_name, item.owner_surname) }}
                                </div>
                                <div class="flex-1 min-w-0 pt-0.5">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3
                                                class="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                                {{ item.owner_name }} {{ item.owner_surname }}
                                            </h3>
                                            <span
                                                class="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium  text-slate-600 dark:text-zinc-400">
                                                {{ item.owner_phone }}
                                            </span>
                                        </div>
                                        <div class="flex gap-1 -mt-1 -mr-1" @click.stop>
                                            <Button icon="pi pi-pencil" rounded text severity="secondary" size="small"
                                                class="!w-8 !h-8 !p-0" @click.stop="onEditOwner(item.id)" />
                                            <Button icon="pi pi-trash" rounded text severity="danger" size="small"
                                                class="!w-8 !h-8 !p-0" @click.stop="confirmDelete(item.id)" />
                                        </div>
                                    </div>
                                    <div>

                                        <span
                                            class="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                                            %{{ item.commission_rate || 0 }} Komisyon
                                        </span>
                                    </div>
                                    <div class="mt-4 flex items-center justify-between">
                                        <p class="text-sm text-slate-500 dark:text-zinc-400 truncate max-w-[180px]">
                                            {{ item.owner_notes || 'Not yok' }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Enhanced Filter Drawer -->
            <Drawer v-model:visible="visibleFilter" header="Filtrele" position="right"
                class="!w-full md:!w-[400px] dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800" :pt="{
                    header: { class: '!p-5 !border-b !border-slate-100 dark:!border-zinc-800 !bg-white dark:!bg-zinc-900' },
                    content: { class: '!p-5 !bg-white dark:!bg-zinc-900' },
                    title: { class: '!text-lg !font-bold !text-slate-900 dark:!text-white' }
                }">
                <div class="flex flex-col h-full">
                    <div class="flex-1 space-y-5">
                        <div class="grid gap-5">
                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Müşteri
                                    Bilgisi</label>
                                <InputText v-model="filters.name" placeholder="İsim"
                                    class="w-full !rounded-lg !bg-slate-50 dark:!bg-zinc-800 !border-slate-200 dark:!border-zinc-700 !shadow-none focus:!ring-1 focus:!ring-slate-900" />
                                <InputText v-model="filters.surname" placeholder="Soyisim"
                                    class="w-full !rounded-lg !bg-slate-50 dark:!bg-zinc-800 !border-slate-200 dark:!border-zinc-700 !shadow-none focus:!ring-1 focus:!ring-slate-900" />
                            </div>

                            <div class="space-y-1.5">
                                <label
                                    class="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Detaylar</label>
                                <div class="relative">
                                    <InputNumber v-model="filters.commission_rate" placeholder="Komisyon Oranı" :min="0"
                                        :max="100" class="w-full"
                                        inputClass="!rounded-lg !bg-slate-50 dark:!bg-zinc-800 !border-slate-200 dark:!border-zinc-700 !shadow-none w-full" />
                                    <i
                                        class="pi pi-percentage absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-6 flex gap-3 border-t border-slate-100 dark:border-zinc-800">
                        <Button label="Temizle" @click="resetFilters" severity="secondary" outlined
                            class="flex-1 !rounded-lg !border-slate-300 dark:!border-zinc-700 !text-slate-700 dark:!text-zinc-300" />
                        <Button label="Uygula" @click="applyFilter"
                            class="flex-1 !rounded-lg !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 !border-none" />
                    </div>
                </div>
            </Drawer>
        </div>

        <EditOwner v-model="editOwner" :id="selectedId" />
        <ConfirmDialog />
        <Toast position="bottom-center" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
//import Skeleton from 'primevue/skeleton';
import Drawer from 'primevue/drawer';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { useRouter } from 'vue-router';
import EditOwner from '@/components/EditOwner.vue';
import { useConfirm } from "primevue/useconfirm";
import { supabase } from '@/supabase';
import { useQuery } from '@tanstack/vue-query';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useQueryClient } from '@tanstack/vue-query';


const queryClient = useQueryClient()
const confirm = useConfirm();
const router = useRouter();
const editOwner = ref(false);
const visibleFilter = ref(false);
const selectedId = ref(null);
const toast = useToast();
const filters = ref({
    name: '',
    surname: '',
    commission_rate: null,
    notes: ''
});
const appliedFilters = ref({
    name: '',
    surname: '',
    commission_rate: null,
    notes: ''
});

// LocalStorage'dan filtreleri yükle
onMounted(() => {
    const savedFilters = localStorage.getItem('ownerFilters');
    if (savedFilters) {
        try {
            appliedFilters.value = JSON.parse(savedFilters);
            filters.value = { ...appliedFilters.value };
        } catch (e) {
            console.warn('Filtreler yüklenirken hata:', e);
        }
    }
});

// Filtreler değiştiğinde localStorage'a kaydet
watch(appliedFilters, (newFilters) => {
    localStorage.setItem('ownerFilters', JSON.stringify(newFilters));
}, { deep: true });

const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
};

const getAvatarColor = (id) => {
    // Professional subtle muted palette
    const colors = [
        'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
        'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400',
        'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    ];
    // Use ID hash to pick a color consistently
    return colors[id % colors.length];
};



// const totalCustomers = computed(() => {
//     return customers.value?.length || 0;
// });

// const newThisMonth = computed(() => {
//     if (!customers.value) return 0;
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     return customers.value.filter(customer => {
//         const createdDate = new Date(customer.created_at);
//         return createdDate >= startOfMonth;
//     }).length;
// });

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
    // Müşteri detayına gitmek için, eğer varsa
    router.push(`/owner/${event.data.id}`);
};

const onAddOwner = () => {
    editOwner.value = true;
    selectedId.value = null;
};

const onEditOwner = (id) => {
    editOwner.value = true;
    selectedId.value = id;
};

const confirmDelete = (id) => {
    confirm.require({
        message: 'Bu mülk sahibini silmek istediğinize emin misiniz?',
        header: 'Silme Onayı',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'İptal',
        acceptLabel: 'Sil',
        rejectClass: 'p-button-secondary p-button-text',
        acceptClass: 'p-button-danger !text-white !bg-red-600',
        accept: async () => {
            try {
                const { error } = await supabase
                    .from('owners')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                toast.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Mülk sahibi silindi',
                    life: 3000
                });

                queryClient.invalidateQueries(['owners']);

            } catch (err) {
                console.error("Silme hatası:", err.message);
                toast.add({ severity: 'error', summary: 'Hata', detail: 'Mülk sahibi silinemedi', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'İptal', detail: 'Silme işlemi iptal edildi.', life: 3000 });
        }
    });
};

const fetchOwners = async () => {
    try {
        const { data, error } = await supabase.from("owners").select(`*`).order('owner_name', { ascending: false });
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

const { isPending, data: owners } = useQuery({
    queryKey: ['owners'],
    queryFn: fetchOwners,
});

const filteredOwners = computed(() => {
    if (!owners.value) return [];
    return owners.value.filter(owner => {
        const matchesName = !appliedFilters.value.name ||
            owner.owner_name?.toLowerCase().includes(appliedFilters.value.name.toLowerCase());
        const matchesSurname = !appliedFilters.value.surname ||
            owner.owner_surname?.toLowerCase().includes(appliedFilters.value.surname.toLowerCase());
        const matchesCommissionRate = appliedFilters.value.commission_rate === null ||
            owner.commission_rate === appliedFilters.value.commission_rate;
        const matchesNotes = !appliedFilters.value.notes ||
            owner.owner_notes?.toLowerCase().includes(appliedFilters.value.notes.toLowerCase());

        return matchesName && matchesSurname && matchesCommissionRate && matchesNotes;
    });
});

const applyFilter = () => {
    appliedFilters.value = { ...filters.value };
    visibleFilter.value = false;
};

const resetFilters = () => {
    filters.value = { name: '', surname: '', commission_rate: null, notes: '' };
    appliedFilters.value = { name: '', surname: '', commission_rate: null, notes: '' };
};
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