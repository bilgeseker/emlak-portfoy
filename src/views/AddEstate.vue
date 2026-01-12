<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-5 md:gap-6 ">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">İlan Ekle</h1>
        </div>
        <div class="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Başlığı</label>
            <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" />
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
            <DatePicker showIcon fluid iconDisplay="input" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">m² (Brüt)</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">m² (Net)</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Bulunduğu Kat</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kat Sayısı</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Bina Yaşı</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Isıtma</label>
            <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
            <Select :options="heatingData" optionLabel="label" placeholder="Isıtma Tipi Seçiniz" filter
                class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Banyo Sayısı</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mutfak</label>
            <Select :options="[
                { label: 'Açık (Amerikan)', value: 'acik' },
                { label: 'Kapalı', value: 'kapali' }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Balkon</label>
            <Select :options="[
                { label: 'Var', value: true },
                { label: 'Yok', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Asansör</label>
            <Select :options="[
                { label: 'Var', value: true },
                { label: 'Yok', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

         <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Otopark</label>
            <Select :options="[
                { label: 'Açık Otopark', value: 'acik_otopark' },
                { label: 'Kapalı Otopark', value: 'kapali_otopark' },
                { label: 'Açık & Kapalı Otopark', value: 'acikkapali_otopark' },
                { label: 'Yok', value: 'yok' }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Eşyalı</label>
            <Select :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
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
            <InputText :disabled="isInSite.value === false" class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kullanım Durumu</label>
            <Select :options="[
                { label: 'Boş', value: 'bos' },
                { label: 'Kiracılı', value: 'kiracili' },
                { label: 'Mülk Sahibi', value: 'mulk_sahibi' }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Aidat (TL)</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
        </div>

         <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Takas</label>
            <Select :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
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
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Krediye Uygun</label>
            <Select :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
            ]" optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Fiyat (TL)</label>
            <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" mode="currency" currency="TRY"
                locale="tr-TR" inputClass="p-3 md:p-2 w-full" />
        </div>
    </div>
    <div class="flex gap-2 w-full mt-5 md:w-auto justify-end">
        <Button label="İptal" icon="pi pi-times" text severity="secondary"
            class="flex-1 md:flex-none mr-5 hover:!bg-slate-100" />
        <Button label="Kaydet" @click="saveEstate" icon="pi pi-check" severity="success" raised
            class="flex-1 md:flex-none" />
    </div>


</template>

<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
// import { supabase } from '@/supabase.js';
// import { useQuery } from '@tanstack/vue-query'
import { ref, computed } from 'vue';
import allData from '../constants/cities_data.js';
import heatingData from '../constants/heating_types.js';
// const props = defineProps({ modelValue: Boolean, id: Number });
// const emit = defineEmits(['update:modelValue']);

const selectedCity = ref(null);
const selectedDistrict = ref(null);
const selectedNeighborhood = ref(null);
const isInSite = ref(true);


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


</script>