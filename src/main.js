import { createApp } from 'vue'
import App from './App.vue'
import './style.css'; 
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router/index.js'
// import ToastService from 'primevue/toastservice';

import 'primeicons/primeicons.css'

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        }
    }
});
app.use(router)
// app.use(ToastService);
app.mount('#app')
