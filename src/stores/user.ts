import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { User } from "@/types/User"

export const useUserStore = defineStore("user", () => {
  const currentUser = ref<User>({
    id: 0,
    name: "",
    createdAt: "",
  })
  const loggedIn = ref<boolean>(false)

  function getUserInfo(userId: number) {
    const user: User = {
      id: userId,
      name: "",
      createdAt: "",
    }
    return user
  }

  // TODO: actually call the API server, auth the user and get their info
  function login(name: string, password: string) {
    currentUser.value = {
      id: 1,
      name: name,
      createdAt: "2023-07-02 13:40:19",
    }
    loggedIn.value = true
  }

  function logout() {
    currentUser.value = {
      id: 0,
      name: "",
      createdAt: "",
    }
    loggedIn.value = false
  }

  return { currentUser, loggedIn, login, logout, getUserInfo }
})
