<template>
    <Toast position="bottom-center" />
    <div
        class="flex flex-col md:flex-row h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-800">

        <!-- Sidebar Backdrop (Mobile) -->
        <div v-if="showSidebar" @click="showSidebar = false" class="fixed inset-0 bg-black/50 z-30 md:hidden"></div>

        <!-- Sidebar -->
        <div :class="[
            'absolute md:relative z-40 md:z-auto top-0 left-0 h-full w-80 border-r border-slate-200 dark:border-zinc-800 p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-slate-50 dark:bg-zinc-900/50 overflow-y-auto transition-transform duration-300',
            showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]">
            <div class="flex items-center justify-between md:block">
                <h2 class="text-lg md:text-xl font-bold dark:text-white">Ajanda</h2>
                <button @click="showSidebar = false"
                    class="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700">
                    <i class="pi pi-times text-xl"></i>
                </button>
            </div>

            <!-- Takvim -->
            <div
                class="bg-white dark:bg-zinc-800 p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
                <div class="flex items-center justify-between mb-4">
                    <button @click="prevMonth" class="p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded"><i
                            class="pi pi-chevron-left text-xs"></i></button>
                    <p class="text-center text-xs md:text-sm font-semibold text-indigo-600">{{ currentMonthName }}</p>
                    <button @click="nextMonth" class="p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded"><i
                            class="pi pi-chevron-right text-xs"></i></button>
                </div>
                <div
                    class="grid grid-cols-7 gap-1 md:gap-2 mt-3 md:mt-4 text-[9px] md:text-[10px] text-center text-slate-400">
                    <span>Pz</span><span>Sa</span><span>Ça</span><span>Pe</span><span>Cu</span><span>Ct</span><span>Pa</span>
                </div>
                <div class="grid grid-cols-7 gap-1 md:gap-2 mt-2 text-xs text-center">
                    <span v-for="d in daysInMonth" :key="d" @click="selectDate(d)" :class="getDayClass(d)">{{ d
                    }}</span>
                </div>
            </div>

            <!-- İş Türleri Filtreleri -->
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">İş Türleri</p>
                    <button @click="toggleAllFilters"
                        class="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                        {{ activeFilters.size === catTypes.length ? 'Kapat' : 'Tümü' }}
                    </button>
                </div>
                <div class="flex flex-col gap-2 text-xs md:text-sm">
                    <div v-for="cat in catTypes" :key="cat.value" @click="toggleFilter(cat.value)"
                        class="flex items-center gap-3 text-xs md:text-sm p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap md:whitespace-normal"
                        :class="activeFilters.has(cat.value) ? 'bg-slate-100 dark:bg-zinc-800' : ''">
                        <span :class="['w-3 h-3 rounded-full flex-shrink-0', cat.color]"></span>
                        <span class="dark:text-zinc-300 flex-1 truncate md:truncate-none">{{ cat.label }}</span>
                        <span v-if="activeFilters.has(cat.value)"
                            class="text-indigo-600 text-lg leading-none flex-shrink-0">✓</span>
                    </div>
                </div>
            </div>

            <!-- İstatistikler -->
            <div
                class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                <p class="text-xs text-slate-600 dark:text-slate-400 mb-2">Bugün</p>
                <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ todayEvents.length }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">görev planlandı</p>
            </div>
        </div>

        <!-- Ana İçerik -->
        <div class="flex-1 flex flex-col w-full md:w-auto">
            <!-- Başlık ve İşlemler -->
            <div class="p-4 md:p-6 border-b border-slate-100 dark:border-zinc-800">
                <div class="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <button @click="showSidebar = true"
                        class="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg dark:text-white">
                        <i class="pi pi-filter text-lg"></i>
                    </button>
                    <div class="flex-1">
                        <h3 class="text-base md:text-lg font-bold dark:text-white">{{ selectedDateDisplay }}</h3>
                        <p class="text-xs md:text-sm text-slate-500">{{ selectedDateEvents.length }} görev planlandı</p>
                    </div>
                    <!-- <div class="flex gap-1 md:gap-2">
                        <button @click="previousDay" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg dark:text-white transition-colors text-sm md:text-base"><i
                                class="pi pi-chevron-left"></i></button>
                        <button @click="selectToday" class="px-2 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs md:text-sm font-medium transition-colors">Bugün</button>
                        <button @click="nextDay" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg dark:text-white transition-colors text-sm md:text-base"><i
                                class="pi pi-chevron-right"></i></button>
                    </div> -->
                </div>

                <!-- Arama ve Yeni Görev Ekleme -->
                <div class="flex gap-2 flex-col md:flex-row">
                    <div class="flex-1 relative">
                        <i
                            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm"></i>
                        <input v-model="searchQuery" type="text" placeholder="Ara..."
                            class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-lg text-xs md:text-sm placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <button @click="openAddModal"
                        class="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 transition-colors justify-center md:justify-start">
                        <i class="pi pi-plus text-xs md:text-sm"></i> <span class="md:inline">Ekle</span>
                    </button>
                </div>
            </div>

            <!-- Görevler Listesi -->
            <div class="flex-1 overflow-y-auto p-4 md:p-6">
                <div v-if="filteredEvents.length === 0"
                    class="flex flex-col items-center justify-center h-full text-slate-500">
                    <i class="pi pi-inbox text-3xl md:text-4xl mb-2 opacity-50"></i>
                    <p class="text-xs md:text-sm">Bu tarihte görev yok</p>
                </div>
                <div v-else class="space-y-2 md:space-y-3">
                    <div v-for="event in filteredEvents" :key="event.id" @click="openViewModal(event)" :class="[
                        'p-3 md:p-4 rounded-xl shadow-sm border-l-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.01] hover:shadow-md',
                        getEventColor(event.category).bg,
                        getEventColor(event.category).border,
                        getEventColor(event.category).text,
                        selectedEvent?.id === event.id ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''
                    ]">
                        <div class="flex items-start justify-between gap-2 md:gap-3">
                            <div class="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                                <div class="flex-1 min-w-0">
                                    <p class="font-semibold text-sm  break-words mb-3">
                                        {{ event?.title }}</p>
                                    <div class="opacity-75 mt-1 flex gap-1 mb-3">
                                        <i class="pi pi-clock text-[10px] md:text-xs flex-shrink-0 mr-2"></i> <span
                                            class="truncate text-sm">{{
                                                formatTime(event?.todo_time) }}</span>
                                    </div>
                                    <div class="opacity-75 mt-1 flex  gap-1 break-words mb-3">
                                        <i class="pi pi-user text-[10px] md:text-xs flex-shrink-0 mr-2"></i> <span
                                            class="truncate text-sm">{{ event?.owners?.owner_name }} {{
                                            event?.owners?.owner_surname }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-start gap-1 flex-shrink-0">
                                <button @click.stop="openEditModal(event)"
                                    class="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-xs md:text-sm">
                                    <i class="pi pi-pencil"></i>
                                </button>
                                <button @click.stop="deleteEvent(event?.id)"
                                    class="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-xs md:text-sm">
                                    <i class="pi pi-trash text-red-600"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Yeni Görev Dialog -->
    <Dialog v-model:visible="showAddModal"
        :header="dialogMode === 'add' ? 'Yeni Görev Ekle' : dialogMode === 'edit' ? 'Görevi Güncelle' : 'Görevi Görüntüle'"
        :modal="true" class="w-full md:w-110 mx-3 dark:bg-slate-900" :pt="{
            root: 'border-none shadow-2xl bg-white dark:bg-zinc-900 mx-2 !rounded-xl',
            header: 'mb-5 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 p-4 md:p-6 !rounded-xl',
            content: 'p-4 md:p-6 bg-white dark:bg-zinc-900 ',
            footer: 'p-4 md:p-6 !bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-300 dark:zinc-slate-800 !rounded-xl'
        }">
        <template #default>
            <div class="space-y-3 md:space-y-4">
                <div>
                    <label class="block text-xs md:text-sm font-medium dark:text-white mb-1">Başlık<span
                            class="text-red-600">*</span></label>
                    <InputText type="text" v-model="newEvent.title" :disabled="dialogMode === 'view'" maxlength="10 0"
                        :class="{ '!border-red-500': submitted && !newEvent.title.trim() }"
                        class="w-full bg-slate-100 dark:bg-zinc-700 text-slate-900 dark:text-white rounded-lg text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                    <label class="block text-xs md:text-sm font-medium dark:text-white mb-1 ">İş Türü</label>
                    <Select v-model="newEvent.type" :options="catTypes" optionLabel="label" optionValue="value"
                        :disabled="dialogMode === 'view'" class="w-full " />

                </div>
                <div>
                    <label class="block text-xs md:text-sm font-medium dark:text-white mb-1">Müşteri / İlgili
                        Kişi</label>
                    <div class="flex gap-2">
                        <Select v-model="newEvent.customer" :options="ownerOptions" optionLabel="label"
                            optionValue="value" filter :disabled="dialogMode === 'view'"
                            class="w-full !rounded-lg !border-slate-300 dark:!border-zinc-700 flex-1" />
                        <Button icon="pi pi-plus" severity="secondary" outlined @click="openNewOwnerDialog"
                            :disabled="dialogMode === 'view'"
                            class="!border-slate-300 dark:!border-zinc-700 !text-slate-600 dark:!text-zinc-400 !bg-slate-50 dark:!bg-zinc-800" />
                    </div>
                </div>

                <div>
                    <label class="block text-xs md:text-sm font-medium dark:text-white mb-1">Tarih <span
                            class="text-red-600">*</span></label>
                    <DatePicker :invalid="submitted && !newEventDate" :minDate="dialogMode === 'view' ? null : minDate"
                        v-model="newEventDate" dateFormat="dd.mm.yy" fluid :disabled="dialogMode === 'view'" />
                </div>

                <div>
                    <label class="block text-xs md:text-sm font-medium dark:text-white mb-1">Saat <span
                            class="text-red-600">*</span></label>
                    <DatePicker :invalid="submitted && !newEventTime" id="datepicker-timeonly" v-model="newEventTime"
                        timeOnly fluid :disabled="dialogMode === 'view'" />
                </div>

                <div>
                    <label class="block text-xs md:text-sm font-medium dark:text-white mb-1">Açıklama</label>
                    <Textarea v-model="newEvent.description" autoResize rows="5" cols="47" fluid
                        :disabled="dialogMode === 'view'" maxlength="255" />
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-2 w-full mt-5 md:w-auto justify-end">
                <Button @click="closeAddModal" severity="secondary" text class="flex-1 md:flex-none px-4 py-2 "
                    icon="pi pi-times" label="İptal" />

                <Button v-if="dialogMode !== 'view'" @click="saveEvent" severity="success" raised
                    class="flex-1 md:flex-none px-4 py-2" icon="pi pi-check"
                    :label="dialogMode === 'add' ? 'Ekle' : 'Güncelle'" />

            </div>
        </template>
    </Dialog>
    <EditOwner v-model="showOwnerModal" @saved="handleOwnerSaved" />
    <ConfirmDialog />
