<template>
  <div class="flex flex-col items-center gap-4 py-4">
    <div class="text-4xl">🙏</div>
    <h2 class="text-xl font-medium">焚燒完成</h2>
    <p class="text-sm text-muted-foreground">
      已焚燒 {{ store.totalItems }} 件紙紮物品
    </p>

    <!-- 焚燒物品列表 -->
    <div class="flex flex-wrap justify-center gap-1.5">
      <span
        v-for="(item, idx) in store.burnList"
        :key="item.id + idx"
        class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
      >
        {{ item.name }}
      </span>
    </div>

    <!-- 環保回饋 -->
    <Card class="w-full max-w-xs">
      <CardContent class="flex flex-col items-center gap-2 pt-6">
        <span class="text-2xl">🌱</span>
        <p class="text-center text-sm">
          本次焚燒以數位方式完成，<br>
          減少了約 <span class="font-semibold text-green-600">{{ store.totalPaperGrams }}g</span> 的實體紙紮消耗
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { usePaperCraftStore } from '~/stores/paper-craft'

const store = usePaperCraftStore()
</script>
