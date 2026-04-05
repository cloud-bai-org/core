<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <div class="text-center">
      <span class="text-4xl">✨</span>
      <h1 class="mt-2 text-2xl font-medium">儀式完成</h1>
      <p class="mt-1 text-sm text-muted-foreground">感謝您的虔誠祝禱</p>
    </div>

    <!-- 摘要內容 -->
    <Card class="w-full max-w-sm">
      <CardContent class="flex flex-col gap-4 pt-6">
        <!-- 祭拜對象 -->
        <div>
          <h3 class="text-xs font-medium text-muted-foreground">祭拜對象</h3>
          <p class="mt-1 text-sm">
            <template v-if="worshipStore.mode === 'deity'">
              {{ deityName ?? '神明' }}
            </template>
            <template v-else>
              {{ worshipStore.ancestorName || '祖先' }}
              <span v-if="worshipStore.ancestorLocation" class="text-muted-foreground">
                （{{ worshipStore.ancestorLocation }}）
              </span>
            </template>
          </p>
        </div>

        <!-- 供品 -->
        <div v-if="worshipStore.mode === 'deity' && offeringStore.selectedOfferings.length">
          <h3 class="text-xs font-medium text-muted-foreground">供品</h3>
          <p class="mt-1 text-sm">
            {{ offeringStore.selectedOfferings.map(o => o.name).join('、') }}
          </p>
        </div>

        <!-- 祈願內容 -->
        <div v-if="worshipStore.prayerContent">
          <h3 class="text-xs font-medium text-muted-foreground">祈願內容</h3>
          <p class="mt-1 text-sm">{{ worshipStore.prayerContent }}</p>
        </div>

        <!-- 擲筊結果（拜神明模式） -->
        <div v-if="worshipStore.mode === 'deity' && divinationStore.history.length">
          <h3 class="text-xs font-medium text-muted-foreground">擲筊結果</h3>
          <div class="mt-1 flex flex-wrap gap-2">
            <span
              v-for="(record, index) in divinationStore.history"
              :key="index"
              class="rounded-md border border-border px-2 py-0.5 text-xs"
            >
              {{ RESULT_LABELS[record.result].name }}
            </span>
          </div>
        </div>

        <!-- 環保成效 -->
        <div class="border-t border-border pt-4">
          <h3 class="text-xs font-medium text-muted-foreground">🌱 環保成效</h3>
          <div class="mt-2 grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-muted/50 p-3 text-center">
              <p class="text-lg font-medium text-primary">{{ ceremonyImpact.paperSavedGrams }}g</p>
              <p class="text-xs text-muted-foreground">減少紙張用量</p>
            </div>
            <div class="rounded-lg bg-muted/50 p-3 text-center">
              <p class="text-lg font-medium text-primary">{{ ceremonyImpact.co2ReducedGrams.toFixed(1) }}g</p>
              <p class="text-xs text-muted-foreground">減少 CO₂ 排放</p>
            </div>
          </div>
          <!-- 明細 -->
          <div v-if="ceremonyImpact.jossPaperDetail.length || ceremonyImpact.paperCraftDetail.count" class="mt-3 space-y-1">
            <p v-for="detail in ceremonyImpact.jossPaperDetail" :key="detail.name" class="text-xs text-muted-foreground">
              {{ detail.name }}：{{ detail.grams }}g
            </p>
            <p v-if="ceremonyImpact.paperCraftDetail.count" class="text-xs text-muted-foreground">
              紙紮物品 ×{{ ceremonyImpact.paperCraftDetail.count }}：{{ ceremonyImpact.paperCraftDetail.grams }}g
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 操作按鈕 -->
    <div class="flex gap-3">
      <Button variant="outline" @click="handleShare">
        分享
      </Button>
      <Button @click="handleFinish">
        完成
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RESULT_LABELS, useDivinationStore } from '~/stores/divination'
import { useJossPaperStore } from '~/stores/joss-paper'
import { usePaperCraftStore } from '~/stores/paper-craft'
import { useOfferingStore } from '~/stores/offering'
import { useEcoImpactStore } from '~/stores/eco-impact'
import { calculateCeremonyImpact } from '~/lib/eco-calculator'
import deitiesData from '~/data/deities.json'

definePageMeta({ capability: 'worship-ceremony' })

const worshipStore = useWorshipStore()
const divinationStore = useDivinationStore()
const jossPaperStore = useJossPaperStore()
const paperCraftStore = usePaperCraftStore()
const offeringStore = useOfferingStore()
const ecoImpactStore = useEcoImpactStore()
const { guard } = useWorshipGuard()

const deityName = computed(() => {
  if (!worshipStore.selectedDeityId) return null
  const deity = (deitiesData as Array<{ id: string; name: string }>)
    .find(d => d.id === worshipStore.selectedDeityId)
  return deity?.name ?? null
})

const ceremonyImpact = computed(() =>
  calculateCeremonyImpact(
    jossPaperStore.selectedBundles,
    paperCraftStore.totalItems,
  ),
)

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: '線上拜拜',
      text: `我剛完成了一次${worshipStore.mode === 'deity' ? '拜神明' : '祭祖'}儀式！減少了 ${ceremonyImpact.value.paperSavedGrams}g 紙張消耗！`,
    }).catch(() => {})
  }
}

async function handleFinish() {
  // 儲存環保紀錄
  await ecoImpactStore.saveRecord(ceremonyImpact.value)

  await worshipStore.completeCeremony()
  // 重置子模組 store
  divinationStore.reset()
  jossPaperStore.reset()
  paperCraftStore.reset()
  offeringStore.reset()
  navigateTo('/worship')
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/summary')
})
</script>
