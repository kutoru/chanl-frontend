import { createRouter, createWebHistory } from "vue-router"

const GlobalView = () => import("@/views/GlobalView.vue")
const ChannelView = () => import("@/views/ChannelView.vue")
const AboutView = () => import("@/views/AboutView.vue")
const LoginView = () => import("@/views/LoginView.vue")
const ProfileView = () => import("@/views/ProfileView.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "global",
      component: GlobalView,
    },
    {
      path: "/channel/:channelId",
      name: "channel",
      component: ChannelView,
      props: true,
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
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
  ],
})

export default router
