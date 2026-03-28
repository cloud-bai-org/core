<script setup lang="ts">
import { handleGoogleCallback } from '~/services/google-auth'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const error = ref('')
const loading = ref(true)

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    error.value = '授權失敗，請重新嘗試'
    loading.value = false
    return
  }

  try {
    const redirectUri = `${config.public.authRedirectBase}/auth/callback/google`
    const result = await handleGoogleCallback(code, redirectUri)
    authStore.setUser(result.user, result.token)
    router.replace('/')
  }
  catch {
    error.value = 'Google 登入失敗，請重新嘗試'
    loading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div
      v-if="loading"
      class="text-muted-foreground"
    >
      正在處理登入...
    </div>
    <div
      v-else-if="error"
      class="flex flex-col items-center gap-4"
    >
      <p class="text-destructive">
        {{ error }}
      </p>
      <Button
        as-child
        variant="outline"
      >
        <NuxtLink to="/login">
          返回登入頁
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
