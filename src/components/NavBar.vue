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
      </div>
      <div v-else class="nav-bar-item" role="link" @click="navigate">
        {{ route.title }}
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
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const topRoutes = [
  {
    title: "GLOB",
    requireLogin: false,
    to: { name: "global" }
  },
  {
    title: "PRIV",
    requireLogin: true,
    to: { name: "private" }
  },
  {
    title: "PERS",
    requireLogin: true,
    to: { name: "personal" }
  },
]

const bottomRoutes = [
  {
    title: "ABT",
    requireLogin: false,
    to: { name: "about" }
  },
  {
    title: "LOG OUT",
    requireLogin: true,
    to: { name: "login" }
  },
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
</style>
