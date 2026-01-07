<template>
    <h1>{{ selectedEstate.title }}</h1>
</template>
<script setup>
import { useRoute } from 'vue-router';
import {ref, computed} from 'vue';

const route = useRoute();
const id = Number(route.params.id);

const selectedEstate = computed(() => {
    return estates.value.find(item => item.id === id);
});

const estates = ref([
    {
        id: 1,
        title: "Beşiktaş'ta Deniz Manzaralı Lüks Dubleks",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Beşiktaş",
        price: 12500000,
        status: "Yayında",
        type: "Daire",
        rooms: "3+1",
        m2: 180
    },
    {
        id: 2,
        title: "Bodrum Yalıkavak'ta Özel Havuzlu Villa",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80",
        city: "Muğla / Bodrum",
        price: 45000000,
        status: "Satıldı",
        type: "Villa",
        rooms: "5+2",
        m2: 450
    },
    {
        id: 3,
        title: "Kadıköy Çarşıda Yatırımlık Ticari Dükkan",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Kadıköy",
        price: 8250000,
        status: "Beklemede",
        type: "İşyeri",
        rooms: "1+0",
        m2: 65
    },
    {
        id: 4,
        title: "Ankara Çankaya'da Modern Bahçe Katı",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80",
        city: "Ankara / Çankaya",
        price: 4200000,
        status: "Yayında",
        type: "Daire",
        rooms: "2+1",
        m2: 110
    },
    {
        id: 5,
        title: "İzmir Mavişehir'de Full Eşyalı Rezidans",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80",
        city: "İzmir / Karşıyaka",
        price: 18750000,
        status: "Yayında",
        type: "Daire",
        rooms: "4+1",
        m2: 220
    },
    {
        id: 6,
        title: "Beşiktaş'ta Deniz Manzaralı Lüks Dubleks",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Beşiktaş",
        price: 12500000,
        status: "Yayında",
        type: "Daire",
        rooms: "3+1",
        m2: 180
    },
    {
        id: 7,
        title: "Bodrum Yalıkavak'ta Özel Havuzlu Villa",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80",
        city: "Muğla / Bodrum",
        price: 45000000,
        status: "Satıldı",
        type: "Villa",
        rooms: "5+2",
        m2: 450
    },
    {
        id: 8,
        title: "Kadıköy Çarşıda Yatırımlık Ticari Dükkan",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80",
        city: "İstanbul / Kadıköy",
        price: 8250000,
        status: "Beklemede",
        type: "İşyeri",
        rooms: "1+0",
        m2: 65
    },
    {
        id: 9,
        title: "Ankara Çankaya'da Modern Bahçe Katı",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80",
        city: "Ankara / Çankaya",
        price: 4200000,
        status: "Yayında",
        type: "Daire",
        rooms: "2+1",
        m2: 110
    },
    {
        id: 10,
        title: "İzmir Mavişehir'de Full Eşyalı Rezidans",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80",
        city: "İzmir / Karşıyaka",
        price: 18750000,
        status: "Yayında",
        type: "Daire",
        rooms: "4+1",
        m2: 220
    }
]);
</script>