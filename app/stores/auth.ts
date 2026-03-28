import type { AuthProvider, AuthUser } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const user = ref<AuthUser | null>(null)
  const authProvider = ref<AuthProvider>('guest')
  const guestId = ref<string>('')
  const token = ref<string>('')

  const isGuest = computed(() => authProvider.value === 'guest')

  function setUser(authUser: AuthUser, authToken: string) {
    user.value = authUser
    token.value = authToken
    authProvider.value = authUser.provider
    isLoggedIn.value = true
  }

  function clearUser() {
    user.value = null
    token.value = ''
    authProvider.value = 'guest'
    isLoggedIn.value = false
  }

  function setGuestId(id: string) {
    guestId.value = id
  }

  return {
    isLoggedIn,
    user,
    authProvider,
    guestId,
    token,
    isGuest,
    setUser,
    clearUser,
    setGuestId,
  }
}, {
  persist: {
    pick: ['isLoggedIn', 'user', 'authProvider', 'guestId', 'token'],
  },
})
