export type AuthProvider = 'google' | 'line' | 'guest'

export interface AuthUser {
  id: string
  name: string
  avatar?: string
  email?: string
  provider: AuthProvider
}

export interface WorshipRecord {
  id: string
  templeId?: string
  deityId?: string
  date: string
  type: string
  guestId?: string
  userId?: string
  synced: boolean
}

export interface EcoImpact {
  incensesSaved: number
  papersSaved: number
  co2Reduced: number
}
