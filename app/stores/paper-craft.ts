import catalogData from '~/data/paper-craft-items.json'

// 紙紮物品分類
export interface PaperCraftCategory {
  id: string
  name: string
  icon: string
  items: PaperCraftItem[]
}

// 紙紮物品品項
export interface PaperCraftItem {
  id: string
  name: string
  categoryId: string
  isCustom: boolean
}

// 焚燒清單中的物品
export interface BurnListItem {
  id: string
  name: string
  categoryId: string
  isCustom: boolean
}

export type PaperCraftPhase =
  | 'selecting'   // 選擇紙紮物品
  | 'burning'     // 焚燒中
  | 'completed'   // 焚燒完成

// 從 JSON 載入分類資料，將品項加上 categoryId 與 isCustom
export const PAPER_CRAFT_CATEGORIES: PaperCraftCategory[] = catalogData.categories.map(cat => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  items: cat.items.map(item => ({
    id: item.id,
    name: item.name,
    categoryId: cat.id,
    isCustom: false,
  })),
}))

// 所有預設品項的扁平列表
export const ALL_PRESET_ITEMS: PaperCraftItem[] = PAPER_CRAFT_CATEGORIES.flatMap(cat => cat.items)

// 紙紮物品等效的實體紙張克數（統一值，紙紮物品較大）
const PAPER_CRAFT_GRAMS = 30

export type AnimationLevel = 'fine' | 'standard' | 'simple'

export const usePaperCraftStore = defineStore('paper-craft', () => {
  const phase = ref<PaperCraftPhase>('selecting')
  const burnList = ref<BurnListItem[]>([])
  const animationLevel = ref<AnimationLevel>('standard')
  const currentBurningIndex = ref(0)
  const totalBurned = ref(0)

  // Getters
  const totalItems = computed(() => burnList.value.length)

  const currentBurningItem = computed(
    () => burnList.value[currentBurningIndex.value] ?? null,
  )

  const totalPaperGrams = computed(() => burnList.value.length * PAPER_CRAFT_GRAMS)

  const particleConfig = computed(() => {
    switch (animationLevel.value) {
      case 'fine': return { maxParticles: 200, targetFps: 60 }
      case 'standard': return { maxParticles: 100, targetFps: 30 }
      case 'simple': return { maxParticles: 40, targetFps: 30 }
    }
  })

  // Actions
  function addItem(item: PaperCraftItem) {
    if (!item.isCustom && burnList.value.some(i => i.id === item.id)) return
    burnList.value.push({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      isCustom: item.isCustom,
    })
  }

  function removeItem(index: number) {
    burnList.value.splice(index, 1)
  }

  function clearList() {
    burnList.value = []
  }

  function addCustomItem(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    burnList.value.push({
      id: `custom-${Date.now()}`,
      name: trimmed,
      categoryId: 'custom',
      isCustom: true,
    })
  }

  function isItemSelected(itemId: string): boolean {
    return burnList.value.some(i => i.id === itemId)
  }

  function setAnimationLevel(level: AnimationLevel) {
    animationLevel.value = level
  }

  function startBurning() {
    phase.value = 'burning'
    currentBurningIndex.value = 0
    totalBurned.value = 0
  }

  function advanceToNext() {
    totalBurned.value++
    if (currentBurningIndex.value + 1 < burnList.value.length) {
      currentBurningIndex.value++
    }
  }

  function complete() {
    phase.value = 'completed'
  }

  function reset() {
    phase.value = 'selecting'
    burnList.value = []
    currentBurningIndex.value = 0
    totalBurned.value = 0
  }

  return {
    // State
    phase,
    burnList,
    animationLevel,
    currentBurningIndex,
    totalBurned,
    // Getters
    totalItems,
    currentBurningItem,
    totalPaperGrams,
    particleConfig,
    // Actions
    addItem,
    removeItem,
    clearList,
    addCustomItem,
    isItemSelected,
    setAnimationLevel,
    startBurning,
    advanceToNext,
    complete,
    reset,
  }
})
