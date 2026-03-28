<script setup lang="ts">
import { handleLineCallback } from '~/services/line-auth'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { syncAfterLogin } = usePostLogin()

const error = ref('')
const loading = ref(true)

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string

  if (!code || !state) {
    error.value = '授權失敗，請重新嘗試'
    loading.value = false
    return
  }

  try {
    const redirectUri = `${config.public.authRedirectBase}/auth/callback/line`
    const result = await handleLineCallback(code, state, redirectUri)
    authStore.setUser(result.user, result.token)
    await syncAfterLogin()
    router.replace('/')
  }
  catch {
    error.value = 'LINE 登入失敗，請重新嘗試'
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