</template>

<script setup>
import { ref, computed } from "vue";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { useQuery } from '@tanstack/vue-query';
import { supabase } from '@/supabase';
import { catTypes } from '../constants/constants.js';
import EditOwner from '@/components/EditOwner.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useQueryClient } from '@tanstack/vue-query';

const toast = useToast();
const confirm = useConfirm();
const showOwnerModal = ref(false);
const queryClient = useQueryClient();
const minDate = new Date();
const submitted = ref(false);
// ============ Veri ============
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
const handleOwnerSaved = (newId) => {
    refetchOwners().then(() => {
        newEvent.value.customer = newId;
    });
};
const openNewOwnerDialog = () => {
    showOwnerModal.value = true;
};

const fetchTodoList = async () => {
    const { data, error } = await supabase
        .from('todos')
        .select('*, owners(owner_name, owner_surname)')
    if (error) throw error;
    return data;
};

const { data: events } = useQuery({
    queryKey: ['todo'],
    queryFn: fetchTodoList
});
// ============ State ============
const selectedDate = ref(new Date());
const searchQuery = ref("");
const showAddModal = ref(false);
const showSidebar = ref(false);
const selectedEvent = ref(null);
const activeFilters = ref(new Set(catTypes.map(c => c.value))); // başlangıçta tüm kategoriler seçili

