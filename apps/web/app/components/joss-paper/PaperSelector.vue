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
        <!-- 金紙擬真預覽 -->
        <div
          class="relative flex size-12 shrink-0 items-center justify-center rounded-sm shadow-sm"
          :style="{
            backgroundColor: paper.visual.paperColor,
            border: `1px solid ${paper.visual.borderColor}`,
          }"
        >
          <!-- 箔片 -->
          <div
            class="size-6 rounded-[1px]"
            :style="{
              background: `linear-gradient(135deg, ${paper.visual.foilColor} 0%, ${paper.visual.foilShine} 45%, ${paper.visual.foilColor} 55%, ${paper.visual.foilShine} 100%)`,
              boxShadow: `inset 0 0 3px ${paper.visual.foilShine}40`,
            }"
          />
          <!-- 紙張紋理 -->
          <div
            class="pointer-events-none absolute inset-0 rounded-sm opacity-20"
            style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 3px)"
          />
        </div>

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
</script>
