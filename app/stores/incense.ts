import { defineStore } from 'pinia'

export type IncensePhase = 'idle' | 'lighting' | 'burning' | 'completed'

interface IncenseState {
  phase: IncensePhase
  startTime: number | null
  endTime: number | null
  remainingRatio: number
}

const INCENSE_DURATION_MS = 15 * 60 * 1000 // 15 分鐘（民俗常用估算時間）

export const useIncenseStore = defineStore('incense', {
  state: (): IncenseState => ({
    phase: 'idle',
    startTime: null,
    endTime: null,
    remainingRatio: 1,
  }),

  getters: {
    isActive: (state) => state.phase === 'lighting' || state.phase === 'burning',
    duration: () => INCENSE_DURATION_MS,
  },

  actions: {
    setPhase(phase: IncensePhase) {
      this.phase = phase
    },

    startBurning() {
      const now = Date.now()
      this.startTime = now
      this.endTime = now + INCENSE_DURATION_MS
      this.phase = 'lighting'
      this.remainingRatio = 1
    },

    updateProgress() {
      if (!this.endTime || !this.startTime) return

      const now = Date.now()
      if (now >= this.endTime) {
        this.phase = 'completed'
        this.remainingRatio = 0
        return
      }

      const elapsed = now - this.startTime
      const total = this.endTime - this.startTime
      this.remainingRatio = Math.max(0, 1 - elapsed / total)

      if (this.phase === 'lighting') {
        this.phase = 'burning'
      }
    },

    restoreFromTimestamp(endTime: number) {
      const now = Date.now()
      if (now >= endTime) {
        this.phase = 'completed'
        this.remainingRatio = 0
        this.endTime = endTime
        this.startTime = endTime - INCENSE_DURATION_MS
        return
      }

      this.endTime = endTime
      this.startTime = endTime - INCENSE_DURATION_MS
      const elapsed = now - this.startTime
      const total = this.endTime - this.startTime
      this.remainingRatio = Math.max(0, 1 - elapsed / total)
      this.phase = 'burning'
    },

    reset() {
      this.phase = 'idle'
      this.startTime = null
      this.endTime = null
      this.remainingRatio = 1
    },
  },
})
