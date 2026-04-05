import type { CeremonyImpact } from '~/lib/eco-calculator'

export interface EcoImpactRecord {
  id: string
  ceremonyDate: string
  paperSavedGrams: number
  co2ReducedGrams: number
  jossPaperDetail?: Array<{ name: string; grams: number }>
  paperCraftDetail?: { count: number; grams: number }
}

export interface EcoImpactSummary {
  totalPaperSaved: number
  totalCo2Reduced: number
  totalCeremonies: number
}

const GUEST_RECORDS_KEY = 'guest_eco_impact_records'

export const useEcoImpactStore = defineStore('eco-impact', () => {
  const authStore = useAuthStore()

  const records = ref<EcoImpactRecord[]>([])
  const summary = ref<EcoImpactSummary>({
    totalPaperSaved: 0,
    totalCo2Reduced: 0,
    totalCeremonies: 0,
  })
  const isGuest = ref(false)
  const loading = ref(false)

  // --- 訪客 localStorage ---

  function loadGuestRecords(): EcoImpactRecord[] {
    if (!import.meta.client) return []
    const raw = localStorage.getItem(GUEST_RECORDS_KEY)
    return raw ? JSON.parse(raw) : []
  }

  function saveGuestRecords(data: EcoImpactRecord[]) {
    if (!import.meta.client) return
    localStorage.setItem(GUEST_RECORDS_KEY, JSON.stringify(data))
  }

  // --- 資料載入 ---

  async function fetchData() {
    loading.value = true
    try {
      if (authStore.isLoggedIn) {
        isGuest.value = false
        const [summaryRes, recordsRes] = await Promise.all([
          $fetch<EcoImpactSummary>('/api/eco-impact/summary', {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }),
          $fetch<EcoImpactRecord[]>('/api/eco-impact/records', {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }),
        ])
        summary.value = summaryRes
        records.value = recordsRes
      } else {
        isGuest.value = true
        const guestRecords = loadGuestRecords()
        records.value = guestRecords
        summary.value = {
          totalPaperSaved: guestRecords.reduce((s, r) => s + r.paperSavedGrams, 0),
          totalCo2Reduced: guestRecords.reduce((s, r) => s + r.co2ReducedGrams, 0),
          totalCeremonies: guestRecords.length,
        }
      }
    } finally {
      loading.value = false
    }
  }

  // --- 儲存單次紀錄 ---

  async function saveRecord(impact: CeremonyImpact) {
    const record: EcoImpactRecord = {
      id: crypto.randomUUID(),
      ceremonyDate: new Date().toISOString(),
      paperSavedGrams: impact.paperSavedGrams,
      co2ReducedGrams: impact.co2ReducedGrams,
      jossPaperDetail: impact.jossPaperDetail,
      paperCraftDetail: impact.paperCraftDetail,
    }

    if (authStore.isLoggedIn) {
      const saved = await $fetch<EcoImpactRecord>('/api/eco-impact', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: {
          paperSavedGrams: impact.paperSavedGrams,
          co2ReducedGrams: impact.co2ReducedGrams,
          jossPaperDetail: impact.jossPaperDetail,
          paperCraftDetail: impact.paperCraftDetail,
        },
      })
      records.value.unshift(saved)
    } else {
      records.value.unshift(record)
      saveGuestRecords(records.value)
    }

    // 更新 summary
    summary.value.totalPaperSaved += impact.paperSavedGrams
    summary.value.totalCo2Reduced += impact.co2ReducedGrams
    summary.value.totalCeremonies++

    return record
  }

  // --- 訪客登入後合併 ---

  async function mergeGuestRecords() {
    if (!authStore.isLoggedIn) return

    const guestRecords = loadGuestRecords()
    if (!guestRecords.length) return

    await $fetch('/api/eco-impact/merge-guest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        records: guestRecords.map(r => ({
          ceremonyDate: r.ceremonyDate,
          paperSavedGrams: r.paperSavedGrams,
          co2ReducedGrams: r.co2ReducedGrams,
          jossPaperDetail: r.jossPaperDetail,
          paperCraftDetail: r.paperCraftDetail,
        })),
      },
    })

    // 合併成功後清除本機訪客紀錄
    if (import.meta.client) {
      localStorage.removeItem(GUEST_RECORDS_KEY)
    }

    // 重新載入伺服器端資料
    await fetchData()
  }

  return {
    records: readonly(records),
    summary: readonly(summary),
    isGuest: readonly(isGuest),
    loading: readonly(loading),
    fetchData,
    saveRecord,
    mergeGuestRecords,
  }
})
