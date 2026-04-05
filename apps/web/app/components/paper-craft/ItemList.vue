<template>
  <div class="flex flex-col gap-1.5">
    <div class="mb-1 flex items-center gap-2">
      <button
        class="text-sm text-muted-foreground hover:text-foreground"
        @click="emit('back')"
      >
        ← 返回分類
      </button>
      <span class="text-sm font-medium">{{ category.name }}</span>
    </div>

    <button
      v-for="item in category.items"
      :key="item.id"
      class="flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors"
      :class="store.isItemSelected(item.id)
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'"
      @click="toggleItem(item)"
    >
      <span class="text-sm">{{ item.name }}</span>
      <span
        v-if="store.isItemSelected(item.id)"
        class="text-xs text-primary"
      >
        已選
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { usePaperCraftStore } from '~/stores/paper-craft'
import type { PaperCraftItem } from '~/stores/paper-craft'

const props = defineProps<{
  categoryId: string
}>()

const emit = defineEmits<{
  back: []
}>()

const store = usePaperCraftStore()

const category = computed(() => {
  return PAPER_CRAFT_CATEGORIES.find(c => c.id === props.categoryId)!
})

import { PAPER_CRAFT_CATEGORIES } from '~/stores/paper-craft'

function toggleItem(item: PaperCraftItem) {
  if (store.isItemSelected(item.id)) {
    const idx = store.burnList.findIndex(i => i.id === item.id)
    if (idx >= 0) store.removeItem(idx)
  } else {
    store.addItem(item)
  }
}
</script>
