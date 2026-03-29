<template>
  <CeremonyLayout :next-disabled="!worshipStore.selectedDeityId" @next="handleNext">
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <h1 class="text-2xl font-medium">選擇神明</h1>
        <p class="mt-1 text-sm text-muted-foreground">選擇要祭拜的神明</p>
      </div>

      <div class="grid w-full max-w-md gap-3">
        <Card
          v-for="deity in deities"
          :key="deity.id"
          class="cursor-pointer transition-colors"
          :class="worshipStore.selectedDeityId === deity.id
            ? 'border-primary bg-primary/5'
            : 'hover:border-primary/50'"
          @click="selectDeity(deity.id)"
        >
          <CardContent class="flex items-start gap-3 pt-4 pb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-medium">{{ deity.name }}</h3>
                <span class="text-xs text-muted-foreground">{{ deity.title }}</span>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">{{ deity.description }}</p>
              <p class="mt-2 text-xs text-muted-foreground">
                建議供品：{{ deity.offerings.join('、') }}
              </p>
            </div>
            <div
              v-if="worshipStore.selectedDeityId === deity.id"
              class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Check :size="14" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </CeremonyLayout>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import deitiesData from '~/data/deities.json'
import CeremonyLayout from '~/components/worship/CeremonyLayout.vue'

definePageMeta({ capability: 'worship-ceremony' })

const worshipStore = useWorshipStore()
const { guard } = useWorshipGuard()

const deities = deitiesData as Array<{
  id: string
  name: string
  title: string
  description: string
  offerings: string[]
  purposes: string[]
}>

function selectDeity(deityId: string) {
  worshipStore.setDeity(deityId)
}

async function handleNext() {
  await worshipStore.persistProgress()
  worshipStore.nextStep()
}

onMounted(() => {
  guard()
  worshipStore.goToStepByRoute('/worship/deity-select')
})
</script>
