<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div
    v-if="authStore.isGuest"
    class="rounded-lg border border-secondary/30 bg-secondary/10 p-4 text-center"
  >
    <p class="mb-3 text-sm text-foreground/80">
      登入即可將紀錄綁定至你的帳號
    </p>
    <Button
      as-child
      variant="secondary"
      size="sm"
    >
      <NuxtLink to="/login">
        前往登入
      </NuxtLink>
    </Button>
  </div>
</template>
