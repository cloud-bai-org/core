<template>
  <div v-if="visible" class="incense-flame">
    <div class="flame-core" />
    <div class="flame-glow" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
}>()
</script>

<style scoped>
.incense-flame {
  position: relative;
  width: 12px;
  height: 24px;
}

.flame-core {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 18px;
  background: radial-gradient(ellipse at bottom, #ff6600 0%, #ff3300 40%, #ff9900 70%, transparent 100%);
  border-radius: 50% 50% 20% 20%;
  animation: flame-flicker 0.3s ease-in-out infinite alternate;
}

.flame-glow {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, rgba(255, 102, 0, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 0.6s ease-in-out infinite alternate;
}

@keyframes flame-flicker {
  0% {
    height: 18px;
    opacity: 0.9;
  }
  100% {
    height: 22px;
    opacity: 1;
  }
}

@keyframes glow-pulse {
  0% {
    opacity: 0.3;
    transform: translateX(-50%) scale(1);
  }
  100% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1.2);
  }
}
</style>
