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
                                İlan Ekle
                            </h1>
                        </div>
                        <p class="text-slate-500 dark:text-zinc-400 text-sm">
                            Yeni bir emlak ilanı oluşturun ve portföyünüze ekleyin.
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Form Column -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Basic Info Section -->
                    <div
                        class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 space-y-5">
                        <div class="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-2">
                            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="pi pi-info-circle text-indigo-500"></i> Temel Bilgiler
                            </h2>
                        </div>

                        <div class="space-y-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Mülk Sahibi
                                    <span class="text-red-500">*</span></label>
                                <div class="flex gap-2">
                                    <Select v-model="selectedOwner" :options="ownerOptions" optionLabel="label"
                                        optionValue="value" filter placeholder="Mülk Sahibi Seçiniz"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 flex-1"
                                        :class="{ '!border-red-500': submitted && !selectedOwner }" />
                                    <Button icon="pi pi-plus" severity="secondary" outlined @click="openNewOwnerDialog"
                                        class="!border-slate-300 dark:!border-zinc-700 !text-slate-600 dark:!text-zinc-400 !bg-slate-50 dark:!bg-zinc-800" />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İlan Başlığı
                                    <span class="text-red-500">*</span></label>
                                <InputText v-model="title" placeholder="Örn: Deniz Manzaralı Lüks Daire" maxlength="100"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 focus:!border-indigo-500 dark:focus:!border-indigo-400 !shadow-none"
                                    :class="{ '!border-red-500': submitted && !title }" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Emlak Tipi
                                        <span class="text-red-500">*</span></label>
                                    <Select v-model="property_type" :options="propertyTypes" optionLabel="label"
                                        optionValue="value" placeholder="Seçiniz"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700"
                                        :class="{ '!border-red-500': submitted && !property_type }" />
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İlan
                                        Tarihi</label>
                                    <DatePicker v-model="created_at" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                                        class="w-full"
                                        inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İşlem
                                        Türü</label>
                                    <Select v-model="in_sale" :options="inSale" optionLabel="label" optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Kullanım
                                        Durumu</label>
                                    <Select v-model="usage_status" :options="usageTypes" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Notlar</label>
                                <Textarea v-model="notes" autoResize rows="4" maxlength="500" fluid
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 !shadow-none"
                                    placeholder="İlan hakkında detaylı açıklama..." />
                            </div>
                        </div>
                    </div>

                    <!-- Location Section -->
                    <div
                        class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 space-y-5">
                        <div class="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-2">
                            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="pi pi-map-marker text-indigo-500"></i> Konum Bilgileri
                            </h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İl <span
                                        class="text-red-500">*</span></label>
                                <Select v-model="selectedCity" :options="allCities" optionLabel="name" filter
                                    placeholder="İl Seçiniz"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700"
                                    :class="{ '!border-red-500': submitted && !selectedCity }" @change="onCityChange" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İlçe <span
                                        class="text-red-500">*</span></label>
                                <Select v-model="selectedDistrict" :options="districtList" filter
                                    :disabled="!selectedCity" placeholder="İlçe Seçiniz"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700"
                                    :class="{ '!border-red-500': submitted && !selectedDistrict }"
                                    :virtualScrollerOptions="{ itemSize: 38 }" />
                            </div>
                            <div class="space-y-1.5 md:col-span-2">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Mahalle <span
                                        class="text-red-500">*</span></label>
                                <Select v-model="selectedNeighborhood" :options="neighborhoodList" filter
                                    :disabled="!selectedDistrict" placeholder="Mahalle Seçiniz"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700"
                                    :class="{ '!border-red-500': submitted && !selectedNeighborhood }"
                                    :virtualScrollerOptions="{ itemSize: 38 }" />
                            </div>
                        </div>
                    </div>

                    <!-- Features Section -->
                    <div
                        class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 space-y-5">
                        <div class="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-2">
                            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="pi pi-list text-indigo-500"></i> Özellikler
                            </h2>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Brüt m² <span
                                        class="text-red-500">*</span></label>
                                <InputNumber v-model="m2_gross" class="w-full"
                                    inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full"
                                    :invalid="submitted && !m2_gross" min="0" max="999999"/>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Net m² <span
                                        class="text-red-500">*</span></label>
                                <InputNumber v-model="m2_net" class="w-full"
                                    inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full"
                                    :invalid="submitted && !m2_net" min="0" max="999999"/>
                            </div>

                            <!-- Conditionally Rendered Fields based on type -->
                            <template v-if="property_type !== 'arsa'">
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Oda
                                        Sayısı</label>
                                    <Select v-model="selectedRoom" :options="roomTypeOptions" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Bulunduğu
                                        Kat</label>
                                    <InputNumber v-model="floor_located" class="w-full"
                                        inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full" min="0" max="50"/>
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Bina
                                        Yaşı</label>
                                    <InputNumber v-model="building_age" class="w-full"
                                        inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full" min="0" max="200"/>
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Isıtma</label>
                                    <Select v-model="heating" :options="heatingOptions" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Banyo
                                        Sayısı</label>
                                    <InputNumber v-model="num_of_bath" class="w-full"
                                        inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full" min="0" max="20"/>
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Mutfak</label>
                                    <Select v-model="kitchen" :options="kitchenTypes" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Balkon</label>
                                    <Select v-model="balcony" :options="booleans" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Asansör</label>
                                    <Select v-model="lift" :options="booleans" optionLabel="label" optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Otopark</label>
                                    <Select v-model="parking" :options="parkingTypes" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Eşyalı</label>
                                    <Select v-model="furnished" :options="booleans2" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Site
                                        İçerisinde</label>
                                    <Select v-model="isInSite" :options="booleans2" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Site
                                        Adı</label>
                                    <InputText :disabled="!isInSite" v-model="site_name"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700"
                                        :class="{ 'opacity-50 cursor-not-allowed': !isInSite }" maxlength="100"/>
                                </div>
                            </template>

                            <template v-if="property_type === 'arsa'">
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İmar
                                        Durumu</label>
                                    <Select v-model="zoning_status" :options="zoningStatusTypes" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Ada/Parsel</label>
                                    <InputNumber v-model="parsel_no" placeholder="Parsel" class="w-full"
                                        inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full" min="0" max="999999"/>
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Kaks
                                        (Emsal)</label>
                                    <Select v-model="kaks" :options="kaksSecenekleri" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                                <div class="space-y-1.5">
                                    <label
                                        class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Gabari</label>
                                    <Select v-model="gabari" :options="gabariSecenekleri" optionLabel="label"
                                        optionValue="value"
                                        class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                                </div>
                            </template>

                            <!-- Common Features for All Types -->
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Tapu
                                    Durumu</label>
                                <Select :options="deedStatus" filter optionLabel="label" optionValue="value"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700"
                                    v-model="deed_status" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar / Secondary Column -->
                <div class="space-y-6">
                    <!-- Price Section -->
                    <div
                        class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 space-y-5">
                        <div class="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-2">
                            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="pi pi-tag text-indigo-500"></i> Fiyatlandırma
                            </h2>
                        </div>
                        <div class="space-y-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Fiyat (TL) <span
                                        class="text-red-500">*</span></label>
                                <InputNumber v-model="price" mode="currency" currency="TRY" locale="tr-TR"
                                    class="w-full"
                                    inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full text-lg font-bold text-indigo-600"
                                    :invalid="submitted && !price" min="0" max="100000000"/>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Aidat</label>
                                <InputNumber v-model="member_fee" mode="currency" currency="TRY" locale="tr-TR"
                                    class="w-full"
                                    inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 w-full" min="0" max="999999"/>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Krediye
                                    Uygun</label>
                                <Select v-model="credit" :options="booleans2" optionLabel="label" optionValue="value"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Takas</label>
                                <Select v-model="swap" :options="booleans2" optionLabel="label" optionValue="value"
                                    class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700" />
                            </div>
                        </div>
                    </div>

                    <!-- Image Section -->
                    <div
                        class="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-zinc-800 space-y-5">
                        <div class="border-b border-slate-100 dark:border-zinc-800 pb-3 mb-2">
                            <h2 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <i class="pi pi-image text-indigo-500"></i> Görsel
                            </h2>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div v-if="image"
                                class="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                                <img :src="image" class="w-full h-48 object-cover" />
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button icon="pi pi-trash" rounded severity="danger" @click="clearImage" />
                                </div>
                            </div>

                            <div v-else
                                class="border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-zinc-800/50">
                                <i class="pi pi-image text-3xl mb-2"></i>
                                <span class="text-xs text-center">Görsel seçilmedi</span>
                            </div>

                            <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
                                chooseLabel="Dosya Seç" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                <Button label="İptal" @click="cancelEstate" icon="pi pi-times" text severity="secondary"
                    class="w-full md:w-auto" />
                <Button label="Kaydet" @click="saveEstate" icon="pi pi-check" severity="contrast"
                    class="w-full md:w-auto px-8" />
            </div>

        </div>
    </div>
    <EditOwner v-model="showOwnerModal" @saved="handleOwnerSaved" />
    <Toast position="bottom-center" />
