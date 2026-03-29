import { defineStore } from 'pinia'
import type { AltarOffering, Offering, OfferingCategory } from '~/types/data'
import offeringsData from '~/data/offerings.json'

export type OfferingPhase =
  | 'selecting'   // 選擇供品
  | 'arranging'   // 拖放擺設
  | 'completed'   // 擺設完成

export interface OfferingState {
  phase: OfferingPhase
  selectedOfferingIds: string[]
  altarOfferings: AltarOffering[]
}

let instanceCounter = 0

export const useOfferingStore = defineStore('offering', {
  state: (): OfferingState => ({
    phase: 'selecting',
    selectedOfferingIds: [],
    altarOfferings: [],
  }),

  getters: {
    categories(): OfferingCategory[] {
      return offeringsData.categories as OfferingCategory[]
    },

    allOfferings(): Offering[] {
      return offeringsData.offerings as Offering[]
    },

    offeringsByCategory() {
      return (categoryId: string): Offering[] => {
        return this.allOfferings.filter(o => o.category === categoryId)
      }
    },

    selectedOfferings(): Offering[] {
      return this.selectedOfferingIds
        .map(id => this.allOfferings.find(o => o.id === id))
        .filter((o): o is Offering => !!o)
    },

    getOfferingById() {
      return (id: string): Offering | undefined => {
        return this.allOfferings.find(o => o.id === id)
      }
    },
  },

  actions: {
    toggleOffering(id: string) {
      const index = this.selectedOfferingIds.indexOf(id)
      if (index >= 0) {
        this.selectedOfferingIds.splice(index, 1)
        // 同時移除供桌上此供品的所有實例
        this.altarOfferings = this.altarOfferings.filter(a => a.offeringId !== id)
      } else {
        this.selectedOfferingIds.push(id)
      }
    },

    isSelected(id: string): boolean {
      return this.selectedOfferingIds.includes(id)
    },

    proceedToArranging() {
      // 將已選供品自動擺放到供桌上（預設位置）
      this.altarOfferings = this.selectedOfferingIds.map((offeringId, i) => {
        const cols = 4
        const col = i % cols
        const row = Math.floor(i / cols)
        return {
          instanceId: `inst-${++instanceCounter}`,
          offeringId,
          x: 15 + col * 22,
          y: 20 + row * 25,
        }
      })
      this.phase = 'arranging'
    },

    updatePosition(instanceId: string, x: number, y: number) {
      const item = this.altarOfferings.find(a => a.instanceId === instanceId)
      if (item) {
        item.x = Math.max(0, Math.min(100, x))
        item.y = Math.max(0, Math.min(100, y))
      }
    },

    removeFromAltar(instanceId: string) {
      this.altarOfferings = this.altarOfferings.filter(a => a.instanceId !== instanceId)
    },

    complete() {
      this.phase = 'completed'
    },

    reset() {
      this.phase = 'selecting'
      this.selectedOfferingIds = []
      this.altarOfferings = []
    },
  },
})
