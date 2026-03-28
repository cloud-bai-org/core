export type DivinationResult = 'holy' | 'laughing' | 'negative'

export interface DivinationRecord {
  result: DivinationResult
  timestamp: number
}

export const RESULT_LABELS: Record<DivinationResult, { name: string; description: string }> = {
  holy: { name: '聖筊', description: '神明同意' },
  laughing: { name: '笑筊', description: '神明微笑不語' },
  negative: { name: '陰筊', description: '神明不同意' },
}

function generateResult(): DivinationResult {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const value = array[0]! / (0xFFFFFFFF + 1)

  if (value < 0.5) return 'holy'
  if (value < 0.75) return 'laughing'
  return 'negative'
}

export const useDivinationStore = defineStore('divination', () => {
  const isAnimating = ref(false)
  const currentResult = ref<DivinationResult | null>(null)
  const history = ref<DivinationRecord[]>([])

  function throwBlocks() {
    if (isAnimating.value) return

    isAnimating.value = true
    currentResult.value = generateResult()
  }

  function onAnimationComplete() {
    isAnimating.value = false
    if (currentResult.value) {
      history.value.push({
        result: currentResult.value,
        timestamp: Date.now(),
      })
    }
  }

  function reset() {
    isAnimating.value = false
    currentResult.value = null
    history.value = []
  }

  return {
    isAnimating,
    currentResult,
    history,
    throwBlocks,
    onAnimationComplete,
    reset,
  }
})
