<template>
    <Dialog :visible="props.modelValue" @update:visible="$emit('update:modelValue', $event)" modal
        header="İlanı Düzenle" :style="{ width: '90vw', maxWidth: '1000px' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }" class="dark:bg-slate-900 " :pt="{
            root: 'border-none shadow-2xl bg-white dark:bg-zinc-900 mx-2 !rounded-xl',
            header: 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 p-4 md:p-6 !rounded-xl',
            content: 'p-4 md:p-6 bg-white dark:bg-zinc-900 ',
            footer: 'p-4 md:p-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-green-300 dark:zinc-slate-800 !rounded-xl'
        }">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-5 md:gap-6 ">
            <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Başlığı<span
                        class="font-bold text-red-500"> *</span></label>
                <InputText v-model="title" class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2"
                    :class="{ 'p-invalid !border-red-500': submitted && !title }" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Emlak Tipi<span
                        class="font-bold text-red-500"> *</span></label>
                <Select :options="propertyTypes" optionLabel="label" optionValue="value" filter
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="property_type"
                    :class="{ 'p-invalid !border-red-500': submitted && !property_type }" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İl<span
                        class="font-bold text-red-500"> *</span></label>
                <Select v-model="selectedCity" :options="allCities" optionLabel="name" optionValue="name" filter
                    placeholder="İl Seçiniz" @change="onCityChange"
                    :class="{ 'p-invalid !border-red-500': submitted && !selectedCity }">
                </Select>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlçe<span
                        class="font-bold text-red-500"> *</span></label>
                <Select v-model="selectedDistrict" :options="districtList" filter :disabled="!selectedCity"
                    :class="{ 'p-invalid !border-red-500': submitted && !selectedDistrict }" placeholder="İlçe Seçiniz"
                    :virtualScrollerOptions="{ itemSize: 38 }" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mahalle<span
                        class="font-bold text-red-500"> *</span></label>
                <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
                <Select v-model="selectedNeighborhood" :options="neighborhoodList" filter :disabled="!selectedDistrict"
                    :class="{ 'p-invalid !border-red-500': submitted && !selectedNeighborhood }"
                    placeholder="Mahalle Seçiniz" :virtualScrollerOptions="{ itemSize: 38 }"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">m² (Brüt)</label>
                <InputNumber v-model="m2_gross" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    inputClass="p-3 md:p-2 w-full" :invalid="submitted && !m2_gross" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">m² (Net)<span
                        class="font-bold text-red-500"> *</span></label>
                <InputNumber v-model="m2_net" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    inputClass="p-3 md:p-2 w-full" :invalid="submitted && !m2_net" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Tür</label>
                <Select :options="inSale" optionLabel="label" optionValue="value"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="in_sale" />
            </div>
            <template v-if="property_type !== 'arsa'">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Oda Sayısı</label>
                    <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
                    <Select v-model="selectedRoom" :options="roomTypeOptions" filter optionLabel="label"
                        optionValue="value" :virtualScrollerOptions="{ itemSize: 38 }"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Bulunduğu Kat</label>
                    <InputNumber v-model="floor_located" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                        inputClass="p-3 md:p-2 w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kat Sayısı</label>
                    <InputNumber v-model="num_of_floors" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                        inputClass="p-3 md:p-2 w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Bina Yaşı</label>
                    <InputNumber v-model="building_age" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                        inputClass="p-3 md:p-2 w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Isıtma</label>
                    <Select v-model="heating" :options="heatingOptions" optionLabel="label" optionValue="value"
                        placeholder="Isıtma Tipi Seçiniz" filter class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Banyo Sayısı</label>
                    <InputNumber v-model="num_of_bath" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                        inputClass="p-3 md:p-2 w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mutfak</label>
                    <Select :options="kitchenTypes" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="kitchen" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Balkon</label>
                    <Select :options="booleans" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="balcony" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Asansör</label>
                    <Select :options="booleans" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="lift" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Otopark</label>
                    <Select :options="parkingTypes" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="parking" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Eşyalı</label>
                    <Select :options="booleans2" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="furnished" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Site İçerisinde</label>
                    <Select v-model="isInSite" :options="booleans2" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Site Adı</label>
                    <InputText :disabled="!isInSite" class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2"
                        v-model="site_name" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kullanım Durumu</label>
                    <Select :options="usageTypes" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="usage_status" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Aidat (TL)</label>
                    <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full"
                        v-model="member_fee" />
                </div>
            </template>
            <template v-if="property_type === 'arsa'">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İmar Durumu</label>
                    <Select :options="zoningStatusTypes" filter optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="zoning_status" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Parsel No</label>
                    <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full"
                        v-model="parsel_no" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Pafta No</label>
                    <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full"
                        v-model="pafta_no" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kaks (Emsal)</label>
                    <!-- <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full"
                        v-model="kaks" /> -->
                    <Select v-model="kaks" :options="kaksSecenekleri" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Gabari</label>
                    <!-- <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full"
                        v-model="gabari" /> -->
                    <Select v-model="gabari" :options="gabariSecenekleri" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
                </div>
            </template>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Takas</label>
                <Select :options="booleans2" optionLabel="label" optionValue="value"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="swap" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Tapu Durumu</label>
                <Select :options="deedStatus" filter optionLabel="label" optionValue="value"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="deed_status" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Krediye Uygun</label>
                <Select :options="booleans2" optionLabel="label" optionValue="value"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="credit" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Tarihi</label>
                <DatePicker required="true" v-model="created_at" showIcon fluid iconDisplay="input"
                    dateFormat="dd/mm/yy" :class="{ 'p-invalid !border-red-500': submitted && !created_at }" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Fiyat (TL)<span
                        class="font-bold text-red-500"> *</span></label>
                <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" mode="currency" currency="TRY"
                    locale="tr-TR" inputClass="p-3 md:p-2 w-full" v-model="price"
                    :invalid="submitted && !price" />
            </div>

            <!-- <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Resim</label>
            <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
                class="p-button-outlined" />
            <img v-if="image" :src="image" alt="Image" class="shadow-md rounded-xl w-full sm:w-64" />
        </div> -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Resim</label>

                <div class="flex flex-col sm:flex-row items-start gap-4">

                    <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
                        class="p-button-outlined" chooseLabel="Dosya Seç" />

                    <div v-if="image" class="relative group">
                        <img :src="getOptimizedUrl(image)" alt="Önizleme"
                            class="shadow-lg rounded-xl w-full sm:w-80 h-52 object-contain border-2 border-dashed border-slate-200 dark:border-zinc-700 p-1" />
                        <button @click="clearImage"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
                            <i class="pi pi-times text-xs"></i>
                        </button>
                    </div>

                    <div v-else
                        class="w-full sm:w-80 h-52 bg-slate-100 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-zinc-700">
                        <i class="pi pi-image text-2xl mb-1"></i>
                        <span class="text-[10px]">Önizleme Yok</span>
                    </div>
                </div>
            </div>
            <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Notlar</label>
                <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
                <Textarea autoResize rows="5" cols="30" class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2"
                    v-model="notes" />
            </div>
        </div>

        <template #footer>
            <div class="flex gap-2 w-full mt-5 md:w-auto justify-end">
                <Button label="İptal" icon="pi pi-times" text severity="secondary"
                    @click="$emit('update:modelValue', false)" class="flex-1 md:flex-none" />
                <Button label="Kaydet" @click="saveEstate" icon="pi pi-check" severity="success" raised
                    class="flex-1 md:flex-none" />
            </div>
        </template>
    </Dialog>
    <Toast position="bottom-center" />
