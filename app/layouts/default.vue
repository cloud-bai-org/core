<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto flex h-14 items-center px-4">
        <NuxtLink to="/" class="text-lg font-medium text-secondary">
          線上拜拜
        </NuxtLink>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
