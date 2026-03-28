<template>
  <div
    ref="blockRef"
    class="divination-block relative h-20 w-12"
  >
    <!-- 正面（凸面朝上）-->
    <div
      class="block-face block-face--front absolute inset-0 rounded-t-full bg-gradient-to-b from-amber-700 to-amber-900"
      :class="{ 'opacity-0': showBack }"
    >
      <div class="absolute inset-2 rounded-t-full bg-gradient-to-b from-amber-600 to-amber-800" />
    </div>
    <!-- 反面（平面朝上）-->
    <div
      class="block-face block-face--back absolute inset-0 rounded-t-full bg-gradient-to-b from-red-800 to-red-950"
      :class="{ 'opacity-0': !showBack }"
    >
      <div class="absolute inset-2 rounded-t-full bg-gradient-to-b from-red-700 to-red-900" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  faceUp: boolean
}>()

const blockRef = ref<HTMLElement | null>(null)
const showBack = computed(() => props.faceUp)

defineExpose({ blockRef })
</script>
