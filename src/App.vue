<template>
  <NavBar />
  <div class="content">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"
import { useUserStore } from "@/stores/user"
import NavBar from "@/components/NavBar.vue"
import { onMounted } from "vue";

const userStore = useUserStore()
const { login } = userStore

function calculateTrueVH() {
  let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  const content = document.getElementsByClassName("content")[0]
  if (content) {
    content.setAttribute("style", `height: ${vh}px;`)
  }
}

window.addEventListener("resize", calculateTrueVH, true)

onMounted(() => {
  calculateTrueVH()
})

login("Kut", "1234")
</script>

<style scoped>
.content {
  /* background-color: rgb(25, 50, 50); */
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.5);

  padding: 0 5px 0 5px;
  margin: 0 75px 0 0;
  max-width: 1075px;
  height: 100vh;
  min-height: 500px;
  display: flex;
  flex-direction: column;

  transition: height 100ms ease-out;
}

@media only screen and (min-width: 1150px) {
  .content{
    margin-right: auto;
    margin-left: auto;
    max-width: 1000px;
  }
}
</style>
