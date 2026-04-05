<template>
  <div class="flex flex-col items-center gap-8 py-12">
    <div class="text-center">
      <h1 class="text-2xl font-medium">開始拜拜</h1>
      <p class="mt-2 text-sm text-muted-foreground">選擇本次祭拜對象</p>
    </div>

    <div class="flex w-full max-w-sm flex-col gap-4">
      <!-- 拜神明 -->
      <Card
        class="cursor-pointer transition-colors hover:border-primary"
        @click="startDeity"
      >
        <CardContent class="flex items-center gap-4 pt-6">
          <span class="text-4xl">🙏</span>
          <div>
            <h2 class="text-lg font-medium">拜神明</h2>
            <p class="text-sm text-muted-foreground">選擇神明、擺設供品、焚香祈禱、擲筊問卦</p>
          </div>
        </CardContent>
      </Card>

      <!-- 祭拜祖先 -->
      <Card
        class="cursor-pointer transition-colors hover:border-primary"
        @click="startAncestor"
      >
        <CardContent class="flex items-center gap-4 pt-6">
          <span class="text-4xl">🕯️</span>
          <div>
            <h2 class="text-lg font-medium">祭拜祖先 / 親人</h2>
            <p class="text-sm text-muted-foreground">焚香祈禱、燒金紙與紙紮物品</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorshipMode } from '~/stores/worship'

definePageMeta({ capability: 'worship-ceremony' })

const worshipStore = useWorshipStore()
const authStore = useAuthStore()

async function start(mode: WorshipMode) {
  worshipStore.startCeremony(mode)
  await worshipStore.persistProgress()
  const firstStep = worshipStore.steps[0]
  if (firstStep) {
    navigateTo(firstStep.route)
  }
}

function startDeity() {
  start('deity')
}

function startAncestor() {
  start('ancestor')
}

// 頁面載入時檢查是否有可恢復的儀式
onMounted(async () => {
  if (authStore.isLoggedIn) {
    const restored = await worshipStore.restoreProgress()
    if (restored && worshipStore.currentStep) {
      navigateTo(worshipStore.currentStep.route)
    }
  }
})
</script>
