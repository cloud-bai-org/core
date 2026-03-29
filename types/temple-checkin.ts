export type PrayerPurpose = 'study' | 'career' | 'love' | 'health' | 'wealth' | 'safety'

export interface CheckinRecord {
  id: string
  templeId: string
  templeName: string
  timestamp: number
  prayerPurpose: PrayerPurpose | null
}

export interface AchievementBadge {
  id: string
  name: string
  description: string
  icon: string
  condition: AchievementCondition
}

export type AchievementCondition =
  | { type: 'checkin_count'; count: number }
  | { type: 'unique_temples'; count: number }
  | { type: 'all_purposes' }
  | { type: 'specific_purpose'; purpose: PrayerPurpose; count: number }

export interface EarnedBadge {
  badgeId: string
  earnedAt: number
}
