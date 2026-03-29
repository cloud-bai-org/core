<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <h1 class="text-2xl font-medium">紙紮焚燒</h1>

    <!-- 階段一：選擇紙紮物品 -->
    <template v-if="store.phase === 'selecting'">
      <p class="text-sm text-muted-foreground">選擇要焚燒的紙紮物品</p>

      <div class="w-full max-w-sm">
        <!-- 焚燒清單預覽 -->
        <PaperCraftBurnListPreview class="mb-4" />

        <!-- 自訂物品輸入 -->
        <PaperCraftCustomItemInput class="mb-4" />

        <!-- 分類瀏覽 / 品項列表 -->
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
</template>

<script setup lang="ts">
import { usePaperCraftStore } from '~/stores/paper-craft'

definePageMeta({ capability: 'paper-craft-burning' })

const store = usePaperCraftStore()
const selectedCategoryId = ref<string | null>(null)

function handleRestart() {
  store.reset()
  selectedCategoryId.value = null
}

function handleContinue() {
  store.reset()
  // 紙紮焚燒完成後返回儀式流程的下一步驟
  navigateTo('/worship')
}
</script>
