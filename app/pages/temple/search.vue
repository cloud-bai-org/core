<script setup lang="ts">
import type { Temple } from '@@/types/data'

definePageMeta({ capability: 'temple-checkin' })

const store = useTempleCheckinStore()
const router = useRouter()

const searchQuery = ref('')
const selectedTemple = ref<Temple | null>(null)

const searchResults = computed(() => store.searchTemples(searchQuery.value))

function selectTemple(temple: Temple) {
  selectedTemple.value = temple
}

function confirmCheckin() {
  if (!selectedTemple.value) return
  const record = store.checkin(selectedTemple.value.id)
  router.push(`/temple/prayer-purpose?checkinId=${record.id}&templeId=${selectedTemple.value.id}`)
}

function goToScan() {
  router.push('/temple/scan')
}
</script>

<template>
  <div class="flex flex-col gap-6 py-8">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-medium">搜尋廟宇</h1>
      <Button variant="outline" size="sm" @click="goToScan">
        QR Code 掃描
      </Button>
    </div>

    <!-- 搜尋輸入 -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="輸入廟宇名稱或地址..."
        class="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
    </div>

    <!-- 選中的廟宇 -->
    <Card v-if="selectedTemple" class="border-primary">
      <CardHeader>
        <CardTitle>{{ selectedTemple.name }}</CardTitle>
        <CardDescription>{{ selectedTemple.address }}</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">{{ selectedTemple.description }}</p>
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="deityId in selectedTemple.deities"
            :key="deityId"
            class="rounded-full bg-secondary/20 px-2 py-0.5 text-xs text-secondary-foreground"
          >
            {{ deityId.replace('deity-', '') }}
          </span>
        </div>
      </CardContent>
      <CardFooter class="flex gap-2">
        <Button class="flex-1" @click="confirmCheckin">
          打卡
        </Button>
        <Button variant="outline" @click="selectedTemple = null">
          取消
        </Button>
      </CardFooter>
    </Card>

    <!-- 搜尋結果列表 -->
    <div v-if="!selectedTemple" class="flex flex-col gap-3">
      <p v-if="searchResults.length === 0" class="text-center text-sm text-muted-foreground py-8">
        找不到符合的廟宇
      </p>
      <Card
        v-for="temple in searchResults"
        :key="temple.id"
        class="cursor-pointer transition-colors hover:border-primary/50"
        @click="selectTemple(temple)"
      >
        <CardHeader class="pb-2">
          <CardTitle class="text-base">{{ temple.name }}</CardTitle>
          <CardDescription>{{ temple.address }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground line-clamp-2">{{ temple.description }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
