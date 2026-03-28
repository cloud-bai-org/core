<template>
  <div class="incense-stick" :style="stickStyle">
    <!-- 香頭（燃燒端） -->
    <div class="incense-tip" :class="{ burning: isBurning }">
      <div v-if="isBurning" class="ember" />
    </div>
    <!-- 香體 -->
    <div class="incense-body" />
    <!-- 香腳（底座固定端） -->
    <div class="incense-base" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  remainingRatio: number
  isBurning: boolean
}>()

const FULL_HEIGHT = 200 // px

const stickStyle = computed(() => ({
  height: `${FULL_HEIGHT * props.remainingRatio}px`,
}))
</script>

<style scoped>
.incense-stick {
  position: relative;
  width: 4px;
  transition: height 0.1s linear;
  display: flex;
  flex-direction: column;
}

.incense-tip {
  width: 4px;
  height: 6px;
  border-radius: 2px 2px 0 0;
  background-color: #8b7355;
  position: relative;
}

.incense-tip.burning {
  background-color: #ff4500;
  box-shadow: 0 0 4px rgba(255, 69, 0, 0.6);
}

.ember {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 6px;
  height: 4px;
  background: radial-gradient(circle, #ff6600 0%, #cc3300 60%, transparent 100%);
  border-radius: 50%;
  animation: ember-glow 0.8s ease-in-out infinite alternate;
}

.incense-body {
  flex: 1;
  width: 4px;
  background: linear-gradient(to bottom, #8b7355, #a0522d);
}

.incense-base {
  width: 4px;
  height: 8px;
  background-color: #deb887;
  border-radius: 0 0 1px 1px;
}

@keyframes ember-glow {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>
