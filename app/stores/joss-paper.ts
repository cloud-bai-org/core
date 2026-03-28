import { defineStore } from 'pinia'

// 金紙種類
export interface JossPaperType {
  id: string
  name: string
  description: string
  sheetsPerBundle: number // 每組張數
  // 視覺外觀
  visual: {
    paperColor: string   // 底紙顏色
    foilColor: string    // 箔片顏色
    foilShine: string    // 箔片光澤高亮色
    borderColor: string  // 紙張邊緣色
  }
  // 粒子參數
  particle: {
    flameColors: [string, string, string] // 內焰、外焰、尖端
    ashColor: string
    burnSpeed: number // 燃燒速度倍率（1 為標準）
    sparkDensity: number // 火花密度倍率
  }
  // 每組金紙等效的實體紙張克數
  paperGrams: number
}

export const JOSS_PAPER_TYPES: JossPaperType[] = [
  {
    id: 'shou-jin',
    name: '壽金',
    description: '祭拜天公、三界公等天神使用',
    sheetsPerBundle: 100,
    visual: {
      paperColor: '#F5DEB3',
      foilColor: '#DAA520',
      foilShine: '#FFD700',
      borderColor: '#D2B48C',
    },
    particle: {
      flameColors: ['#FFD700', '#FF8C00', '#FF4500'],
      ashColor: '#8B8682',
      burnSpeed: 1,
      sparkDensity: 1,
    },
    paperGrams: 12,
  },
  {
    id: 'gua-jin',
    name: '刈金',
    description: '祭拜一般神明使用',
    sheetsPerBundle: 100,
    visual: {
      paperColor: '#FAEBD7',
      foilColor: '#CD950C',
      foilShine: '#EEC900',
      borderColor: '#C4A882',
    },
    particle: {
      flameColors: ['#FFC125', '#FF7F00', '#FF3030'],
      ashColor: '#808080',
      burnSpeed: 1.1,
      sparkDensity: 0.9,
    },
    paperGrams: 8,
  },
  {
    id: 'fu-jin',
    name: '福金',
    description: '祭拜土地公、地基主使用',
    sheetsPerBundle: 100,
    visual: {
      paperColor: '#FFF8DC',
      foilColor: '#B8860B',
      foilShine: '#DAA520',
      borderColor: '#D2C6A5',
    },
    particle: {
      flameColors: ['#FFE4B5', '#FFA500', '#FF6347'],
      ashColor: '#9E9E9E',
      burnSpeed: 0.9,
      sparkDensity: 1.1,
    },
    paperGrams: 10,
  },
  {
    id: 'da-bai-shou-jin',
    name: '大百壽金',
    description: '祭拜玉皇大帝等最高階神明使用',
    sheetsPerBundle: 50,
    visual: {
      paperColor: '#FFFACD',
      foilColor: '#FFD700',
      foilShine: '#FFEC8B',
      borderColor: '#EEE8AA',
    },
    particle: {
      flameColors: ['#FFFACD', '#FFD700', '#FF8C00'],
      ashColor: '#A9A9A9',
      burnSpeed: 0.8,
      sparkDensity: 1.3,
    },
    paperGrams: 18,
  },
  {
    id: 'yin-zhi',
    name: '銀紙',
    description: '祭拜祖先、好兄弟使用',
    sheetsPerBundle: 50,
    visual: {
      paperColor: '#F0EDE4',
      foilColor: '#A8A8A8',
      foilShine: '#C0C0C0',
      borderColor: '#C8C8C0',
    },
    particle: {
      flameColors: ['#C0C0C0', '#B0B0B0', '#FF6347'],
      ashColor: '#696969',
      burnSpeed: 1.2,
      sparkDensity: 0.8,
    },
    paperGrams: 6,
  },
]

export type BurnMode = 'auto' | 'manual'
export type AnimationLevel = 'fine' | 'standard' | 'simple'

export type BurnPhase =
  | 'selecting'     // 選擇金紙
  | 'mode-select'   // 選擇焚燒模式
  | 'burning'       // 焚燒中
  | 'completed'     // 焚燒完成

// 選擇的金紙：id → 組數
export interface SelectedBundle {
  id: string
  bundles: number
}

export interface BurnState {
  phase: BurnPhase
  selectedBundles: SelectedBundle[] // 已選金紙與組數
  burnMode: BurnMode
  animationLevel: AnimationLevel
  // 焚燒進度
  currentBurningIndex: number // 目前正在燒的組 index
  burnProgress: number // 0~1，當前組燃燒進度
  totalBurned: number // 已焚燒完成的組數
}

export const useJossPaperStore = defineStore('joss-paper', {
  state: (): BurnState => ({
    phase: 'selecting',
    selectedBundles: [],
    burnMode: 'auto',
    animationLevel: 'standard',
    currentBurningIndex: 0,
    burnProgress: 0,
    totalBurned: 0,
  }),

  getters: {
    /** 展開所有組為逐組列表（每組對應一個 JossPaperType），供焚燒流程迭代 */
    burnQueue(): JossPaperType[] {
      const queue: JossPaperType[] = []
      for (const sb of this.selectedBundles) {
        const type = JOSS_PAPER_TYPES.find(p => p.id === sb.id)
        if (!type) continue
        for (let i = 0; i < sb.bundles; i++) {
          queue.push(type)
        }
      }
      return queue
    },

    totalBundles(): number {
      return this.selectedBundles.reduce((sum, sb) => sum + sb.bundles, 0)
    },

    currentBurningPaper(): JossPaperType | null {
      return this.burnQueue[this.currentBurningIndex] ?? null
    },

    totalPaperGrams(): number {
      return this.selectedBundles.reduce((sum, sb) => {
        const type = JOSS_PAPER_TYPES.find(p => p.id === sb.id)
        return sum + (type ? type.paperGrams * sb.bundles : 0)
      }, 0)
    },

    totalSheets(): number {
      return this.selectedBundles.reduce((sum, sb) => {
        const type = JOSS_PAPER_TYPES.find(p => p.id === sb.id)
        return sum + (type ? type.sheetsPerBundle * sb.bundles : 0)
      }, 0)
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
    getBundles(id: string): number {
      return this.selectedBundles.find(sb => sb.id === id)?.bundles ?? 0
    },

    setBundles(id: string, bundles: number) {
      const existing = this.selectedBundles.find(sb => sb.id === id)
      if (bundles <= 0) {
        this.selectedBundles = this.selectedBundles.filter(sb => sb.id !== id)
      } else if (existing) {
        existing.bundles = bundles
      } else {
        this.selectedBundles.push({ id, bundles })
      }
    },

    setBurnMode(mode: BurnMode) {
      this.burnMode = mode
    },

    setAnimationLevel(level: AnimationLevel) {
      this.animationLevel = level
    },

    startBurning() {
      this.phase = 'burning'
      this.currentBurningIndex = 0
      this.burnProgress = 0
      this.totalBurned = 0
    },

    advanceToNextPaper() {
      this.totalBurned++
      if (this.currentBurningIndex + 1 < this.burnQueue.length) {
        this.currentBurningIndex++
        this.burnProgress = 0
      }
    },

    complete() {
      this.phase = 'completed'
    },

    proceedToModeSelect() {
      this.phase = 'mode-select'
    },

    reset() {
      this.phase = 'selecting'
      this.selectedBundles = []
      this.burnMode = 'auto'
      this.currentBurningIndex = 0
      this.burnProgress = 0
      this.totalBurned = 0
    },
  },
})
