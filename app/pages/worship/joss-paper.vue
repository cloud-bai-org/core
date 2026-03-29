<template>
  <CeremonyLayout hide-next-button>
    <div class="flex flex-col items-center gap-6">
      <h1 class="text-2xl font-medium">金紙焚燒</h1>

      <!-- 階段一：選擇金紙 -->
      <template v-if="store.phase === 'selecting'">
        <p class="text-sm text-muted-foreground">選擇要焚燒的金紙種類</p>

        <!-- 建議金紙提示 -->
        <Card v-if="recommendedNames.length" class="w-full max-w-sm">
          <CardContent class="pt-4 pb-4">
            <p class="text-xs text-muted-foreground">根據祭拜對象建議使用：</p>
            <p class="mt-1 text-sm font-medium">{{ recommendedNames.join('、') }}</p>
          </CardContent>
        </Card>

        <div class="w-full max-w-sm">
          <JossPaperSelector />
        </div>
        <Button
          size="lg"
          :disabled="store.totalBundles === 0"
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
  </CeremonyLayout>
</template>

<script setup lang="ts">
import { JOSS_PAPER_TYPES, useJossPaperStore } from '~/stores/joss-paper'
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const store = useJossPaperStore()
const worshipStore = useWorshipStore()
const { guard } = useWorshipGuard()

const recommendedNames = computed(() => {
  return worshipStore.recommendedJossPaper
    .map(id => JOSS_PAPER_TYPES.find(p => p.id === id)?.name)
    .filter((n): n is string => !!n)
})

function handleRestart() {
  store.reset()
}

async function handleContinue() {
  store.reset()
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/joss-paper')
})
</script>
