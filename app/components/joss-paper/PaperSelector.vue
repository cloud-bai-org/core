<template>
  <div class="flex flex-col gap-3">
    <button
      v-for="paper in papers"
      :key="paper.id"
      class="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors"
      :class="isSelected(paper.id)
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'"
      @click="store.togglePaper(paper.id)"
    >
      <!-- 金紙色塊預覽 -->
      <div
        class="size-10 shrink-0 rounded"
        :style="{ background: paperGradient(paper) }"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span class="font-medium">{{ paper.name }}</span>
          <span
            v-if="isSelected(paper.id)"
            class="text-xs text-primary"
          >已選</span>
        </div>
        <p class="text-sm text-muted-foreground">{{ paper.description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { JOSS_PAPER_TYPES, useJossPaperStore } from '~/stores/joss-paper'
import type { JossPaperType } from '~/stores/joss-paper'

const store = useJossPaperStore()
const papers = JOSS_PAPER_TYPES

function isSelected(id: string) {
  return store.selectedPapers.includes(id)
}

function paperGradient(paper: JossPaperType) {
  const [c1, c2] = paper.particle.flameColors
  return `linear-gradient(135deg, ${c1}, ${c2})`
}
</script>
