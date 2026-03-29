<template>
  <div v-if="store.burnList.length > 0" class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium">焚燒清單（{{ store.burnList.length }}）</h3>
      <button
        class="text-xs text-muted-foreground hover:text-destructive"
        @click="store.clearList()"
      >
        清空
      </button>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="(item, idx) in store.burnList"
        :key="item.id + idx"
        class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
        :class="item.isCustom ? 'border-dashed' : 'border-solid'"
      >
        {{ item.name }}
        <button
          class="ml-0.5 text-muted-foreground hover:text-destructive"
          @click="store.removeItem(idx)"
        >
          ×
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaperCraftStore } from '~/stores/paper-craft'

const store = usePaperCraftStore()
</script>
