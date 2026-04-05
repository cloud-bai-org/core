<script setup lang="ts">
definePageMeta({ capability: 'temple-checkin' })

const store = useTempleCheckinStore()

const earnedBadgeIds = computed(() =>
  new Set(store.earnedBadges.map(b => b.badgeId)),
)

const sortedBadges = computed(() =>
  [...store.achievements].sort((a, b) => {
    const aEarned = earnedBadgeIds.value.has(a.id)
    const bEarned = earnedBadgeIds.value.has(b.id)
    if (aEarned && !bEarned) return -1
    if (!aEarned && bEarned) return 1
    return 0
  }),
)

function getEarnedDate(badgeId: string): string | null {
  const earned = store.earnedBadges.find(b => b.badgeId === badgeId)
  if (!earned) return null
  return new Date(earned.earnedAt).toLocaleDateString('zh-TW')
}

// 新獲得徽章的動畫
const justEarnedId = ref<string | null>(null)

function showAnimation(badgeId: string) {
  justEarnedId.value = badgeId
  setTimeout(() => {
    justEarnedId.value = null
  }, 1500)
}

// 監聽新成就
watch(
  () => store.earnedBadges.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) {
      const latest = store.earnedBadges[newLen - 1]
      if (latest) showAnimation(latest.badgeId)
    }
  },
)
</script>

<template>
  <div class="flex flex-col gap-6 py-8">
    <div>
      <h1 class="text-2xl font-medium">成就徽章</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        已獲得 {{ store.earnedBadges.length }} / {{ store.achievements.length }} 個徽章
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <Card
        v-for="badge in sortedBadges"
        :key="badge.id"
        class="transition-all duration-300"
        :class="{
          'opacity-40': !earnedBadgeIds.has(badge.id),
          'scale-110 ring-2 ring-primary': justEarnedId === badge.id,
        }"
      >
        <CardContent class="flex flex-col items-center gap-2 pt-6 text-center">
          <span
            class="text-3xl transition-transform duration-300"
            :class="{ 'animate-bounce': justEarnedId === badge.id }"
          >
            {{ badge.icon }}
          </span>
          <p class="text-sm font-medium">{{ badge.name }}</p>
          <p class="text-xs text-muted-foreground">{{ badge.description }}</p>
          <p v-if="getEarnedDate(badge.id)" class="text-xs text-primary">
            {{ getEarnedDate(badge.id) }} 獲得
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
