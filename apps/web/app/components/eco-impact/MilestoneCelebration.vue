<template>
  <Teleport to="body">
    <Transition name="milestone">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click="dismiss"
      >
        <div class="milestone-card rounded-2xl bg-background p-8 text-center shadow-xl" @click.stop>
          <div class="milestone-icon text-5xl">{{ milestone?.icon }}</div>
          <h2 class="mt-4 text-xl font-semibold">{{ milestone?.name }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ milestone?.description }}</p>
          <Button class="mt-6" size="sm" @click="dismiss">
            太棒了！
          </Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Milestone } from '~/lib/eco-milestones'

const props = defineProps<{
  milestone: Milestone | null
}>()

const emit = defineEmits<{
  dismiss: []
}>()

const visible = computed(() => props.milestone !== null)

function dismiss() {
  emit('dismiss')
}
</script>

<style scoped>
.milestone-enter-active {
  transition: opacity 0.3s ease;
}
.milestone-enter-active .milestone-card {
  animation: milestone-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.milestone-leave-active {
  transition: opacity 0.2s ease;
}
.milestone-enter-from,
.milestone-leave-to {
  opacity: 0;
}

@keyframes milestone-pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.milestone-icon {
  animation: milestone-bounce 0.6s ease 0.3s both;
}

@keyframes milestone-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
</style>
