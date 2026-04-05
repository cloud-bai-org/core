import { useIncenseStore } from '~/stores/incense'
import { useIncenseDB } from '~/composables/useIncenseDB'

export function useIncenseTimer() {
  const store = useIncenseStore()
  const { saveEndTime, getEndTime, clearEndTime } = useIncenseDB()

  let progressInterval: ReturnType<typeof setInterval> | null = null

  function startProgressTracking() {
    stopProgressTracking()
    progressInterval = setInterval(() => {
      store.updateProgress()
      if (store.phase === 'completed') {
        stopProgressTracking()
      }
    }, 100)
  }

  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }

  async function lightIncense() {
    store.startBurning()

    if (store.endTime) {
      await saveEndTime(store.endTime)
    }

    // lighting 階段短暫顯示後進入 burning
    setTimeout(() => {
      if (store.phase === 'lighting') {
        store.setPhase('burning')
      }
      startProgressTracking()
    }, 1500)

    notifyServiceWorker()
  }

  async function restoreState() {
    const endTime = await getEndTime()
    if (!endTime) return

    store.restoreFromTimestamp(endTime)

    if (store.phase === 'burning') {
      startProgressTracking()
    }
  }

  async function handleComplete() {
    stopProgressTracking()
    await clearEndTime()
  }

  async function extinguish() {
    stopProgressTracking()
    store.setPhase('completed')
    await clearEndTime()
    cancelServiceWorkerTimer()
  }

  async function relight() {
    if (store.remainingRatio <= 0) return

    const remainingMs = store.duration * store.remainingRatio
    const now = Date.now()
    store.startTime = now - (store.duration - remainingMs)
    store.endTime = now + remainingMs
    store.setPhase('burning')

    await saveEndTime(store.endTime)
    startProgressTracking()
    notifyServiceWorker()
  }

  function cancelServiceWorkerTimer() {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({ type: 'INCENSE_TIMER_CANCEL' })
    })
  }

  function notifyServiceWorker() {
    if (!('serviceWorker' in navigator) || !store.endTime) return

    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        type: 'INCENSE_TIMER_START',
        endTime: store.endTime,
      })
    })
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible' && store.isActive) {
      restoreState()
    }
  }

  function setupVisibilityListener() {
    document.addEventListener('visibilitychange', onVisibilityChange)
  }

  function cleanupVisibilityListener() {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    stopProgressTracking()
  }

  return {
    lightIncense,
    extinguish,
    relight,
    restoreState,
    handleComplete,
    setupVisibilityListener,
    cleanupVisibilityListener,
  }
}
