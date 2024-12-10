import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const userId = ref('')

  function setUser(name: string) {
    username.value = name
    userId.value = `user-${Math.random().toString(36).substr(2, 9)}`
  }

  function clearUser() {
    username.value = ''
    userId.value = ''
  }

  return {
    username,
    userId,
    setUser,
    clearUser
  }
})