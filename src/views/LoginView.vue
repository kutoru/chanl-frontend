<template>
  <div class="login-container">
    <h2 v-if="onLogin">Log In</h2>
    <h2 v-if="!onLogin">Sign Up</h2>

    <label class="input-label">
      <input type="text" v-model="username" :placeholder="'Enter a username'"/>
    </label>
    <label class="input-label">
      <input type="password" v-model="password" :placeholder="'Enter a password'"/>
    </label>

    <button v-if="onLogin" type="button" @click.prevent="loginWrapper">Log in</button>
    <button v-if="!onLogin" type="button" @click.prevent="signupWrapper">Sign up</button>

    <a v-if="onLogin" href="/" @click.prevent="onLogin = false">Or sign up instead</a>
    <a v-if="!onLogin" href="/" @click.prevent="onLogin = true">Or log in instead</a>
    <span class="info">{{ info }}</span>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref, watch } from 'vue';

const MAX_INPUT_CHARS = 20

const username = ref<string>("")
const password = ref<string>("")
const info = ref<string>("")
const onLogin = ref<boolean>(true)

const authStore = useAuthStore()
const { loggedIn } = storeToRefs(authStore)
const { login, signup } = authStore

function sanityCheck() {
  if (loggedIn.value) {
    return "You are already logged in"
  }

  if (username.value.length > MAX_INPUT_CHARS || username.value.length < 4) {
    return "The username is invalid"
  }

  if (password.value.length > MAX_INPUT_CHARS || password.value.length < 4) {
    return "The password is invalid"
  }

  return ""
}

async function loginWrapper() {
  const valueStatus = sanityCheck()
  if (valueStatus.length !== 0) {
    info.value = valueStatus
    return
  }

  const error = await login(username.value, password.value)
  if (error.length !== 0) {
    info.value = error.trim()
  } else {
    info.value = "You have successfully logged in"
    router.push({ name: "profile" })
  }
}

async function signupWrapper() {
  const valueStatus = sanityCheck()
  if (valueStatus.length !== 0) {
    info.value = valueStatus
    return
  }

  const error = await signup(username.value, password.value)
  if (error.length !== 0) {
    info.value = error.trim()
  } else {
    info.value = "You have successfully signed up"
    router.push({ name: "profile" })
  }
}

onBeforeMount(() => {
  if (loggedIn.value) {
    router.push({ name: "profile" })
  }
})

watch(username, (newValue, oldValue) => {
  if (newValue.length > MAX_INPUT_CHARS) {
    username.value = newValue.slice(0, MAX_INPUT_CHARS)
  }
})

watch(password, (newValue, oldValue) => {
  if (newValue.length > MAX_INPUT_CHARS) {
    password.value = newValue.slice(0, MAX_INPUT_CHARS)
  }
})
</script>

<style scoped>
.login-container {
  width: auto;
  margin: 0 5px;
  text-align: center;
}

@media screen and (min-width: 540px) {
  .login-container {
    width: 500px;
    margin: 0 auto;
  }
}

button, a, h2, span, .input-label {
  margin: 5px 0;
}
a {
  display: block;
  padding: 5px 0;
  user-select: none;
  transition: color 100ms ease-in-out;
}
button, input, .input-label {
  background-color: rgb(25, 25, 25);
  transition: background-color 100ms ease-in-out;
  color: white;
  font-size: 15px;
  border-radius: 5px;
}
button {
  display: block;
  width: 100%;
  height: 50px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.25);
}
.input-label {
  display: block;
  width: 100%;
  height: 50px;
  cursor: text;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.25);
}
input {
  margin: 5px;
  width: calc(100% - 10px);
  height: 40px;
}

button:hover, .input-label:hover, .input-label:hover > input {
  background-color: rgb(36, 36, 36);
}
button:active {
  background-color: rgb(50, 50, 50);
}
a:hover {
  color: rgb(75, 115, 170);
}

.info {
  display: block;
}
</style>
