export type WorshipMode = 'deity' | 'ancestor'

export interface WorshipStep {
  id: string
  route: string
  label: string
}

// 神明對應建議金紙
const DEITY_JOSS_PAPER_MAP: Record<string, string[]> = {
  'deity-tiangong': ['da-bai-shou-jin', 'shou-jin'],
  'deity-mazu': ['shou-jin', 'gua-jin'],
  'deity-guanyin': ['shou-jin', 'gua-jin'],
  'deity-guanyu': ['shou-jin', 'gua-jin'],
  'deity-tudi': ['fu-jin', 'gua-jin'],
  'deity-wenchang': ['gua-jin'],
  'deity-yuelao': ['gua-jin'],
  'deity-baosheng': ['shou-jin', 'gua-jin'],
  'deity-dizang': ['shou-jin'],
}

const DEITY_STEPS: WorshipStep[] = [
  { id: 'deity-select', route: '/worship/deity-select', label: '選擇神明' },
  { id: 'offering', route: '/worship/offering', label: '供品擺設' },
  { id: 'incense', route: '/worship/incense', label: '焚香' },
  { id: 'prayer', route: '/worship/prayer', label: '祈禱' },
  { id: 'divination', route: '/worship/divination', label: '擲筊' },
  { id: 'joss-paper', route: '/worship/joss-paper', label: '燒金紙' },
  { id: 'summary', route: '/worship/summary', label: '完成' },
]

const ANCESTOR_STEPS: WorshipStep[] = [
  { id: 'ancestor-setup', route: '/worship/ancestor-setup', label: '祭拜設定' },
  { id: 'offering', route: '/worship/offering', label: '記錄供品' },
  { id: 'incense', route: '/worship/incense', label: '焚香' },
  { id: 'prayer', route: '/worship/prayer', label: '祈禱' },
  { id: 'joss-paper', route: '/worship/joss-paper', label: '燒金紙' },
  { id: 'paper-craft', route: '/worship/paper-craft', label: '燒紙紮' },
  { id: 'summary', route: '/worship/summary', label: '完成' },
]

export const useWorshipStore = defineStore('worship', () => {
  // --- State ---
  const mode = ref<WorshipMode | null>(null)
  const currentStepIndex = ref(0)
  const isActive = ref(false)

  // 拜神明資料
  const selectedDeityId = ref<string | null>(null)

  // 祭祖資料
  const ancestorName = ref('')
  const ancestorLocation = ref('')

  // 共用資料
  const prayerContent = ref('')

  // --- Getters ---
  const steps = computed<WorshipStep[]>(() => {
    if (mode.value === 'deity') return DEITY_STEPS
    if (mode.value === 'ancestor') return ANCESTOR_STEPS
    return []
  })

  const currentStep = computed(() => steps.value[currentStepIndex.value] ?? null)
  const totalSteps = computed(() => steps.value.length)
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === steps.value.length - 1)
  const isSummaryStep = computed(() => currentStep.value?.id === 'summary')

  const recommendedJossPaper = computed(() => {
    if (mode.value === 'ancestor') return ['yin-zhi']
    if (selectedDeityId.value) {
      return DEITY_JOSS_PAPER_MAP[selectedDeityId.value] ?? ['gua-jin']
    }
    return ['gua-jin']
  })

  const selectedDeity = computed(() => {
    if (!selectedDeityId.value) return null
    // 從靜態資料取得（在元件中 import）
    return selectedDeityId.value
  })

  // --- Actions ---
  function startCeremony(worshipMode: WorshipMode) {
    mode.value = worshipMode
    currentStepIndex.value = 0
    isActive.value = true
    prayerContent.value = ''
    selectedDeityId.value = null
    ancestorName.value = ''
    ancestorLocation.value = ''
  }

  function nextStep() {
    if (currentStepIndex.value < steps.value.length - 1) {
      currentStepIndex.value++
      const step = steps.value[currentStepIndex.value]
      if (step) {
        navigateTo(step.route)
      }
    }
  }

  function prevStep() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
      const step = steps.value[currentStepIndex.value]
      if (step) {
        navigateTo(step.route)
      }
    }
  }

  function goToStep(index: number) {
    if (index >= 0 && index < steps.value.length && index <= currentStepIndex.value) {
      currentStepIndex.value = index
      const step = steps.value[index]
      if (step) {
        navigateTo(step.route)
      }
    }
  }

  function goToStepByRoute(route: string) {
    const index = steps.value.findIndex(s => s.route === route)
    if (index !== -1) {
      currentStepIndex.value = index
    }
  }

  function setDeity(deityId: string) {
    selectedDeityId.value = deityId
  }

  function setAncestor(name: string, location: string) {
    ancestorName.value = name
    ancestorLocation.value = location
  }

  function setPrayer(content: string) {
    prayerContent.value = content
  }

  function reset() {
    mode.value = null
    currentStepIndex.value = 0
    isActive.value = false
    selectedDeityId.value = null
    ancestorName.value = ''
    ancestorLocation.value = ''
    prayerContent.value = ''
  }

  return {
    // State
    mode,
    currentStepIndex,
    isActive,
    selectedDeityId,
    ancestorName,
    ancestorLocation,
    prayerContent,
    // Getters
    steps,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    isSummaryStep,
    recommendedJossPaper,
    selectedDeity,
    // Actions
    startCeremony,
    nextStep,
    prevStep,
    goToStep,
    goToStepByRoute,
    setDeity,
    setAncestor,
    setPrayer,
    reset,
  }
})
