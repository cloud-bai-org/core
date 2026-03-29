<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <h1 class="text-2xl font-medium">供品擺設</h1>

    <!-- 階段一：選擇供品 -->
    <template v-if="store.phase === 'selecting'">
      <p class="text-sm text-muted-foreground">選擇要供奉的供品</p>
      <div class="w-full max-w-sm">
        <OfferingSelector />
      </div>
      <Button
        size="lg"
        :disabled="store.selectedOfferings.length === 0"
        @click="store.proceedToArranging()"
      >
        開始擺設
      </Button>
    </template>

    <!-- 階段二：拖放擺設 -->
    <template v-else-if="store.phase === 'arranging'">
      <p class="text-sm text-muted-foreground">將供品拖放至理想位置</p>
      <div class="w-full max-w-md">
        <OfferingAltar />
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="store.phase = 'selecting'">
          返回選擇
        </Button>
        <Button
          size="lg"
          :disabled="store.altarOfferings.length === 0"
          @click="store.complete()"
        >
          擺設完成
        </Button>
      </div>
    </template>

    <!-- 階段三：擺設完成 -->
    <template v-else-if="store.phase === 'completed'">
      <OfferingComplete />
      <div class="flex gap-3">
        <Button variant="outline" @click="handleRestart">
          重新擺設
        </Button>
        <Button size="lg" @click="handleContinue">
          繼續儀式
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useOfferingStore } from '~/stores/offering'

definePageMeta({ capability: 'offering-arrangement' })

const store = useOfferingStore()

function handleRestart() {
  store.reset()
}

function handleContinue() {
  store.reset()
  navigateTo('/worship/incense')
}
</script>