</template>
<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import { useQuery } from '@tanstack/vue-query'
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/supabase';
import { useToast } from 'primevue/usetoast';
import {
    heatingOptions, roomTypeOptions, propertyTypes, kitchenTypes, booleans, parkingTypes, booleans2,
    usageTypes, zoningStatusTypes, deedStatus, inSale, kaksSecenekleri, gabariSecenekleri
} from '../constants/constants.js';
import { getCities, getDistrictsByCityCode, getNeighbourhoodsByCityCodeAndDistrict } from 'turkey-neighbourhoods';
const allCities = getCities();
const toast = useToast();

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
const submitted = ref(false);
// const toast = useToast();
const props = defineProps({ modelValue: Boolean, id: String });
const emit = defineEmits(['update:modelValue']);
const districtList = ref([]);
const neighborhoodList = ref([]);

// const saveEstate = () => {
//     emit('update:modelValue', false)
// };
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
    selectedFile.value = null;
};

const onCityChange = () => {
    selectedDistrict.value = null;
    selectedNeighborhood.value = null;
};

const fetchProcess = async () => {
    if (!props.id) return null
    try {
        const { data, error } = await supabase.from("estates")
            .select(`*`)
            .eq('id', props.id)
            .single();
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        return null;
    }
}
const { data } = useQuery({
    queryKey: ['estates', computed(() => props.id)],
    queryFn: fetchProcess,
    enabled: computed(() => !!props.id),
    keepPreviousData: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
});

const getOptimizedUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return url;
    return url.replace('/upload/', '/upload/w_150,c_thumb,q_auto,f_auto/');
};

watch(data, (newData) => {
    if (newData) {
        title.value = newData.title?.trim() || null;
        m2_gross.value = newData.m2_gross || null;
        m2_net.value = newData.m2_net || null;
        floor_located.value = newData.floor_located || null;
        num_of_floors.value = newData.num_of_floors || null;
        building_age.value = newData.building_age || null;
        num_of_bath.value = newData.num_of_bath || null;
        balcony.value = newData.balcony;
        heating.value = newData.heating || null;
        kitchen.value = newData.kitchen;
        lift.value = newData.lift;
        parking.value = newData.parking;
        site_name.value = newData.site_name || null;
        isInSite.value = newData.in_site;
        usage_status.value = newData.usage_status || null;
        member_fee.value = newData.member_fee || null;
        swap.value = newData.swap;
        deed_status.value = newData.deed_status || null;
        credit.value = newData.credit;
        price.value = newData.price || null;
        notes.value = newData.notes || null;
        property_type.value = newData.property_type || null;
        image.value = newData.img_url || null;
        furnished.value = newData.furnished;
        selectedRoom.value = newData.rooms || null;
        zoning_status.value = newData.zoning_status || null;
        parsel_no.value = newData.parsel_no || null;
        pafta_no.value = newData.pafta_no || null;
        kaks.value = newData.kaks || null;
        gabari.value = newData.gabari || null;
        in_sale.value = newData.in_sale || null;
        if (newData.created_at) {
            created_at.value = new Date(newData.created_at);
        } else {
            created_at.value = null;
        }
        const foundCity = allCities.find(c => c.name === newData.city);
        if (foundCity) {
            selectedCity.value = foundCity.name;
            districtList.value = getDistrictsByCityCode(foundCity.code);
            selectedDistrict.value = districtList.value.find(d => d === newData.district?.trim());
            if (selectedDistrict.value) {
                neighborhoodList.value = getNeighbourhoodsByCityCodeAndDistrict(foundCity.code, selectedDistrict.value);
                selectedNeighborhood.value = neighborhoodList.value.find(d => d === newData.neighborhood?.trim());
            }
        }
    }
});

// Cloudinary Bilgileriniz
const cloudName = "cozumemlak";
const uploadPreset = "ml_default"; // Panelde oluşturduğunuz isim

const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
    }

    const data = await response.json();
    // return data.secure_url; // Küçültülmüş ve optimize edilmiş resmin linki
    return data; 
};

const saveEstate = async () => {
    let response = null;
    let public_id = null;
    try {
        submitted.value = true;
        if (!selectedCity.value?.name || !selectedDistrict.value || !selectedNeighborhood.value || !price.value || !m2_gross.value || !m2_net.value || !property_type.value || !title.value) {
            toast.add({ severity: 'error', summary: 'Hata', detail: 'Tüm zorunlu alanları doldurunuz.', life: 2000 });
            return;
        }

        let imageUrl = image.value;

        if (selectedFile.value) {
            toast.add({ severity: 'info', summary: 'Yükleniyor', detail: 'Resim optimize ediliyor...', life: 2000 });
            
            // imageUrl = await uploadToCloudinary(selectedFile.value);
            response = await uploadToCloudinary(selectedFile.value);
            if(!response || !response.secure_url){
                toast.add({ severity: 'error', summary: 'Hata', detail: 'Resim yüklenirken hata oluştu.', life: 2000 });
                return;
            }
            imageUrl = response.secure_url;
            public_id = response.public_id;
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Resim başarıyla yüklendi.', life: 2000 });
        }
        const date = new Date(created_at.value);
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")

        const finalDate = `${y}-${m}-${d}`;

        const payload = {
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
            // img_id: image.value || null,
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
        const { error } = await supabase
            .from("estates")
            .update({
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
                property_type: payload.property_type,
                title: payload.title,
                rooms: payload.rooms,
                zoning_status: payload.zoning_status,
                parsel_no: payload.parsel_no,
                pafta_no: payload.pafta_no,
                kaks: payload.kaks,
                gabari: payload.gabari,
                in_sale: payload.in_sale,
                img_url: payload.img_url,
                img_id: payload.img_id
            })
            .eq('id', props.id);
        if (error) {
            throw error;
        } else {
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'İlan bilgileri güncellendi.', life: 2000 });
            queryClient.invalidateQueries({ queryKey: ['estates'] });
            emit('update:modelValue', false);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'İlan eklenirken hata oluştu.', life: 2000 });
    }
};
</script>
