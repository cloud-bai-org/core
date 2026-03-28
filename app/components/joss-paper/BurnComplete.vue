<template>
  <div class="flex flex-col items-center gap-4 py-4">
    <div class="text-4xl">🙏</div>
    <h2 class="text-xl font-medium">焚燒完成</h2>
    <p class="text-sm text-muted-foreground">
      已焚燒 {{ paperCount }} 張金紙
    </p>

    <!-- 環保回饋 -->
    <Card class="w-full max-w-xs">
      <CardContent class="flex flex-col items-center gap-2 pt-6">
        <span class="text-2xl">🌱</span>
        <p class="text-center text-sm">
          本次焚燒以數位方式完成，<br>
          減少了約 <span class="font-semibold text-green-600">{{ savedGrams }}g</span> 的實體紙張消耗
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useJossPaperStore } from '~/stores/joss-paper'

const store = useJossPaperStore()

const paperCount = computed(() => store.selectedPapers.length)
const savedGrams = computed(() => store.totalPaperGrams)
</script>
