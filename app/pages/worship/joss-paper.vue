<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <h1 class="text-2xl font-medium">金紙焚燒</h1>

    <!-- 階段一：選擇金紙 -->
    <template v-if="store.phase === 'selecting'">
      <p class="text-sm text-muted-foreground">選擇要焚燒的金紙種類</p>
      <div class="w-full max-w-sm">
        <JossPaperPaperSelector />
      </div>
      <Button
        size="lg"
        :disabled="store.selectedPapers.length === 0"
        @click="store.proceedToModeSelect()"
      >
        選好了，下一步
      </Button>
    </template>

    <!-- 階段二：選擇焚燒模式 -->
    <template v-else-if="store.phase === 'mode-select'">
      <p class="text-sm text-muted-foreground">選擇焚燒方式</p>
      <div class="w-full max-w-sm">
        <JossPaperModeSelector />
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="store.phase = 'selecting'">
          返回選擇
        </Button>
        <Button size="lg" @click="store.startBurning()">
          開始焚燒
        </Button>
      </div>
    </template>

    <!-- 階段三：焚燒中 -->
    <template v-else-if="store.phase === 'burning'">
      <JossPaperBurnScene />
    </template>

    <!-- 階段四：焚燒完成 -->
    <template v-else-if="store.phase === 'completed'">
      <JossPaperBurnComplete />
      <div class="flex gap-3">
        <Button variant="outline" @click="handleRestart">
          再燒一次
        </Button>
        <Button size="lg" @click="handleContinue">
          繼續儀式
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useJossPaperStore } from '~/stores/joss-paper'

definePageMeta({ capability: 'joss-paper-burning' })

const store = useJossPaperStore()

function handleRestart() {
  store.reset()
}

function handleContinue() {
  store.reset()
  navigateTo('/worship/paper-craft')
}

onBeforeUnmount(() => {
  // 離開頁面時不重置狀態，以便返回時恢復
})
</script>
