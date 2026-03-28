<template>
  <div ref="sceneRef" class="relative flex items-center justify-center gap-8 py-12">
    <DivinationBlock
      ref="leftBlockRef"
      :face-up="leftFaceUp"
    />
    <DivinationBlock
      ref="rightBlockRef"
      :face-up="rightFaceUp"
    />
  </div>
</template>

<script setup lang="ts">
import type { DivinationResult } from '~/stores/divination'

const props = defineProps<{
  result: DivinationResult | null
  animate: boolean
}>()

const emit = defineEmits<{
  animationComplete: []
}>()

const { $gsap } = useNuxtApp()

const sceneRef = ref<HTMLElement | null>(null)
const leftBlockRef = ref<{ blockRef: HTMLElement | null } | null>(null)
const rightBlockRef = ref<{ blockRef: HTMLElement | null } | null>(null)

// 根據結果決定筊杯朝向
// holy: 一正一反, laughing: 兩面朝上(平面), negative: 兩面朝下(凸面)
const leftFaceUp = ref(false)
const rightFaceUp = ref(false)

function getFaceConfig(result: DivinationResult) {
  switch (result) {
    case 'holy': return { left: true, right: false }
    case 'laughing': return { left: true, right: true }
    case 'negative': return { left: false, right: false }
  }
}

watch(() => props.animate, (shouldAnimate) => {
  if (!shouldAnimate || !props.result) return

  const leftEl = leftBlockRef.value?.blockRef
  const rightEl = rightBlockRef.value?.blockRef
  if (!leftEl || !rightEl) return

  const faces = getFaceConfig(props.result)

  // 動畫開始前先重置位置，隱藏朝向
  leftFaceUp.value = false
  rightFaceUp.value = false

  const tl = $gsap.timeline({
    onComplete: () => {
      emit('animationComplete')
    },
  })

  // 兩個筊杯同時拋起
  tl.fromTo([leftEl, rightEl], {
    y: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
  }, {
    y: -180,
    rotation: 360,
    scale: 0.8,
    duration: 0.5,
    ease: 'power2.out',
  })

  // 空中翻轉
  tl.to(leftEl, {
    rotation: 720 + (faces.left ? 180 : 0),
    duration: 0.4,
    ease: 'none',
  }, '+=0')
  tl.to(rightEl, {
    rotation: 540 + (faces.right ? 180 : 0),
    duration: 0.4,
    ease: 'none',
  }, '<')

  // 切換朝向（在空中最高點切換）
  tl.call(() => {
    leftFaceUp.value = faces.left
    rightFaceUp.value = faces.right
  }, [], '-=0.1')

  // 落地（帶彈跳）
  tl.to([leftEl, rightEl], {
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: 'bounce.out',
  })

  // 左右散開
  tl.to(leftEl, {
    x: -10,
    rotation: `+=${faces.left ? -15 : 10}`,
    duration: 0.2,
    ease: 'power1.out',
  }, '<')
  tl.to(rightEl, {
    x: 10,
    rotation: `+=${faces.right ? 15 : -10}`,
    duration: 0.2,
    ease: 'power1.out',
  }, '<')
})

// 重置動畫狀態
watch(() => props.result, (val) => {
  if (val === null) {
    const leftEl = leftBlockRef.value?.blockRef
    const rightEl = rightBlockRef.value?.blockRef
    if (leftEl && rightEl) {
      $gsap.set([leftEl, rightEl], { x: 0, y: 0, rotation: 0, scale: 1 })
    }
    leftFaceUp.value = false
    rightFaceUp.value = false
  }
})
</script>
