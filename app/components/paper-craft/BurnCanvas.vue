<template>
  <canvas
    ref="canvasRef"
    class="block"
    :style="{ width: `${CSS_W}px`, height: `${CSS_H}px` }"
  />
</template>

<script setup lang="ts">
import gsap from 'gsap'
import {
  ParticlePool,
  createPaperCraftFlame,
  createPaperCraftAsh,
  createPaperCraftSmoke,
  renderPaperCraftParticles,
  getPaperCraftLevelConfig,
} from './particles'
import { drawItemShape } from './item-shapes'
import type { BurnListItem } from '~/stores/paper-craft'
import type { AnimationLevel } from '~/stores/paper-craft'

const props = defineProps<{
  item: BurnListItem | null
  burning: boolean
  intensity: number
  animationLevel: AnimationLevel
}>()

const emit = defineEmits<{
  burnComplete: []
}>()

const CSS_W = 300
const CSS_H = 400

// 金爐佈局常數（與 joss-paper 相同）
const FURNACE_Y = CSS_H - 30
const FURNACE_H = 60
const FURNACE_TOP = FURNACE_Y - FURNACE_H
const FURNACE_W = 120
const FURNACE_X = (CSS_W - FURNACE_W) / 2
const FIRE_CX = CSS_W / 2
const FIRE_BASE_Y = FURNACE_TOP + 5

const canvasRef = ref<HTMLCanvasElement | null>(null)
let dpr = 1
let animationId: number | null = null
const pool = new ParticlePool(200)

// GSAP 動畫狀態
const dropItem = reactive({
  active: false,
  x: CSS_W / 2,
  y: -40,
  rotation: 0,
  opacity: 1,
  width: 50,
  height: 60,
})

// 焚燒階段
const burnStage = ref(0)
let burnTimeline: gsap.core.Timeline | null = null

// 粒子發射累積器
let flameAccum = 0
let ashAccum = 0
let smokeAccum = 0

watch(() => props.burning, (val) => {
  if (val && props.item) {
    startBurnSequence(props.item)
  }
})

watch(() => props.item, () => {
  pool.clear()
  burnStage.value = 0
  flameAccum = 0
  ashAccum = 0
  smokeAccum = 0
})

watch(() => props.animationLevel, (level) => {
  const config = getPaperCraftLevelConfig(level)
  pool.setMax(config.maxParticles)
})

function startBurnSequence(item: BurnListItem) {
  if (burnTimeline) burnTimeline.kill()

  burnStage.value = 0
  pool.clear()

  dropItem.active = true
  dropItem.y = -40
  dropItem.x = CSS_W / 2
  dropItem.rotation = (Math.random() - 0.5) * 0.3
  dropItem.opacity = 1

  burnTimeline = gsap.timeline({
    onComplete: () => {
      dropItem.active = false
      burnStage.value = 0
      emit('burnComplete')
    },
  })

  // 1. 紙紮物品落入金爐
  burnTimeline.to(dropItem, {
    y: FURNACE_TOP - 15,
    rotation: (Math.random() - 0.5) * 0.4,
    duration: 0.7,
    ease: 'power2.in',
    onComplete: () => {
      burnStage.value = 1
    },
  })

  // 2. 點燃（紙紮物品比金紙大，燃燒稍慢）
  burnTimeline.to(dropItem, {
    opacity: 0.3,
    duration: 1.0,
    onStart: () => {
      burnStage.value = 2
    },
  })

  // 3. 殆盡
  burnTimeline.to(dropItem, {
    opacity: 0,
    duration: 1.5,
    onStart: () => {
      burnStage.value = 3
    },
  })
}

// ---- 繪製 ----

function drawFurnace(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(FURNACE_X, FURNACE_TOP, FURNACE_X, FURNACE_Y)
  grad.addColorStop(0, '#B8860B')
  grad.addColorStop(0.5, '#DAA520')
  grad.addColorStop(1, '#8B6914')
  ctx.fillStyle = grad
  roundRect(ctx, FURNACE_X, FURNACE_TOP, FURNACE_W, FURNACE_H, 8)
  ctx.fill()

  ctx.fillStyle = '#4A3000'
  roundRect(ctx, FURNACE_X + 10, FURNACE_TOP - 4, FURNACE_W - 20, 12, 4)
  ctx.fill()

  ctx.fillStyle = '#8B6914'
  ctx.fillRect(FURNACE_X + 15, FURNACE_Y, 12, 8)
  ctx.fillRect(FURNACE_X + FURNACE_W - 27, FURNACE_Y, 12, 8)

  ctx.strokeStyle = '#DAA520'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(FURNACE_X + 20, FURNACE_TOP + 20)
  ctx.lineTo(FURNACE_X + FURNACE_W - 20, FURNACE_TOP + 20)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(FURNACE_X + 20, FURNACE_TOP + 40)
  ctx.lineTo(FURNACE_X + FURNACE_W - 20, FURNACE_TOP + 40)
  ctx.stroke()
}

