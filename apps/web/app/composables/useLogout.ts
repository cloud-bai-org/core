export function useLogout() {
  const authStore = useAuthStore()
  const router = useRouter()

  function logout() {
    authStore.clearUser()
    router.replace('/')
  }

  return { logout }
}
