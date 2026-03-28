<template>
  <div class="flex flex-col items-center justify-center gap-4 py-12">
    <h1 class="text-2xl font-medium">QR Code 掃描打卡</h1>
    <p class="text-sm text-muted-foreground">capability: temple-checkin</p>
    <Card class="w-full max-w-sm">
      <CardContent class="pt-6">
        <p class="text-center text-muted-foreground">功能開發中</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ capability: 'temple-checkin' })
</script>
