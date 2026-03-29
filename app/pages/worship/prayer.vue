<template>
  <CeremonyLayout @next="handleNext">
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <h1 class="text-2xl font-medium">祈禱</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ worshipStore.mode === 'ancestor' ? '對祖先說說心裡話（可跳過）' : '誠心祈願，向神明訴說心願（可跳過）' }}
        </p>
      </div>

      <div class="w-full max-w-sm">
        <textarea
          v-model="prayerText"
          rows="6"
          class="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          :placeholder="placeholder"
          @input="onInput"
        />
      </div>

      <!-- 焚香剩餘時間 -->
      <div
        v-if="incenseStore.isActive"
        class="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <span>🔥</span>
        <span>焚香進行中（{{ remainingText }}）</span>
      </div>
    </div>
  </CeremonyLayout>
</template>

<script setup lang="ts">
import { useIncenseStore } from '~/stores/incense'
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const worshipStore = useWorshipStore()
const incenseStore = useIncenseStore()
const { guard } = useWorshipGuard()

const prayerText = ref(worshipStore.prayerContent)

const placeholder = computed(() => {
  if (worshipStore.mode === 'ancestor') {
    return '想對祖先/親人說的話...'
  }
  return '寫下您的心願...'
})

const remainingText = computed(() => {
  if (!incenseStore.endTime || !incenseStore.startTime) return ''
  const total = incenseStore.endTime - incenseStore.startTime
  const remaining = Math.max(0, total * incenseStore.remainingRatio)
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

function onInput() {
  worshipStore.setPrayer(prayerText.value)
}

async function handleNext() {
  worshipStore.setPrayer(prayerText.value)
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/prayer')
})
</script>
