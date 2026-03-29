<template>
  <div class="flex flex-col gap-4">
    <!-- 分類標籤列 -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="cat in store.categories"
        :key="cat.id"
        class="shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors"
        :class="activeCategory === cat.id
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border hover:bg-muted'"
        @click="activeCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- 供品網格 -->
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="offering in filteredOfferings"
        :key="offering.id"
        class="flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors"
        :class="store.isSelected(offering.id)
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border hover:bg-muted'"
        @click="store.toggleOffering(offering.id)"
      >
        <span class="text-3xl">{{ offering.emoji }}</span>
        <span class="text-xs font-medium">{{ offering.name }}</span>
        <span class="text-[10px] text-muted-foreground">{{ offering.description }}</span>
      </button>
    </div>

    <!-- 已選供品摘要 -->
    <div
      v-if="store.selectedOfferings.length > 0"
      class="rounded-lg bg-muted/50 p-3"
    >
      <p class="mb-2 text-xs text-muted-foreground">
        已選 {{ store.selectedOfferings.length }} 項供品
      </p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="item in store.selectedOfferings"
          :key="item.id"
          class="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs shadow-sm"
        >
          {{ item.emoji }} {{ item.name }}
          <button
            class="ml-0.5 text-muted-foreground hover:text-foreground"
            @click="store.toggleOffering(item.id)"
          >
            ×
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOfferingStore } from '~/stores/offering'

const store = useOfferingStore()

const activeCategory = ref(store.categories[0]?.id ?? 'fruit')

const filteredOfferings = computed(() =>
  store.offeringsByCategory(activeCategory.value),
)
</script>
