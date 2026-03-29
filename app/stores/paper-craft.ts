import { defineStore } from 'pinia'
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

export const usePaperCraftStore = defineStore('paper-craft', {
  state: () => ({
    phase: 'selecting' as PaperCraftPhase,
    burnList: [] as BurnListItem[],
    animationLevel: 'standard' as 'fine' | 'standard' | 'simple',
    // 焚燒進度
    currentBurningIndex: 0,
    totalBurned: 0,
  }),

  getters: {
    totalItems(): number {
      return this.burnList.length
    },

    currentBurningItem(): BurnListItem | null {
      return this.burnList[this.currentBurningIndex] ?? null
    },

    totalPaperGrams(): number {
      return this.burnList.length * PAPER_CRAFT_GRAMS
    },

    particleConfig(): { maxParticles: number, targetFps: number } {
      switch (this.animationLevel) {
        case 'fine': return { maxParticles: 200, targetFps: 60 }
        case 'standard': return { maxParticles: 100, targetFps: 30 }
        case 'simple': return { maxParticles: 40, targetFps: 30 }
      }
    },
  },

  actions: {
    addItem(item: PaperCraftItem) {
      // 預設物品：避免重複加入
      if (!item.isCustom && this.burnList.some(i => i.id === item.id)) return
      this.burnList.push({
        id: item.id,
        name: item.name,
        categoryId: item.categoryId,
        isCustom: item.isCustom,
      })
    },

    removeItem(index: number) {
      this.burnList.splice(index, 1)
    },

    clearList() {
      this.burnList = []
    },

    addCustomItem(name: string) {
      const trimmed = name.trim()
      if (!trimmed) return
      this.burnList.push({
        id: `custom-${Date.now()}`,
        name: trimmed,
        categoryId: 'custom',
        isCustom: true,
      })
    },

    isItemSelected(itemId: string): boolean {
      return this.burnList.some(i => i.id === itemId)
    },

    setAnimationLevel(level: 'fine' | 'standard' | 'simple') {
      this.animationLevel = level
    },

    startBurning() {
      this.phase = 'burning'
      this.currentBurningIndex = 0
      this.totalBurned = 0
    },

    advanceToNext() {
      this.totalBurned++
      if (this.currentBurningIndex + 1 < this.burnList.length) {
        this.currentBurningIndex++
      }
    },

    complete() {
      this.phase = 'completed'
    },

    reset() {
      this.phase = 'selecting'
      this.burnList = []
      this.currentBurningIndex = 0
      this.totalBurned = 0
    },
  },
})
