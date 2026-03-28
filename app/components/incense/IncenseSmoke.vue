<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none absolute inset-0"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
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
  active: boolean
  originX: number
  originY: number
  width: number
  height: number
  maxParticles?: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const particles = ref<SmokeParticle[]>([])
let animationId: number | null = null

const particleLimit = computed(() => props.maxParticles ?? 40)

function createParticle(): SmokeParticle {
  return {
    x: props.originX + (Math.random() - 0.5) * 4,
    y: props.originY,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(Math.random() * 1.2 + 0.5),
    life: 0,
    maxLife: 60 + Math.random() * 40,
    size: 3 + Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.15,
  }
}

function updateParticles() {
  const alive: SmokeParticle[] = []
  for (const p of particles.value) {
    p.x += p.vx
    p.y += p.vy
    p.vx += (Math.random() - 0.5) * 0.1
    p.vy -= 0.005
    p.life++
    p.size += 0.08
    if (p.life < p.maxLife) {
      alive.push(p)
    }
  }
  particles.value = alive
}

function drawParticles(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, props.width, props.height)
  for (const p of particles.value) {
    const progress = p.life / p.maxLife
    const alpha = p.opacity * (1 - progress)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180, 180, 180, ${alpha})`
    ctx.fill()
  }
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (props.active && particles.value.length < particleLimit.value) {
    particles.value.push(createParticle())
  }

  updateParticles()
  drawParticles(ctx)

  if (props.active || particles.value.length > 0) {
    animationId = requestAnimationFrame(animate)
  } else {
    animationId = null
  }
}

function startAnimation() {
  if (animationId) return
  animationId = requestAnimationFrame(animate)
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

watch(() => props.active, (active) => {
  if (active) {
    startAnimation()
  }
})

onMounted(() => {
  if (props.active) {
    startAnimation()
  }
})

onBeforeUnmount(() => {
  stopAnimation()
})
</script>
