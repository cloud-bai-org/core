<script setup lang="ts">
const authStore = useAuthStore()
const { logout } = useLogout()
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto flex h-14 items-center justify-between px-4">
        <NuxtLink to="/" class="text-lg font-medium text-secondary">
          線上拜拜
        </NuxtLink>
        <div class="flex items-center gap-2">
          <template v-if="authStore.isLoggedIn">
            <span class="text-sm text-muted-foreground">{{ authStore.user?.name }}</span>
            <Button variant="ghost" size="sm" @click="logout">
              登出
            </Button>
          </template>
          <template v-else>
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/login">
                登入
              </NuxtLink>
            </Button>
          </template>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
