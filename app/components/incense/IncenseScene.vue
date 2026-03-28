<template>
  <div ref="sceneRef" class="relative flex flex-col items-center" :style="{ height: `${sceneHeight}px` }">
    <!-- 煙霧 Canvas -->
    <IncenseSmoke
      :active="showSmoke"
      :origin-x="smokeOrigin.x"
      :origin-y="smokeOrigin.y"
      :width="sceneWidth"
      :height="sceneHeight"
      :max-particles="maxParticles"
    />

    <!-- 火焰 -->
    <div class="absolute" :style="flamePosition">
      <IncenseFlame :visible="showFlame" />
    </div>

    <!-- 香體 -->
    <div class="absolute bottom-8" :style="{ height: `${stickMaxHeight}px` }">
      <IncenseStick
        :remaining-ratio="store.remainingRatio"
        :is-burning="store.phase === 'burning'"
      />
    </div>

    <!-- 香爐底座 -->
    <div class="absolute bottom-0 flex flex-col items-center">
      <div class="h-6 w-16 rounded-t-lg bg-amber-800/80" />
      <div class="h-2 w-20 rounded-b bg-amber-900/80" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIncenseStore } from '~/stores/incense'
import IncenseFlame from './IncenseFlame.vue'
import IncenseSmoke from './IncenseSmoke.vue'
import IncenseStick from './IncenseStick.vue'

const props = defineProps<{
  maxParticles?: number
}>()

const store = useIncenseStore()
const sceneRef = ref<HTMLElement | null>(null)

const sceneWidth = 300
const sceneHeight = 350
const stickMaxHeight = 200

const showFlame = computed(() => store.phase === 'lighting')

const showSmoke = computed(() =>
  store.phase === 'burning' || store.phase === 'lighting',
)

const smokeOrigin = computed(() => ({
  x: sceneWidth / 2,
  y: sceneHeight - 32 - stickMaxHeight * store.remainingRatio - 10,
}))

const flamePosition = computed(() => ({
  bottom: `${32 + stickMaxHeight * store.remainingRatio}px`,
  left: '50%',
  transform: 'translateX(-50%)',
}))
</script>
