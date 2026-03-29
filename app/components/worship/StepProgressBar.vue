<template>
  <div class="flex items-center gap-1 overflow-x-auto scrollbar-none">
    <template v-for="(step, index) in worshipStore.steps" :key="step.id">
      <!-- 連接線 -->
      <div
        v-if="index > 0"
        class="h-0.5 w-4 shrink-0 transition-colors"
        :class="index <= worshipStore.currentStepIndex ? 'bg-primary' : 'bg-border'"
      />

      <!-- 步驟圓點 -->
      <button
        class="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors"
        :class="stepClass(index)"
        :disabled="index > worshipStore.currentStepIndex"
        @click="handleClick(index)"
      >
        <span
          class="flex size-5 items-center justify-center rounded-full text-[10px] font-medium"
          :class="dotClass(index)"
        >
          {{ index + 1 }}
        </span>
        <span v-if="index === worshipStore.currentStepIndex" class="whitespace-nowrap">
          {{ step.label }}
        </span>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
const worshipStore = useWorshipStore()

function stepClass(index: number) {
  if (index === worshipStore.currentStepIndex) return 'bg-primary/10 text-primary'
  if (index < worshipStore.currentStepIndex) return 'text-muted-foreground hover:text-primary cursor-pointer'
  return 'text-muted-foreground/50 cursor-not-allowed'
}

function dotClass(index: number) {
  if (index === worshipStore.currentStepIndex) return 'bg-primary text-primary-foreground'
  if (index < worshipStore.currentStepIndex) return 'bg-muted text-muted-foreground'
  return 'bg-muted/50 text-muted-foreground/50'
}

function handleClick(index: number) {
  if (index < worshipStore.currentStepIndex) {
    worshipStore.goToStep(index)
  }
}
</script>