// Dialog modu: 'add' (yeni ekle), 'edit' (güncelle), 'view' (görüntüle)
const dialogMode = ref('add');
const editingEventId = ref(null);

const newEvent = ref({
    title: "",
    customer: "",
    type: catTypes[0].value,
    description: ""
});
const newEventDate = ref(null);
const newEventTime = ref("");

// ============ Takvim Fonksiyonları ============
const currentMonth = computed(() => selectedDate.value.getMonth());
const currentYear = computed(() => selectedDate.value.getFullYear());

const currentMonthName = computed(() => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${months[currentMonth.value]} ${currentYear.value}`;
});

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const prevMonth = () => {
    selectedDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};

const nextMonth = () => {
    selectedDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};

const getDayClass = (day) => {
    const isSelected = day === selectedDate.value.getDate() &&
        currentMonth.value === new Date().getMonth() &&
        currentYear.value === new Date().getFullYear();
    const isToday = day === new Date().getDate() &&
        currentMonth.value === new Date().getMonth() &&
        currentYear.value === new Date().getFullYear();

    return [
        'cursor-pointer rounded-full w-6 h-6 flex items-center justify-center transition-colors',
        isSelected ? 'bg-indigo-600 text-white font-bold' : '',
        isToday && !isSelected ? 'hover:bg-slate-100 dark:hover:bg-zinc-700 border border-indigo-600' : '',
        !isSelected && !isToday ? 'hover:bg-slate-100 dark:hover:bg-zinc-700' : ''
    ].filter(Boolean).join(' ');
};

const selectDate = (day) => {
    selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
};

// const selectToday = () => {
//     selectedDate.value = new Date();
// };

// const nextDay = () => {
//     const tomorrow = new Date(selectedDate.value);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     selectedDate.value = tomorrow;
// };

// const previousDay = () => {
//     const yesterday = new Date(selectedDate.value);
//     yesterday.setDate(yesterday.getDate() - 1);
//     selectedDate.value = yesterday;
// };

// ============ Tarih Formatı ============
const selectedDateDisplay = computed(() => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const day = days[selectedDate.value.getDay()];
    const date = selectedDate.value.getDate();
    const month = months[selectedDate.value.getMonth()];
    return `${date} ${month} ${selectedDate.value.getFullYear()}, ${day}`;
});

// const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString('tr-TR', {
//         hour: '2-digit',
//         minute: '2-digit'
//     });
// };
const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    // Eğer veri "13:00:00" formatındaysa sadece "13:00" kısmını alır
    // Eğer veri zaten "13:00" ise aynen bırakır
    return timeString.substring(0, 5);
};
// ============ Filtreleme ============
const toggleFilter = (type) => {
    if (activeFilters.value.has(type)) {
        activeFilters.value.delete(type);
    } else {
        activeFilters.value.add(type);
    }
};

const toggleAllFilters = () => {
    if (activeFilters.value.size === catTypes.length) {
        activeFilters.value.clear();
    } else {
        activeFilters.value.clear();
        catTypes.forEach(cat => activeFilters.value.add(cat.value));
    }
};

const todayEvents = computed(() => {
    if (!events.value) return [];
    const today = new Date();
    return events.value.filter(event => {
        const eventDate = new Date(event?.todo_date);
        return eventDate.toDateString() === today.toDateString();
    });
});

// const selectedDateEvents = computed(() => {
//     return events.value.filter(event => {
//         const eventDate = new Date(event?.todo_date);
//         return eventDate.toDateString() === selectedDate.value.toDateString();
//     });
// });
const selectedDateEvents = computed(() => {
    if (!events.value) return [];

    // Seçili tarihi YYYY-MM-DD formatına çevir
    const offset = selectedDate.value.getTimezoneOffset();
    const adjustedDate = new Date(selectedDate.value.getTime() - (offset * 60 * 1000));
    const selectedFormatted = adjustedDate.toISOString().split('T')[0];

    return events.value.filter(event => {
        // Supabase'den gelen "2026-01-30" ile kıyasla
        return event?.todo_date === selectedFormatted;
    });
});

// const filteredEvents = computed(() => {
//     return selectedDateEvents.value
//         .filter(event => activeFilters.value.has(event?.type))
//         .filter(event => {
//             const searchLower = searchQuery.value.toLowerCase();
//             return event?.title.toLowerCase().includes(searchLower) ||
//                 event?.customer.toLowerCase().includes(searchLower);
//         })
//         .sort((a, b) => new Date(a.start) - new Date(b.start));
// });
const filteredEvents = computed(() => {
    if (!selectedDateEvents.value || selectedDateEvents.value.length === 0) return [];
    return selectedDateEvents.value
        .filter(event => {
            // Eğer hiç filtre seçili değilse hepsini göster
            if (activeFilters.value.size === 0) return true;
            // Seçili filtrelere uygun olanları göster
            return activeFilters.value.has(event.category);
        })
        .filter(event => {
            const searchLower = searchQuery.value.toLowerCase();
            return (event?.title || "").toLowerCase().includes(searchLower);
        })
        .sort((a, b) => (a?.todo_time || "").localeCompare(b?.todo_time || "00:00"));
});
// ============ Renkler ============
const getEventColor = (category) => {
    const colors = {
        'ev_gosterimi': {
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            border: 'border-indigo-500 dark:border-indigo-400',
            text: 'text-indigo-900 dark:text-indigo-200'
        },
        'mulk_sahibi_gorusme': {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-500 dark:border-amber-400',
            text: 'text-amber-900 dark:text-amber-200'
        },
        'evrak_tapu_isleri': {
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-500 dark:border-emerald-400',
            text: 'text-emerald-900 dark:text-emerald-200'
        },
        'fotograf_cekimi': {
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-500 dark:border-rose-400',
            text: 'text-rose-900 dark:text-rose-200'
        },
        'diger': {
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-500 dark:border-purple-400',
            text: 'text-purple-900 dark:text-purple-200'
        }
    };
    return colors[category];
};
// ============ Görev Yönetimi ============
const openAddModal = () => {
    dialogMode.value = 'add';
    editingEventId.value = null;
    newEvent.value = {
        title: "",
        customer: "",
        type: catTypes[0].value,
        description: ""
    };
    newEventDate.value = null;
    newEventTime.value = "";
    submitted.value = false;
    showAddModal.value = true;
};

const openEditModal = (event) => {
    dialogMode.value = 'edit';
    editingEventId.value = event.id;
    newEvent.value = {
        title: event.title,
        customer: event.customer_id,
        type: event.category,
        description: event.todo_notes || ""
    };
    newEventDate.value = new Date(event.todo_date);
    // todo_time formatı "HH:MM:00" olduğundan saat ve dakikayı ayıklıyoruz
    const timeParts = event.todo_time.split(':');
    newEventTime.value = new Date();
    newEventTime.value.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0);
    submitted.value = false;
    showAddModal.value = true;
};

const openViewModal = (event) => {
    dialogMode.value = 'view';
    editingEventId.value = event.id;
    newEvent.value = {
        title: event.title,
        customer: event.customer_id,
        type: event.category,
        description: event.todo_notes || ""
    };
    newEventDate.value = new Date(event.todo_date);
    const timeParts = event.todo_time.split(':');
    newEventTime.value = new Date();
    newEventTime.value.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0);
    showAddModal.value = true;
};

const closeAddModal = () => {
    showAddModal.value = false;
    dialogMode.value = 'add';
    editingEventId.value = null;
    newEvent.value = {
        title: null,
        customer: null,
        type: catTypes[0].label,
        description: null
    };
    newEventDate.value = null;
    newEventTime.value = null;
    submitted.value = false;
};

const saveEvent = async () => {
    if (!newEventDate.value || !newEventTime.value || !newEvent.value.title.trim()) {
        submitted.value = true;
        toast.add({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen tüm zorunlu alanları doldurunuz!', life: 3000 });
        return;
    }

    try {
        const timeString = new Date(newEventTime.value).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const eventData = {
            title: newEvent.value.title,
            customer_id: newEvent.value.customer || null,
            category: newEvent.value.type,
            todo_date: new Date(newEventDate.value.getTime() - (newEventDate.value.getTimezoneOffset() * 60000))
                .toISOString()
                .split('T')[0],
            todo_time: formatTime(timeString) + ":00",
            todo_notes: newEvent.value.description
        };

        if (dialogMode.value === 'add') {
            const { error } = await supabase
                .from('todos')
                .insert([eventData])
                .select();
            if (error) throw error;
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Görev başarıyla eklendi!', life: 3000 });
        } else if (dialogMode.value === 'edit') {
            const { error } = await supabase
                .from('todos')
                .update(eventData)
                .eq('id', editingEventId.value)
                .select();
            if (error) throw error;
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Görev başarıyla güncellendi!', life: 3000 });
        }

        queryClient.invalidateQueries(['todo']);
        closeAddModal();
    } catch (err) {
        submitted.value = false;
        console.error('Beklenmeyen hata:', err);
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Beklenmeyen bir hata oluştu', life: 3000 });
    }
};

// const addEvent = saveEvent;

// const toggleComplete = (eventId) => {
//     const event = events.value.find(e => e.id === eventId);
//     if (event) {
//         event.completed = !event.completed;
//     }
// };

const deleteEvent = async (eventId) => {
    confirm.require({
        message: 'Silmek istediğinize emin misiniz?',
        header: 'Silme Onayı',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'İptal',
        acceptLabel: 'Sil',
        rejectClass: 'p-button-secondary p-button-text',
        acceptClass: 'p-button-danger !text-white !bg-red-600',
        accept: async () => {
            try {
                const { error } = await supabase
                    .from('todos')
                    .delete()
                    .eq('id', eventId);

                if (error) throw error;
                queryClient.invalidateQueries(['todo']);
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Görev başarıyla silindi!', life: 3000 });
                if (selectedEvent.value?.id === eventId) {
                    selectedEvent.value = null;
                }
            } catch (err) {
                console.error('Beklenmeyen hata:', err);
                toast.add({ severity: 'error', summary: 'Hata', detail: 'Beklenmeyen bir hata oluştu', life: 3000 });
            }
        },
        reject: () => {
            console.log("Silme iptal edildi.");
            toast.add({ severity: 'warn', summary: 'İptal', detail: 'Silme işlemi iptal edilidi.', life: 3000 });
        }
    });
};
</script>