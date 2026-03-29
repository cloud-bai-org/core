// 紙紮物品 Canvas 造型繪製
// 每個函式在以 (0,0) 為中心、scale 已套用的座標系下繪製

type DrawFn = (ctx: CanvasRenderingContext2D, s: number) => void

// ---- 3C 產品 ----

const phone: DrawFn = (ctx, s) => {
  // 手機外框
  roundRect(ctx, -8 * s, -14 * s, 16 * s, 28 * s, 3 * s)
  ctx.fill()
  ctx.stroke()
  // 螢幕
  ctx.fillStyle = '#4A90D9'
  ctx.fillRect(-6 * s, -10 * s, 12 * s, 20 * s)
  // Home 鍵
  ctx.beginPath()
  ctx.arc(0, 13 * s, 2 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#888'
  ctx.fill()
}

const tablet: DrawFn = (ctx, s) => {
  roundRect(ctx, -12 * s, -16 * s, 24 * s, 32 * s, 2 * s)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#4A90D9'
  ctx.fillRect(-10 * s, -13 * s, 20 * s, 26 * s)
  // 前置鏡頭
  ctx.beginPath()
  ctx.arc(0, -14.5 * s, 1 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#555'
  ctx.fill()
}

const laptop: DrawFn = (ctx, s) => {
  // 螢幕部分
  roundRect(ctx, -14 * s, -16 * s, 28 * s, 20 * s, 2 * s)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#4A90D9'
  ctx.fillRect(-12 * s, -14 * s, 24 * s, 16 * s)
  // 鍵盤底座
  ctx.beginPath()
  ctx.moveTo(-16 * s, 4 * s)
  ctx.lineTo(16 * s, 4 * s)
  ctx.lineTo(18 * s, 12 * s)
  ctx.lineTo(-18 * s, 12 * s)
  ctx.closePath()
  ctx.fillStyle = '#999'
  ctx.fill()
  ctx.stroke()
}

const tv: DrawFn = (ctx, s) => {
  // 螢幕
  roundRect(ctx, -16 * s, -14 * s, 32 * s, 22 * s, 2 * s)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#3388CC'
  ctx.fillRect(-14 * s, -12 * s, 28 * s, 18 * s)
  // 底座
  ctx.fillStyle = '#666'
  ctx.fillRect(-4 * s, 8 * s, 8 * s, 3 * s)
  ctx.fillRect(-8 * s, 11 * s, 16 * s, 2 * s)
}

const camera: DrawFn = (ctx, s) => {
  // 機身
  roundRect(ctx, -14 * s, -8 * s, 28 * s, 18 * s, 3 * s)
  ctx.fill()
  ctx.stroke()
  // 鏡頭
  ctx.beginPath()
  ctx.arc(0, 1 * s, 7 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, 1 * s, 5 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#5577AA'
  ctx.fill()
  // 觀景窗
  ctx.fillStyle = '#222'
  ctx.fillRect(6 * s, -7 * s, 6 * s, 4 * s)
  // 閃光燈
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(-10 * s, -7 * s, 3 * s, 3 * s)
}

// ---- 房屋 ----

const mansion: DrawFn = (ctx, s) => {
  // 屋頂（三角形）
  ctx.beginPath()
  ctx.moveTo(0, -16 * s)
  ctx.lineTo(-18 * s, -4 * s)
  ctx.lineTo(18 * s, -4 * s)
  ctx.closePath()
  ctx.fillStyle = '#CC4444'
  ctx.fill()
  ctx.stroke()
  // 牆壁
  ctx.fillRect(-15 * s, -4 * s, 30 * s, 18 * s)
  ctx.stroke()
  // 大門
  ctx.fillStyle = '#8B4513'
  roundRect(ctx, -4 * s, 4 * s, 8 * s, 10 * s, 2 * s)
  ctx.fill()
  // 窗戶
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(-12 * s, -1 * s, 5 * s, 5 * s)
  ctx.fillRect(7 * s, -1 * s, 5 * s, 5 * s)
}

const apartment: DrawFn = (ctx, s) => {
  // 大樓主體
  ctx.fillRect(-10 * s, -16 * s, 20 * s, 30 * s)
  ctx.stroke()
  // 窗戶排列
  ctx.fillStyle = '#87CEEB'
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.fillRect((-7 + col * 5) * s, (-13 + row * 7) * s, 3.5 * s, 4.5 * s)
    }
  }
  // 大門
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-3 * s, 8 * s, 6 * s, 6 * s)
}

