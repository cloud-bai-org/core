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
  createFlameParticle,
  createAshParticle,
  createSmokeParticle,
  renderParticles,
  getLevelConfig,
} from './particles'
import type { JossPaperType, AnimationLevel } from '~/stores/joss-paper'

const props = defineProps<{
  paper: JossPaperType | null
  burning: boolean
  intensity: number // 0~1 累積火焰強度
  animationLevel: AnimationLevel
}>()

const emit = defineEmits<{
  burnComplete: []
}>()

const CSS_W = 300
const CSS_H = 400

// 金爐佈局常數
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
const dropPaper = reactive({
  active: false,
  x: CSS_W / 2,
  y: -30,
  rotation: 0,
  opacity: 1,
  width: 40,
  height: 50,
})

// 焚燒階段 0=未開始 1=點燃 2=燃燒 3=殆盡
const burnStage = ref(0)
let burnTimeline: gsap.core.Timeline | null = null

// 粒子發射累積器（用於非整數 rate）
let flameAccum = 0
let ashAccum = 0
let smokeAccum = 0

watch(() => props.burning, (val) => {
  if (val && props.paper) {
    startBurnSequence(props.paper)
  }
})

watch(() => props.paper, () => {
  // 切換金紙時重置粒子
  pool.clear()
  burnStage.value = 0
  flameAccum = 0
  ashAccum = 0
  smokeAccum = 0
})

watch(() => props.animationLevel, (level) => {
  const config = getLevelConfig(level)
  pool.setMax(config.maxParticles)
})

function startBurnSequence(paper: JossPaperType) {
  if (burnTimeline) {
    burnTimeline.kill()
  }

  const speed = paper.particle.burnSpeed
  burnStage.value = 0
  pool.clear()

  // 金紙從上方落入金爐
  dropPaper.active = true
  dropPaper.y = -30
  dropPaper.x = CSS_W / 2
  dropPaper.rotation = (Math.random() - 0.5) * 0.3
  dropPaper.opacity = 1

  burnTimeline = gsap.timeline({
    onComplete: () => {
      dropPaper.active = false
      burnStage.value = 0
      emit('burnComplete')
    },
  })

  // 1. 金紙落入
  burnTimeline.to(dropPaper, {
    y: FURNACE_TOP - 10,
    rotation: (Math.random() - 0.5) * 0.5,
    duration: 0.6 / speed,
    ease: 'power2.in',
    onComplete: () => {
      burnStage.value = 1 // 點燃
    },
  })

  // 2. 點燃（金紙開始變透明 + 粒子噴發）
  burnTimeline.to(dropPaper, {
    opacity: 0.3,
    duration: 0.8 / speed,
    onStart: () => {
      burnStage.value = 2 // 燃燒
    },
  })

  // 3. 殆盡
  burnTimeline.to(dropPaper, {
    opacity: 0,
    duration: 1.2 / speed,
    onStart: () => {
      burnStage.value = 3 // 殆盡
    },
  })
}

// 可供外部呼叫，讓金紙從指定位置落入
function dropFromPosition(x: number, y: number, paper: JossPaperType) {
  dropPaper.x = x
  dropPaper.y = y
  dropPaper.active = true
  dropPaper.opacity = 1
  startBurnSequence(paper)
}

defineExpose({ dropFromPosition })

// ---- 繪製 ----

