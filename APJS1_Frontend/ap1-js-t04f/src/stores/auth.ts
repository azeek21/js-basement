import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getMockUser } from '@/lib/services/user'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | undefined>()
  const token = ref('')
  const refreshToken = ref('')
  const expires = ref('')

  async function signOut() {
    isAuthenticated.value = false
    user.value = undefined
    token.value = ''
    refreshToken.value = ''
  }

  return {
    isAuthenticated,
    user,
    refreshToken,
    token,
    expires,
    signOut,
  }
})