const traditional: DrawFn = (ctx, s) => {
  // 三合院：中間主屋
  ctx.fillRect(-6 * s, -6 * s, 12 * s, 12 * s)
  ctx.stroke()
  // 屋頂（微彎曲線）
  ctx.beginPath()
  ctx.moveTo(-8 * s, -6 * s)
  ctx.quadraticCurveTo(0, -14 * s, 8 * s, -6 * s)
  ctx.fillStyle = '#CC4444'
  ctx.fill()
  ctx.stroke()
  // 左護龍
  ctx.fillRect(-18 * s, -2 * s, 10 * s, 10 * s)
  ctx.stroke()
  // 右護龍
  ctx.fillRect(8 * s, -2 * s, 10 * s, 10 * s)
  ctx.stroke()
  // 門
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-2 * s, 0, 4 * s, 6 * s)
  // 院子
  ctx.fillStyle = '#D2B48C'
  ctx.fillRect(-6 * s, 6 * s, 12 * s, 6 * s)
}

const gardenHouse: DrawFn = (ctx, s) => {
  // 洋房主體
  ctx.fillRect(-12 * s, -6 * s, 24 * s, 16 * s)
  ctx.stroke()
  // 斜屋頂
  ctx.beginPath()
  ctx.moveTo(-14 * s, -6 * s)
  ctx.lineTo(0, -16 * s)
  ctx.lineTo(14 * s, -6 * s)
  ctx.closePath()
  ctx.fillStyle = '#996633'
  ctx.fill()
  ctx.stroke()
  // 窗戶
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(-9 * s, -3 * s, 5 * s, 5 * s)
  ctx.fillRect(4 * s, -3 * s, 5 * s, 5 * s)
  // 門
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-2.5 * s, 3 * s, 5 * s, 7 * s)
  // 花園
  ctx.fillStyle = '#228B22'
  ctx.beginPath()
  ctx.arc(-8 * s, 12 * s, 3 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(8 * s, 12 * s, 3 * s, 0, Math.PI * 2)
  ctx.fill()
}

// ---- 車輛 ----

