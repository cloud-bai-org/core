<template>
  <div class="flex flex-col gap-3">
    <button
      v-for="mode in modes"
      :key="mode.value"
      class="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors"
      :class="store.burnMode === mode.value
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'"
      @click="store.setBurnMode(mode.value)"
    >
      <span class="text-2xl">{{ mode.icon }}</span>
      <div>
        <div class="font-medium">{{ mode.label }}</div>
        <p class="text-sm text-muted-foreground">{{ mode.description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useJossPaperStore } from '~/stores/joss-paper'
import type { BurnMode } from '~/stores/joss-paper'

const store = useJossPaperStore()

const modes: { value: BurnMode, icon: string, label: string, description: string }[] = [
  { value: 'auto', icon: '🔥', label: '自動焚燒', description: '一鍵播放完整焚燒動畫' },
  { value: 'manual', icon: '🤲', label: '手動投入', description: '以手指拖曳金紙逐張投入金爐' },
]
</script>
