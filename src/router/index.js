import { createRouter, createWebHashHistory } from "vue-router"
import LoginView from "@/views/LoginView.vue";
import EstateList from "@/views/EstateList.vue";
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "giris",
            component: LoginView,
            meta: { requiresAuth: false }
        },{
            path: "/estateList",
            name: "evListesi",
            component: EstateList
            // meta: { requiresAuth: true, is_admin: true }
        }
    ]
})
// router.beforeEach(async (to, from, next) => {
//   const userid = localStorage.getItem("userid");
//   const isadmin = localStorage.getItem("is_admin") === "true";
//   if (to.meta.requiresAuth && !userid) {
//     next('/')
//   } else if (to.meta.is_admin) {
//     console.log("Rota için admin kontrolü:", to.meta.is_admin, "Kullanıcı is_admin değeri:", isadmin);
//     if (isadmin == to.meta.is_admin) {
//       next() // Rol eşleşiyorsa izin ver
//     } else {
//       next('/customerList') // Yetkisi yoksa ana sayfaya at
//     }
//   } else {
//     next()
//   }
// })
export default router;