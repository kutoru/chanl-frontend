<template>
  <NavBar />
  <div class="content">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"
import NavBar from "./components/NavBar.vue";
</script>

<style scoped>
.content {
  padding: 0 5px 0 5px;
  margin: 0 75px 0 0;
  max-width: 1075px;
  height: 100vh;
}

@media only screen and (min-width: 1150px) {
  .content{
    margin-right: auto;
    margin-left: auto;
    max-width: 1000px;
  }
}
</style>
