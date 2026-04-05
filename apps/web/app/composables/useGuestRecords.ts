import type { EcoImpact, WorshipRecord } from '~/types/auth'

const STORAGE_KEY_RECORDS = 'guest_worship_records'
const STORAGE_KEY_ECO = 'guest_eco_impact'

export function useGuestRecords() {
  const records = ref<WorshipRecord[]>([])
  const ecoImpact = ref<EcoImpact>({
    incensesSaved: 0,
    papersSaved: 0,
    co2Reduced: 0,
  })

  function load() {
    if (!import.meta.client) return

    const rawRecords = localStorage.getItem(STORAGE_KEY_RECORDS)
    if (rawRecords) {
      records.value = JSON.parse(rawRecords)
    }

    const rawEco = localStorage.getItem(STORAGE_KEY_ECO)
    if (rawEco) {
      ecoImpact.value = JSON.parse(rawEco)
    }
  }

  function save() {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records.value))
    localStorage.setItem(STORAGE_KEY_ECO, JSON.stringify(ecoImpact.value))
  }

  function addRecord(record: WorshipRecord) {
    records.value.push(record)
    save()
  }

  function updateEcoImpact(impact: Partial<EcoImpact>) {
    if (impact.incensesSaved !== undefined) ecoImpact.value.incensesSaved += impact.incensesSaved
    if (impact.papersSaved !== undefined) ecoImpact.value.papersSaved += impact.papersSaved
    if (impact.co2Reduced !== undefined) ecoImpact.value.co2Reduced += impact.co2Reduced
    save()
  }

  function markAllSynced() {
    records.value = records.value.map(r => ({ ...r, synced: true }))
    save()
  }

  function getUnsyncedRecords() {
    return records.value.filter(r => !r.synced)
  }

  function clearAll() {
    records.value = []
    ecoImpact.value = { incensesSaved: 0, papersSaved: 0, co2Reduced: 0 }
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY_RECORDS)
      localStorage.removeItem(STORAGE_KEY_ECO)
    }
  }

  load()

  return {
    records: readonly(records),
    ecoImpact: readonly(ecoImpact),
    addRecord,
    updateEcoImpact,
    markAllSynced,
    getUnsyncedRecords,
    clearAll,
  }
}