function drawFurnace(ctx: CanvasRenderingContext2D) {
  // 金爐主體
  const grad = ctx.createLinearGradient(FURNACE_X, FURNACE_TOP, FURNACE_X, FURNACE_Y)
  grad.addColorStop(0, '#B8860B')
  grad.addColorStop(0.5, '#DAA520')
  grad.addColorStop(1, '#8B6914')
  ctx.fillStyle = grad
  roundRect(ctx, FURNACE_X, FURNACE_TOP, FURNACE_W, FURNACE_H, 8)
  ctx.fill()

  // 爐口（深色）
  ctx.fillStyle = '#4A3000'
  roundRect(ctx, FURNACE_X + 10, FURNACE_TOP - 4, FURNACE_W - 20, 12, 4)
  ctx.fill()

  // 爐腳
  ctx.fillStyle = '#8B6914'
  ctx.fillRect(FURNACE_X + 15, FURNACE_Y, 12, 8)
  ctx.fillRect(FURNACE_X + FURNACE_W - 27, FURNACE_Y, 12, 8)

  // 爐身裝飾
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

function drawDroppingPaper(ctx: CanvasRenderingContext2D) {
  if (!dropPaper.active || dropPaper.opacity <= 0) return

  ctx.save()
  ctx.globalAlpha = dropPaper.opacity
  ctx.translate(dropPaper.x, dropPaper.y)
  ctx.rotate(dropPaper.rotation)

  // 金紙外觀
  const w = dropPaper.width
  const h = dropPaper.height
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(-w / 2, -h / 2, w, h)

  // 金箔中心
  ctx.fillStyle = '#FFA500'
  ctx.fillRect(-w / 4, -h / 4, w / 2, h / 2)

  // 燃燒邊緣效果
  if (burnStage.value >= 2) {
    ctx.strokeStyle = `rgba(255, 69, 0, ${dropPaper.opacity})`
    ctx.lineWidth = 2
    ctx.strokeRect(-w / 2, -h / 2, w, h)
  }

  ctx.restore()
}

function emitParticles() {
  if (!props.paper || burnStage.value < 1) return

  const config = getLevelConfig(props.animationLevel)
  const stageMultiplier = burnStage.value === 1 ? 0.5 : burnStage.value === 2 ? 1 : 0.3

  // 火焰粒子
  flameAccum += config.flameRate * stageMultiplier * props.paper.particle.sparkDensity
  while (flameAccum >= 1) {
    pool.add(createFlameParticle(FIRE_CX, FIRE_BASE_Y, props.paper, props.intensity))
    flameAccum--
  }

  // 灰燼粒子（燃燒中後期）
  if (burnStage.value >= 2) {
    ashAccum += config.ashRate * stageMultiplier
    while (ashAccum >= 1) {
      pool.add(createAshParticle(FIRE_CX, FIRE_BASE_Y, props.paper))
      ashAccum--
    }
  }

  // 煙霧粒子
  if (burnStage.value >= 1) {
    smokeAccum += config.smokeRate * stageMultiplier
    while (smokeAccum >= 1) {
      pool.add(createSmokeParticle(FIRE_CX, FIRE_BASE_Y - 30))
      smokeAccum--
    }
  }
}

// 火焰光暈
function drawFireGlow(ctx: CanvasRenderingContext2D) {
  if (burnStage.value < 1 || !props.paper) return

  const glowIntensity = burnStage.value === 2 ? 1 : burnStage.value === 1 ? 0.5 : 0.2
  const radius = 40 + props.intensity * 20
  const gradient = ctx.createRadialGradient(FIRE_CX, FIRE_BASE_Y, 0, FIRE_CX, FIRE_BASE_Y, radius)
  gradient.addColorStop(0, `rgba(255, 120, 0, ${0.3 * glowIntensity})`)
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

  // 簡易 frame rate 控制
  const config = getLevelConfig(props.animationLevel)
  const frameInterval = 1000 / config.targetFps
  if (timestamp - lastTime < frameInterval) {
    animationId = requestAnimationFrame(render)
    return
  }
  lastTime = timestamp

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.scale(dpr, dpr)

  // 先畫光暈（在金爐後面）
  drawFireGlow(ctx)
  // 粒子在金爐後面
  emitParticles()
  pool.update(1)
  if (props.paper) {
    renderParticles(ctx, pool, props.paper)
  }
  // 金爐
  drawFurnace(ctx)
  // 落入的金紙
  drawDroppingPaper(ctx)

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
  const config = getLevelConfig(props.animationLevel)
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
