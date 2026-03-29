import type { Temple } from '~/types/data'
import type {
  AchievementBadge,
  CheckinRecord,
  EarnedBadge,
  PrayerPurpose,
} from '~/types/temple-checkin'
import templesData from '~/data/temples.json'
import achievementsData from '~/data/achievements.json'

export const useTempleCheckinStore = defineStore('temple-checkin', () => {
  const temples = templesData as Temple[]
  const achievements = achievementsData as AchievementBadge[]

  const checkins = ref<CheckinRecord[]>([])
  const earnedBadges = ref<EarnedBadge[]>([])

  const totalCheckins = computed(() => checkins.value.length)

  const uniqueTempleIds = computed(() =>
    [...new Set(checkins.value.map(c => c.templeId))],
  )

  const purposeCounts = computed(() => {
    const counts: Partial<Record<PrayerPurpose, number>> = {}
    for (const c of checkins.value) {
      if (c.prayerPurpose) {
        counts[c.prayerPurpose] = (counts[c.prayerPurpose] ?? 0) + 1
      }
    }
    return counts
  })

  const completedPurposes = computed(() =>
    Object.keys(purposeCounts.value) as PrayerPurpose[],
  )

  function findTemple(id: string): Temple | undefined {
    return temples.find(t => t.id === id)
  }

  function searchTemples(query: string): Temple[] {
    if (!query.trim()) return temples
    const q = query.trim().toLowerCase()
    return temples.filter(t =>
      t.name.toLowerCase().includes(q)
      || t.address.toLowerCase().includes(q)
      || t.description.toLowerCase().includes(q),
    )
  }

  function checkin(templeId: string, prayerPurpose: PrayerPurpose | null = null): CheckinRecord {
    const temple = findTemple(templeId)
    const record: CheckinRecord = {
      id: `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      templeId,
      templeName: temple?.name ?? '未知廟宇',
      timestamp: Date.now(),
      prayerPurpose,
    }
    checkins.value.push(record)
    checkNewAchievements()
    return record
  }

  function setPrayerPurpose(checkinId: string, purpose: PrayerPurpose) {
    const record = checkins.value.find(c => c.id === checkinId)
    if (record) {
      record.prayerPurpose = purpose
      checkNewAchievements()
    }
  }

  function checkNewAchievements(): EarnedBadge[] {
    const newBadges: EarnedBadge[] = []

    for (const badge of achievements) {
      if (earnedBadges.value.some(e => e.badgeId === badge.id)) continue

      let earned = false
      const cond = badge.condition

      if (cond.type === 'checkin_count') {
        earned = totalCheckins.value >= cond.count
      }
      else if (cond.type === 'unique_temples') {
        earned = uniqueTempleIds.value.length >= cond.count
      }
      else if (cond.type === 'all_purposes') {
        const allPurposes: PrayerPurpose[] = ['study', 'career', 'love', 'health', 'wealth', 'safety']
        earned = allPurposes.every(p => completedPurposes.value.includes(p))
      }
      else if (cond.type === 'specific_purpose') {
        earned = (purposeCounts.value[cond.purpose] ?? 0) >= cond.count
      }

      if (earned) {
        const entry: EarnedBadge = { badgeId: badge.id, earnedAt: Date.now() }
        earnedBadges.value.push(entry)
        newBadges.push(entry)
      }
    }

    return newBadges
  }

  function reset() {
    checkins.value = []
    earnedBadges.value = []
  }

  return {
    temples,
    achievements,
    checkins,
    earnedBadges,
    totalCheckins,
    uniqueTempleIds,
    purposeCounts,
    completedPurposes,
    findTemple,
    searchTemples,
    checkin,
    setPrayerPurpose,
    checkNewAchievements,
    reset,
  }
}, {
  persist: {
    pick: ['checkins', 'earnedBadges'],
  },
})
