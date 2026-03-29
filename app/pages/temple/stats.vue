<script setup lang="ts">
import { PRAYER_PURPOSE_LABELS } from '~/types/temple-checkin'

definePageMeta({ capability: 'temple-checkin' })

const store = useTempleCheckinStore()

const stats = computed(() => ({
  totalCheckins: store.totalCheckins,
  uniqueTemples: store.uniqueTempleIds.length,
  totalBadges: store.earnedBadges.length,
}))

const purposeDistribution = computed(() =>
  Object.entries(store.purposeCounts).map(([purpose, count]) => ({
    purpose,
    label: PRAYER_PURPOSE_LABELS[purpose as keyof typeof PRAYER_PURPOSE_LABELS],
    count,
  })).sort((a, b) => b.count - a.count),
)

const recentCheckins = computed(() =>
  [...store.checkins]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10),
)
</script>

<template>
  <div class="flex flex-col gap-6 py-8">
    <h1 class="text-2xl font-medium">參拜統計</h1>

    <!-- 總覽數據 -->
    <div class="grid grid-cols-3 gap-3">
      <Card>
        <CardContent class="flex flex-col items-center pt-6">
          <span class="text-2xl font-bold">{{ stats.totalCheckins }}</span>
          <span class="text-xs text-muted-foreground">總打卡次數</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="flex flex-col items-center pt-6">
          <span class="text-2xl font-bold">{{ stats.uniqueTemples }}</span>
          <span class="text-xs text-muted-foreground">造訪廟宇</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="flex flex-col items-center pt-6">
          <span class="text-2xl font-bold">{{ stats.totalBadges }}</span>
          <span class="text-xs text-muted-foreground">成就徽章</span>
        </CardContent>
      </Card>
    </div>

    <!-- 祈願分佈 -->
    <div>
      <h2 class="mb-3 text-lg font-medium">祈願類型分佈</h2>
      <div v-if="purposeDistribution.length === 0" class="text-sm text-muted-foreground">
        尚無祈願紀錄
      </div>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="item in purposeDistribution"
          :key="item.purpose"
          class="flex items-center gap-3"
        >
          <span class="w-6 text-center">{{ item.label.icon }}</span>
          <span class="w-12 text-sm">{{ item.label.name }}</span>
          <div class="flex-1">
            <div
              class="h-5 rounded-full bg-primary/20"
            >
              <div
                class="h-full rounded-full bg-primary transition-all"
                :style="{ width: `${(item.count / stats.totalCheckins) * 100}%` }"
              />
            </div>
          </div>
          <span class="w-8 text-right text-sm text-muted-foreground">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <!-- 最近打卡 -->
    <div>
      <h2 class="mb-3 text-lg font-medium">最近打卡</h2>
      <div v-if="recentCheckins.length === 0" class="text-sm text-muted-foreground">
        尚無打卡紀錄
      </div>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="checkin in recentCheckins"
          :key="checkin.id"
          class="flex items-center justify-between rounded-lg border border-border p-3"
        >
          <div>
            <p class="text-sm font-medium">{{ checkin.templeName }}</p>
            <p class="text-xs text-muted-foreground">
              {{ new Date(checkin.timestamp).toLocaleString('zh-TW') }}
            </p>
          </div>
          <span v-if="checkin.prayerPurpose" class="text-lg">
            {{ PRAYER_PURPOSE_LABELS[checkin.prayerPurpose].icon }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