</template>

<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
// import { supabase } from '@/supabase.js';
// import { useQuery } from '@tanstack/vue-query'
import { ref, computed } from 'vue';
// import allData from '../constants/cities_data.js';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/supabase';
import { useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import EditOwner from '@/components/EditOwner.vue';
import {
    heatingOptions, roomTypeOptions, propertyTypes, kitchenTypes, booleans, parkingTypes, booleans2,
    usageTypes, zoningStatusTypes, deedStatus, inSale, kaksSecenekleri, gabariSecenekleri
} from '../constants/constants.js';
import { getCities, getDistrictsByCityCode, getNeighbourhoodsByCityCodeAndDistrict } from 'turkey-neighbourhoods';
const allCities = getCities();
// const props = defineProps({ modelValue: Boolean, id: Number });
// const emit = defineEmits(['update:modelValue']);

const selectedCity = ref(null), selectedDistrict = ref(null), selectedNeighborhood = ref(null);
const title = ref(null);
const created_at = ref(null);
const m2_gross = ref(null);
const m2_net = ref(null);
const floor_located = ref(null);
const num_of_floors = ref(null);
const building_age = ref(null);
const heating = ref(null);
const num_of_bath = ref(null);
const kitchen = ref(null);
const balcony = ref(null);
const lift = ref(null);
const parking = ref(null);
const site_name = ref(null);
const usage_status = ref(null);
const member_fee = ref(null);
const swap = ref(null);
const deed_status = ref(null);
const credit = ref(null);
const price = ref(null);
const notes = ref(null);
const property_type = ref(null);
const image = ref(null);
const isInSite = ref(null);
const furnished = ref(null);
const selectedRoom = ref(null);
const zoning_status = ref(null);
const parsel_no = ref(null);
const pafta_no = ref(null);
const kaks = ref(null);
const gabari = ref(null);
const in_sale = ref(null);
const queryClient = useQueryClient();
const toast = useToast();
const submitted = ref(false);
const showOwnerModal = ref(false);
const selectedOwner = ref(null);

const fetchOwners = async () => {
    const { data, error } = await supabase
        .from('owners')
        .select('*')
        .order('owner_name', { ascending: true });
    if (error) throw error;
    return data;
};

const { data: owners, refetch: refetchOwners } = useQuery({
    queryKey: ['owners'],
    queryFn: fetchOwners
});

const ownerOptions = computed(() => {
    return owners.value?.map(o => ({
        label: `${o.owner_name} ${o.owner_surname}`,
        value: o.id
    })) || [];
});

const openNewOwnerDialog = () => {
    showOwnerModal.value = true;
};

const handleOwnerSaved = (newId) => {
    refetchOwners().then(() => {
        selectedOwner.value = newId;
    });
};

const selectedFile = ref(null); // Ham dosya objesini tutmak için

function onFileSelect(event) {
    const file = event.files[0];
    selectedFile.value = file; // Dosyayı sakla

    const reader = new FileReader();
    reader.onload = (e) => {
        image.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// function onFileSelect(event) {
//     const file = event.files[0];
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//         image.value = e.target.result;
//     };

//     reader.readAsDataURL(file);
// }

const clearImage = () => {
    image.value = null;
};
// const onUpload = (event) => {
//     console.log('Uploaded files:', event.files);
// };

const onCityChange = () => {
    selectedDistrict.value = null;
    selectedNeighborhood.value = null;
};

const districtList = computed(() => {
    if (!selectedCity.value?.code) return []
    return getDistrictsByCityCode(selectedCity.value?.code);
});

const neighborhoodList = computed(() => {
    if (!selectedCity.value || !selectedDistrict.value) {
        return [];
    }
    try {
        return getNeighbourhoodsByCityCodeAndDistrict(
            selectedCity.value.code,
            selectedDistrict.value
        );
    } catch (error) {
        console.error("Mahalleler yüklenirken hata oluştu:", error);
        return [];
    }
});

// Cloudinary Bilgileriniz
// const cloudName = "cozumemlak";
// const uploadPreset = "ml_default"; // Panelde oluşturduğunuz isim

// const uploadToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);

//     const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         {
//             method: "POST",
//             body: formData,
//         }
//     );
//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error.message);
//     }

//     const data = await response.json();
//     // return data.secure_url; // Küçültülmüş ve optimize edilmiş resmin linki
//     return data; // Tüm yanıt verisi
// };

const saveEstate = async () => {
    // let response = null;
    let public_id = null;
    try {
        submitted.value = true;
        if (!selectedOwner.value || !selectedCity.value?.name || !selectedDistrict.value || !selectedNeighborhood.value || !price.value || !m2_gross.value || !m2_net.value || !property_type.value || !title.value) {
            toast.add({ severity: 'error', summary: 'Hata', detail: 'Tüm zorunlu alanları doldurunuz.', life: 2000 });
            return;
        }
        let imageUrl = image.value; // Varsayılan mevcut resim (belki edit yapıyorsunuzdur)

        // Eğer yeni bir dosya seçilmişse yükle
        // if (selectedFile.value) {
        //     toast.add({ severity: 'info', summary: 'Yükleniyor', detail: 'Resim optimize ediliyor...', life: 2000 });

        //     // imageUrl = await uploadToCloudinary(selectedFile.value);
        //     response = await uploadToCloudinary(selectedFile.value);
        //     if(!response || !response.secure_url){
        //         toast.add({ severity: 'error', summary: 'Hata', detail: 'Resim yüklenirken hata oluştu.', life: 2000 });
        //         return;
        //     }
        //     imageUrl = response.secure_url;
        //     public_id = response.public_id;
        //     toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Resim başarıyla yüklendi.', life: 2000 });
        // }
        const date = new Date(created_at.value);
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")

        const finalDate = `${y}-${m}-${d}`;

        const payload = {
            owner_id: selectedOwner.value,
            created_at: finalDate,
            city: selectedCity.value.name,
            district: selectedDistrict.value,
            neighborhood: selectedNeighborhood.value,
            m2_gross: m2_gross.value,
            m2_net: m2_net.value,
            floor_located: floor_located.value || null,
            num_of_floors: num_of_floors.value || null,
            building_age: building_age.value || null,
            heating: heating.value || null,
            num_of_bath: num_of_bath.value || null,
            kitchen: kitchen.value ?? null,
            balcony: balcony.value ?? null,
            lift: lift.value ?? null,
            parking: parking.value ?? null,
            furnished: furnished.value ?? null,
            in_site: isInSite.value ?? null,
            site_name: site_name.value || null,
            usage_status: usage_status.value || null,
            member_fee: member_fee.value || null,
            swap: swap.value ?? null,
            credit: credit.value ?? null,
            price: price.value,
            notes: notes.value || null,
            deed_status: deed_status.value,
            property_type: property_type.value,
            title: title.value,
            rooms: selectedRoom.value || null,
            zoning_status: zoning_status.value || null,
            parsel_no: parsel_no.value || null,
            pafta_no: pafta_no.value || null,
            kaks: kaks.value || null,
            gabari: gabari.value || null,
            in_sale: in_sale.value || null,
            img_url: imageUrl || null,
            img_id: public_id || null
        };
        mutation.mutate(payload);
    } catch (error) {
        console.log(error)
    }
};

const mutation = useMutation({
    mutationFn: async (payload) => {
        const { error } = await supabase.from("estates").insert([
            {
                owner_id: payload.owner_id,
                created_at: payload.created_at,
                city: payload.city,
                district: payload.district,
                neighborhood: payload.neighborhood,
                m2_gross: payload.m2_gross,
                m2_net: payload.m2_net,
                floor_located: payload.floor_located,
                num_of_floors: payload.num_of_floors,
                building_age: payload.building_age,
                heating: payload.heating,
                num_of_bath: payload.num_of_bath,
                kitchen: payload.kitchen,
                balcony: payload.balcony,
                lift: payload.lift,
                parking: payload.parking,
                furnished: payload.furnished,
                in_site: payload.in_site,
                site_name: payload.site_name,
                usage_status: payload.usage_status,
                member_fee: payload.member_fee,
                swap: payload.swap,
                credit: payload.credit,
                price: payload.price,
                notes: payload.notes,
                deed_status: payload.deed_status,
                title: payload.title,
                property_type: payload.property_type,
                rooms: payload.rooms,
                zoning_status: payload.zoning_status,
                parsel_no: payload.parsel_no,
                pafta_no: payload.pafta_no,
                kaks: payload.kaks,
                gabari: payload.gabari,
                in_sale: payload.in_sale,
                img_url: payload.img_url,
                img_id: payload.img_id
            }
        ]);

        if (error) {
            toast.add({ severity: 'error', summary: 'Hata', detail: 'İlan eklenirken hata oluştu.', life: 2000 });
            console.log('db', error)
            throw error;
        }
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['estates']);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'İlan başarıyla eklendi.', life: 2000 });
        resetForm();
        clearImage();
        submitted.value = false;
        selectedFile.value = null;
    }
});
const resetForm = () => {
    // String ve Number alanlar
    selectedOwner.value = null;
    title.value = null;
    m2_gross.value = null;
    m2_net.value = null;
    floor_located.value = null;
    num_of_floors.value = null;
    building_age.value = null;
    num_of_bath.value = null;
    site_name.value = null;
    member_fee.value = null;
    price.value = null;
    notes.value = null;
    property_type.value = null;
    created_at.value = null;

    // Seçim (Select) alanları
    selectedCity.value = null;
    selectedDistrict.value = null;
    selectedNeighborhood.value = null;
    heating.value = null;
    kitchen.value = null;
    balcony.value = null;
    lift.value = null;
    parking.value = null;
    furnished.value = null;
    usage_status.value = null;
    swap.value = null;
    deed_status.value = null;
    credit.value = null;
    selectedRoom.value = null;
    zoning_status.value = null;
    parsel_no.value = null;
    pafta_no.value = null;
    kaks.value = null;
    gabari.value = null;
    in_sale.value = null;
    // Default değerler
    isInSite.value = null;
};
const cancelEstate = () => {
    resetForm();
    clearImage();
    submitted.value = false;
    selectedFile.value = null;
};
</script>