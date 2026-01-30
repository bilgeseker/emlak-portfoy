import { createRouter, createWebHashHistory } from "vue-router"
import LoginView from "@/views/LoginView.vue";
import EstateList from "@/views/EstateList.vue";
import EstateDetails from "@/views/EstateDetails.vue";
import OwnerList from "@/views/OwnerList.vue";
import AddEstate from "@/views/AddEstate.vue";
import OwnerDetails from "@/views/OwnerDetails.vue";
import ToDoList from "@/views/ToDoList.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "giris",
            component: LoginView,
            meta: { requiresAuth: false }
        }, {
            path: "/estateList",
            name: "evListesi",
            component: EstateList,
            meta: { requiresAuth: true }
        }, {
            path: "/estateDetails/:id",
            name: "evDetaylari",
            component: EstateDetails,
            meta: { requiresAuth: true }
        }, {
            path: "/ownerList",
            name: "musteriListesi",
            component: OwnerList,
            meta: { requiresAuth: true }
        }, {
            path: "/addEstate",
            name: "evEkle",
            component: AddEstate,
            meta: { requiresAuth: true }
        }, {
            path: "/owner/:id",
            name: "ownerDetails",
            component: OwnerDetails,
            meta: { requiresAuth: true }
        }, {
            path: "/todo",
            name: "ToDoList",
            component: ToDoList,
            meta: { requiresAuth: true }
        }
    ],
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
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