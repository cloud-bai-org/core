import { defineStore } from 'pinia'

// 金紙種類
export interface JossPaperType {
  id: string
  name: string
  description: string
  // 粒子參數
  particle: {
    flameColors: [string, string, string] // 內焰、外焰、尖端
    ashColor: string
    burnSpeed: number // 燃燒速度倍率（1 為標準）
    sparkDensity: number // 火花密度倍率
  }
  // 每張金紙等效的實體紙張克數
  paperGrams: number
}

export const JOSS_PAPER_TYPES: JossPaperType[] = [
  {
    id: 'shou-jin',
    name: '壽金',
    description: '祭拜天公、三界公等天神使用',
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

export interface BurnState {
  phase: BurnPhase
  selectedPapers: string[] // JossPaperType ids
  burnMode: BurnMode
  animationLevel: AnimationLevel
  // 焚燒進度
  currentBurningIndex: number // 目前正在燒的金紙 index（auto 模式用）
  burnProgress: number // 0~1，當前金紙燃燒進度
  totalBurned: number // 已焚燒完成的張數
}

export const useJossPaperStore = defineStore('joss-paper', {
  state: (): BurnState => ({
    phase: 'selecting',
    selectedPapers: [],
    burnMode: 'auto',
    animationLevel: 'standard',
    currentBurningIndex: 0,
    burnProgress: 0,
    totalBurned: 0,
  }),

  getters: {
    selectedPaperTypes(): JossPaperType[] {
      return this.selectedPapers
        .map(id => JOSS_PAPER_TYPES.find(p => p.id === id))
        .filter((p): p is JossPaperType => !!p)
    },

    currentBurningPaper(): JossPaperType | null {
      return this.selectedPaperTypes[this.currentBurningIndex] ?? null
    },

    remainingPapers(): JossPaperType[] {
      return this.selectedPaperTypes.slice(this.currentBurningIndex + 1)
    },

    totalPaperGrams(): number {
      return this.selectedPaperTypes.reduce((sum, p) => sum + p.paperGrams, 0)
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
    togglePaper(id: string) {
      const idx = this.selectedPapers.indexOf(id)
      if (idx >= 0) {
        this.selectedPapers.splice(idx, 1)
      } else {
        this.selectedPapers.push(id)
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
      if (this.currentBurningIndex + 1 >= this.selectedPapers.length) {
        this.phase = 'completed'
      } else {
        this.currentBurningIndex++
        this.burnProgress = 0
      }
    },

    proceedToModeSelect() {
      this.phase = 'mode-select'
    },

    reset() {
      this.phase = 'selecting'
      this.selectedPapers = []
      this.burnMode = 'auto'
      this.currentBurningIndex = 0
      this.burnProgress = 0
      this.totalBurned = 0
    },
  },
})
