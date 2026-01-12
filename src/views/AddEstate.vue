<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-5 md:gap-6 ">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İlan Ekle</h1>
        </div>
        <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Başlığı</label>
            <InputText v-model="title" class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İl</label>
            <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
            <Select v-model="selectedCity" :options="allData" filter optionLabel="il" placeholder="İl Seçiniz"
                @change="onCityChange">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                        <span class="text-slate-800 dark:text-slate-100">{{ slotProps.value.il }}</span>
                    </div>
                    <span v-else class="text-slate-400">
                        {{ slotProps.placeholder }}
                    </span>
                </template>

                <template #option="slotProps">
                    <div class="flex items-center">
                        <span class="text-md">{{ slotProps.option.il }}</span>
                    </div>
                </template>
            </Select>
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlçe</label>
            <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
            <Select v-model="selectedDistrict" :options="districtList" filter optionLabel="ilce"
                :disabled="!selectedCity" placeholder="İlçe Seçiniz">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                        <span class="text-slate-800 dark:text-slate-100">{{ slotProps.value.ilce }}</span>
                    </div>
                    <span v-else class="text-slate-400">
                        {{ slotProps.placeholder }}
                    </span>
                </template>

                <template #option="slotProps">
                    <div class="flex items-center">
                        <span class="text-md">{{ slotProps.option.ilce }}</span>
                    </div>
                </template>
            </Select>
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mahalle</label>
            <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
            <Select v-model="selectedNeighborhood" :options="neighborhoodList" filter :disabled="!selectedDistrict"
                placeholder="Mahalle Seçiniz" :virtualScrollerOptions="{ itemSize: 38 }"
                class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Tarihi</label>
            <DatePicker v-model="created_at" showIcon fluid iconDisplay="input" dateFormat="dd/mm/yy" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">m² (Brüt)</label>
            <InputNumber v-model="m2_gross" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">m² (Net)</label>
            <InputNumber v-model="m2_net" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                inputClass="p-3 md:p-2 w-full" />
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
            <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
            <Select v-model="heating" :options="heatingOptions" optionLabel="label" placeholder="Isıtma Tipi Seçiniz"
                filter class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Banyo Sayısı</label>
            <InputNumber v-model="num_of_bath" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mutfak</label>
            <Select :options="[
                { label: 'Açık (Amerikan)', value: 'acik' },
                { label: 'Kapalı', value: 'kapali' }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="kitchen" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Balkon</label>
            <Select :options="[
                { label: 'Var', value: true },
                { label: 'Yok', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="balcony" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Asansör</label>
            <Select :options="[
                { label: 'Var', value: true },
                { label: 'Yok', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="lift" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Otopark</label>
            <Select :options="[
                { label: 'Açık Otopark', value: 'acik_otopark' },
                { label: 'Kapalı Otopark', value: 'kapali_otopark' },
                { label: 'Açık & Kapalı Otopark', value: 'acikkapali_otopark' },
                { label: 'Yok', value: 'yok' }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="parking" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Eşyalı</label>
            <Select :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="furnished" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Site İçerisinde</label>
            <Select v-model="isInSite" :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Site Adı</label>
            <InputText :disabled="isInSite.value === false"
                class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" v-model="site_name" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kullanım Durumu</label>
            <Select :options="[
                { label: 'Boş', value: 'bos' },
                { label: 'Kiracılı', value: 'kiracili' },
                { label: 'Mülk Sahibi', value: 'mulk_sahibi' }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="usage_status" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Aidat (TL)</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full"
                v-model="member_fee" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Takas</label>
            <Select :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="swap" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Tapu Durumu</label>
            <Select :options="[
                { label: 'Kat Mülkiyetli', value: 'kat_mülkiyetli' },
                { label: 'Kat İrtifaklı', value: 'kat_irtifakli' },
                { label: 'Hisseli Tapu', value: 'hisseli_tapu' },
                { label: 'Müstakil Tapulu', value: 'müstakil_tapu' },
                { label: 'Arsa Tapulu', value: 'arsa_tapu' },
                { label: 'Kooperatif Hisseli Tapu', value: 'kooperatif_tapu' },
                { label: 'İntifa Hakkı Tesisli', value: 'intifa_hakki' },
                { label: 'Yurt Dışı Tapulu', value: 'yurtdisi_tapu' },
                { label: 'Tapu Kaydı Yok', value: 'tapu_kaydi_yok' },
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="deed_status" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Krediye Uygun</label>
            <Select :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="credit" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Fiyat (TL)</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" mode="currency" currency="TRY"
                locale="tr-TR" inputClass="p-3 md:p-2 w-full" v-model="price" />
        </div>
        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Emlak Tipi</label>
            <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" v-model="property_type" />
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
                    <img :src="image" alt="Önizleme"
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
    <div class="flex gap-2 w-full mt-5 md:w-auto justify-end">
        <Button label="İptal" icon="pi pi-times" text severity="secondary"
            class="flex-1 md:flex-none mr-5 hover:!bg-slate-100" />
        <Button label="Kaydet" @click="saveEstate" icon="pi pi-check" severity="success" raised
            class="flex-1 md:flex-none" />
    </div>
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
// import { supabase } from '@/supabase.js';
// import { useQuery } from '@tanstack/vue-query'
import { ref, computed } from 'vue';
import allData from '../constants/cities_data.js';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/supabase';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import {heatingOptions} from '../constants/heating_types.js';
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
const selectedFile = ref(null);
const isInSite = ref(true);
const furnished = ref(null);
const queryClient = useQueryClient()
const toast = useToast();


function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        image.value = e.target.result;
    };

    reader.readAsDataURL(file);
}

