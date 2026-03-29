<script setup lang="ts">
import type { PrayerPurpose } from '~/types/temple-checkin'
import { PRAYER_PURPOSE_LABELS } from '~/types/temple-checkin'
import deitiesData from '~/data/deities.json'

definePageMeta({ capability: 'temple-checkin' })

const route = useRoute()
const router = useRouter()
const store = useTempleCheckinStore()

const checkinId = route.query.checkinId as string
const templeId = route.query.templeId as string
const temple = store.findTemple(templeId)

const purposes = Object.entries(PRAYER_PURPOSE_LABELS) as [PrayerPurpose, { name: string; icon: string }][]

// 根據廟宇神明找出推薦的祈願目的
const recommendedPurposes = computed(() => {
  if (!temple) return []
  const deityPurposes = new Set<string>()
  for (const deityId of temple.deities) {
    const deity = deitiesData.find(d => d.id === deityId)
    if (deity) {
      for (const p of deity.purposes) {
        deityPurposes.add(p)
      }
    }
  }
  return [...deityPurposes] as PrayerPurpose[]
})

function selectPurpose(purpose: PrayerPurpose) {
  store.setPrayerPurpose(checkinId, purpose)
  router.push(`/temple/route-guide?templeId=${templeId}&purpose=${purpose}`)
}

function skip() {
  router.push('/temple/search')
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <h1 class="text-2xl font-medium">選擇祈願目的</h1>
    <p v-if="temple" class="text-sm text-muted-foreground">
      {{ temple.name }} — 打卡成功！請選擇本次祈願目的
    </p>

    <!-- 推薦祈願 -->
    <div v-if="recommendedPurposes.length > 0" class="w-full max-w-sm">
      <p class="mb-2 text-xs font-medium text-muted-foreground">推薦祈願</p>
      <div class="grid grid-cols-2 gap-3">
        <Card
          v-for="purpose in recommendedPurposes"
          :key="purpose"
          class="cursor-pointer transition-colors hover:border-primary/50"
          @click="selectPurpose(purpose)"
        >
          <CardContent class="flex flex-col items-center gap-2 pt-6">
            <span class="text-2xl">{{ PRAYER_PURPOSE_LABELS[purpose].icon }}</span>
            <span class="text-sm font-medium">{{ PRAYER_PURPOSE_LABELS[purpose].name }}</span>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- 所有祈願 -->
    <div class="w-full max-w-sm">
      <p class="mb-2 text-xs font-medium text-muted-foreground">所有祈願類型</p>
      <div class="grid grid-cols-3 gap-3">
        <Card
          v-for="[purpose, label] in purposes"
          :key="purpose"
          class="cursor-pointer transition-colors hover:border-primary/50"
          :class="{ 'border-primary/30 bg-primary/5': recommendedPurposes.includes(purpose) }"
          @click="selectPurpose(purpose)"
        >
          <CardContent class="flex flex-col items-center gap-1 p-4">
            <span class="text-xl">{{ label.icon }}</span>
            <span class="text-xs">{{ label.name }}</span>
          </CardContent>
        </Card>
      </div>
    </div>

    <Button variant="ghost" size="sm" @click="skip">
      略過
    </Button>
  </div>
</template>
