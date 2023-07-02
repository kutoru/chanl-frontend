import { createRouter, createWebHistory } from "vue-router"
// import HomeView from "../views/HomeView.vue"
const GlobalView = () => import("@/views/GlobalView.vue")
const PrivateView = () => import("@/views/PrivateView.vue")
const PersonalView = () => import("@/views/PersonalView.vue")
const AboutView = () => import("@/views/AboutView.vue")
const LoginView = () => import("@/views/LoginView.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "global",
      component: GlobalView,
    },
    {
      path: "/private",
      name: "private",
      component: PrivateView,
    },
    {
      path: "/personal",
      name: "personal",
      component: PersonalView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
})

export default router
