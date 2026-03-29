import { defineStore } from 'pinia'
import type { AltarOffering, Offering, OfferingCategory } from '~/types/data'
import offeringsData from '~~/data/offerings.json'

export type OfferingPhase =
  | 'selecting'   // 選擇供品
  | 'arranging'   // 拖放擺設
  | 'completed'   // 擺設完成

let instanceCounter = 0

export const useOfferingStore = defineStore('offering', () => {
  const phase = ref<OfferingPhase>('selecting')
  const selectedOfferingIds = ref<string[]>([])
  const altarOfferings = ref<AltarOffering[]>([])

  // --- Getters ---

  const categories = computed(() => offeringsData.categories as OfferingCategory[])

  const allOfferings = computed(() => offeringsData.offerings as Offering[])

  const selectedOfferings = computed(() =>
    selectedOfferingIds.value
      .map(id => allOfferings.value.find(o => o.id === id))
      .filter((o): o is Offering => !!o),
  )

  function offeringsByCategory(categoryId: string): Offering[] {
    return allOfferings.value.filter(o => o.category === categoryId)
  }

  function getOfferingById(id: string): Offering | undefined {
    return allOfferings.value.find(o => o.id === id)
  }

  function isSelected(id: string): boolean {
    return selectedOfferingIds.value.includes(id)
  }

  // --- Actions ---

  function toggleOffering(id: string) {
    const index = selectedOfferingIds.value.indexOf(id)
    if (index >= 0) {
      selectedOfferingIds.value.splice(index, 1)
      altarOfferings.value = altarOfferings.value.filter((a: AltarOffering) => a.offeringId !== id)
    } else {
      selectedOfferingIds.value.push(id)
    }
  }

  function proceedToArranging() {
    altarOfferings.value = selectedOfferingIds.value.map((offeringId, i) => {
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
    phase.value = 'arranging'
  }

  function updatePosition(instanceId: string, x: number, y: number) {
    const item = altarOfferings.value.find((a: AltarOffering) => a.instanceId === instanceId)
    if (item) {
      item.x = Math.max(0, Math.min(100, x))
      item.y = Math.max(0, Math.min(100, y))
    }
  }

  function removeFromAltar(instanceId: string) {
    altarOfferings.value = altarOfferings.value.filter((a: AltarOffering) => a.instanceId !== instanceId)
  }

  function complete() {
    phase.value = 'completed'
  }

  function reset() {
    phase.value = 'selecting'
    selectedOfferingIds.value = []
    altarOfferings.value = []
  }

  return {
    // State
    phase,
    selectedOfferingIds,
    altarOfferings,
    // Getters
    categories,
    allOfferings,
    selectedOfferings,
    offeringsByCategory,
    getOfferingById,
    isSelected,
    // Actions
    toggleOffering,
    proceedToArranging,
    updatePosition,
    removeFromAltar,
    complete,
    reset,
  }
})
