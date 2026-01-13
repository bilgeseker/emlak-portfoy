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
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Başlığı</label>
                <InputText v-model="title" class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Emlak Tipi</label>
                <Select :options="[
                    { label: 'Konut', value: 'konut' },
                    { label: 'İş Yeri', value: 'is_yeri' },
                    { label: 'Arsa', value: 'arsa' },
                    { label: 'Konut Projeleri', value: 'konut_proje' },
                    { label: 'Bina', value: 'bina' },
                    { label: 'Devre Mülk', value: 'devre_mulk' },
                    { label: 'Turistik Tesis', value: 'turistik_tesis' },
                ]" optionLabel="label" optionValue="value" filter class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="property_type" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İl</label>
                <Select v-model="selectedCity" :options="allCities" optionLabel="name" optionValue="name" filter
                    placeholder="İl Seçiniz" @change="onCityChange">
                </Select>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlçe</label>
                <Select v-model="selectedDistrict" :options="districtList" filter :disabled="!selectedCity"
                    placeholder="Mahalle Seçiniz" :virtualScrollerOptions="{ itemSize: 38 }"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Mahalle</label>
                <!-- <InputText class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" /> -->
                <Select v-model="selectedNeighborhood" :options="neighborhoodList" filter :disabled="!selectedDistrict"
                    placeholder="Mahalle Seçiniz" :virtualScrollerOptions="{ itemSize: 38 }"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
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
                <Select :options="[
                    { label: 'Açık (Amerikan)', value: 'acik' },
                    { label: 'Kapalı', value: 'kapali' }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="kitchen" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Balkon</label>
                <Select :options="[
                    { label: 'Var', value: true },
                    { label: 'Yok', value: false }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="balcony" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Asansör</label>
                <Select :options="[
                    { label: 'Var', value: true },
                    { label: 'Yok', value: false }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="lift" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Otopark</label>
                <Select :options="[
                    { label: 'Açık Otopark', value: 'acik_otopark' },
                    { label: 'Kapalı Otopark', value: 'kapali_otopark' },
                    { label: 'Açık & Kapalı Otopark', value: 'acikkapali_otopark' },
                    { label: 'Yok', value: 'yok' }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="parking" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Eşyalı</label>
                <Select :options="[
                    { label: 'Evet', value: true },
                    { label: 'Hayır', value: false }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="furnished" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Site İçerisinde</label>
                <Select v-model="isInSite" :options="[
                    { label: 'Evet', value: true },
                    { label: 'Hayır', value: false }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Site Adı</label>
                <InputText :disabled="!isInSite"
                    class="w-full dark:bg-zinc-800 dark:border-zinc-700 p-3 md:p-2" v-model="site_name" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Kullanım Durumu</label>
                <Select :options="[
                    { label: 'Boş', value: 'bos' },
                    { label: 'Kiracılı', value: 'kiracili' },
                    { label: 'Mülk Sahibi', value: 'mulk_sahibi' }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="usage_status" />
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
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="swap" />
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
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="deed_status" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Krediye Uygun</label>
                <Select :options="[
                    { label: 'Evet', value: true },
                    { label: 'Hayır', value: false }
                ]" optionLabel="label" optionValue="value" class="w-full dark:bg-zinc-800 dark:border-zinc-700"
                    v-model="credit" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">İlan Tarihi</label>
                <DatePicker v-model="created_at" showIcon fluid iconDisplay="input" dateFormat="dd/mm/yy" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200">Fiyat (TL)</label>
                <InputNumber class="w-full dark:bg-zinc-800 dark:border-zinc-700" mode="currency" currency="TRY"
                    locale="tr-TR" inputClass="p-3 md:p-2 w-full" v-model="price" />
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
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import { useQuery } from '@tanstack/vue-query'
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import { supabase } from '@/supabase';
// import Toast from 'primevue/toast';
// import { useToast } from 'primevue/usetoast';
import { heatingOptions } from '../constants/heating_types.js';
import { getCities, getDistrictsByCityCode, getNeighbourhoodsByCityCodeAndDistrict } from 'turkey-neighbourhoods';
const allCities = getCities();

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
const isInSite = ref(null);
const furnished = ref(null);
// const queryClient = useQueryClient();
// const toast = useToast();
const props = defineProps({ modelValue: Boolean, id: String });
const emit = defineEmits(['update:modelValue']);
const districtList = ref([]);
const neighborhoodList = ref([]);

const saveEstate = () => {
    emit('update:modelValue', false)
};

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

watch(data, (newData) => {
    if (newData) {
        title.value = newData.title?.trim() || null;
        m2_gross.value = newData.m2_gross || null;
        m2_net.value = newData.m2_net || null;
        floor_located.value = newData.floor_located || null;
        num_of_floors.value = newData.num_of_floors || null;
        building_age.value = newData.building_age || null;
        num_of_bath.value = newData.num_of_bath || null;
        balcony.value = newData.balcony || null;
        heating.value = newData.heating || null;
        kitchen.value = newData.kitchen || null;
        lift.value =  newData.lift || null;
        parking.value = newData.parking || null;
        site_name.value = newData.site_name || null;
        usage_status.value = newData.usage_status || null;
        member_fee.value = newData.member_fee || null;
        swap.value = newData.swap || null;
        deed_status.value = newData.deed_status || null;
        credit.value = newData.credit || null;
        price.value = newData.price || null;
        notes.value = newData.notes || null;
        property_type.value = newData.property_type || null;
        image.value = newData.image || null;
        furnished.value = newData.furnished || null;
        const foundCity = allCities.find(c => c.name === newData.city);
        if (foundCity) {
            selectedCity.value = foundCity.name;
            districtList.value = getDistrictsByCityCode(foundCity.code);
            selectedDistrict.value = districtList.value.find(d => d === newData.district?.trim());
            if (selectedDistrict.value) {
                neighborhoodList.value = getNeighbourhoodsByCityCodeAndDistrict(foundCity.code, selectedDistrict.value);
                console.log(neighborhoodList.value)
                selectedNeighborhood.value = neighborhoodList.value.find(d => d === newData.neighborhood?.trim());
            }
        }
    }
});


</script>
