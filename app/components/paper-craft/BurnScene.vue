<template>
  <div class="flex flex-col items-center gap-4">
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
    <BurnCanvas
      ref="canvasRef"
      :item="currentItem"
      :burning="isBurning"
      :intensity="fireIntensity"
      :animation-level="store.animationLevel"
      @burn-complete="onBurnComplete"
    />

    <!-- 焚燒進度 -->
    <div class="text-sm text-muted-foreground">
      <span v-if="currentItem">正在焚燒：{{ currentItem.name }}</span>
      <span class="ml-2">（{{ store.totalBurned }} / {{ store.burnList.length }}）</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BurnCanvas from './BurnCanvas.vue'
import { usePaperCraftStore } from '~/stores/paper-craft'
import type { BurnListItem } from '~/stores/paper-craft'
import type { AnimationLevel } from '~/stores/joss-paper'

const store = usePaperCraftStore()

const levels: { value: AnimationLevel, label: string }[] = [
  { value: 'fine', label: '精緻' },
  { value: 'standard', label: '標準' },
  { value: 'simple', label: '簡約' },
]

const canvasRef = ref<InstanceType<typeof BurnCanvas> | null>(null)
const isBurning = ref(false)
const currentItem = ref<BurnListItem | null>(null)

const fireIntensity = computed(() => {
  const total = store.burnList.length
  if (total === 0) return 0
  return Math.min(1, store.totalBurned / total + 0.2)
})

function burnOneItem(): Promise<void> {
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
  store.advanceToNext()
}

async function startAutoBurn() {
  for (let i = 0; i < store.burnList.length; i++) {
    if (store.phase !== 'burning') break

    store.currentBurningIndex = i
    currentItem.value = store.burnList[i]

    await burnOneItem()
  }
  if (store.phase === 'burning') {
    setTimeout(() => {
      store.complete()
    }, 1200)
  }
}

watch(() => store.phase, (phase) => {
  if (phase === 'burning') {
    startAutoBurn()
  }
})

onMounted(() => {
  if (store.phase === 'burning') {
    startAutoBurn()
  }
})
</script>
