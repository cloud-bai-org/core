import { fetchUserData, mergeGuestRecords } from '~/services/api'

export function usePostLogin() {
  const authStore = useAuthStore()
  const guestRecords = useGuestRecords()

  async function syncAfterLogin() {
    if (!authStore.isLoggedIn || !authStore.token) return

    const unsyncedRecords = guestRecords.getUnsyncedRecords()
    if (unsyncedRecords.length > 0 && authStore.guestId) {
      await mergeGuestRecords(authStore.token, authStore.guestId, unsyncedRecords)
      guestRecords.markAllSynced()
    }

    await fetchUserData(authStore.token)
  }

  return { syncAfterLogin }
}
