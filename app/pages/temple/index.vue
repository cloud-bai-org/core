<script setup lang="ts">
definePageMeta({ capability: 'temple-checkin' })

const store = useTempleCheckinStore()

const navItems = [
  { to: '/temple/scan', label: 'QR Code 掃描', icon: '📷', description: '掃描廟宇 QR Code 快速打卡' },
  { to: '/temple/search', label: '搜尋廟宇', icon: '🔍', description: '手動搜尋並選擇廟宇打卡' },
  { to: '/temple/footprint', label: '我的足跡', icon: '🗺️', description: '查看參拜足跡地圖' },
  { to: '/temple/achievements', label: '成就徽章', icon: '🏆', description: '查看已獲得的成就徽章' },
  { to: '/temple/stats', label: '參拜統計', icon: '📊', description: '查看參拜歷程統計' },
]
</script>

<template>
  <div class="flex flex-col gap-6 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-medium">廟宇打卡</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        探索廟宇、打卡祈福、累積成就
      </p>
    </div>

    <!-- 快速統計 -->
    <div v-if="store.totalCheckins > 0" class="flex justify-center gap-6 text-center">
      <div>
        <span class="text-lg font-bold">{{ store.totalCheckins }}</span>
        <p class="text-xs text-muted-foreground">打卡次數</p>
      </div>
      <div>
        <span class="text-lg font-bold">{{ store.uniqueTempleIds.length }}</span>
        <p class="text-xs text-muted-foreground">造訪廟宇</p>
      </div>
      <div>
        <span class="text-lg font-bold">{{ store.earnedBadges.length }}</span>
        <p class="text-xs text-muted-foreground">成就徽章</p>
      </div>
    </div>

    <!-- 導覽選單 -->
    <div class="flex flex-col gap-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
      >
        <Card class="transition-colors hover:border-primary/50">
          <CardContent class="flex items-center gap-4 p-4">
            <span class="text-2xl">{{ item.icon }}</span>
            <div>
              <p class="font-medium">{{ item.label }}</p>
              <p class="text-sm text-muted-foreground">{{ item.description }}</p>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>
