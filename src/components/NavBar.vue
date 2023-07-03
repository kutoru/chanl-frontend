<template>
  <div class="nav-bar">
    <RouterLink
      v-for="route, index in topRoutes"
      :key="index"
      :to="route.to"
      custom
      v-slot="{ navigate }"
    >
      <div v-if="index+1 !== topRoutes.length" class="nav-bar-item" style="margin-bottom: 0;" role="link" @click="navigate">
        {{ route.title }}
        <div class="tooltip">{{ route.desc }}</div>
      </div>
      <div v-else class="nav-bar-item" role="link" @click="navigate">
        {{ route.title }}
        <div class="tooltip">{{ route.desc }}</div>
      </div>
    </RouterLink>

    <div style="flex: 1 1 auto;"></div>

    <RouterLink
      v-for="route, index in bottomRoutes"
      :key="index"
      :to="route.to"
      custom
      v-slot="{ navigate }"
    >
      <div class="nav-bar-item" style="margin-top: 0;" role="link" @click="navigate">
        {{ route.title }}
        <div class="tooltip">{{ route.desc }}</div>
      </div>
    </RouterLink>

    <div v-if="loggedIn" class="nav-bar-item" style="margin-top: 0;" role="link" @click="logout">
      LOG OUT
      <div class="tooltip">Log out of<br>your account</div>
    </div>
    <!-- TODO: if the user is not logged in, make this into a router link and send the user to the login page -->
    <div v-else class="nav-bar-item" style="margin-top: 0;" role="link" @click="login('Kut', '1234')">
      LOG IN
      <div class="tooltip">Log into<br>your account</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const userStore = useUserStore()
const { currentUser, loggedIn } = storeToRefs(userStore)
const { login, logout } = userStore

const topRoutes = [
  {
    title: "GLOB",
    desc: "Global\nchannel",
    requireLogin: false,
    to: { name: "global" }
  },
  {
    title: "PRIV",
    desc: "Private\nchannel",
    requireLogin: true,
    to: { name: "private" }
  },
  {
    title: "PERS",
    desc: "Personal\nchannel",
    requireLogin: true,
    to: { name: "personal" }
  },
]

const bottomRoutes = [
  {
    title: "ABT",
    desc: "About this\nwebsite",
    requireLogin: false,
    to: { name: "about" }
  },
  // {
  //   title: "LOG IN",
  //   desc: "Log into\nyour account",
  //   requireLogin: false,
  //   to: { name: "login" }
  // },
]

// 100vh in css is incorrect for some mobile browsers, this function gets actual 100vh
function calculateTrueVH() {
  let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  const navBar = document.getElementsByClassName("nav-bar")[0]
  if (navBar) {
    navBar.setAttribute("style", `height: ${vh}px;`)
  }
}

window.addEventListener("resize", calculateTrueVH, true)

onMounted(() => {
  calculateTrueVH()
})
</script>

<style scoped>
.nav-bar {
  background-color: rgb(35, 70, 70);
  top: 0;
  right: 0;
  bottom: 0;
  width: 75px;
  height: 100vh;
  position: fixed;

  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  transition: box-shadow 200ms ease-out, text-shadow 200ms ease-out;

  display: flex;
  flex-flow: column;

  transition: height 100ms ease-out;
}
.nav-bar:hover {
  box-shadow: 0px 0px 5px 1px rgba(50, 200, 200, 0.5);
}
.nav-bar-item {
  margin: 10px;
  width: 55px;
  height: 55px;
  background-color: rgb(45, 90, 90);
  border-radius: 10px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  transition: all 200ms ease-out;
  cursor: pointer;
  user-select: none;
  font-size: 15px;
  font-weight: bold;
  flex: 0 0 auto;

  position: relative;

  /* centering text */
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.nav-bar-item:hover {
  box-shadow: 0px 0px 5px 1px rgba(50, 200, 200, 0.5);
  text-shadow: 0px 0px 10px rgb(60, 255, 255);
}
.nav-bar-item .tooltip {
  width: fit-content;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  border-radius: 5px;
  text-shadow: none;
  padding: 5px;
  white-space: pre;

  transition: all 100ms ease-out;
  scale: 0;

  position: absolute;
  z-index: 1;
  right: 125%;
}
.nav-bar-item .tooltip::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -7px;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.5);
}
.nav-bar-item:hover .tooltip {
  scale: 1;
}
.nav-bar-item .tooltip:hover {
  scale: 0;
}
</style>
