<template>
  <div class="flex flex-col items-center gap-4">
    <div class="text-5xl">🙏</div>
    <h2 class="text-lg font-medium">供品擺設完成</h2>
    <p class="text-sm text-muted-foreground">
      已擺放 {{ store.altarOfferings.length }} 項供品
    </p>

    <!-- 供品清單 -->
    <div class="w-full max-w-sm rounded-lg bg-muted/50 p-4">
      <div class="flex flex-wrap justify-center gap-3">
        <div
          v-for="item in store.altarOfferings"
          :key="item.instanceId"
          class="flex flex-col items-center gap-0.5"
        >
          <span class="text-2xl">{{ getEmoji(item.offeringId) }}</span>
          <span class="text-xs text-muted-foreground">{{ getName(item.offeringId) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOfferingStore } from '~/stores/offering'

const store = useOfferingStore()

function getEmoji(offeringId: string) {
  return store.getOfferingById(offeringId)?.emoji ?? '❓'
}

function getName(offeringId: string) {
  return store.getOfferingById(offeringId)?.name ?? ''
}
</script>
