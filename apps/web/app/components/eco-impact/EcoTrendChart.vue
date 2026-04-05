<template>
  <div>
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-medium">環保趨勢</h3>
      <div class="flex gap-1">
        <Button
          v-for="mode in (['month', 'year'] as const)"
          :key="mode"
          :variant="viewMode === mode ? 'default' : 'outline'"
          size="sm"
          class="h-7 px-2 text-xs"
          @click="viewMode = mode"
        >
          {{ mode === 'month' ? '月' : '年' }}
        </Button>
      </div>
    </div>
    <div ref="chartRef" class="h-52 w-full" />
    <p v-if="!records.length" class="py-8 text-center text-sm text-muted-foreground">
      尚無紀錄
    </p>
  </div>
</template>

<script setup lang="ts">
import { echarts } from '~/lib/echarts'
import type { EcoImpactRecord } from '~/stores/eco-impact'

const props = defineProps<{
  records: readonly EcoImpactRecord[]
}>()

const chartRef = ref<HTMLElement>()
const viewMode = ref<'month' | 'year'>('month')
let chartInstance: ReturnType<typeof echarts.init> | null = null

const groupedData = computed(() => {
  const groups = new Map<string, { paper: number; co2: number }>()

  for (const record of props.records) {
    const date = new Date(record.ceremonyDate)
    const key = viewMode.value === 'month'
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : `${date.getFullYear()}`

    const existing = groups.get(key) ?? { paper: 0, co2: 0 }
    existing.paper += record.paperSavedGrams
    existing.co2 += record.co2ReducedGrams
    groups.set(key, existing)
  }

  const sorted = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  return {
    labels: sorted.map(([k]) => k),
    paper: sorted.map(([, v]) => Math.round(v.paper)),
    co2: sorted.map(([, v]) => Math.round(v.co2)),
  }
})

function renderChart() {
  if (!chartRef.value || !props.records.length) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 16, top: 24, bottom: 24 },
    xAxis: {
      type: 'category',
      data: groupedData.value.labels,
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, formatter: '{value}g' },
    },
    series: [
      {
        name: '紙張減少 (g)',
        type: 'bar',
        data: groupedData.value.paper,
        itemStyle: { color: '#22c55e' },
      },
      {
        name: 'CO₂ 減少 (g)',
        type: 'line',
        data: groupedData.value.co2,
        itemStyle: { color: '#3b82f6' },
        smooth: true,
      },
    ],
  })
}

function handleResize() {
  chartInstance?.resize()
}

watch([groupedData, chartRef], () => renderChart(), { flush: 'post' })

onMounted(() => {
  window.addEventListener('resize', handleResize)
  renderChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
</script>
