import { describe, it, expect } from 'vitest'
import { calculateCeremonyImpact, calculateEquivalent } from '~/lib/eco-calculator'

describe('calculateCeremonyImpact', () => {
  it('計算單種金紙的環保效益', () => {
    const result = calculateCeremonyImpact(
      [{ id: 'shou-jin', bundles: 2 }],
      0,
    )
    // 壽金 paperGrams=12, 2 bundles → 24g
    expect(result.paperSavedGrams).toBe(24)
    expect(result.co2ReducedGrams).toBeCloseTo(24 * 1.8)
    expect(result.jossPaperDetail).toEqual([{ name: '壽金', grams: 24 }])
    expect(result.paperCraftDetail).toEqual({ count: 0, grams: 0 })
  })

  it('計算多種金紙加紙紮物品的環保效益', () => {
    const result = calculateCeremonyImpact(
      [
        { id: 'shou-jin', bundles: 1 },  // 12g
        { id: 'gua-jin', bundles: 3 },   // 8*3=24g
      ],
      2, // 2 items × 30g = 60g
    )
    const expectedPaper = 12 + 24 + 60
    expect(result.paperSavedGrams).toBe(expectedPaper)
    expect(result.co2ReducedGrams).toBeCloseTo(expectedPaper * 1.8)
    expect(result.jossPaperDetail).toHaveLength(2)
    expect(result.paperCraftDetail).toEqual({ count: 2, grams: 60 })
  })

  it('忽略不存在的金紙 ID', () => {
    const result = calculateCeremonyImpact(
      [{ id: 'nonexistent', bundles: 5 }],
      0,
    )
    expect(result.paperSavedGrams).toBe(0)
    expect(result.jossPaperDetail).toHaveLength(0)
  })

  it('無金紙無紙紮時回傳零', () => {
    const result = calculateCeremonyImpact([], 0)
    expect(result.paperSavedGrams).toBe(0)
    expect(result.co2ReducedGrams).toBe(0)
  })
})

describe('calculateEquivalent', () => {
  it('計算等效樹木與公斤數', () => {
    const result = calculateEquivalent(12_000)
    expect(result.treesSaved).toBe(1)
    expect(result.co2ReducedKg).toBe(12)
  })

  it('零碳排放回傳零', () => {
    const result = calculateEquivalent(0)
    expect(result.treesSaved).toBe(0)
    expect(result.co2ReducedKg).toBe(0)
  })
})
