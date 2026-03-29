<script setup lang="ts">
import type { PrayerPurpose } from '@@/types/temple-checkin'
import { PRAYER_PURPOSE_LABELS, deitiesData } from '~/stores/temple-checkin'

definePageMeta({ capability: 'temple-checkin' })

const route = useRoute()
const router = useRouter()
const store = useTempleCheckinStore()

const templeId = route.query.templeId as string
const purpose = route.query.purpose as PrayerPurpose
const temple = store.findTemple(templeId)

const currentStep = ref(0)

// 根據祈願目的產生推薦路線
const routeSteps = computed(() => {
  if (!temple) return []

  // 找出與祈願目的相關的神明
  const relevantDeityIds = new Set<string>()
  for (const deityId of temple.deities) {
    const deity = deitiesData.find(d => d.id === deityId)
    if (deity?.purposes.includes(purpose)) {
      relevantDeityIds.add(deityId)
    }
  }

  // 如果有靜態路線就用靜態路線
  if (temple.routes.length > 0) {
    const matchedRoute = temple.routes[0]!
    return matchedRoute.steps.map(step => {
      const deity = deitiesData.find(d => d.id === step.deityId)
      return {
        ...step,
        deityName: deity?.name ?? '未知',
        deityTitle: deity?.title ?? '',
        isRelevant: relevantDeityIds.has(step.deityId),
      }
    })
  }

  // 否則按殿堂順序走
  return temple.halls.map(hall => {
    const deity = deitiesData.find(d => d.id === hall.deityId)
    return {
      order: hall.order,
      deityId: hall.deityId,
      location: hall.name,
      deityName: deity?.name ?? '未知',
      deityTitle: deity?.title ?? '',
      isRelevant: relevantDeityIds.has(hall.deityId),
    }
  })
})

function nextStep() {
  if (currentStep.value < routeSteps.value.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function finish() {
  router.push('/temple/search')
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-medium">參拜路線導覽</h1>
      <p v-if="temple && purpose" class="mt-1 text-sm text-muted-foreground">
        {{ temple.name }} · {{ PRAYER_PURPOSE_LABELS[purpose]?.icon }} {{ PRAYER_PURPOSE_LABELS[purpose]?.name }}
      </p>
    </div>

    <!-- 路線進度 -->
    <div class="flex w-full max-w-sm items-center gap-1">
      <div
        v-for="(step, i) in routeSteps"
        :key="i"
        class="h-1.5 flex-1 rounded-full transition-colors"
        :class="i <= currentStep ? 'bg-primary' : 'bg-muted'"
      />
    </div>

    <!-- 當前步驟 -->
    <Card v-if="routeSteps[currentStep]" class="w-full max-w-sm">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardDescription>第 {{ currentStep + 1 }} / {{ routeSteps.length }} 站</CardDescription>
          <span
            v-if="routeSteps[currentStep]!.isRelevant"
            class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
          >
            推薦
          </span>
        </div>
        <CardTitle>{{ routeSteps[currentStep]!.location }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            <span class="text-muted-foreground">主祀：</span>
            {{ routeSteps[currentStep]!.deityName }}
            <span v-if="routeSteps[currentStep]!.deityTitle" class="text-muted-foreground">
              （{{ routeSteps[currentStep]!.deityTitle }}）
            </span>
          </p>
          <p class="text-sm text-muted-foreground">
            雙手合十，誠心參拜，默念姓名與祈願
          </p>
        </div>
      </CardContent>
      <CardFooter class="flex gap-2">
        <Button
          variant="outline"
          :disabled="currentStep === 0"
          @click="prevStep"
        >
          上一站
        </Button>
        <Button
          v-if="currentStep < routeSteps.length - 1"
          class="flex-1"
          @click="nextStep"
        >
          下一站
        </Button>
        <Button
          v-else
          class="flex-1"
          @click="finish"
        >
          完成參拜
        </Button>
      </CardFooter>
    </Card>

    <!-- 路線總覽 -->
    <div class="w-full max-w-sm">
      <p class="mb-2 text-xs font-medium text-muted-foreground">路線總覽</p>
      <div class="flex flex-col gap-2">
        <div
          v-for="(step, i) in routeSteps"
          :key="i"
          class="flex items-center gap-3 rounded-lg p-2 text-sm transition-colors"
          :class="{
            'bg-primary/10': i === currentStep,
            'text-muted-foreground': i > currentStep,
          }"
        >
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
            :class="i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'"
          >
            {{ i + 1 }}
          </span>
          <span>{{ step.location }} — {{ step.deityName }}</span>
          <span v-if="step.isRelevant" class="text-xs text-primary">★</span>
        </div>
      </div>
    </div>
  </div>
</template>
