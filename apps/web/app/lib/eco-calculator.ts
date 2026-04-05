import { JOSS_PAPER_TYPES, type SelectedBundle } from '~/stores/joss-paper'

// 碳排放係數：每公克紙張燃燒產生的 CO₂ 公克數
const CO2_PER_GRAM_PAPER = 1.8

// 每棵樹每年吸收的 CO₂ 公克數
const CO2_PER_TREE_PER_YEAR = 12_000

// 紙紮物品每件等效的實體紙張公克數
const PAPER_CRAFT_GRAMS_PER_ITEM = 30

export interface CeremonyImpact {
  paperSavedGrams: number
  co2ReducedGrams: number
  jossPaperDetail: Array<{ name: string; grams: number }>
  paperCraftDetail: { count: number; grams: number }
}

export interface EcoEquivalent {
  treesSaved: number
  co2ReducedKg: number
}

/**
 * 根據儀式使用的金紙與紙紮物品，計算環保效益
 */
export function calculateCeremonyImpact(
  jossPaperBundles: SelectedBundle[],
  paperCraftCount: number,
): CeremonyImpact {
  let totalPaperGrams = 0

  const jossPaperDetail = jossPaperBundles
    .map((bundle) => {
      const type = JOSS_PAPER_TYPES.find(t => t.id === bundle.id)
      if (!type) return null
      const grams = type.paperGrams * bundle.bundles
      totalPaperGrams += grams
      return { name: type.name, grams }
    })
    .filter((d): d is { name: string; grams: number } => d !== null)

  const paperCraftGrams = paperCraftCount * PAPER_CRAFT_GRAMS_PER_ITEM
  totalPaperGrams += paperCraftGrams

  return {
    paperSavedGrams: totalPaperGrams,
    co2ReducedGrams: totalPaperGrams * CO2_PER_GRAM_PAPER,
    jossPaperDetail,
    paperCraftDetail: { count: paperCraftCount, grams: paperCraftGrams },
  }
}

/**
 * 將累積碳排放量換算為等效比喻
 */
export function calculateEquivalent(totalCO2Grams: number): EcoEquivalent {
  return {
    treesSaved: totalCO2Grams / CO2_PER_TREE_PER_YEAR,
    co2ReducedKg: totalCO2Grams / 1000,
  }
}
