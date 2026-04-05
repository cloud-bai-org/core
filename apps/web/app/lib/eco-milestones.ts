export interface Milestone {
  id: string
  name: string
  description: string
  icon: string
  check: (stats: MilestoneStats) => boolean
}

export interface MilestoneStats {
  totalCeremonies: number
  totalCo2ReducedGrams: number
}

export const MILESTONES: Milestone[] = [
  {
    id: 'eco-beginner',
    name: '環保新手',
    description: '完成首次線上拜拜',
    icon: '🌱',
    check: s => s.totalCeremonies >= 1,
  },
  {
    id: 'green-guardian',
    name: '綠色守護者',
    description: '累積減少 1 公斤碳排放',
    icon: '🛡️',
    check: s => s.totalCo2ReducedGrams >= 1_000,
  },
  {
    id: 'forest-friend',
    name: '森林之友',
    description: '相當於拯救 1 棵樹',
    icon: '🌳',
    check: s => s.totalCo2ReducedGrams >= 12_000,
  },
  {
    id: 'eco-master',
    name: '環保達人',
    description: '完成 50 次線上拜拜',
    icon: '🏆',
    check: s => s.totalCeremonies >= 50,
  },
  {
    id: 'earth-guardian',
    name: '地球守護者',
    description: '相當於拯救 10 棵樹',
    icon: '🌍',
    check: s => s.totalCo2ReducedGrams >= 120_000,
  },
]

/**
 * 檢測新達成的里程碑
 */
export function detectNewMilestones(
  stats: MilestoneStats,
  achievedIds: string[],
): Milestone[] {
  return MILESTONES.filter(m => !achievedIds.includes(m.id) && m.check(stats))
}
