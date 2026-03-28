<template>
  <canvas
    ref="canvasRef"
    class="block"
    :style="{ width: `${cssWidth}px`, height: `${cssHeight}px` }"
  />
</template>

<script setup lang="ts">
import type { IncensePhase } from '~/stores/incense'

interface SmokeParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  opacity: number
}

const props = defineProps<{
  phase: IncensePhase
  remainingRatio: number
  maxParticles?: number
}>()

const cssWidth = 300
const cssHeight = 400

// 佈局常數（Canvas 像素座標）
const CENSER_Y = cssHeight - 10      // 香爐頂部 y
const CENSER_HEIGHT = 28
const CENSER_TOP = CENSER_Y - CENSER_HEIGHT
const STICK_BASE_Y = CENSER_TOP - 4  // 香體底部（插入香爐中）
const STICK_FULL_LENGTH = 220        // 香體最大長度
const STICK_WIDTH = 4
const CENTER_X = cssWidth / 2

const canvasRef = ref<HTMLCanvasElement | null>(null)
let dpr = 1
let animationId: number | null = null
const particles: SmokeParticle[] = []
const particleLimit = computed(() => props.maxParticles ?? 40)

// 香頂端 y 座標（隨燃燒下降）
function tipY(): number {
  return STICK_BASE_Y - STICK_FULL_LENGTH * props.remainingRatio
}

// ---- 繪製函式 ----

function drawCenser(ctx: CanvasRenderingContext2D) {
  const cx = CENTER_X
  // 爐身
  ctx.fillStyle = 'rgba(120, 66, 18, 0.85)'
  roundRect(ctx, cx - 40, CENSER_TOP, 80, 24, 6)
  ctx.fill()
  // 爐底
  ctx.fillStyle = 'rgba(100, 50, 10, 0.85)'
  roundRect(ctx, cx - 46, CENSER_TOP + 24, 92, 8, 3)
  ctx.fill()
}

function drawStick(ctx: CanvasRenderingContext2D) {
  if (props.remainingRatio <= 0) return

  const ty = tipY()
  const baseY = STICK_BASE_Y

  // 香腳（淺色）
  ctx.fillStyle = '#deb887'
  ctx.fillRect(CENTER_X - STICK_WIDTH / 2, baseY - 10, STICK_WIDTH, 10)

  // 香體（漸層）
  const grad = ctx.createLinearGradient(0, ty, 0, baseY - 10)
  grad.addColorStop(0, '#8b7355')
  grad.addColorStop(1, '#a0522d')
  ctx.fillStyle = grad
  ctx.fillRect(CENTER_X - STICK_WIDTH / 2, ty, STICK_WIDTH, baseY - 10 - ty)

  // 燃燒端（紅光）
  if (props.phase === 'burning' || props.phase === 'lighting') {
    ctx.fillStyle = '#ff4500'
    ctx.shadowColor = 'rgba(255, 69, 0, 0.6)'
    ctx.shadowBlur = 4
    ctx.fillRect(CENTER_X - STICK_WIDTH / 2, ty - 2, STICK_WIDTH, 6)
    ctx.shadowBlur = 0

    // 餘燼光暈
    const glowAlpha = 0.3 + Math.sin(Date.now() / 300) * 0.15
    const glow = ctx.createRadialGradient(CENTER_X, ty, 0, CENTER_X, ty, 8)
    glow.addColorStop(0, `rgba(255, 102, 0, ${glowAlpha})`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(CENTER_X - 10, ty - 10, 20, 20)
  }
}

function drawFlame(ctx: CanvasRenderingContext2D) {
  if (props.phase !== 'lighting') return

  const ty = tipY()
  const flickerH = 18 + Math.sin(Date.now() / 150) * 4
  const flickerAlpha = 0.85 + Math.sin(Date.now() / 200) * 0.15

  // 火焰核心
  const flameGrad = ctx.createRadialGradient(
    CENTER_X, ty - flickerH * 0.4, 2,
    CENTER_X, ty - flickerH * 0.3, flickerH * 0.5,
  )
  flameGrad.addColorStop(0, `rgba(255, 153, 0, ${flickerAlpha})`)
  flameGrad.addColorStop(0.4, `rgba(255, 51, 0, ${flickerAlpha * 0.8})`)
  flameGrad.addColorStop(1, 'transparent')

  ctx.beginPath()
  ctx.ellipse(CENTER_X, ty - flickerH * 0.4, 5, flickerH * 0.5, 0, 0, Math.PI * 2)
  ctx.fillStyle = flameGrad
  ctx.fill()

  // 外光暈
  const glowGrad = ctx.createRadialGradient(CENTER_X, ty - 6, 0, CENTER_X, ty - 6, 14)
  glowGrad.addColorStop(0, 'rgba(255, 102, 0, 0.3)')
  glowGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(CENTER_X, ty - 6, 14, 0, Math.PI * 2)
  ctx.fill()
}

function createParticle(): SmokeParticle {
  const ty = tipY()
  return {
    x: CENTER_X + (Math.random() - 0.5) * 4,
    y: ty - 4,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(Math.random() * 1.2 + 0.5),
    life: 0,
    maxLife: 60 + Math.random() * 40,
    size: 3 + Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.15,
  }
}

function updateAndDrawSmoke(ctx: CanvasRenderingContext2D) {
  const showSmoke = props.phase === 'burning' || props.phase === 'lighting'

  if (showSmoke && particles.length < particleLimit.value) {
    particles.push(createParticle())
  }

  let i = particles.length
  while (i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vx += (Math.random() - 0.5) * 0.1
    p.vy -= 0.005
    p.life++
    p.size += 0.08

    if (p.life >= p.maxLife) {
      particles.splice(i, 1)
      continue
    }

    const progress = p.life / p.maxLife
    const alpha = p.opacity * (1 - progress)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180, 180, 180, ${alpha})`
    ctx.fill()
  }
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

// ---- 動畫循環 ----

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.scale(dpr, dpr)

  drawCenser(ctx)
  drawStick(ctx)
  updateAndDrawSmoke(ctx)
  drawFlame(ctx)

  ctx.restore()

  const isActive = props.phase !== 'idle' && props.phase !== 'completed'
  if (isActive || particles.length > 0) {
    animationId = requestAnimationFrame(render)
  } else {
    animationId = null
  }
}

function startRendering() {
  if (animationId) return
  animationId = requestAnimationFrame(render)
}

function stopRendering() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

function setupCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = window.devicePixelRatio || 1
  canvas.width = cssWidth * dpr
  canvas.height = cssHeight * dpr
}

watch(() => props.phase, (phase) => {
  if (phase === 'idle' || phase === 'completed') {
    // 繪製一次靜態畫面（idle 顯示完整香，completed 顯示空香爐）
    startRendering()
  } else {
    startRendering()
  }
})

onMounted(() => {
  setupCanvas()
  startRendering()
})

onBeforeUnmount(() => {
  stopRendering()
})
</script>
