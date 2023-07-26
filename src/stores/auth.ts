import { ref } from "vue"
import { defineStore } from "pinia"
import type { User } from "@/types/User"
import { apiurl, fetchWithTimeout } from "@/global"
import { useChannelStore } from "@/stores/channel"

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<User>({
    id: 0,
    name: "",
    password: "",
    createdAt: "",
  })
  const loggedIn = ref<boolean>(false)

  async function signup(name: string, password: string): Promise<string> {
    let error = ""

    const user: User = {
      id: 0,
      name: name,
      password: password,
      createdAt: "",
    }

    const userResult: User | undefined = await fetchWithTimeout(`http://${apiurl}/create-user`, {
      method: "POST",
      body: JSON.stringify(user),
      credentials: "include",
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw response.text()
        }
      })
      .catch(err => {
        error = err as string
        console.log(error)
        return undefined
      })

    if (!userResult) {
      return error
    }

    currentUser.value = userResult
    loggedIn.value = true
    return ""
  }

  // Returns potential error
  async function login(name: string, password: string): Promise<string> {
    let error = ""

    const user: User = {
      id: 0,
      name: name,
      password: password,
      createdAt: "",
    }

    const userResult: User | undefined = await fetchWithTimeout(`http://${apiurl}/auth-user`, {
      method: "POST",
      body: JSON.stringify(user),
      credentials: "include",
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw response.text()
        }
      })
      .catch(err => {
        error = err as string
        console.log(error)
        return undefined
      })

    if (!userResult) {
      return error
    }

    currentUser.value = userResult
    loggedIn.value = true
    return ""
  }

  async function loginWithToken(): Promise<boolean> {
    const receivedUser: User | undefined = await fetchWithTimeout(`http://${apiurl}/auth-with-token`, {
      method: "GET",
      credentials: "include",
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return undefined
        }
      })
      .catch(error => {
        console.log(error)
        return undefined
      })

    if (!receivedUser) {
      return false
    }

    currentUser.value = receivedUser
    loggedIn.value = true
    return true
  }

  async function logout(): Promise<boolean> {
    // try to logout the user in the backend as well
    const success: boolean = await fetchWithTimeout(`http://${apiurl}/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return false
        }
      })
      .catch(error => {
        console.log(error)
        return false
      })

    if (!success) {
      return false
    }

    currentUser.value = {
      id: 0,
      name: "",
      password: "",
      createdAt: "",
    }
    loggedIn.value = false
    return true
  }

  function forceLogout() {
    currentUser.value = {
      id: 0,
      name: "",
      password: "",
      createdAt: "",
    }
    loggedIn.value = false

    const channelStore = useChannelStore()
    const { unloadChannel } = channelStore
    unloadChannel()
  }

  async function refreshAuthToken(): Promise<boolean> {
    const receivedUser: User | undefined = await fetchWithTimeout(`http://${apiurl}/auth-with-token`, {
      method: "GET",
      credentials: "include",
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return undefined
        }
      })
      .catch(error => {
        console.log(error)
        return undefined
      })

    if (!receivedUser || currentUser.value.id != receivedUser.id) {
      return false
    }

    return true
  }

  return { currentUser, loggedIn, signup, login, loginWithToken, logout, forceLogout, refreshAuthToken }
})
