<template>
  <CeremonyLayout hide-next-button @next="handleContinue">
    <div class="flex flex-col items-center gap-6">
      <h1 class="text-2xl font-medium">
        {{ worshipStore.mode === 'ancestor' ? '記錄供品' : '供品擺設' }}
      </h1>

      <!-- 祭祖模式：拍照記錄供品 -->
      <template v-if="worshipStore.mode === 'ancestor'">
        <p class="text-sm text-muted-foreground">拍照記錄您準備的供品（可跳過）</p>

        <div class="w-full max-w-sm">
          <div
            v-if="!photoPreview"
            class="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50"
            @click="triggerCamera"
          >
            <Camera :size="32" class="text-muted-foreground" />
            <span class="text-sm text-muted-foreground">點擊拍照記錄供品</span>
          </div>

          <div v-else class="relative">
            <img :src="photoPreview" alt="供品照片" class="w-full rounded-lg" />
            <button
              class="absolute right-2 top-2 rounded-full bg-background/80 p-1"
              @click="clearPhoto"
            >
              <X :size="16" />
            </button>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            @change="handleFileChange"
          />
        </div>

        <div class="flex gap-3">
          <Button variant="outline" @click="handleContinue">
            跳過
          </Button>
          <Button v-if="photoPreview" @click="handleContinue">
            繼續儀式
          </Button>
        </div>
      </template>

      <!-- 拜神明模式：供品互動擺設 -->
      <template v-else>
        <!-- 階段一：選擇供品 -->
        <template v-if="offeringStore.phase === 'selecting'">
          <p class="text-sm text-muted-foreground">選擇要供奉的供品</p>

          <!-- 建議供品提示 -->
          <Card v-if="suggestedOfferings" class="w-full max-w-sm">
            <CardContent class="pt-4 pb-4">
              <p class="text-xs text-muted-foreground">根據所選神明建議供品：</p>
              <p class="mt-1 text-sm font-medium">{{ suggestedOfferings }}</p>
            </CardContent>
          </Card>

          <div class="w-full max-w-sm">
            <OfferingSelector />
          </div>
          <Button
            size="lg"
            :disabled="offeringStore.selectedOfferings.length === 0"
            @click="offeringStore.proceedToArranging()"
          >
            開始擺設
          </Button>
        </template>

        <!-- 階段二：拖放擺設 -->
        <template v-else-if="offeringStore.phase === 'arranging'">
          <p class="text-sm text-muted-foreground">將供品拖放至理想位置</p>
          <div class="w-full max-w-md">
            <OfferingAltar />
          </div>
          <div class="flex gap-3">
            <Button variant="outline" @click="offeringStore.phase = 'selecting'">
              返回選擇
            </Button>
            <Button
              size="lg"
              :disabled="offeringStore.altarOfferings.length === 0"
              @click="offeringStore.complete()"
            >
              擺設完成
            </Button>
          </div>
        </template>

        <!-- 階段三：擺設完成 -->
        <template v-else-if="offeringStore.phase === 'completed'">
          <OfferingComplete />
          <div class="flex gap-3">
            <Button variant="outline" @click="offeringStore.reset()">
              重新擺設
            </Button>
            <Button size="lg" @click="handleContinue">
              繼續儀式
            </Button>
          </div>
        </template>
      </template>
    </div>
  </CeremonyLayout>
</template>

<script setup lang="ts">
import { Camera, X } from 'lucide-vue-next'
import { useOfferingStore } from '~/stores/offering'
import deitiesData from '~/data/deities.json'
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const worshipStore = useWorshipStore()
const offeringStore = useOfferingStore()
const { guard } = useWorshipGuard()

// 拍照相關
const fileInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)

// 建議供品
const suggestedOfferings = computed(() => {
  if (!worshipStore.selectedDeityId) return null
  const deity = (deitiesData as Array<{ id: string; offerings: string[] }>)
    .find(d => d.id === worshipStore.selectedDeityId)
  return deity?.offerings.join('、') ?? null
})

function triggerCamera() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function clearPhoto() {
  photoPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function handleContinue() {
  offeringStore.reset()
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/offering')
})
</script>
