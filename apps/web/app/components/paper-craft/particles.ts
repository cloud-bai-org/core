import type { AnimationLevel } from '~/stores/paper-craft'

// 複用 joss-paper 的粒子池與基礎粒子型別
export {
  ParticlePool,
  type FlameParticle,
  type AshParticle,
  type SmokeParticle,
  type AnyParticle,
  type LevelConfig,
} from '~/components/joss-paper/particles'

import { ParticlePool } from '~/components/joss-paper/particles'
import type { FlameParticle, AshParticle, SmokeParticle, AnyParticle, LevelConfig } from '~/components/joss-paper/particles'

// ---- 紙紮專屬粒子參數 ----

// 紙紮物品的焚燒色調：偏暖橘紅，與金紙的金黃色系區隔
const PAPER_CRAFT_FLAME_COLORS: [string, string, string] = ['#FF6B35', '#FF4500', '#CC2200']
const PAPER_CRAFT_ASH_COLOR = '#7A6B5D'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export function createPaperCraftFlame(
  cx: number,
  baseY: number,
  intensity: number,
): FlameParticle {
  // 紙紮物品較大，火焰擴散範圍更大
  const spread = 25 + intensity * 20
  return {
    type: 'flame',
    x: cx + rand(-spread, spread),
    y: baseY + rand(-8, 5),
    vx: rand(-1, 1),
    vy: rand(-3.5, -1.5) * (1 + intensity * 0.4),
    life: 0,
    maxLife: rand(25, 60),
    size: rand(4, 10) * (1 + intensity * 0.3),
    colorPhase: Math.random(),
  }
}

export function createPaperCraftAsh(
  cx: number,
  baseY: number,
): AshParticle {
  return {
    type: 'ash',
    x: cx + rand(-35, 35),
    y: baseY + rand(-50, -10),
    vx: rand(-0.7, 0.7),
    vy: rand(0.2, 1.0),
    life: 0,
    maxLife: rand(80, 150), // 紙紮灰燼飄散更久
    size: rand(3, 7), // 灰燼碎片更大
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.04, 0.04),
  }
}

export function createPaperCraftSmoke(
  cx: number,
  baseY: number,
): SmokeParticle {
  return {
    type: 'smoke',
    x: cx + rand(-20, 20),
    y: baseY + rand(-25, -5),
    vx: rand(-0.4, 0.4),
    vy: rand(-1.8, -0.6),
    life: 0,
    maxLife: rand(90, 160),
    size: rand(8, 18), // 煙霧更大更明顯
    opacity: rand(0.1, 0.25),
  }
}

// ---- 紙紮專屬渲染器 ----

function lerpColor(a: string, b: string, t: number): string {
  const parseHex = (hex: string): [number, number, number] => {
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

export function renderPaperCraftParticles(
  ctx: CanvasRenderingContext2D,
  pool: ParticlePool,
) {
  for (const p of pool.all) {
    const progress = p.life / p.maxLife
    const alpha = 1 - progress

    if (p.type === 'flame') {
      const fp = p as FlameParticle
      const colorIdx = Math.min(2, Math.floor(progress * 3))
      const nextIdx = Math.min(2, colorIdx + 1)
      const localT = (progress * 3) - colorIdx
      const color = lerpColor(
        PAPER_CRAFT_FLAME_COLORS[colorIdx]!,
        PAPER_CRAFT_FLAME_COLORS[nextIdx]!,
        localT,
      )
      const size = fp.size * (1 - progress * 0.5)
      ctx.globalAlpha = alpha * 0.85
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(fp.x, fp.y, Math.max(0.5, size), 0, Math.PI * 2)
      ctx.fill()
    } else if (p.type === 'ash') {
      const ap = p as AshParticle
      ap.rotation += ap.rotationSpeed
      // 紙紮灰燼：不規則碎片形狀
      const size = ap.size * (1 - progress * 0.25)
      ctx.globalAlpha = alpha * 0.6
      ctx.fillStyle = PAPER_CRAFT_ASH_COLOR
      ctx.save()
      ctx.translate(ap.x, ap.y)
      ctx.rotate(ap.rotation)
      // 較大的不規則碎片
      ctx.beginPath()
      ctx.moveTo(-size / 2, -size / 3)
      ctx.lineTo(size / 3, -size / 2)
      ctx.lineTo(size / 2, size / 4)
      ctx.lineTo(-size / 4, size / 3)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    } else if (p.type === 'smoke') {
      const sp = p as SmokeParticle
      const size = sp.size * (1 + progress * 2.5)
      sp.vx += (Math.random() - 0.5) * 0.06
      ctx.globalAlpha = sp.opacity * (1 - progress)
      ctx.fillStyle = 'rgba(140, 130, 120, 1)' // 偏暖色調的煙
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

// ---- 動畫等級配置（紙紮物品版） ----

export function getPaperCraftLevelConfig(level: AnimationLevel): LevelConfig {
  switch (level) {
    case 'fine':
      return { maxParticles: 200, flameRate: 3.5, ashRate: 1.8, smokeRate: 1.2 }
    case 'standard':
      return { maxParticles: 100, flameRate: 2, ashRate: 1.2, smokeRate: 0.7 }
    case 'simple':
      return { maxParticles: 40, flameRate: 0.8, ashRate: 0.5, smokeRate: 0.3 }
  }
}
