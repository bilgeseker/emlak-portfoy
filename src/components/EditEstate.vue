<template>
    <Dialog :visible="props.modelValue" @update:visible="$emit('update:modelValue', $event)" modal
        header="İlanı Düzenle" :style="{ width: '90vw', maxWidth: '1000px' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }" class="dark:bg-slate-900 " :pt="{
            root: 'border-none shadow-2xl bg-white dark:bg-zinc-900 mx-2 !rounded-xl',
            header: 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 p-4 md:p-6 !rounded-xl',
            content: 'p-4 md:p-6 bg-white dark:bg-zinc-900 ',
            footer: 'p-4 md:p-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-green-300 dark:zinc-slate-800 !rounded-xl'
        }">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 mb-5 md:gap-6 ">
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
                <Select :options="heatingOptions" optionLabel="label"
                    placeholder="Isıtma Tipi Seçiniz" filter class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Banyo Sayısı</label>
                <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" inputClass="p-3 md:p-2 w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mutfak</label>
                <Select  optionLabel="label" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Fiyat (TL)</label>
                <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" mode="currency" currency="TRY"
                    locale="tr-TR" inputClass="p-3 md:p-2 w-full" />
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
</template>
<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
// import { supabase } from '@/supabase.js';
// import { useQuery } from '@tanstack/vue-query'
import { defineProps, defineEmits, ref, computed } from 'vue';
import allData from '../constants/cities_data.js';
import {heatingOptions} from '../constants/heating_types.js';
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue']);

const selectedCity = ref(null);
const selectedDistrict = ref(null);
const selectedNeighborhood = ref(null);

const saveEstate = () => {
    emit('update:modelValue', false)
};

const onCityChange = () => {
    console.log(heatingOptions)
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