<template>
  <UserBar />
  <div class="content">
    <RouterView />
  </div>
  <NavBar />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"
import { useUserStore } from "@/stores/user"
import NavBar from "@/components/NavBar.vue"
import UserBar from "@/components/UserBar.vue"
import { onMounted } from "vue";

const userStore = useUserStore()
const { login } = userStore

// 100vh in css is incorrect for some mobile browsers, this function gets actual 100vh
function calculateTrueVH() {
  let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

  const content = document.getElementsByClassName("content")[0]
  content?.setAttribute("style", `height: ${vh}px;`)
  const navBar = document.getElementsByClassName("nav-bar")[0]
  navBar?.setAttribute("style", `height: ${vh}px;`)
  const userBar = document.getElementsByClassName("user-bar")[0]
  userBar?.setAttribute("style", `height: ${vh}px;`)
}

window.addEventListener("resize", calculateTrueVH, true)

onMounted(() => {
  calculateTrueVH()
})

login("Kut", "1234")
</script>

<style>
.content {
  /* background-color: rgb(25, 50, 50); */
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);

  /* padding: 0 5px 0 5px; */
  margin: 0 15px 0 15px;
  max-width: 2000px;
  height: 100vh;
  min-height: 500px;
  display: flex;
  flex-direction: column;

  transition: height 100ms ease-out;
}
.nav-bar {
  right: -135px;
}
.user-bar {
  left: -135px
}

@media only screen and (min-width: 1300px) {
  .content {
    margin-right: auto;
    margin-left: auto;
    max-width: 1000px;
  }
  .nav-bar {
    right: 0;
  }
  .user-bar {
    left: 0;
  }
}
</style>
