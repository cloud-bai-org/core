<script setup lang="ts">
import { Html5Qrcode } from 'html5-qrcode'

definePageMeta({ capability: 'temple-checkin' })

const store = useTempleCheckinStore()
const router = useRouter()

const scannerRef = ref<HTMLDivElement>()
const scanner = ref<Html5Qrcode | null>(null)
const isScanning = ref(false)
const errorMessage = ref('')
const scannedTemple = ref<ReturnType<typeof store.findTemple>>(undefined)

async function startScanning() {
  if (!scannerRef.value || isScanning.value) return

  errorMessage.value = ''

  try {
    const html5Qrcode = new Html5Qrcode(scannerRef.value.id)
    scanner.value = html5Qrcode
    isScanning.value = true

    await html5Qrcode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess,
      () => {},
    )
  }
  catch {
    errorMessage.value = '無法開啟相機，請確認已授權相機權限'
    isScanning.value = false
  }
}

async function stopScanning() {
  if (scanner.value?.isScanning) {
    await scanner.value.stop()
  }
  scanner.value = null
  isScanning.value = false
}

function onScanSuccess(decodedText: string) {
  const templeId = parseQrCode(decodedText)
  const temple = templeId ? store.findTemple(templeId) : undefined

  if (temple) {
    scannedTemple.value = temple
    stopScanning()
  }
  else {
    errorMessage.value = '無法辨識此 QR Code，請嘗試手動搜尋'
    stopScanning()
  }
}

function parseQrCode(text: string): string | null {
  // 支援格式: "temple:{id}" 或直接是 temple id
  if (text.startsWith('temple:')) return text.slice(7)
  if (store.findTemple(text)) return text
  return null
}

function confirmCheckin() {
  if (!scannedTemple.value) return
  const record = store.checkin(scannedTemple.value.id)
  router.push(`/temple/prayer-purpose?checkinId=${record.id}&templeId=${scannedTemple.value.id}`)
}

function goToSearch() {
  router.push('/temple/search')
}

onUnmounted(() => {
  stopScanning()
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <h1 class="text-2xl font-medium">QR Code 掃描打卡</h1>

    <!-- 掃描區域 -->
    <template v-if="!scannedTemple">
      <div
        id="qr-scanner"
        ref="scannerRef"
        class="w-full max-w-sm overflow-hidden rounded-lg bg-muted"
        :class="{ 'min-h-[300px]': isScanning }"
      />

      <div v-if="!isScanning" class="flex flex-col items-center gap-3">
        <Button @click="startScanning">
          開始掃描
        </Button>
        <Button variant="outline" @click="goToSearch">
          手動搜尋廟宇
        </Button>
      </div>

      <div v-if="isScanning" class="text-center">
        <p class="text-sm text-muted-foreground">請將相機對準廟宇 QR Code</p>
        <Button variant="ghost" size="sm" class="mt-2" @click="stopScanning">
          停止掃描
        </Button>
      </div>
    </template>

    <!-- 掃描成功 -->
    <template v-if="scannedTemple">
      <Card class="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{{ scannedTemple.name }}</CardTitle>
          <CardDescription>{{ scannedTemple.address }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">{{ scannedTemple.description }}</p>
        </CardContent>
        <CardFooter class="flex gap-2">
          <Button class="flex-1" @click="confirmCheckin">
            確認打卡
          </Button>
          <Button variant="outline" @click="scannedTemple = undefined; startScanning()">
            重新掃描
          </Button>
        </CardFooter>
      </Card>
    </template>

    <!-- 錯誤訊息 -->
    <div v-if="errorMessage" class="w-full max-w-sm rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
      <p class="text-sm text-destructive">{{ errorMessage }}</p>
      <Button variant="outline" size="sm" class="mt-3" @click="goToSearch">
        改用手動搜尋
      </Button>
    </div>
  </div>
</template>
