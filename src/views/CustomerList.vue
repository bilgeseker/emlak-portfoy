<template>
    <div class="min-h-screen dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-4 md:p-8">
        <!-- İstatistik Kartları -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 p-6 hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-600 dark:text-zinc-400">Toplam Müşteri</p>
                        <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1">{{ totalCustomers }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <i class="pi pi-users text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 p-6 hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-600 dark:text-zinc-400">Bu Ay Eklenen</p>
                        <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1">{{ newThisMonth }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <i class="pi pi-plus-circle text-white text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 p-6 hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-600 dark:text-zinc-400">Aktif Filtreler</p>
                        <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1">{{ activeFilterCount }}</p>
                    </div>
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <i class="pi pi-filter text-white text-xl"></i>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Başlık ve Butonlar -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                    Müşteri Yönetimi
                </h1>
            </div>

            <div class="flex gap-3">
                <Button type="button" icon="pi pi-plus" label="Yeni Müşteri" @click="onAddCustomer"
                    class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none shadow-lg hover:shadow-xl transition-all duration-300" />
                <Button type="button" icon="pi pi-filter"
                    :label="`Filtrele ${activeFilterCount > 0 ? '(' + activeFilterCount + ')' : ''}`"
                    @click="onOpenFilter" :severity="activeFilterCount > 0 ? 'primary' : 'secondary'" outlined
                    class="hover:shadow-lg transition-all duration-300" />
            </div>
        </div>

        <!-- Desktop Tablo Görünümü -->
        <div class="hidden lg:block bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
            <Skeleton v-if="isPending" class="p-6"></Skeleton>
            <DataTable v-else :value="filteredCustomers" paginator :rows="10" dataKey="id" filterDisplay="menu"
                stripedRows sortMode="multiple" responsiveLayout="scroll"
                class="p-datatable-sm cursor-pointer dark:!bg-zinc-900" @row-click="onRowClick" rowHover
                columnResizeMode="fit" :pt="{
                    thead: {
                        class: 'h-12 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900'
                    }
                }">

                <Column field="first_name" header="Müşteri" sortable style="min-width: 200px">
                    <template #body="slotProps">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {{ getInitials(slotProps.data.first_name, slotProps.data.last_name) }}
                            </div>
                            <div>
                                <span class="font-semibold text-slate-800 dark:text-white">{{ slotProps.data.first_name }} {{ slotProps.data.last_name }}</span>
                                <div class="text-xs text-slate-500 dark:text-zinc-400">{{ formatDate(slotProps.data.created_at) }}</div>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="phone" header="İletişim" sortable style="min-width: 180px">
                    <template #body="slotProps">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-phone text-green-500 text-xs"></i>
                                <span class="text-sm">{{ slotProps.data.phone || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-envelope text-blue-500 text-xs"></i>
                                <span class="text-sm truncate max-w-[140px]" :title="slotProps.data.email">{{ slotProps.data.email || '-' }}</span>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="address" header="Adres" sortable>
                    <template #body="slotProps">
                        <div class="flex items-start gap-2">
                            <i class="pi pi-map-marker text-slate-400 text-xs mt-0.5"></i>
                            <span class="text-sm text-slate-600 dark:text-zinc-300 truncate max-w-xs" :title="slotProps.data.address">{{ slotProps.data.address || '-' }}</span>
                        </div>
                    </template>
                </Column>

                <Column header="İşlemler" style="min-width: 120px">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" severity="info" @click="onEditCustomer(slotProps.data.id)"
                                rounded outlined class="hover:shadow-md transition-all duration-200" />
                            <Button icon="pi pi-trash" severity="danger" rounded outlined
                                @click="confirmDelete(slotProps.data.id)" class="hover:shadow-md transition-all duration-200" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Mobil Kart Görünümü -->
        <div class="lg:hidden space-y-4">
            <div v-if="isPending" class="space-y-4">
                <div v-for="i in 3" :key="i" class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg animate-pulse">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-200 dark:bg-zinc-700 rounded-full"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-3/4"></div>
                            <div class="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else v-for="item in filteredCustomers" :key="item.id"
                class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 overflow-hidden">

                <div class="p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {{ getInitials(item.first_name, item.last_name) }}
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between">
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-lg font-bold text-slate-800 dark:text-white truncate">
                                        {{ item.first_name }} {{ item.last_name }}
                                    </h3>
                                    <div class="flex items-center gap-1 mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                        <i class="pi pi-calendar text-xs"></i>
                                        <span>{{ formatDate(item.created_at) }}</span>
                                    </div>
                                </div>

                                <div class="flex gap-2 ml-4">
                                    <Button icon="pi pi-pencil" severity="info" size="small" @click.stop="onEditCustomer(item.id)"
                                        rounded outlined class="hover:shadow-md transition-all duration-200" />
                                    <Button icon="pi pi-trash" severity="danger" size="small" @click.stop="confirmDelete(item.id)"
                                        rounded outlined class="hover:shadow-md transition-all duration-200" />
                                </div>
                            </div>

                            <div class="mt-4 space-y-3">
                                <div v-if="item.phone" class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <i class="pi pi-phone text-green-600 dark:text-green-400 text-sm"></i>
                                    </div>
                                    <span class="text-sm text-slate-700 dark:text-zinc-300">{{ item.phone }}</span>
                                </div>

                                <div v-if="item.email" class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <i class="pi pi-envelope text-blue-600 dark:text-blue-400 text-sm"></i>
                                    </div>
                                    <span class="text-sm text-slate-700 dark:text-zinc-300 truncate">{{ item.email }}</span>
                                </div>

                                <div v-if="item.address" class="flex items-start gap-3">
                                    <div class="w-8 h-8 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mt-0.5">
                                        <i class="pi pi-map-marker text-slate-600 dark:text-zinc-400 text-sm"></i>
                                    </div>
                                    <span class="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">{{ item.address }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtre Çekmecesi -->
        <Drawer v-model:visible="visibleFilter" header="Filtreleme" position="left"
            class="!w-full md:!w-[400px] dark:bg-zinc-900">
            <div class="flex flex-col h-full overflow-hidden">
                <div class="flex-1 overflow-y-auto p-1 pb-5 space-y-6 pt-4 custom-scrollbar">
                    <div class="space-y-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                                <i class="pi pi-user text-slate-400"></i>
                                Ad
                            </label>
                            <InputText v-model="filters.first_name" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                                <i class="pi pi-user text-slate-400"></i>
                                Soyad
                            </label>
                            <InputText v-model="filters.last_name" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                                <i class="pi pi-phone text-slate-400"></i>
                                Telefon
                            </label>
                            <InputText v-model="filters.phone" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                                <i class="pi pi-envelope text-slate-400"></i>
                                E-posta
                            </label>
                            <InputText v-model="filters.email" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div class="pt-4 pb-2 flex gap-2 border-t dark:border-zinc-700 bg-inherit">
                    <Button label="Sıfırla" @click="resetFilters" severity="secondary" outlined class="flex-1 rounded-lg" />
                    <Button label="Uygula" @click="applyFilter" class="flex-1 rounded-lg" />
                </div>
            </div>
        </Drawer>

        <EditCustomer v-model="editCustomer" :id="selectedId" />
        <ConfirmDialog />
        <Toast position="bottom-center" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import Skeleton from 'primevue/skeleton';
import Drawer from 'primevue/drawer';
import InputText from 'primevue/inputtext';
// import { useRouter } from 'vue-router';
import EditCustomer from '@/components/EditCustomer.vue';
import { useConfirm } from "primevue/useconfirm";
import { supabase } from '@/supabase';
import { useQuery } from '@tanstack/vue-query';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient()
const confirm = useConfirm();
// const router = useRouter();
const editCustomer = ref(false);
const visibleFilter = ref(false);
const selectedId = ref(null);
const toast = useToast();
const filters = ref({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
});
const appliedFilters = ref({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
});

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
};

const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
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

// const onRowClick = (event) => {
//     // Müşteri detayına gitmek için, eğer varsa
//     // router.push(`/customerDetails/${event.data.id}`);
// };

const onAddCustomer = () => {
    editCustomer.value = true;
    selectedId.value = null;
};

const onEditCustomer = (id) => {
    editCustomer.value = true;
    selectedId.value = id;
};

const confirmDelete = (id) => {
    confirm.require({
        message: 'Bu müşteriyi silmek istediğinize emin misiniz?',
        header: 'Silme Onayı',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'İptal',
        acceptLabel: 'Sil',
        rejectClass: 'p-button-secondary p-button-text',
        acceptClass: 'p-button-danger !text-white !bg-red-600',
        accept: async () => {
            try {
                const { error } = await supabase
                    .from('customers')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                toast.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Müşteri silindi',
                    life: 3000
                });

                queryClient.invalidateQueries(['customers']);

            } catch (err) {
                console.error("Silme hatası:", err.message);
                toast.add({ severity: 'error', summary: 'Hata', detail: 'Müşteri silinemedi', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'İptal', detail: 'Silme işlemi iptal edildi.', life: 3000 });
        }
    });
};

const fetchCustomers = async () => {
    try {
        const { data, error } = await supabase.from("customers").select(`*`).order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

const { isPending, data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
});

const filteredCustomers = computed(() => {
    if (!customers.value) return [];
    return customers.value.filter(customer => {
        const matchesFirstName = !appliedFilters.value.first_name ||
            customer.first_name?.toLowerCase().includes(appliedFilters.value.first_name.toLowerCase());
        const matchesLastName = !appliedFilters.value.last_name ||
            customer.last_name?.toLowerCase().includes(appliedFilters.value.last_name.toLowerCase());
        const matchesPhone = !appliedFilters.value.phone ||
            customer.phone?.includes(appliedFilters.value.phone);
        const matchesEmail = !appliedFilters.value.email ||
            customer.email?.toLowerCase().includes(appliedFilters.value.email.toLowerCase());

        return matchesFirstName && matchesLastName && matchesPhone && matchesEmail;
    });
});

const applyFilter = () => {
    appliedFilters.value = { ...filters.value };
    visibleFilter.value = false;
};

const resetFilters = () => {
    filters.value = { first_name: '', last_name: '', phone: '', email: '' };
    appliedFilters.value = { first_name: '', last_name: '', phone: '', email: '' };
};
</script>

<style scoped>
.p-paginator {
    border-radius: 12px;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgb(203 213 225) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(203 213 225);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(148 163 184);
}

/* Hover efektleri için */
.p-datatable .p-datatable-tbody > tr:hover {
    background: rgba(59, 130, 246, 0.05);
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

.dark .p-datatable .p-datatable-tbody > tr:hover {
    background: rgba(59, 130, 246, 0.1);
}

/* Gradient animasyonu */
@keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.bg-gradient-to-br {
    animation: gradient-shift 8s ease infinite;
    background-size: 200% 200%;
}
</style>