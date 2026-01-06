<template>
    <div class="h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 ">
        <div class="w-full h-full overflow-hidden grid grid-cols-1 lg:grid-cols-2">

            <!-- Left: Illustration / Gradient -->
            <div class="hidden lg:flex items-center justify-center p-10 " :style="bgStyle">
                <!-- <div class="text-center text-white px-6">
                    <h2 class="text-3xl font-bold mb-2">Emlak Portföy</h2>
                    <p class="opacity-90">Hızlı, güvenli ve modern portföy yönetimi ile işinizi büyütün.</p>
                </div> -->
            </div>

            <!-- Right: Form -->
            <div class="bg-white dark:bg-slate-900 p-8 lg:p-12 flex flex-col justify-center">
                <div class="max-w-md mx-auto w-full">
                    <div class="flex items-center justify-center mb-8">
                        <img src="@/assets/logo.jpeg" alt="logo" class="w-80 h-auto" />
                    </div>
                    <!--  <h3 class="text-2xl font-semibold text-center mb-5">Giriş Yap</h3> -->

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div class="mb-3">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-user" />
                                </InputIcon>
                                <InputText id="input" v-model="email" type="text"
                                    placeholder="E-posta veya kullanıcı adı" autofocus fluid class="loginInput" />
                            </IconField>
                        </div>

                        <div class="mb-5">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-key" />
                                </InputIcon>
                                <Password v-model="password" :feedback="false" toggleMask placeholder="Şifre"
                                    class="w-full loginInput" fluid />
                            </IconField>
                        </div>

                        <div>
                            <Button type="submit" label="Giriş Yap" :loading="loading" class="w-full p-button-red" />
                        </div>
                    </form>

                    <!-- <div class="my-6 flex items-center gap-3">
                        <div class="flex-1 h-px bg-slate-200"></div>
                        <div class="text-sm text-slate-400">veya</div>
                        <div class="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button class="py-2 px-4 rounded-lg border flex items-center justify-center gap-2 hover:bg-slate-50">
                            <i class="pi pi-google text-red-500" /> Google
                        </button>
                        <button class="py-2 px-4 rounded-lg border flex items-center justify-center gap-2 hover:bg-slate-50">
                            <i class="pi pi-facebook text-blue-600" /> Facebook
                        </button>
                    </div> -->
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import loginBackground from '@/assets/loginbackground.jpg';
import { useToast } from 'primevue/usetoast';
import { supabase } from '@/supabase';

const email = ref('');
const password = ref('');
const loading = ref(false);
const toast = useToast();

const bgStyle = computed(() => {
    return {
        padding: 0,
        margin: 0,
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh'
    };
});
const handleSubmit = async () => {
    if (!email.value || !password.value) {
        toast.add({ severity: 'warn', summary: 'Hata', detail: 'E-posta ve şifre girin', life: 3000 });
        return;
    }

    loading.value = true;
    
    // Supabase Auth Giriş İşlemi
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        toast.add({ severity: 'error', summary: 'Giriş Başarısız', detail: 'Bilgilerinizi kontrol edin', life: 3000 });
        console.error("Auth hatası:", error.message);
    } else {
        toast.add({ severity: 'success', summary: 'Hoş Geldiniz', detail: 'Başarıyla giriş yapıldı', life: 2000 });
        console.log("Kullanıcı verisi:", data.user);
        // Burada kullanıcıyı Dashboard sayfasına yönlendireceğiz
    }
    
    loading.value = false;
};
// function handleSubmit() {
//     loading.value = true;
//     setTimeout(() => {
//         loading.value = false;
//     }, 900);
// }
</script>

<style>
.p-button.p-button-red {
    background: #DE5028;
    border: none !important;
    color: white !important;
    box-shadow: 0 6px 18px rgba(255, 75, 39, 0.18);
}

.p-button.p-button-red:hover {
    background: #ec623c !important;
}

.p-button.p-button-red:disabled {
    opacity: 0.7;
}

.loginInput:enabled:focus,
.p-password-input:enabled:focus {
    border-color: #DE5028 !important;
}
</style>