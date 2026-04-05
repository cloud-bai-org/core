<template>
  <IncenseCanvas
    :phase="store.phase"
    :remaining-ratio="store.remainingRatio"
    :max-particles="maxParticles"
    @stick-click="$emit('stickClick')"
  />
</template>

<script setup lang="ts">
import { useIncenseStore } from '~/stores/incense'
import IncenseCanvas from './IncenseCanvas.vue'

defineProps<{
  maxParticles?: number
}>()

defineEmits<{
  stickClick: []
}>()

const store = useIncenseStore()
</script>