const clearImage = () => {
    image.value = null;
    selectedFile.value = null;
};
// const onUpload = (event) => {
//     console.log('Uploaded files:', event.files);
// };

const onCityChange = () => {
    selectedDistrict.value = null;
    selectedNeighborhood.value = null;
};

const districtList = computed(() => {
    return selectedCity.value ? selectedCity.value.ilceler : [];
});

const neighborhoodList = computed(() => {
    return selectedDistrict.value ? selectedDistrict.value.mahalleler : [];
});

const saveEstate = () => {

    try {

        const date = new Date(created_at.value);
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")

        const finalDate = `${y}-${m}-${d}`;

        const payload = {
            created_at: finalDate,
            city: selectedCity.value.il,
            district: selectedDistrict.value.ilce,
            neighborhood: selectedNeighborhood.value,
            m2_gross: m2_gross.value,
            m2_net: m2_net.value,
            floor_located: floor_located.value,
            num_of_floors: num_of_floors.value,
            building_age: building_age.value,
            heating: heating.value.value,
            num_of_bath: num_of_bath.value,
            kitchen: kitchen.value.value,
            balcony: balcony.value.value,
            lift: lift.value.value,
            parking: parking.value.value,
            furnished: furnished.value.value,
            in_site: isInSite.value.value,
            site_name: site_name.value,
            usage_status: usage_status.value.value,
            member_fee: member_fee.value,
            swap: swap.value.value,
            credit: credit.value.value,
            price: price.value,
            notes: notes.value,
            deed_status: deed_status.value.value,
            img_id: null,
            property_type: property_type.value,
            title: title.value
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
                in_site: payload.isInSite,
                site_name: payload.site_name,
                usage_status: payload.usage_status,
                member_fee: payload.member_fee,
                swap: payload.swap,
                credit: payload.credit,
                price: payload.price,
                notes: payload.notes,
                deed_status: payload.deed_status,
                img_id: null,
                title: payload.title,
                property_type: payload.property_type
            }
        ]);

        if (error) {
            toast.add({ severity: 'error', detail: 'İlan eklenirken hata oluştu.', life: 2000 });
            throw error;
        }
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['estates']);
        toast.add({ severity: 'success', detail: 'İlan başarıyla eklendi.', life: 2000 });
        resetForm();
    }
});
const resetForm = () => {
    // String ve Number alanlar
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

    // Default değerler
    isInSite.value = null;
};
</script>