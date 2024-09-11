// stores/user.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const username = ref('')

  function setUsername(newUsername: string) {
    username.value = newUsername
  }

  function getUsername() {
    return username.value
  }

  function clearUsername() {
    username.value = ''
  }

  return { username, setUsername, getUsername, clearUsername }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage, // or sessionStorage for session-based persistence
  }
})
