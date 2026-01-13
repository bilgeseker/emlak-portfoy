<template>
    <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İlan Yönetimi</h1>
        </div>

        <div
            class="hidden lg:block bg-white rounded-xl dark:bg-zinc-900 shadow-sm  border border-slate-200 dark:border-zinc-900 overflow-hidden">

            <Skeleton v-if="isPending"></Skeleton>
            <DataTable v-else :value="estates" paginator :rows="8" dataKey="id" filterDisplay="menu" stripedRows
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

                <!-- <Column field="city" header="Şehir" sortable></Column> -->
                <Column header="Şehir / İlçe" sortable sortField="district">
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

                <!-- <Column field="rooms" header="Oda" sortable></Column> -->

                <Column field="price" header="Fiyat" sortable>
                    <template #body="slotProps">
                        <span class="text-md font-black text-indigo-500 dark:text-white tracking-tight">
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
            <router-link v-else v-for="item in estates" :key="item.id"
                class="flex gap-3 p-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 active:bg-zinc-100 dark:active:bg-zinc-800 transition-all"
                :to="`/estateDetails/${item.id}`">

                <!-- <div class="relative flex-shrink-0">
                    <img :src="item.image" class="w-32 h-24 object-cover rounded-lg shadow-sm" />
                </div> -->

                <div class="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                    <div>
                        <h3
                            class="text-[13px] font-semibold text-slate-800 dark:text-zinc-100 leading-[1.3] line-clamp-2">
                            {{ item.title }}
                        </h3>
                        <div class="flex items-center gap-1 mt-1 text-[11px] text-slate-500 dark:text-zinc-300">
                            <i class="pi pi-map-marker text-[10px]"></i>
                            <span>{{ item.city }}</span>
                            <span class="mx-1">•</span>
                            <span>{{ item.rooms }}</span>
                        </div>
                    </div>

                    <div class="flex justify-between items-end mt-2">
                        <!-- <span class="text-sm font-black text-indigo-600 dark:text-indigo-400"> -->
                        <span class="text-md font-black text-indigo-500 dark:text-white tracking-tight">
                            {{ formatCurrency(item.price) }}
                        </span>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
    <EditEstate v-model="editEstate" :id="selectedId" />
    <ConfirmDialog />
    <Toast position="bottom-center" />
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import Skeleton from 'primevue/skeleton';
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

const queryClient = useQueryClient()
const confirm = useConfirm();
const router = useRouter();
const editEstate = ref(false);
const selectedId = ref(null);
const toast = useToast();
const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};

const onRowClick = (event) => {
    const id = event.data.id;
    console.log('id', id)
    router.push(`/estateDetails/${id}`);
};

const onEditEstate = (id) => {
    editEstate.value = true;
    selectedId.value = id;
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
        const { data, error } = await supabase.from("estates").select(`id, title, city, district, price`).order('created_at', { ascending: true });
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
})
</script>
<style scoped>
.p-paginator {
    border-radius: 0px;
}
</style>