<template>
  <div class="flex min-h-[calc(100vh-8rem)] flex-col">
    <!-- 進度指示器 -->
    <div v-if="worshipStore.isActive && !worshipStore.isSummaryStep" class="mb-6 flex justify-center">
      <StepProgressBar />
    </div>

    <!-- 主內容區 -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- 底部導航列 -->
    <div
      v-if="worshipStore.isActive && !worshipStore.isSummaryStep"
      class="sticky bottom-0 flex items-center justify-between border-t border-border bg-background px-4 py-3"
    >
      <Button
        v-if="!worshipStore.isFirstStep"
        variant="outline"
        @click="worshipStore.prevStep()"
      >
        上一步
      </Button>
      <div v-else />

      <Button
        v-if="!hideNextButton"
        :disabled="nextDisabled"
        @click="$emit('next')"
      >
        {{ nextLabel }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import StepProgressBar from '~/components/worship/StepProgressBar.vue'

const worshipStore = useWorshipStore()

withDefaults(defineProps<{
  nextDisabled?: boolean
  nextLabel?: string
  hideNextButton?: boolean
}>(), {
  nextDisabled: false,
  nextLabel: '下一步',
  hideNextButton: false,
})

defineEmits<{
  next: []
}>()
</script>
