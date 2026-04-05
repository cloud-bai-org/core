<template>
  <div class="grid grid-cols-3 gap-3">
    <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-4">
      <span class="text-2xl">🌳</span>
      <p class="text-lg font-semibold text-primary">{{ treesDisplay }}</p>
      <p class="text-xs text-muted-foreground text-center">拯救樹木</p>
    </div>
    <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-4">
      <span class="text-2xl">📄</span>
      <p class="text-lg font-semibold text-primary">{{ paperDisplay }}</p>
      <p class="text-xs text-muted-foreground text-center">減少紙張</p>
    </div>
    <div class="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-4">
      <span class="text-2xl">💨</span>
      <p class="text-lg font-semibold text-primary">{{ co2Display }}</p>
      <p class="text-xs text-muted-foreground text-center">減少 CO₂</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { calculateEquivalent } from '~/lib/eco-calculator'

const props = defineProps<{
  totalPaperGrams: number
  totalCo2Grams: number
}>()

const equivalent = computed(() => calculateEquivalent(props.totalCo2Grams))

const treesDisplay = computed(() => {
  const t = equivalent.value.treesSaved
  return t >= 1 ? `${t.toFixed(1)} 棵` : `${(t * 100).toFixed(0)}%`
})

const paperDisplay = computed(() => {
  const g = props.totalPaperGrams
  return g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g.toFixed(0)} g`
})

const co2Display = computed(() => {
  const kg = equivalent.value.co2ReducedKg
  return kg >= 1 ? `${kg.toFixed(1)} kg` : `${(kg * 1000).toFixed(0)} g`
})
</script>
