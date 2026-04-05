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

export interface UserData {
  records: WorshipRecord[]
  ecoImpact: EcoImpact
  templeCheckins: string[]
}

export async function fetchUserData(token: string): Promise<UserData> {
  return await $fetch<UserData>(`${API_BASE}/user/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function mergeGuestRecords(
  token: string,
  guestId: string,
  records: WorshipRecord[],
): Promise<void> {
  await $fetch(`${API_BASE}/user/merge-guest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      guestId,
      records,
    },
  })
}
