<template>
    <div class="flex flex-col h-full overflow-hidden">

        <div class="flex-1 overflow-y-auto p-1 pb-5 space-y-6 pt-4 custom-scrollbar">
            <div class="flex flex-col gap-2">
                <FloatLabel class="w-full" variant="on">
                    <Select showClear fluid inputId="prop_types" :options="propertyTypes" filter optionLabel="label"
                        optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                        v-model="filters.property_type" />
                    <label for="prop_types" class="text-xs font-bold text-slate-600 dark:!text-zinc-200">Emlak
                        Tipi</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel class="w-full" variant="on">
                    <Select showClear fluid inputId="on_label" :options="allCities" v-model="filters.city"
                        optionLabel="name" filter class="w-full" @change="onCityChange" />
                    <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200" for="on_label">İl</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel class="w-full" variant="on">
                    <Select showClear fluid inputId="district_label" :options="districtList" v-model="filters.district"
                        filter class="w-full" :disabled="!filters?.city" />
                    <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200"
                        for="district_label">İlçe</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <FloatLabel class="w-full" variant="on">
                    <Select showClear fluid inputId="neighborhood_label" :options="neighborhoodList"
                        v-model="filters.neighborhood" filter class="w-full" :disabled="!filters?.district" />
                    <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200"
                        for="neighborhood_label">Mahalle</label>
                </FloatLabel>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200">Fiyat Aralığı</label>
                <div class="grid grid-cols-2 gap-2">
                    <InputNumber v-model="filters.minPrice" placeholder="min TL" fluid :useGrouping="true"
                        mode="currency" currency="TRY" locale="tr-TR" />
                    <InputNumber v-model="filters.maxPrice" placeholder="max TL" fluid :useGrouping="true"
                        mode="currency" currency="TRY" locale="tr-TR" />
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200">m² (Brüt)</label>
                <div class="grid grid-cols-2 gap-2">
                    <InputNumber v-model="filters.m2_grossmin" placeholder="min m²" fluid :useGrouping="true" />
                    <InputNumber v-model="filters.m2_grossmax" placeholder="max m²" fluid :useGrouping="true" />
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200">m² (Net)</label>
                <div class="grid grid-cols-2 gap-2">
                    <InputNumber v-model="filters.m2_netmin" placeholder="min m²" fluid :useGrouping="true" />
                    <InputNumber v-model="filters.m2_netmax" placeholder="max m²" fluid :useGrouping="true" />
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <FloatLabel class="w-full" variant="on">
                    <Select showClear fluid :options="inSale" optionLabel="label" optionValue="value"
                        class="w-full dark:bg-zinc-800 dark:border-zinc-700" v-model="filters.in_sale"
                        inputId="insale_label" />
                    <label for="insale_label" class="text-xs font-bold text-slate-600 dark:!text-zinc-200">Tür</label>
                </FloatLabel>
            </div>

            <template v-if="filters.property_type !== 'arsa'">
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <MultiSelect showClear display="chip" fluid inputId="rooms_label" :options="roomTypeOptions"
                            v-model="filters.rooms" optionLabel="label" optionValue="value" filter class="w-full" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200"
                            for="rooms_label">Oda</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <Select showClear fluid inputId="kitchen_label" :options="kitchenTypes" optionLabel="label"
                            optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                            v-model="filters.kitchen" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200"
                            for="kitchen_label">Mutfak</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <Select showClear fluid inputId="kitchen_label" :options="booleans" optionLabel="label"
                            optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                            v-model="filters.balcony" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200"
                            for="kitchen_label">Balkon</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <MultiSelect showClear display="chip" fluid inputId="heating_label" v-model="filters.heating"
                            :options="heatingOptions" optionLabel="label" optionValue="value" filter
                            class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200"
                            for="heating_label">Isıtma</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <MultiSelect showClear display="chip" fluid inputId="status_label" :options="usageTypes"
                            optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                            v-model="filters.usage_status" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200" for="status_label">Kullanım
                            Durumu</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <Select showClear display="chip" fluid inputId="status_label" :options="booleans2"
                            optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                            v-model="filters.in_site" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200" for="status_label">Site İçerisinde</label>
                    </FloatLabel>
                </div>
            </template>
            <template v-if="filters.property_type === 'arsa'">
                <div class="flex flex-col gap-2">
                    <FloatLabel class="w-full" variant="on">
                        <MultiSelect showClear display="chip" fluid inputId="status_label" :options="zoningStatusTypes"
                            optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                            v-model="filters.zoning_status" />
                        <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200" for="status_label">İmar
                            Durumu</label>
                    </FloatLabel>
                </div>
            </template>

            <div class="flex flex-col gap-2">
                <FloatLabel class="w-full" variant="on">
                    <MultiSelect filter showClear display="chip" fluid inputId="deed_label" :options="deedStatus"
                        optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                        v-model="filters.deed_status" />
                    <label class="text-xs font-bold text-slate-600 dark:!text-zinc-200" for="deed_label">Tapu
                        Durumu</label>
                </FloatLabel>
            </div>
        </div>


        <div class="pt-4 pb-2 flex gap-2 border-t dark:border-zinc-700 bg-inherit">
            <Button label="Temizle" severity="danger" class="dark:!text-red-400 dark:hover:!bg-red-200/10" text fluid
                @click="$emit('reset')" />
            <Button label="Uygula" severity="success" class="dark:!bg-green-400 !text-white dark:hover:!bg-green-600 "
                fluid @click="$emit('apply')" />
        </div>
    </div>
</template>

<script setup>
import Select from 'primevue/select';
import FloatLabel from 'primevue/floatlabel';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { defineModel, computed } from 'vue';
import { getCities, getDistrictsByCityCode, getNeighbourhoodsByCityCodeAndDistrict } from 'turkey-neighbourhoods';
import { roomTypeOptions, inSale, propertyTypes, heatingOptions, kitchenTypes, usageTypes, deedStatus, booleans, booleans2, zoningStatusTypes } from '@/constants/constants.js'
const filters = defineModel();

const onCityChange = () => {
    filters.value.district = null;
    filters.value.neighborhood = null;
};

const allCities = getCities();
const districtList = computed(() => {
    const cityCode = filters.value?.city?.code;
    if (!cityCode) return [];
    return getDistrictsByCityCode(cityCode);
});

const neighborhoodList = computed(() => {
    if (!filters.value?.city || !filters.value?.district) {
        return [];
    }
    try {
        return getNeighbourhoodsByCityCodeAndDistrict(
            filters.value?.city?.code,
            filters.value?.district
        );
    } catch (error) {
        console.error("Mahalleler yüklenirken hata oluştu:", error);
        return [];
    }
});
</script>