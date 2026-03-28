<script setup lang="ts">
import { getGoogleAuthUrl } from '~/services/google-auth'
import { getLineAuthUrl } from '~/services/line-auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const router = useRouter()

if (authStore.isLoggedIn) {
  router.replace('/')
}

const googleRedirectUri = `${config.public.authRedirectBase}/auth/callback/google`
const lineRedirectUri = `${config.public.authRedirectBase}/auth/callback/line`

function loginWithGoogle() {
  const url = getGoogleAuthUrl(config.public.googleClientId, googleRedirectUri)
  navigateTo(url, { external: true })
}

function loginWithLine() {
  const url = getLineAuthUrl(config.public.lineChannelId, lineRedirectUri)
  navigateTo(url, { external: true })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-12">
    <h1 class="text-2xl font-medium">
      登入
    </h1>
    <p class="text-sm text-muted-foreground">
      登入後可跨裝置同步拜拜紀錄
    </p>
    <Card class="w-full max-w-sm">
      <CardContent class="flex flex-col gap-3 pt-6">
        <Button
          class="w-full"
          variant="outline"
          @click="loginWithGoogle"
        >
          使用 Google 登入
        </Button>
        <Button
          class="w-full"
          variant="outline"
          @click="loginWithLine"
        >
          使用 LINE 登入
        </Button>
      </CardContent>
      <CardFooter class="justify-center">
        <Button
          variant="ghost"
          size="sm"
          as-child
        >
          <NuxtLink to="/">
            以訪客身份繼續
          </NuxtLink>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
