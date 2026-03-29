<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

definePageMeta({ capability: 'temple-checkin' })

const authStore = useAuthStore()
const store = useTempleCheckinStore()

const mapContainer = ref<HTMLDivElement>()
const mapInstance = ref<L.Map | null>(null)
const selectedCheckin = ref<{ templeName: string; time: string } | null>(null)

// 取得已打卡的廟宇（去重）
const checkedTemples = computed(() => {
  const seen = new Set<string>()
  return store.checkins
    .filter((c) => {
      if (seen.has(c.templeId)) return false
      seen.add(c.templeId)
      return true
    })
    .map((c) => {
      const temple = store.findTemple(c.templeId)
      return {
        checkin: c,
        temple,
      }
    })
    .filter(item => item.temple)
})

async function initMap() {
  if (!mapContainer.value || mapInstance.value) return

  const L = await import('leaflet')

  // 修正 Leaflet 預設 icon 路徑問題
  delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  const map = L.map(mapContainer.value).setView([25.045, 121.53], 12)
  mapInstance.value = map

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // 加入已打卡廟宇標記
  for (const { checkin, temple } of checkedTemples.value) {
    if (!temple) continue
    const marker = L.marker([temple.location.lat, temple.location.lng]).addTo(map)
    marker.bindPopup(`<b>${temple.name}</b><br>${new Date(checkin.timestamp).toLocaleDateString('zh-TW')}`)
    marker.on('click', () => {
      selectedCheckin.value = {
        templeName: temple.name,
        time: new Date(checkin.timestamp).toLocaleString('zh-TW'),
      }
    })
  }

  // 如果有標記，調整地圖範圍
  if (checkedTemples.value.length > 0) {
    const bounds = L.latLngBounds(
      checkedTemples.value
        .filter(item => item.temple)
        .map(item => [item.temple!.location.lat, item.temple!.location.lng] as [number, number]),
    )
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    nextTick(() => initMap())
  }
})

onUnmounted(() => {
  mapInstance.value?.remove()
  mapInstance.value = null
})
</script>

<template>
  <div class="flex flex-col gap-6 py-8">
    <h1 class="text-2xl font-medium">我的拜拜足跡</h1>

    <!-- 未登入提示 -->
    <template v-if="!authStore.isLoggedIn">
      <Card class="w-full max-w-sm mx-auto">
        <CardContent class="flex flex-col items-center gap-4 pt-6">
          <p class="text-center text-muted-foreground">登入後即可查看你的參拜足跡地圖</p>
          <Button as-child>
            <NuxtLink to="/login">前往登入</NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </template>

    <!-- 已登入：地圖 -->
    <template v-else>
      <p class="text-sm text-muted-foreground">
        已造訪 {{ checkedTemples.length }} 間廟宇
      </p>

      <div v-if="checkedTemples.length === 0" class="text-center py-8">
        <p class="text-muted-foreground">還沒有打卡紀錄，快去探索廟宇吧！</p>
        <Button class="mt-3" as-child>
          <NuxtLink to="/temple/search">搜尋廟宇</NuxtLink>
        </Button>
      </div>

      <div
        ref="mapContainer"
        class="h-[400px] w-full rounded-lg border border-border"
      />

      <!-- 選中的打卡資訊 -->
      <Card v-if="selectedCheckin" class="w-full max-w-sm mx-auto">
        <CardContent class="pt-4">
          <p class="font-medium">{{ selectedCheckin.templeName }}</p>
          <p class="text-sm text-muted-foreground">打卡時間：{{ selectedCheckin.time }}</p>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
