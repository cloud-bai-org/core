<template>
  <div class="flex flex-col gap-3">
    <!-- 供桌區域 -->
    <div
      ref="altarRef"
      class="relative aspect-[4/3] w-full rounded-xl border-2 border-amber-800/30 bg-gradient-to-b from-amber-50 to-amber-100"
      @dragover.prevent
      @drop="onDrop"
    >
      <!-- 供桌木紋裝飾 -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-4 rounded-b-xl bg-amber-800/20" />
      <div class="pointer-events-none absolute inset-x-4 top-2 text-center text-xs text-amber-800/40">
        供桌
      </div>

      <!-- 已擺放的供品 -->
      <div
        v-for="item in store.altarOfferings"
        :key="item.instanceId"
        class="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab flex-col items-center select-none active:cursor-grabbing"
        :style="{ left: `${item.x}%`, top: `${item.y}%` }"
        draggable="true"
        @dragstart="onDragStart($event, item.instanceId)"
        @touchstart.prevent="onTouchStart($event, item.instanceId)"
        @contextmenu.prevent="confirmRemove(item.instanceId)"
      >
        <span class="text-2xl drop-shadow-sm">{{ getEmoji(item.offeringId) }}</span>
        <span class="mt-0.5 rounded-full bg-white/80 px-1.5 text-[10px] shadow-sm">
          {{ getName(item.offeringId) }}
        </span>
      </div>
    </div>

    <!-- 操作提示 -->
    <p class="text-center text-xs text-muted-foreground">
      拖動供品調整位置・長按移除
    </p>
  </div>
</template>

<script setup lang="ts">
import { useOfferingStore } from '~/stores/offering'

const store = useOfferingStore()
const altarRef = ref<HTMLElement | null>(null)

function getEmoji(offeringId: string) {
  return store.getOfferingById(offeringId)?.emoji ?? '❓'
}

function getName(offeringId: string) {
  return store.getOfferingById(offeringId)?.name ?? ''
}

// --- 座標轉換 ---
function toPercent(clientX: number, clientY: number): { x: number, y: number } {
  const rect = altarRef.value!.getBoundingClientRect()
  return {
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100,
  }
}

// --- 桌面端 Drag & Drop ---
let dragInstanceId = ''

function onDragStart(e: DragEvent, instanceId: string) {
  dragInstanceId = instanceId
  e.dataTransfer!.effectAllowed = 'move'
  // 設定透明拖曳圖片，避免預設 ghost
  const img = new Image()
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  e.dataTransfer!.setDragImage(img, 0, 0)
}

function onDrop(e: DragEvent) {
  if (!dragInstanceId || !altarRef.value) return
  const { x, y } = toPercent(e.clientX, e.clientY)
  store.updatePosition(dragInstanceId, x, y)
  dragInstanceId = ''
}

// --- 行動端 Touch ---
let touchInstanceId = ''
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let hasMoved = false

function onTouchStart(e: TouchEvent, instanceId: string) {
  touchInstanceId = instanceId
  hasMoved = false

  // 長按移除
  longPressTimer = setTimeout(() => {
    if (!hasMoved) {
      confirmRemove(instanceId)
      touchInstanceId = ''
    }
  }, 600)

  const onTouchMove = (ev: TouchEvent) => {
    hasMoved = true
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
    if (!altarRef.value || !touchInstanceId) return
    const touch = ev.touches[0]
    const { x, y } = toPercent(touch.clientX, touch.clientY)
    store.updatePosition(touchInstanceId, x, y)
  }

  const onTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
    touchInstanceId = ''
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
  }

  document.addEventListener('touchmove', onTouchMove, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { once: true })
}

// --- 移除供品 ---
function confirmRemove(instanceId: string) {
  store.removeFromAltar(instanceId)
}
</script>
