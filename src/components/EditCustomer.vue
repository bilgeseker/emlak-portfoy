<template>
    <Dialog :visible="props.modelValue" @update:visible="$emit('update:modelValue', $event)" modal
        :header="props.id ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'" :style="{ width: '90vw', maxWidth: '700px' }"
        :breakpoints="{ '960px': '80vw', '641px': '100vw' }" class="dark:bg-slate-900" :pt="{
            root: 'border-none shadow-2xl bg-white dark:bg-zinc-900 mx-2 !rounded-2xl overflow-hidden',
            header: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-b-0 p-6 !rounded-t-2xl',
            content: 'p-6 bg-white dark:bg-zinc-900',
            footer: 'p-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 !rounded-b-2xl'
        }">

        <!-- Header İkon -->
        <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i class="pi pi-user text-2xl text-white"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-white">{{ props.id ? 'Müşteri Bilgilerini Güncelle' : 'Yeni Müşteri Kaydı' }}</h3>
                <p class="text-blue-100 text-sm">{{ props.id ? 'Mevcut bilgileri düzenleyin' : 'Müşteri bilgilerini girin' }}</p>
            </div>
        </div>

        <div class="space-y-6">
            <!-- Kişisel Bilgiler -->
            <div class="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-id-card text-blue-500"></i>
                    <h4 class="text-lg font-semibold text-slate-800 dark:text-white">Kişisel Bilgiler</h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                            <i class="pi pi-user text-slate-400 text-xs"></i>
                            Ad <span class="font-bold text-red-500">*</span>
                        </label>
                        <InputText v-model="first_name" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-3"
                            :class="{ 'p-invalid !border-red-500 !ring-red-500/20': submitted && !first_name }"
                            placeholder="Müşteri adı" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                            <i class="pi pi-user text-slate-400 text-xs"></i>
                            Soyad <span class="font-bold text-red-500">*</span>
                        </label>
                        <InputText v-model="last_name" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-3"
                            :class="{ 'p-invalid !border-red-500 !ring-red-500/20': submitted && !last_name }"
                            placeholder="Müşteri soyadı" />
                    </div>
                </div>
            </div>

            <!-- İletişim Bilgileri -->
            <div class="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-phone text-green-500"></i>
                    <h4 class="text-lg font-semibold text-slate-800 dark:text-white">İletişim Bilgileri</h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                            <i class="pi pi-phone text-green-500 text-xs"></i>
                            Telefon
                        </label>
                        <InputText v-model="phone" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-3"
                            placeholder="(5XX) XXX XX XX" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                            <i class="pi pi-envelope text-blue-500 text-xs"></i>
                            E-posta
                        </label>
                        <InputText v-model="email" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-3"
                            placeholder="ornek@email.com" />
                    </div>
                </div>
            </div>

            <!-- Adres Bilgileri -->
            <div class="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-map-marker text-purple-500"></i>
                    <h4 class="text-lg font-semibold text-slate-800 dark:text-white">Adres Bilgileri</h4>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                        <i class="pi pi-home text-purple-500 text-xs"></i>
                        Adres
                    </label>
                    <Textarea autoResize rows="4" cols="30" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-3"
                        v-model="address" placeholder="Müşteri adresini girin..." />
                </div>
            </div>

            <!-- Notlar -->
            <div class="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-sticky-note text-orange-500"></i>
                    <h4 class="text-lg font-semibold text-slate-800 dark:text-white">Notlar</h4>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-slate-600 dark:text-zinc-200 flex items-center gap-2">
                        <i class="pi pi-comment text-orange-500 text-xs"></i>
                        Ek Notlar
                    </label>
                    <Textarea autoResize rows="3" cols="30" class="w-full dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-3"
                        v-model="notes" placeholder="Müşteri hakkında notlar..." />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 w-full justify-end">
                <Button label="İptal" icon="pi pi-times" severity="secondary" outlined
                    @click="$emit('update:modelValue', false)" class="px-6 py-2 rounded-lg hover:shadow-md transition-all duration-200" />
                <Button :label="props.id ? 'Güncellemeyi Kaydet' : 'Müşteriyi Ekle'" @click="saveCustomer"
                    icon="pi pi-check" severity="success" raised
                    class="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none shadow-lg hover:shadow-xl transition-all duration-200" />
            </div>
        </template>
    </Dialog>
    <Toast position="bottom-center" />
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import { useQuery } from '@tanstack/vue-query'
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/supabase';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const queryClient = useQueryClient();
const submitted = ref(false);

const props = defineProps({ modelValue: Boolean, id: String });
const emit = defineEmits(['update:modelValue']);

const first_name = ref('');
const last_name = ref('');
const phone = ref('');
const email = ref('');
const address = ref('');
const notes = ref('');

const fetchCustomer = async () => {
    if (!props.id) return null;
    try {
        const { data, error } = await supabase.from("customers")
            .select(`*`)
            .eq('id', props.id)
            .single();
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Müşteri getirme hatası:', error);
        return null;
    }
}

const { data } = useQuery({
    queryKey: ['customer', computed(() => props.id)],
    queryFn: fetchCustomer,
    enabled: computed(() => !!props.id),
    keepPreviousData: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
});

watch(data, (newData) => {
    if (newData) {
        first_name.value = newData.first_name || '';
        last_name.value = newData.last_name || '';
        phone.value = newData.phone || '';
        email.value = newData.email || '';
        address.value = newData.address || '';
        notes.value = newData.notes || '';
    } else {
        // Yeni müşteri için sıfırla
        first_name.value = '';
        last_name.value = '';
        phone.value = '';
        email.value = '';
        address.value = '';
        notes.value = '';
    }
});

const saveCustomer = async () => {
    submitted.value = true;

    if (!first_name.value || !last_name.value) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Ad ve soyad zorunludur.', life: 3000 });
        return;
    }

    try {
        const customerData = {
            first_name: first_name.value,
            last_name: last_name.value,
            phone: phone.value,
            email: email.value,
            address: address.value,
            notes: notes.value,
        };

        if (props.id) {
            // Güncelle
            const { error } = await supabase
                .from('customers')
                .update(customerData)
                .eq('id', props.id);

            if (error) throw error;

            toast.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Müşteri güncellendi',
                life: 3000
            });
        } else {
            // Ekle
            const { error } = await supabase
                .from('customers')
                .insert([customerData]);

            if (error) throw error;

            toast.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Müşteri eklendi',
                life: 3000
            });
        }

        queryClient.invalidateQueries(['customers']);
        emit('update:modelValue', false);

    } catch (err) {
        console.error("Kaydetme hatası:", err.message);
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Müşteri kaydedilemedi', life: 3000 });
    }
};
</script>