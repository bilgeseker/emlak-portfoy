<template>
    <Dialog :visible="props.modelValue" @update:visible="$emit('update:modelValue', $event)" modal header=" "
        :style="{ width: '90vw', maxWidth: '600px' }" :breakpoints="{ '960px': '80vw', '641px': '100vw' }"
        class="font-sans" :pt="{
            root: 'border-none shadow-2xl bg-white dark:bg-zinc-900 mx-2 !rounded-xl',
            header: 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 p-4 md:p-6 !rounded-xl',
            content: 'p-4 md:p-6 bg-white dark:bg-zinc-900 ',
            footer: 'p-4 md:p-6 bg-slate-50 dark:bg-zinc-900/50 border-t !border-green-300 dark:zinc-slate-800 !rounded-xl'
        }">
        <!-- Professional Custom Header -->
        <div
            class="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
            <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                    {{ props.id ? 'Müşteri Düzenle' : 'Yeni Müşteri' }}
                </h3>
                <p class="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">
                    {{ props.id ? 'Mevcut müşteri bilgilerini güncelleyin.' : 'Portföyünüze yeni bir müşteri ekleyin.'
                    }}
                </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center">
                <i :class="['pi text-slate-400 dark:text-zinc-500', props.id ? 'pi-user-edit' : 'pi-user-plus']"
                    style="font-size: 1.2rem"></i>
            </div>
        </div>

        <div class="p-6 space-y-6">
            <!-- Kişisel Bilgiler Section -->
            <div class="space-y-4">
                <h4
                    class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <i class="pi pi-id-card text-indigo-500"></i> Kişisel Bilgiler
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">İsim <span
                                class="text-red-500">*</span></label>
                        <InputText v-model="owner_name"
                            class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 focus:!border-indigo-500 dark:focus:!border-indigo-400 !shadow-none"
                            :class="{ '!border-red-500': submitted && !owner_name }" placeholder="Örn: Ahmet" />
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Soyisim <span
                                class="text-red-500">*</span></label>
                        <InputText v-model="owner_surname"
                            class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 focus:!border-indigo-500 dark:focus:!border-indigo-400 !shadow-none"
                            :class="{ '!border-red-500': submitted && !owner_surname }" placeholder="Örn: Yılmaz" />
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Telefon <span
                                class="text-red-500">*</span></label>
                        <InputMask v-model="owner_phone" mask="0599 999 99 99"
                            class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 focus:!border-indigo-500 dark:focus:!border-indigo-400 !shadow-none"
                            :class="{ '!border-red-500': submitted && !owner_phone }" placeholder="05XX XXX XX XX" />
                    </div>
                </div>
            </div>

            <div class="h-px bg-slate-100 dark:bg-zinc-800 w-full"></div>

            <!-- İş Bilgileri Section -->
            <div class="space-y-4">
                <h4
                    class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <i class="pi pi-briefcase text-indigo-500"></i> Detaylar
                </h4>
                <div class="grid grid-cols-1 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Komisyon Oranı
                            (%)</label>
                        <InputNumber v-model="commission_rate" :min="0" :max="100" suffix="%" class="w-full"
                            inputClass="!rounded-lg !border-slate-300 dark:!border-zinc-700 focus:!border-indigo-500 w-full"
                            placeholder="0" />
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold text-slate-700 dark:text-zinc-300">Notlar</label>
                        <Textarea v-model="notes" rows="3" autoResize
                            class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 focus:!border-indigo-500 !shadow-none"
                            placeholder="Müşteri hakkında özel notlar..." />
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-2 w-full mt-5 md:w-auto justify-end">
                <Button label="İptal" icon="pi pi-times" text severity="secondary" @click="closeDialog"
                    class="flex-1 md:flex-none" />
                <Button :label="props.id ? 'Güncelle' : 'Kaydet'" icon="pi pi-check" severity="success"
                    @click="saveOwner" :loading="loading" class="flex-1 md:flex-none" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, defineProps } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import { supabase } from '@/supabase';
import { useToast } from 'primevue/usetoast';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps({
    modelValue: Boolean,
    id: Number
});

const emit = defineEmits(['update:modelValue', 'saved']);

const toast = useToast();
const queryClient = useQueryClient();

const owner_name = ref('');
const owner_surname = ref('');
const owner_phone = ref('');
const commission_rate = ref(null);
const notes = ref('');
const submitted = ref(false);
const loading = ref(false);

const closeDialog = () => {
    emit('update:modelValue', false);
    resetForm();
};

const resetForm = () => {
    owner_name.value = '';
    owner_surname.value = '';
    owner_phone.value = '';
    commission_rate.value = null;
    notes.value = '';
    submitted.value = false;
};

const fetchOwner = async (id) => {
    try {
        const { data, error } = await supabase
            .from('owners')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        owner_name.value = data.owner_name || '';
        owner_surname.value = data.owner_surname || '';
        owner_phone.value = data.owner_phone || '';
        commission_rate.value = data.commission_rate || null;
        notes.value = data.owner_notes || '';
    } catch (error) {
        console.error('Mülk sahibi getirilirken hata:', error);
        toast.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Mülk sahibi bilgileri yüklenemedi',
            life: 3000
        });
    }
};

const saveOwner = async () => {
    submitted.value = true;

    if (!owner_name.value || !owner_surname.value) {
        toast.add({
            severity: 'warn',
            summary: 'Uyarı',
            detail: 'Lütfen zorunlu alanları doldurun',
            life: 3000
        });
        return;
    }

    loading.value = true;

    try {
        const ownerData = {
            owner_name: owner_name.value,
            owner_surname: owner_surname.value,
            owner_phone: owner_phone.value,
            commission_rate: commission_rate.value,
            owner_notes: notes.value
        };

        if (props.id) {
            // Güncelleme
            const { error } = await supabase
                .from('owners')
                .update(ownerData)
                .eq('id', props.id);

            if (error) throw error;

            toast.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Mülk sahibi güncellendi',
                life: 3000
            });
        } else {
            // Yeni ekleme
            const { data, error } = await supabase
                .from('owners')
                .insert([ownerData])
                .select();

            if (error) throw error;

            if (data && data[0]) {
                emit('saved', data[0].id);
            }

            toast.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Mülk sahibi eklendi',
                life: 3000
            });
        }

        queryClient.invalidateQueries(['owners']);
        closeDialog();

    } catch (error) {
        console.error('Kaydetme hatası:', error);
        toast.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Mülk sahibi kaydedilemedi',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

watch(() => props.modelValue, (newVal) => {
    if (newVal && props.id) {
        fetchOwner(props.id);
    } else if (!newVal) {
        resetForm();
    }
});

onMounted(() => {
    if (props.modelValue && props.id) {
        fetchOwner(props.id);
    }
});
</script>