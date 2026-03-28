import type { EcoImpact, WorshipRecord } from '~/types/auth'

const API_BASE = '/api'

export async function uploadGuestRecords(guestId: string, records: WorshipRecord[]): Promise<void> {
  await $fetch(`${API_BASE}/records/guest`, {
    method: 'POST',
    body: {
      guestId,
      records,
    },
  })
}

export async function uploadGuestEcoImpact(guestId: string, ecoImpact: EcoImpact): Promise<void> {
  await $fetch(`${API_BASE}/eco-impact/guest`, {
    method: 'POST',
    body: {
      guestId,
      ecoImpact,
    },
  })
}