function drawDroppingItem(ctx: CanvasRenderingContext2D) {
  if (!dropItem.active || dropItem.opacity <= 0 || !props.item) return

  ctx.save()
  ctx.globalAlpha = dropItem.opacity
  ctx.translate(dropItem.x, dropItem.y)
  ctx.rotate(dropItem.rotation)

  // 使用物品專屬造型繪製
  const scale = 1.4 // 紙紮物品比金紙大
  drawItemShape(
    ctx,
    props.item.id,
    props.item.categoryId,
    scale,
    props.item.isCustom ? props.item.name : undefined,
  )

  // 燃燒邊緣光暈效果
  if (burnStage.value >= 2) {
    ctx.globalAlpha = dropItem.opacity * 0.6
    ctx.shadowColor = '#FF5000'
    ctx.shadowBlur = 12
    ctx.strokeStyle = `rgba(255, 80, 0, ${dropItem.opacity})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, 22 * scale, 0, Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  ctx.restore()
}

function emitParticles() {
  if (!props.item || burnStage.value < 1) return

  const config = getPaperCraftLevelConfig(props.animationLevel)
  const stageMultiplier = burnStage.value === 1 ? 0.5 : burnStage.value === 2 ? 1 : 0.3

  flameAccum += config.flameRate * stageMultiplier
  while (flameAccum >= 1) {
    pool.add(createPaperCraftFlame(FIRE_CX, FIRE_BASE_Y, props.intensity))
    flameAccum--
  }

  if (burnStage.value >= 2) {
    ashAccum += config.ashRate * stageMultiplier
    while (ashAccum >= 1) {
      pool.add(createPaperCraftAsh(FIRE_CX, FIRE_BASE_Y))
      ashAccum--
    }
  }

  if (burnStage.value >= 1) {
    smokeAccum += config.smokeRate * stageMultiplier
    while (smokeAccum >= 1) {
      pool.add(createPaperCraftSmoke(FIRE_CX, FIRE_BASE_Y - 30))
      smokeAccum--
    }
  }
}

function drawFireGlow(ctx: CanvasRenderingContext2D) {
  if (burnStage.value < 1) return

  const glowIntensity = burnStage.value === 2 ? 1 : burnStage.value === 1 ? 0.5 : 0.2
  const radius = 45 + props.intensity * 25
  const gradient = ctx.createRadialGradient(FIRE_CX, FIRE_BASE_Y, 0, FIRE_CX, FIRE_BASE_Y, radius)
  gradient.addColorStop(0, `rgba(255, 100, 30, ${0.35 * glowIntensity})`) // 偏橘紅光暈
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(FIRE_CX, FIRE_BASE_Y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ---- 渲染循環 ----

let lastTime = 0

function render(timestamp: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const config = getPaperCraftLevelConfig(props.animationLevel)
  const frameInterval = 1000 / (props.animationLevel === 'fine' ? 60 : 30)
  if (timestamp - lastTime < frameInterval) {
    animationId = requestAnimationFrame(render)
    return
  }
  lastTime = timestamp

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.scale(dpr, dpr)

  drawFireGlow(ctx)
  emitParticles()
  pool.update(1)
  renderPaperCraftParticles(ctx, pool)
  drawFurnace(ctx)
  drawDroppingItem(ctx)

  ctx.restore()

  animationId = requestAnimationFrame(render)
}

function setupCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = window.devicePixelRatio || 1
  canvas.width = CSS_W * dpr
  canvas.height = CSS_H * dpr
}

onMounted(() => {
  setupCanvas()
  const config = getPaperCraftLevelConfig(props.animationLevel)
  pool.setMax(config.maxParticles)
  animationId = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (burnTimeline) {
    burnTimeline.kill()
    burnTimeline = null
  }
  pool.clear()
})
</script>