const sedan: DrawFn = (ctx, s) => {
  // 車頂
  ctx.beginPath()
  ctx.moveTo(-8 * s, -4 * s)
  ctx.lineTo(-4 * s, -12 * s)
  ctx.lineTo(6 * s, -12 * s)
  ctx.lineTo(12 * s, -4 * s)
  ctx.closePath()
  ctx.fillStyle = '#4488CC'
  ctx.fill()
  ctx.stroke()
  // 車身
  roundRect(ctx, -16 * s, -4 * s, 32 * s, 10 * s, 3 * s)
  ctx.fill()
  ctx.stroke()
  // 車窗
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(-6 * s, -10 * s, 5 * s, 6 * s)
  ctx.fillRect(2 * s, -10 * s, 5 * s, 6 * s)
  // 輪子
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(-9 * s, 6 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(9 * s, 6 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
}

const suv: DrawFn = (ctx, s) => {
  // 車頂（較高）
  ctx.beginPath()
  ctx.moveTo(-10 * s, -6 * s)
  ctx.lineTo(-6 * s, -14 * s)
  ctx.lineTo(8 * s, -14 * s)
  ctx.lineTo(12 * s, -6 * s)
  ctx.closePath()
  ctx.fillStyle = '#556B2F'
  ctx.fill()
  ctx.stroke()
  // 車身（較高）
  roundRect(ctx, -16 * s, -6 * s, 32 * s, 12 * s, 3 * s)
  ctx.fill()
  ctx.stroke()
  // 車窗
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(-8 * s, -12 * s, 6 * s, 6 * s)
  ctx.fillRect(2 * s, -12 * s, 6 * s, 6 * s)
  // 輪子（較大）
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(-9 * s, 6 * s, 5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(9 * s, 6 * s, 5 * s, 0, Math.PI * 2)
  ctx.fill()
}

const motorcycle: DrawFn = (ctx, s) => {
  // 車身斜線
  ctx.beginPath()
  ctx.moveTo(-4 * s, -10 * s)
  ctx.lineTo(6 * s, -4 * s)
  ctx.lineTo(4 * s, 0)
  ctx.lineTo(-6 * s, -6 * s)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // 把手
  ctx.beginPath()
  ctx.moveTo(-6 * s, -12 * s)
  ctx.lineTo(0, -10 * s)
  ctx.lineTo(6 * s, -12 * s)
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.lineWidth = 1
  // 前輪
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(-8 * s, 6 * s, 5 * s, 0, Math.PI * 2)
  ctx.fill()
  // 後輪
  ctx.beginPath()
  ctx.arc(8 * s, 6 * s, 5 * s, 0, Math.PI * 2)
  ctx.fill()
  // 排氣管
  ctx.fillStyle = '#999'
  ctx.fillRect(6 * s, 0, 8 * s, 2 * s)
}

const bicycle: DrawFn = (ctx, s) => {
  ctx.lineWidth = 1.5
  // 車架三角形
  ctx.beginPath()
  ctx.moveTo(-2 * s, -8 * s)
  ctx.lineTo(-8 * s, 4 * s)
  ctx.lineTo(8 * s, 4 * s)
  ctx.closePath()
  ctx.stroke()
  // 座墊
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-4 * s, -10 * s, 4 * s, 2 * s)
  // 把手
  ctx.beginPath()
  ctx.moveTo(6 * s, -10 * s)
  ctx.lineTo(8 * s, -4 * s)
  ctx.stroke()
  ctx.fillRect(4 * s, -12 * s, 4 * s, 2 * s)
  // 前輪
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(-8 * s, 8 * s, 5 * s, 0, Math.PI * 2)
  ctx.stroke()
  // 後輪
  ctx.beginPath()
  ctx.arc(8 * s, 8 * s, 5 * s, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 1
}

// ---- 精品 ----

const watch: DrawFn = (ctx, s) => {
  // 錶帶上
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-4 * s, -16 * s, 8 * s, 8 * s)
  // 錶帶下
  ctx.fillRect(-4 * s, 8 * s, 8 * s, 8 * s)
  // 錶面外框
  ctx.beginPath()
  ctx.arc(0, 0, 10 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#DAA520'
  ctx.fill()
  ctx.stroke()
  // 錶面
  ctx.beginPath()
  ctx.arc(0, 0, 8 * s, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // 時針分針
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, -5 * s)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(4 * s, -2 * s)
  ctx.stroke()
  ctx.lineWidth = 1
}

const bag: DrawFn = (ctx, s) => {
  // 包包主體
  roundRect(ctx, -12 * s, -6 * s, 24 * s, 18 * s, 4 * s)
  ctx.fill()
  ctx.stroke()
  // 提把
  ctx.beginPath()
  ctx.moveTo(-6 * s, -6 * s)
  ctx.quadraticCurveTo(-6 * s, -14 * s, 0, -14 * s)
  ctx.quadraticCurveTo(6 * s, -14 * s, 6 * s, -6 * s)
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.lineWidth = 1
  // 扣環
  ctx.fillStyle = '#DAA520'
  ctx.fillRect(-3 * s, 2 * s, 6 * s, 3 * s)
}

const jewelry: DrawFn = (ctx, s) => {
  // 戒環
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 10 * s, 6 * s, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#DAA520'
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 7 * s, 4 * s, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF8DC'
  ctx.fill()
  // 寶石
  ctx.beginPath()
  ctx.moveTo(0, -8 * s)
  ctx.lineTo(-6 * s, -2 * s)
  ctx.lineTo(-4 * s, 2 * s)
  ctx.lineTo(4 * s, 2 * s)
  ctx.lineTo(6 * s, -2 * s)
  ctx.closePath()
  ctx.fillStyle = '#E0115F'
  ctx.fill()
  ctx.stroke()
}

const perfume: DrawFn = (ctx, s) => {
  // 瓶蓋
  ctx.fillStyle = '#DAA520'
  ctx.fillRect(-3 * s, -16 * s, 6 * s, 6 * s)
  // 瓶頸
  ctx.fillRect(-2 * s, -10 * s, 4 * s, 4 * s)
  ctx.stroke()
  // 瓶身
  roundRect(ctx, -10 * s, -6 * s, 20 * s, 20 * s, 4 * s)
  ctx.fillStyle = '#DDA0DD'
  ctx.fill()
  ctx.stroke()
  // 標籤
  ctx.fillStyle = '#FFF'
  ctx.fillRect(-6 * s, 0, 12 * s, 6 * s)
}

// ---- 日用品 ----

const clothes: DrawFn = (ctx, s) => {
  // T-shirt 造型
  ctx.beginPath()
  // 左肩
  ctx.moveTo(-12 * s, -8 * s)
  ctx.lineTo(-16 * s, -2 * s)
  ctx.lineTo(-10 * s, 0)
  ctx.lineTo(-8 * s, -4 * s)
  // 左身
  ctx.lineTo(-8 * s, 14 * s)
  ctx.lineTo(8 * s, 14 * s)
  // 右身
  ctx.lineTo(8 * s, -4 * s)
  ctx.lineTo(10 * s, 0)
  ctx.lineTo(16 * s, -2 * s)
  ctx.lineTo(12 * s, -8 * s)
  // 領口
  ctx.quadraticCurveTo(0, -2 * s, -12 * s, -8 * s)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

const shoes: DrawFn = (ctx, s) => {
  // 鞋子側面
  ctx.beginPath()
  ctx.moveTo(-14 * s, 2 * s)
  ctx.lineTo(-14 * s, -6 * s)
  ctx.quadraticCurveTo(-10 * s, -10 * s, -4 * s, -8 * s)
  ctx.lineTo(6 * s, -6 * s)
  ctx.lineTo(16 * s, -2 * s)
  ctx.lineTo(16 * s, 2 * s)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // 鞋底
  ctx.fillStyle = '#555'
  ctx.fillRect(-14 * s, 2 * s, 30 * s, 4 * s)
  ctx.stroke()
  // 鞋帶裝飾
  ctx.strokeStyle = '#FFF'
  ctx.beginPath()
  ctx.moveTo(-6 * s, -6 * s)
  ctx.lineTo(-2 * s, -2 * s)
  ctx.moveTo(-2 * s, -7 * s)
  ctx.lineTo(2 * s, -3 * s)
  ctx.stroke()
}

const furniture: DrawFn = (ctx, s) => {
  // 沙發主體
  roundRect(ctx, -14 * s, -4 * s, 28 * s, 14 * s, 3 * s)
  ctx.fill()
  ctx.stroke()
  // 靠背
  roundRect(ctx, -12 * s, -12 * s, 24 * s, 10 * s, 3 * s)
  ctx.fill()
  ctx.stroke()
  // 扶手
  roundRect(ctx, -16 * s, -8 * s, 4 * s, 16 * s, 2 * s)
  ctx.fill()
  ctx.stroke()
  roundRect(ctx, 12 * s, -8 * s, 4 * s, 16 * s, 2 * s)
  ctx.fill()
  ctx.stroke()
  // 沙發腳
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(-12 * s, 10 * s, 3 * s, 4 * s)
  ctx.fillRect(9 * s, 10 * s, 3 * s, 4 * s)
}

const appliance: DrawFn = (ctx, s) => {
  // 冰箱造型
  roundRect(ctx, -10 * s, -16 * s, 20 * s, 32 * s, 2 * s)
  ctx.fill()
  ctx.stroke()
  // 上下層分隔線
  ctx.beginPath()
  ctx.moveTo(-10 * s, -2 * s)
  ctx.lineTo(10 * s, -2 * s)
  ctx.stroke()
  // 把手
  ctx.fillStyle = '#999'
  ctx.fillRect(6 * s, -12 * s, 2 * s, 8 * s)
  ctx.fillRect(6 * s, 2 * s, 2 * s, 10 * s)
}

// ---- 美食 ----

const feast: DrawFn = (ctx, s) => {
  // 大圓盤
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 16 * s, 8 * s, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.stroke()
  // 食物堆疊
  ctx.fillStyle = '#CD853F'
  ctx.beginPath()
  ctx.arc(-4 * s, -2 * s, 5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#DC143C'
  ctx.beginPath()
  ctx.arc(4 * s, -4 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#228B22'
  ctx.beginPath()
  ctx.arc(0, -8 * s, 3 * s, 0, Math.PI * 2)
  ctx.fill()
}

const fruit: DrawFn = (ctx, s) => {
  // 籃子
  ctx.beginPath()
  ctx.moveTo(-14 * s, 0)
  ctx.quadraticCurveTo(-12 * s, 14 * s, 0, 14 * s)
  ctx.quadraticCurveTo(12 * s, 14 * s, 14 * s, 0)
  ctx.fillStyle = '#D2B48C'
  ctx.fill()
  ctx.stroke()
  // 水果
  ctx.fillStyle = '#FF4500'
  ctx.beginPath()
  ctx.arc(-5 * s, -2 * s, 5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(5 * s, -4 * s, 4.5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#228B22'
  ctx.beginPath()
  ctx.arc(0, -8 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
}

const snack: DrawFn = (ctx, s) => {
  // 禮盒
  roundRect(ctx, -12 * s, -10 * s, 24 * s, 22 * s, 3 * s)
  ctx.fillStyle = '#DC143C'
  ctx.fill()
  ctx.stroke()
  // 蝴蝶結緞帶（橫）
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(-12 * s, -2 * s, 24 * s, 4 * s)
  // 蝴蝶結緞帶（縱）
  ctx.fillRect(-2 * s, -10 * s, 4 * s, 22 * s)
  // 蝴蝶結
  ctx.beginPath()
  ctx.moveTo(0, -2 * s)
  ctx.quadraticCurveTo(-8 * s, -8 * s, 0, -6 * s)
  ctx.quadraticCurveTo(8 * s, -8 * s, 0, -2 * s)
  ctx.fill()
}

const tea: DrawFn = (ctx, s) => {
  // 茶罐主體
  roundRect(ctx, -8 * s, -10 * s, 16 * s, 24 * s, 3 * s)
  ctx.fillStyle = '#556B2F'
  ctx.fill()
  ctx.stroke()
  // 蓋子
  roundRect(ctx, -6 * s, -14 * s, 12 * s, 5 * s, 2 * s)
  ctx.fillStyle = '#8B4513'
  ctx.fill()
  ctx.stroke()
  // 標籤
  ctx.fillStyle = '#FFF8DC'
  ctx.fillRect(-5 * s, -4 * s, 10 * s, 10 * s)
  // 茶字
  ctx.fillStyle = '#556B2F'
  ctx.font = `${8 * s}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('茶', 0, 2 * s)
}

// ---- 自訂物品 ----

const customItem: DrawFn = (ctx, s) => {
  // 禮物盒造型
  // 盒身
  roundRect(ctx, -12 * s, -4 * s, 24 * s, 18 * s, 2 * s)
  ctx.fillStyle = '#E07050'
  ctx.fill()
  ctx.stroke()
  // 蓋子
  roundRect(ctx, -14 * s, -8 * s, 28 * s, 6 * s, 2 * s)
  ctx.fillStyle = '#D06040'
  ctx.fill()
  ctx.stroke()
  // 緞帶（縱）
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(-2 * s, -8 * s, 4 * s, 22 * s)
  // 緞帶（橫）
  ctx.fillRect(-14 * s, 2 * s, 28 * s, 3 * s)
  // 蝴蝶結
  ctx.beginPath()
  ctx.moveTo(0, -8 * s)
  ctx.quadraticCurveTo(-8 * s, -16 * s, 0, -12 * s)
  ctx.quadraticCurveTo(8 * s, -16 * s, 0, -8 * s)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  ctx.stroke()
}

// ---- 工具 ----

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

// ---- 物品 ID → 繪製函式對映 ----

const SHAPE_MAP: Record<string, DrawFn> = {
  // 3C
  '3c-phone': phone,
  '3c-tablet': tablet,
  '3c-laptop': laptop,
  '3c-tv': tv,
  '3c-camera': camera,
  // 房屋
  'house-mansion': mansion,
  'house-apartment': apartment,
  'house-traditional': traditional,
  'house-garden': gardenHouse,
  // 車輛
  'vehicle-sedan': sedan,
  'vehicle-suv': suv,
  'vehicle-motorcycle': motorcycle,
  'vehicle-bicycle': bicycle,
  // 精品
  'luxury-watch': watch,
  'luxury-bag': bag,
  'luxury-jewelry': jewelry,
  'luxury-perfume': perfume,
  // 日用品
  'daily-clothes': clothes,
  'daily-shoes': shoes,
  'daily-furniture': furniture,
  'daily-appliance': appliance,
  // 美食
  'food-feast': feast,
  'food-fruit': fruit,
  'food-snack': snack,
  'food-tea': tea,
}

// 紙紮物品的基底色（紙紮特有的淺色調）
const ITEM_BASE_COLORS: Record<string, string> = {
  '3c': '#C8C8D8',
  house: '#DEC8A8',
  vehicle: '#B8CCE0',
  luxury: '#E0C8E0',
  daily: '#C0D8C0',
  food: '#E8E0C0',
}

/**
 * 繪製指定物品的造型
 * @param ctx Canvas 2D context
 * @param itemId 物品 ID
 * @param categoryId 分類 ID
 * @param scale 縮放比例（1 = 預設大小約 32×32px）
 * @param name 物品名稱（自訂物品顯示用）
 */
export function drawItemShape(
  ctx: CanvasRenderingContext2D,
  itemId: string,
  categoryId: string,
  scale: number = 1,
  name?: string,
) {
  const drawFn = SHAPE_MAP[itemId]

  ctx.save()
  // 設定紙紮風格的基底色與描邊
  ctx.fillStyle = ITEM_BASE_COLORS[categoryId] ?? '#E8D5B7'
  ctx.strokeStyle = '#8B7355'
  ctx.lineWidth = 1

  if (drawFn) {
    drawFn(ctx, scale)
  } else {
    // 自訂物品或未知物品
    customItem(ctx, scale)
    // 顯示物品名稱（禮物盒下方）
    if (name) {
      ctx.fillStyle = '#6B5B47'
      ctx.font = `bold ${8 * scale}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const displayName = name.length > 5 ? name.slice(0, 5) + '..' : name
      ctx.fillText(displayName, 0, 16 * scale)
    }
  }

  ctx.restore()
}
