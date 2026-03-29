export type PrayerPurpose = 'study' | 'career' | 'love' | 'health' | 'wealth' | 'safety'

export const PRAYER_PURPOSE_LABELS: Record<PrayerPurpose, { name: string; icon: string }> = {
  study: { name: '學業', icon: '📚' },
  career: { name: '事業', icon: '💼' },
  love: { name: '愛情', icon: '💕' },
  health: { name: '健康', icon: '🏥' },
  wealth: { name: '財運', icon: '💰' },
  safety: { name: '平安', icon: '🙏' },
}

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
