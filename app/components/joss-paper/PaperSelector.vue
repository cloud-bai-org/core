<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="paper in papers"
      :key="paper.id"
      class="rounded-lg border p-3 transition-colors"
      :class="isSelected(paper.id)
        ? 'border-primary bg-primary/5'
        : 'border-border'"
    >
      <div class="flex items-center gap-3">
        <!-- 金紙色塊預覽 -->
        <div
          class="size-10 shrink-0 rounded"
          :style="{ background: paperGradient(paper) }"
        />
        <div class="min-w-0 flex-1">
          <div class="font-medium">{{ paper.name }}</div>
          <p class="text-sm text-muted-foreground">{{ paper.description }}</p>
          <p class="text-xs text-muted-foreground">每組 {{ paper.sheetsPerBundle }} 張</p>
        </div>
      </div>

      <!-- 組數選擇 -->
      <div class="mt-2 flex items-center justify-end gap-2">
        <button
          class="flex size-7 items-center justify-center rounded-full border text-sm transition-colors hover:bg-muted"
          :disabled="!isSelected(paper.id)"
          @click="decrement(paper.id)"
        >
          −
        </button>
        <span class="w-8 text-center text-sm font-medium">
          {{ store.getBundles(paper.id) }}
        </span>
        <button
          class="flex size-7 items-center justify-center rounded-full border text-sm transition-colors hover:bg-muted"
          @click="increment(paper.id)"
        >
          +
        </button>
        <span class="text-xs text-muted-foreground">組</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JOSS_PAPER_TYPES, useJossPaperStore } from '~/stores/joss-paper'
import type { JossPaperType } from '~/stores/joss-paper'

const store = useJossPaperStore()
const papers = JOSS_PAPER_TYPES

function isSelected(id: string) {
  return store.getBundles(id) > 0
}

function increment(id: string) {
  store.setBundles(id, store.getBundles(id) + 1)
}

function decrement(id: string) {
  const current = store.getBundles(id)
  if (current > 0) {
    store.setBundles(id, current - 1)
  }
}

function paperGradient(paper: JossPaperType) {
  const [c1, c2] = paper.particle.flameColors
  return `linear-gradient(135deg, ${c1}, ${c2})`
}
</script>
