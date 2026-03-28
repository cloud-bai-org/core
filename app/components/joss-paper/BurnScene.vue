<template>
  <div class="relative flex flex-col items-center gap-4">
    <!-- 動畫等級切換 -->
    <div class="flex gap-2 text-xs">
      <button
        v-for="level in levels"
        :key="level.value"
        class="rounded-full px-2.5 py-1 transition-colors"
        :class="store.animationLevel === level.value
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'"
        @click="store.setAnimationLevel(level.value)"
      >
        {{ level.label }}
      </button>
    </div>

    <!-- Canvas 焚燒場景 -->
    <div
      ref="sceneRef"
      class="relative touch-none"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <BurnCanvas
        ref="canvasRef"
        :paper="currentPaper"
        :burning="isBurning"
        :intensity="fireIntensity"
        :animation-level="store.animationLevel"
        @burn-complete="onBurnComplete"
      />

      <!-- 手動模式：Canvas 內左下角的金紙散堆（拖曳起點） -->
      <div
        v-if="store.burnMode === 'manual' && store.phase === 'burning' && remainingManualPapers.length > 0"
        class="absolute bottom-2 left-2"
      >
        <div class="relative h-16 w-20">
          <div
            v-for="(paper, idx) in displayedPaperStack"
            :key="paper.id + idx"
            class="absolute size-10 rounded border border-amber-400/50 bg-amber-200 shadow-sm"
            :class="idx === displayedPaperStack.length - 1 && !dragging ? 'animate-pulse cursor-grab' : ''"
            :style="scatterStyle(idx)"
          >
            <div class="m-1.5 size-5 rounded-sm bg-amber-400/60" />
          </div>
        </div>
        <span class="mt-1 block text-center text-xs text-muted-foreground">
          剩餘 {{ remainingManualPapers.length }} 組
        </span>
      </div>

      <!-- 拖曳中的金紙 -->
      <div
        v-if="dragging"
        class="pointer-events-none absolute size-12 rounded border-2 border-amber-500 bg-amber-200 shadow-lg"
        :style="{
          left: `${dragPos.x - 24}px`,
          top: `${dragPos.y - 24}px`,
        }"
      >
        <div class="m-2 size-6 rounded-sm bg-amber-400/80" />
      </div>
    </div>

    <!-- 焚燒進度 -->
    <div v-if="store.phase === 'burning'" class="text-sm text-muted-foreground">
      已焚燒 {{ store.totalBurned }} / {{ store.burnQueue.length }} 組
    </div>

    <!-- 手動模式的自動完成按鈕 -->
    <Button
      v-if="store.burnMode === 'manual' && store.phase === 'burning' && remainingManualPapers.length > 0"
      variant="outline"
      size="sm"
      @click="autoCompleteRemaining"
    >
      自動完成剩餘 {{ remainingManualPapers.length }} 組
    </Button>
  </div>
</template>

<script setup lang="ts">
import BurnCanvas from './BurnCanvas.vue'
import { useJossPaperStore } from '~/stores/joss-paper'
import type { AnimationLevel, JossPaperType } from '~/stores/joss-paper'

const store = useJossPaperStore()

const levels: { value: AnimationLevel, label: string }[] = [
  { value: 'fine', label: '精緻' },
  { value: 'standard', label: '標準' },
  { value: 'simple', label: '簡約' },
]

const canvasRef = ref<InstanceType<typeof BurnCanvas> | null>(null)
const sceneRef = ref<HTMLElement | null>(null)

const isBurning = ref(false)
const currentPaper = ref<JossPaperType | null>(null)
const fireIntensity = computed(() => {
  const total = store.burnQueue.length
  if (total === 0) return 0
  return Math.min(1, store.totalBurned / total + 0.2)
})

// 手動模式狀態
const dragging = ref(false)
const dragPos = reactive({ x: 0, y: 0 })
const manualIndex = ref(0)
const manualBurning = ref(false) // 手動模式下是否有一組正在燒

const remainingManualPapers = computed(() => {
  return store.burnQueue.slice(manualIndex.value)
})

// 最多顯示 5 張散開的金紙
const displayedPaperStack = computed(() => {
  return remainingManualPapers.value.slice(0, 5)
})

