<template>
  <CeremonyLayout hide-next-button>
    <div class="flex flex-col items-center gap-6">
      <h1 class="text-2xl font-medium">擲筊</h1>

      <!-- 筊杯動畫區域 -->
      <div
        ref="gestureAreaRef"
        class="flex w-full max-w-sm flex-col items-center rounded-lg border border-border bg-card p-6"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <DivinationScene
          :result="store.currentResult"
          :animate="shouldAnimate"
          @animation-complete="onAnimationComplete"
        />

        <p v-if="!store.currentResult && !store.isAnimating" class="mt-2 text-sm text-muted-foreground">
          點擊按鈕或向上滑動擲筊
        </p>
      </div>

      <!-- 結果顯示區域 -->
      <div
        v-if="store.currentResult && !store.isAnimating"
        class="flex flex-col items-center gap-2"
      >
        <span class="text-4xl">{{ resultIcon }}</span>
        <p class="text-xl font-medium">{{ resultLabel.name }}</p>
        <p class="text-sm text-muted-foreground">{{ resultLabel.description }}</p>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex gap-3">
        <Button
          v-if="!store.currentResult || store.isAnimating"
          :disabled="store.isAnimating"
          size="lg"
          @click="doThrow"
        >
          擲筊
        </Button>
        <template v-if="store.currentResult && !store.isAnimating">
          <Button
            variant="outline"
            size="lg"
            @click="doThrow"
          >
            再擲一次
          </Button>
          <Button
            size="lg"
            @click="handleContinue"
          >
            繼續儀式
          </Button>
        </template>
      </div>

      <!-- 擲筊歷程 -->
      <div
        v-if="store.history.length > 0"
        class="w-full max-w-sm"
      >
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">擲筊紀錄</h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="(record, index) in store.history"
            :key="record.timestamp"
            class="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2"
          >
            <span class="text-sm text-muted-foreground">{{ index + 1 }}</span>
            <span class="text-lg">{{ getIcon(record.result) }}</span>
            <span class="text-sm">{{ RESULT_LABELS[record.result].name }}</span>
          </div>
        </div>
      </div>
    </div>
  </CeremonyLayout>
</template>

<script setup lang="ts">
import { RESULT_LABELS, useDivinationStore } from '~/stores/divination'
import type { DivinationResult } from '~/stores/divination'
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const store = useDivinationStore()
const worshipStore = useWorshipStore()
const { guard } = useWorshipGuard()
const shouldAnimate = ref(false)
const gestureAreaRef = ref<HTMLElement | null>(null)

let touchStartY = 0

const RESULT_ICONS: Record<DivinationResult, string> = {
  holy: '🌙',
  laughing: '😊',
  negative: '🌑',
}

const resultIcon = computed(() =>
  store.currentResult ? RESULT_ICONS[store.currentResult] : '',
)

const resultLabel = computed(() =>
  store.currentResult ? RESULT_LABELS[store.currentResult] : { name: '', description: '' },
)

function getIcon(result: DivinationResult) {
  return RESULT_ICONS[result]
}

function doThrow() {
  if (store.isAnimating) return
  shouldAnimate.value = false
  nextTick(() => {
    store.throwBlocks()
    shouldAnimate.value = true
  })
}

function onAnimationComplete() {
  store.onAnimationComplete()
  shouldAnimate.value = false
}

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (touch) touchStartY = touch.clientY
}

function onTouchEnd(e: TouchEvent) {
  const touch = e.changedTouches[0]
  if (!touch) return
  const touchEndY = touch.clientY
  const swipeDistance = touchStartY - touchEndY
  if (swipeDistance > 50 && !store.isAnimating) {
    doThrow()
  }
}

async function handleContinue() {
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/divination')
})
</script>
