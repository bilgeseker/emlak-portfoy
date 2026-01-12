<template>
    <div class="space-y-4 mt-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İlan Yönetimi</h1>
            <!-- <Button label="Yeni İlan Ekle" icon="pi pi-plus" severity="warn" class=" dark:!text-white" raised /> -->
        </div>

        <div
            class="hidden lg:block bg-white rounded-xl dark:bg-zinc-900 shadow-sm  border border-slate-200 dark:border-zinc-900 overflow-hidden">
            <DataTable :value="estates" paginator :rows="8"  dataKey="id" filterDisplay="menu"
                stripedRows sortMode="multiple" responsiveLayout="scroll"
                class="p-datatable-sm cursor-pointer dark:!bg-zinc-900" @row-click="onRowClick" rowHover
                columnResizeMode="fit" :pt="{
                    thead: {
                        class: 'h-10'
                    }
                }">
                <!-- <template #header>
                    <div class="flex justify-end">
                        <IconField iconPosition="left">
                            <InputIcon class="pi pi-search" />
                            <InputText placeholder="İlanlarda ara..." class="w-full md:w-80" />
                        </IconField>
                    </div>
                </template> -->

                <Column field="image">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image" class="w-24 h-16 object-cover rounded shadow" />
                    </template>
                </Column>

                <Column field="title" header="İlan Başlığı" sortable></Column>

                <Column field="city" header="Şehir" sortable></Column>

                <Column field="rooms" header="Oda" sortable></Column>

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
                            <Button icon="pi pi-pencil" severity="contrast" @click="addEstate = true" rounded outlined/>
                            <Button icon="pi pi-trash" severity="danger" rounded outlined
                                @click="confirmDelete(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div
            class="lg:hidden flex flex-col bg-slate-100 dark:bg-zinc-950 gap-[1px] border-y border-slate-200 dark:border-zinc-800">
            <router-link v-for="item in estates" :key="item.id"
                class="flex gap-3 p-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 active:bg-zinc-100 dark:active:bg-zinc-800 transition-all"
                :to="`/estateDetails/${item.id}`">

                <div class="relative flex-shrink-0">
                    <img :src="item.image" class="w-32 h-24 object-cover rounded-lg shadow-sm" />
                </div>

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
    <EditEstate v-model="addEstate" />
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import InputText from 'primevue/inputtext';
// import IconField from 'primevue/iconfield';
// import InputIcon from 'primevue/inputicon';
import { useRouter } from 'vue-router';
import EditEstate from '@/components/EditEstate.vue';

const router = useRouter();
const addEstate = ref(false);
const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
};

const onRowClick = (event) => {
    const id = event.data.id;
    router.push(`/estateDetails/${id}`);
};


const estates = ref([
    {
        id: 1,
        title: "Beşiktaş'ta Deniz Manzaralı Lüks Dubleks",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Beşiktaş",
        price: 12500000,
        status: "Yayında",
        type: "Daire",
        rooms: "3+1",
        m2: 180
    },
    {
        id: 2,
        title: "Bodrum Yalıkavak'ta Özel Havuzlu Villa",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80",
        city: "Muğla / Bodrum",
        price: 45000000,
        status: "Satıldı",
        type: "Villa",
        rooms: "5+2",
        m2: 450
    },
    {
        id: 3,
        title: "Kadıköy Çarşıda Yatırımlık Ticari Dükkan",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Kadıköy",
        price: 8250000,
        status: "Beklemede",
        type: "İşyeri",
        rooms: "1+0",
        m2: 65
    },
    {
        id: 4,
        title: "Ankara Çankaya'da Modern Bahçe Katı",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80",
        city: "Ankara / Çankaya",
        price: 4200000,
        status: "Yayında",
        type: "Daire",
        rooms: "2+1",
        m2: 110
    },
    {
        id: 5,
        title: "İzmir Mavişehir'de Full Eşyalı Rezidans",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80",
        city: "İzmir / Karşıyaka",
        price: 18750000,
        status: "Yayında",
        type: "Daire",
        rooms: "4+1",
        m2: 220
    },
    {
        id: 6,
        title: "Beşiktaş'ta Deniz Manzaralı Lüks Dubleks",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Beşiktaş",
        price: 12500000,
        status: "Yayında",
        type: "Daire",
        rooms: "3+1",
        m2: 180
    },
    {
        id: 7,
        title: "Bodrum Yalıkavak'ta Özel Havuzlu Villa",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80",
        city: "Muğla / Bodrum",
        price: 45000000,
        status: "Satıldı",
        type: "Villa",
        rooms: "5+2",
        m2: 450
    },
    {
        id: 8,
        title: "Kadıköy Çarşıda Yatırımlık Ticari Dükkan",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Kadıköy",
        price: 8250000,
        status: "Beklemede",
        type: "İşyeri",
        rooms: "1+0",
        m2: 65
    },
    {
        id: 9,
        title: "Ankara Çankaya'da Modern Bahçe Katı",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80",
        city: "Ankara / Çankaya",
        price: 4200000,
        status: "Yayında",
        type: "Daire",
        rooms: "2+1",
        m2: 110
    },
    {
        id: 10,
        title: "İzmir Mavişehir'de Full Eşyalı Rezidans",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80",
        city: "İzmir / Karşıyaka",
        price: 18750000,
        status: "Yayında",
        type: "Daire",
        rooms: "4+1",
        m2: 220
    }
]);
</script>
<style scoped>
.p-paginator {
    border-radius: 0px;
}
</style>