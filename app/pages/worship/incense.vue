<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <h1 class="text-2xl font-medium">焚香</h1>

    <!-- 焚香場景 -->
    <IncenseScene v-if="ready" :max-particles="adaptiveParticles" @stick-click="handleStickClick" />

    <!-- 狀態提示 -->
    <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span v-if="store.phase === 'idle'">點燃香燭，誠心祈願</span>
      <span v-else-if="store.phase === 'lighting'">正在點香…</span>
      <span v-else-if="store.phase === 'burning'">焚香進行中（{{ remainingText }}）</span>
      <span v-else-if="store.phase === 'completed' && store.remainingRatio > 0">香已熄滅</span>
      <span v-else-if="store.phase === 'completed'">香已燃畢</span>

      <Popover v-if="showHint" :default-open="true">
        <PopoverTrigger as-child>
          <button class="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground">
            <Info :size="14" />
          </button>
        </PopoverTrigger>
        <PopoverContent class="w-auto px-3 py-1.5 text-sm" :side-offset="4">
          {{ hintText }}
        </PopoverContent>
      </Popover>
    </div>

    <!-- In-App 降級通知 -->
    <Card v-if="showFallbackNotice" class="w-full max-w-sm border-amber-500/50 bg-amber-50/10">
      <CardContent class="flex items-center gap-3 pt-6">
        <span class="text-lg">🔔</span>
        <p class="text-sm">香已燃畢，請繼續進行儀式。</p>
      </CardContent>
    </Card>

    <!-- 操作按鈕 -->
    <div class="flex gap-3">
      <Button
        v-if="store.phase === 'idle'"
        size="lg"
        @click="handleLight"
      >
        點香
      </Button>

      <Button
        v-if="store.phase === 'burning'"
        size="lg"
        @click="handleContinue"
      >
        跳過，繼續儀式
      </Button>

      <Button
        v-if="store.phase === 'completed'"
        size="lg"
        @click="handleContinue"
      >
        繼續儀式
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { useIncenseStore } from '~/stores/incense'
import { useIncenseTimer } from '~/composables/useIncenseTimer'
import { useIncenseNotification } from '~/composables/useIncenseNotification'
import IncenseScene from '~/components/incense/IncenseScene.vue'

definePageMeta({ capability: 'incense-simulation' })

const store = useIncenseStore()
const { lightIncense, extinguish, relight, restoreState, handleComplete, setupVisibilityListener, cleanupVisibilityListener } = useIncenseTimer()
const { requestPermission, needsFallback } = useIncenseNotification()

const showHint = computed(() =>
  store.phase === 'burning' || (store.phase === 'completed' && store.remainingRatio > 0),
)

const hintText = computed(() => {
  if (store.phase === 'burning') return '點擊香可熄滅'
  if (store.phase === 'completed' && store.remainingRatio > 0) return '點擊香可重新燃起'
  return ''
})

const ready = ref(false)
const showFallbackNotice = ref(false)
const adaptiveParticles = ref(40)

const remainingText = computed(() => {
  if (!store.endTime || !store.startTime) return ''
  const total = store.endTime - store.startTime
  const remaining = Math.max(0, total * store.remainingRatio)
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 偵測裝置效能，動態調整粒子數量
function detectPerformance() {
  if (typeof navigator === 'undefined') return

  const cores = navigator.hardwareConcurrency || 2
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4

  if (cores <= 2 || memory <= 2) {
    adaptiveParticles.value = 15
  } else if (cores <= 4 || memory <= 4) {
    adaptiveParticles.value = 25
  } else {
    adaptiveParticles.value = 40
  }
}

async function handleLight() {
  await requestPermission()
  await lightIncense()
}

async function handleStickClick() {
  if (store.phase === 'burning') {
    await extinguish()
  } else if (store.phase === 'completed' && store.remainingRatio > 0) {
    await relight()
  }
}

function handleContinue() {
  navigateTo('/worship/prayer')
}

// 監聽完成狀態
watch(() => store.phase, async (phase) => {
  if (phase === 'completed') {
    await handleComplete()
    if (needsFallback()) {
      showFallbackNotice.value = true
    }
  }
})

onMounted(async () => {
  detectPerformance()
  setupVisibilityListener()
  await restoreState()
  ready.value = true
})

onBeforeUnmount(() => {
  cleanupVisibilityListener()
})
</script>
