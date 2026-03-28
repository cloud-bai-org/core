<template>
  <div class="flex flex-col items-center justify-center gap-6 py-12">
    <h1 class="text-2xl font-medium text-secondary">線上拜拜</h1>
    <p class="text-muted-foreground">將傳統拜拜習俗數位化，以環保方式完成儀式</p>
    <div class="flex gap-3">
      <Button as-child>
        <NuxtLink to="/worship">開始拜拜</NuxtLink>
      </Button>
      <Button variant="outline" as-child>
        <NuxtLink to="/temple/search">廟宇探索</NuxtLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ capability: 'home' })
</script>
