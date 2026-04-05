<template>
  <div class="flex flex-col gap-2">
    <button
      v-for="category in categories"
      :key="category.id"
      class="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors"
      :class="selectedCategoryId === category.id
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'"
      @click="emit('select', category.id)"
    >
      <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-lg">
        {{ categoryEmoji(category.icon) }}
      </span>
      <div>
        <div class="font-medium">{{ category.name }}</div>
        <p class="text-xs text-muted-foreground">{{ category.items.length }} 個品項</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PAPER_CRAFT_CATEGORIES } from '~/stores/paper-craft'

defineProps<{
  selectedCategoryId: string | null
}>()

const emit = defineEmits<{
  select: [categoryId: string]
}>()

const categories = PAPER_CRAFT_CATEGORIES

function categoryEmoji(icon: string): string {
  const map: Record<string, string> = {
    smartphone: '📱',
    home: '🏠',
    car: '🚗',
    gem: '💎',
    shirt: '👔',
    utensils: '🍽️',
  }
  return map[icon] ?? '📦'
}
</script>
