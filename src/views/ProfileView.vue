<template>
  <h1>Profile</h1>
  <span>ID: {{ currentUser.id }}</span><br>
  <span>Name: {{ currentUser.name }}</span><br>
  <span>Account created at: {{ currentUser.createdAt }}</span>
  <button @click.prevent="logoutWrapper">Log out</button>
  <span>{{ info }}</span>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref } from 'vue';

const info = ref<string>("")

const authStore = useAuthStore()
const { currentUser, loggedIn } = storeToRefs(authStore)
const { logout } = authStore

async function logoutWrapper() {
  const success = await logout()
  if (!success) {
    info.value = "Could not log out"
  } else {
    router.push({ name: "login" })
  }
}

onBeforeMount(() => {
  if (!loggedIn.value) {
    router.push({ name: "login" })
  }
})
</script>

<style scoped>
h1, span, button {
  margin: 5px;
}
button {
  width: 250px;
  height: 50px;
  background-color: rgb(25, 25, 25);
}
</style>
