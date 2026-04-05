export function useIncenseNotification() {
  const permissionGranted = ref(false)
  const supported = ref(false)

  function checkSupport() {
    supported.value = 'Notification' in window && 'serviceWorker' in navigator
    permissionGranted.value = supported.value && Notification.permission === 'granted'
  }

  async function requestPermission(): Promise<boolean> {
    if (!supported.value) return false
    if (Notification.permission === 'granted') {
      permissionGranted.value = true
      return true
    }
    if (Notification.permission === 'denied') return false

    const result = await Notification.requestPermission()
    permissionGranted.value = result === 'granted'
    return permissionGranted.value
  }

  /**
   * 降級方案：不支援通知時顯示 in-app 提示
   * 回傳是否需要使用降級方案
   */
  function needsFallback(): boolean {
    return !supported.value || Notification.permission === 'denied'
  }

  onMounted(() => {
    checkSupport()
  })

  return {
    supported,
    permissionGranted,
    requestPermission,
    needsFallback,
  }
}
