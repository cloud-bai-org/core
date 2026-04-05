import type { JossPaperType, AnimationLevel } from '~/stores/joss-paper'

// ---- 基礎粒子介面 ----

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  type: 'flame' | 'ash' | 'smoke'
}

export interface FlameParticle extends Particle {
  type: 'flame'
  colorPhase: number // 0~1, 用於顏色插值
}

export interface AshParticle extends Particle {
  type: 'ash'
  rotation: number
  rotationSpeed: number
}

export interface SmokeParticle extends Particle {
  type: 'smoke'
  opacity: number
}

export type AnyParticle = FlameParticle | AshParticle | SmokeParticle

// ---- 粒子池 ----

export class ParticlePool {
  private particles: AnyParticle[] = []
  private maxParticles: number

  constructor(maxParticles: number) {
    this.maxParticles = maxParticles
  }

  setMax(max: number) {
    this.maxParticles = max
  }

  get all(): readonly AnyParticle[] {
    return this.particles
  }

  get count(): number {
    return this.particles.length
  }

  add(p: AnyParticle): boolean {
    if (this.particles.length >= this.maxParticles) return false
    this.particles.push(p)
    return true
  }

  update(dt: number) {
    let i = this.particles.length
    while (i--) {
      const p = this.particles[i]
      p.life += dt
      if (p.life >= p.maxLife) {
        // swap-remove for performance
        this.particles[i] = this.particles[this.particles.length - 1]
        this.particles.pop()
        continue
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
  }

  clear() {
    this.particles.length = 0
  }
}

// ---- 粒子發射器 ----

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export function createFlameParticle(
  cx: number,
  baseY: number,
  paper: JossPaperType,
  intensity: number, // 0~1, 火焰強度（隨投入金紙數累積）
): FlameParticle {
  const spread = 20 + intensity * 15
  return {
    type: 'flame',
    x: cx + rand(-spread, spread),
    y: baseY + rand(-5, 5),
    vx: rand(-0.8, 0.8),
    vy: rand(-3, -1.2) * (1 + intensity * 0.5),
    life: 0,
    maxLife: rand(20, 50),
    size: rand(3, 8) * (1 + intensity * 0.3),
    colorPhase: Math.random(),
  }
}

export function createAshParticle(
  cx: number,
  baseY: number,
  paper: JossPaperType,
): AshParticle {
  return {
    type: 'ash',
    x: cx + rand(-30, 30),
    y: baseY + rand(-40, -10),
    vx: rand(-0.5, 0.5),
    vy: rand(0.3, 1.2), // 向下飄落
    life: 0,
    maxLife: rand(60, 120),
    size: rand(2, 5),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.05, 0.05),
  }
}

export function createSmokeParticle(
  cx: number,
  baseY: number,
): SmokeParticle {
  return {
    type: 'smoke',
    x: cx + rand(-15, 15),
    y: baseY + rand(-20, -5),
    vx: rand(-0.3, 0.3),
    vy: rand(-1.5, -0.5), // 向上擴散
    life: 0,
    maxLife: rand(80, 140),
    size: rand(6, 14),
    opacity: rand(0.08, 0.2),
  }
}

// ---- 渲染器 ----

function lerpColor(a: string, b: string, t: number): string {
  // 簡易 hex→rgb 插值
  const parseHex = (hex: string) => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const [r1, g1, b1] = parseHex(a)
  const [r2, g2, b2] = parseHex(b)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const bl = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${bl})`
}

export function renderParticles(
  ctx: CanvasRenderingContext2D,
  pool: ParticlePool,
  paper: JossPaperType,
) {
  for (const p of pool.all) {
    const progress = p.life / p.maxLife
    const alpha = 1 - progress

    if (p.type === 'flame') {
      const fp = p as FlameParticle
      // 根據生命週期插值三段顏色
      const colorIdx = Math.min(2, Math.floor(progress * 3))
      const nextIdx = Math.min(2, colorIdx + 1)
      const localT = (progress * 3) - colorIdx
      const color = lerpColor(
        paper.particle.flameColors[colorIdx],
        paper.particle.flameColors[nextIdx],
        localT,
      )
      const size = fp.size * (1 - progress * 0.6)
      ctx.globalAlpha = alpha * 0.9
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(fp.x, fp.y, Math.max(0.5, size), 0, Math.PI * 2)
      ctx.fill()
    } else if (p.type === 'ash') {
      const ap = p as AshParticle
      ap.rotation += ap.rotationSpeed
      const size = ap.size * (1 - progress * 0.3)
      ctx.globalAlpha = alpha * 0.7
      ctx.fillStyle = paper.particle.ashColor
      ctx.save()
      ctx.translate(ap.x, ap.y)
      ctx.rotate(ap.rotation)
      ctx.fillRect(-size / 2, -size / 4, size, size / 2)
      ctx.restore()
    } else if (p.type === 'smoke') {
      const sp = p as SmokeParticle
      const size = sp.size * (1 + progress * 2)
      sp.vx += (Math.random() - 0.5) * 0.05 // 微幅漂移
      ctx.globalAlpha = sp.opacity * (1 - progress)
      ctx.fillStyle = 'rgba(160, 160, 160, 1)'
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

// ---- 動畫等級配置 ----

export interface LevelConfig {
  maxParticles: number
  flameRate: number  // 每 frame 新增火焰粒子數
  ashRate: number
  smokeRate: number
}

export function getLevelConfig(level: AnimationLevel): LevelConfig {
  switch (level) {
    case 'fine':
      return { maxParticles: 200, flameRate: 4, ashRate: 1.5, smokeRate: 1 }
    case 'standard':
      return { maxParticles: 100, flameRate: 2.5, ashRate: 1, smokeRate: 0.6 }
    case 'simple':
      return { maxParticles: 40, flameRate: 1, ashRate: 0.4, smokeRate: 0.3 }
  }
}
