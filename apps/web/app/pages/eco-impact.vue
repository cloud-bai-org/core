<template>
  <div class="flex flex-col gap-6 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-medium">🌱 環保成效</h1>
      <p v-if="ecoImpactStore.isGuest" class="mt-1 text-xs text-muted-foreground">
        訪客紀錄（登入後可同步至帳戶）
      </p>
    </div>

    <!-- 累積統計 -->
    <Card class="w-full">
      <CardContent class="pt-6">
        <div class="mb-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p class="text-2xl font-semibold text-primary">{{ ecoImpactStore.summary.totalCeremonies }}</p>
            <p class="text-xs text-muted-foreground">線上拜拜次數</p>
          </div>
          <div>
            <p class="text-2xl font-semibold text-primary">{{ paperDisplay }}</p>
            <p class="text-xs text-muted-foreground">減少紙張</p>
          </div>
          <div>
            <p class="text-2xl font-semibold text-primary">{{ co2Display }}</p>
            <p class="text-xs text-muted-foreground">減少 CO₂</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 等效換算 -->
    <EcoImpactEcoEquivalentCard
      :total-paper-grams="ecoImpactStore.summary.totalPaperSaved"
      :total-co2-grams="ecoImpactStore.summary.totalCo2Reduced"
    />

    <!-- 趨勢圖表 -->
    <Card v-if="ecoImpactStore.records.length" class="w-full">
      <CardContent class="pt-6">
        <EcoImpactEcoTrendChart :records="ecoImpactStore.records" />
      </CardContent>
    </Card>

    <!-- 空狀態 -->
    <div v-if="!ecoImpactStore.loading && !ecoImpactStore.records.length" class="py-8 text-center">
      <p class="text-muted-foreground">尚未有環保紀錄</p>
      <Button class="mt-4" @click="navigateTo('/worship')">
        開始拜拜
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEcoImpactStore } from '~/stores/eco-impact'

definePageMeta({ capability: 'eco-impact-tracker' })

const ecoImpactStore = useEcoImpactStore()

const paperDisplay = computed(() => {
  const g = ecoImpactStore.summary.totalPaperSaved
  return g >= 1000 ? `${(g / 1000).toFixed(1)}kg` : `${g.toFixed(0)}g`
})

const co2Display = computed(() => {
  const g = ecoImpactStore.summary.totalCo2Reduced
  return g >= 1000 ? `${(g / 1000).toFixed(1)}kg` : `${g.toFixed(0)}g`
})

onMounted(() => {
  ecoImpactStore.fetchData()
})
</script>