// 預先產生每個位置的隨機散開參數（固定種子避免每次 render 跳動）
const scatterSeeds = Array.from({ length: 5 }, () => ({
  x: (Math.random() - 0.5) * 20,
  y: (Math.random() - 0.5) * 16,
  r: (Math.random() - 0.5) * 24,
}))

function scatterStyle(idx: number) {
  const seed = scatterSeeds[idx]
  return {
    left: `${10 + seed.x}px`,
    top: `${8 + seed.y}px`,
    transform: `rotate(${seed.r}deg)`,
    zIndex: idx,
  }
}

// ---- 自動焚燒模式 ----

async function startAutoBurn() {
  for (let i = 0; i < store.burnQueue.length; i++) {
    if (store.phase !== 'burning') break

    store.currentBurningIndex = i
    currentPaper.value = store.burnQueue[i]

    await burnOnePaper()
  }
}

function burnOnePaper(): Promise<void> {
  return new Promise((resolve) => {
    isBurning.value = true
    const unwatch = watch(isBurning, (val) => {
      if (!val) {
        unwatch()
        resolve()
      }
    })
  })
}

function onBurnComplete() {
  isBurning.value = false
  manualBurning.value = false
  store.advanceToNextPaper()
}

// ---- 手動投入模式 ----

// 金爐碰撞偵測區域
const FURNACE_HIT = { x: 90, y: 280, w: 120, h: 80 }

function onPointerDown(e: PointerEvent) {
  if (store.burnMode !== 'manual' || store.phase !== 'burning') return
  if (remainingManualPapers.value.length === 0) return
  if (manualBurning.value) return // 上一組還在燒，不允許拖曳

  const rect = sceneRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 只有從左下角金紙堆區域才能開始拖曳
  if (x > 80 || y < rect.height - 100) return

  dragging.value = true
  dragPos.x = x
  dragPos.y = y
  ;(e.target as Element)?.setPointerCapture?.(e.pointerId)
  e.preventDefault()
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const rect = sceneRef.value?.getBoundingClientRect()
  if (!rect) return

  dragPos.x = e.clientX - rect.left
  dragPos.y = e.clientY - rect.top
  e.preventDefault()
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false

  // 檢查是否落入金爐範圍
  if (
    dragPos.x >= FURNACE_HIT.x
    && dragPos.x <= FURNACE_HIT.x + FURNACE_HIT.w
    && dragPos.y >= FURNACE_HIT.y
    && dragPos.y <= FURNACE_HIT.y + FURNACE_HIT.h
  ) {
    const paper = remainingManualPapers.value[0]
    if (paper) {
      manualBurning.value = true
      currentPaper.value = paper
      store.currentBurningIndex = manualIndex.value
      manualIndex.value++

      // 從拖放位置觸發焚燒動畫
      canvasRef.value?.dropFromPosition(dragPos.x, dragPos.y, paper)
    }
  }

  e.preventDefault()
}

// 等待手動焚燒中的那組完成
function waitForManualBurnDone(): Promise<void> {
  if (!manualBurning.value) return Promise.resolve()
  return new Promise((resolve) => {
    const unwatch = watch(manualBurning, (val) => {
      if (!val) {
        unwatch()
        resolve()
      }
    })
  })
}

// 自動完成剩餘金紙
async function autoCompleteRemaining() {
  // 先等手動拖入的那組燒完
  await waitForManualBurnDone()

  store.burnMode = 'auto'
  const startIdx = manualIndex.value
  const remaining = store.burnQueue.slice(startIdx)
  for (let i = 0; i < remaining.length; i++) {
    if (store.phase !== 'burning') break

    const idx = startIdx + i
    store.currentBurningIndex = idx
    currentPaper.value = remaining[i]

    await burnOnePaper()
  }
}

// 開始焚燒流程
watch(() => store.phase, (phase) => {
  if (phase === 'burning') {
    manualIndex.value = 0
    if (store.burnMode === 'auto') {
      startAutoBurn()
    }
  }
})

// 如果組件掛載時已經在 burning 階段
onMounted(() => {
  if (store.phase === 'burning' && store.burnMode === 'auto') {
    startAutoBurn()
  }
})
</script>
