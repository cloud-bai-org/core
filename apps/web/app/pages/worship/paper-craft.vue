<template>
  <CeremonyLayout hide-next-button>
    <div class="flex flex-col items-center gap-6">
      <h1 class="text-2xl font-medium">紙紮焚燒</h1>

      <!-- 階段一：選擇紙紮物品 -->
      <template v-if="store.phase === 'selecting'">
        <p class="text-sm text-muted-foreground">選擇要焚燒的紙紮物品</p>

        <div class="w-full max-w-sm">
          <PaperCraftBurnListPreview class="mb-4" />
          <PaperCraftCustomItemInput class="mb-4" />
          <PaperCraftItemList
            v-if="selectedCategoryId"
            :category-id="selectedCategoryId"
            @back="selectedCategoryId = null"
          />
          <PaperCraftCategoryList
            v-else
            :selected-category-id="selectedCategoryId"
            @select="selectedCategoryId = $event"
          />
        </div>

        <Button
          size="lg"
          :disabled="store.totalItems === 0"
          @click="store.startBurning()"
        >
          開始焚燒
        </Button>
      </template>

      <!-- 階段二：焚燒中 -->
      <template v-else-if="store.phase === 'burning'">
        <PaperCraftBurnScene />
      </template>

      <!-- 階段三：焚燒完成 -->
      <template v-else-if="store.phase === 'completed'">
        <PaperCraftBurnComplete />
        <div class="flex gap-3">
          <Button variant="outline" @click="handleRestart">
            再燒一次
          </Button>
          <Button size="lg" @click="handleContinue">
            繼續儀式
          </Button>
        </div>
      </template>
    </div>
  </CeremonyLayout>
</template>

<script setup lang="ts">
import { usePaperCraftStore } from '~/stores/paper-craft'
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const store = usePaperCraftStore()
const worshipStore = useWorshipStore()
const { guard } = useWorshipGuard()
const selectedCategoryId = ref<string | null>(null)

function handleRestart() {
  store.reset()
  selectedCategoryId.value = null
}

async function handleContinue() {
  store.reset()
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/paper-craft')
})
</script>
