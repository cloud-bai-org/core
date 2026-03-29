<template>
  <CeremonyLayout :next-disabled="!isValid" @next="handleNext">
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <h1 class="text-2xl font-medium">祭拜設定</h1>
        <p class="mt-1 text-sm text-muted-foreground">設定祭拜對象資訊</p>
      </div>

      <div class="flex w-full max-w-sm flex-col gap-5">
        <!-- 祭拜對象稱謂（必填） -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">
            祭拜對象稱謂
            <span class="text-destructive">*</span>
          </label>
          <input
            v-model="name"
            type="text"
            class="rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="例如：阿公、外婆、爸爸"
          />
        </div>

        <!-- 祭拜地點（選填） -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">
            祭拜地點
            <span class="text-xs text-muted-foreground">（選填）</span>
          </label>

          <!-- 快捷選項 -->
          <div class="flex gap-2">
            <Button
              v-for="option in locationOptions"
              :key="option"
              size="sm"
              :variant="location === option ? 'default' : 'outline'"
              @click="selectLocation(option)"
            >
              {{ option }}
            </Button>
          </div>

          <!-- 自由輸入 -->
          <input
            v-model="location"
            type="text"
            class="rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="或輸入其他地點"
          />
        </div>
      </div>
    </div>
  </CeremonyLayout>
</template>

<script setup lang="ts">
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const worshipStore = useWorshipStore()
const { guard } = useWorshipGuard()

const name = ref(worshipStore.ancestorName)
const location = ref(worshipStore.ancestorLocation)

const locationOptions = ['在家', '靈骨塔', '墓園']

const isValid = computed(() => name.value.trim().length > 0)

function selectLocation(option: string) {
  location.value = location.value === option ? '' : option
}

async function handleNext() {
  worshipStore.setAncestor(name.value.trim(), location.value.trim())
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/ancestor-setup')
})
</script>
