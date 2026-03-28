export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn && !authStore.guestId) {
    authStore.setGuestId(generateGuestId())
  }
})

function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
