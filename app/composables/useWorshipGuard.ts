export function useWorshipGuard() {
  const worshipStore = useWorshipStore()
  const route = useRoute()

  function guard() {
    // 儀式未啟動時，非 index 頁面導回 index
    if (!worshipStore.isActive) {
      if (route.path !== '/worship') {
        navigateTo('/worship')
        return false
      }
      return true
    }

    // 檢查當前路由是否在步驟序列中
    const stepIndex = worshipStore.steps.findIndex(s => s.route === route.path)
    if (stepIndex === -1) return true

    // 禁止跳過步驟
    if (stepIndex > worshipStore.currentStepIndex) {
      const currentStep = worshipStore.currentStep
      if (currentStep) {
        navigateTo(currentStep.route)
      }
      return false
    }

    return true
  }

  return { guard }
}
