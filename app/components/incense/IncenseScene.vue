<template>
  <IncenseCanvas
    :phase="store.phase"
    :remaining-ratio="store.remainingRatio"
    :max-particles="maxParticles"
  />
</template>

<script setup lang="ts">
import { useIncenseStore } from '~/stores/incense'
import IncenseCanvas from './IncenseCanvas.vue'

const props = defineProps<{
  maxParticles?: number
}>()

const store = useIncenseStore()
</script>
