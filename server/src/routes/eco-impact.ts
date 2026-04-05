import type { FastifyInstance } from 'fastify'
import { eq, sql, desc } from 'drizzle-orm'
import { ecoImpactRecords } from '../schema/index.js'

export default async function ecoImpactRoutes(app: FastifyInstance) {
  // 儲存單次儀式環保紀錄
  app.post('/api/eco-impact', {
    preHandler: app.verifyAuth,
  }, async (request) => {
    const { paperSavedGrams, co2ReducedGrams, jossPaperDetail, paperCraftDetail } = request.body as {
      paperSavedGrams: number
      co2ReducedGrams: number
      jossPaperDetail: Array<{ name: string; grams: number }>
      paperCraftDetail: { count: number; grams: number }
    }

    const [record] = await app.db.insert(ecoImpactRecords).values({
      userId: request.user.id,
      paperSavedGrams,
      co2ReducedGrams,
      jossPaperDetail,
      paperCraftDetail,
    }).returning()

    return record
  })

  // 取得累積統計
  app.get('/api/eco-impact/summary', {
    preHandler: app.verifyAuth,
  }, async (request) => {
    const [result] = await app.db
      .select({
        totalPaperSaved: sql<number>`coalesce(sum(${ecoImpactRecords.paperSavedGrams}), 0)`,
        totalCo2Reduced: sql<number>`coalesce(sum(${ecoImpactRecords.co2ReducedGrams}), 0)`,
        totalCeremonies: sql<number>`count(*)`,
      })
      .from(ecoImpactRecords)
      .where(eq(ecoImpactRecords.userId, request.user.id))

    return result
  })

  // 取得所有紀錄（供趨勢圖表用）
  app.get('/api/eco-impact/records', {
    preHandler: app.verifyAuth,
  }, async (request) => {
    const records = await app.db
      .select({
        id: ecoImpactRecords.id,
        ceremonyDate: ecoImpactRecords.ceremonyDate,
        paperSavedGrams: ecoImpactRecords.paperSavedGrams,
        co2ReducedGrams: ecoImpactRecords.co2ReducedGrams,
      })
      .from(ecoImpactRecords)
      .where(eq(ecoImpactRecords.userId, request.user.id))
      .orderBy(desc(ecoImpactRecords.ceremonyDate))

    return records
  })

  // 合併訪客紀錄
  app.post('/api/eco-impact/merge-guest', {
    preHandler: app.verifyAuth,
  }, async (request) => {
    const { records } = request.body as {
      records: Array<{
        ceremonyDate: string
        paperSavedGrams: number
        co2ReducedGrams: number
        jossPaperDetail?: Array<{ name: string; grams: number }>
        paperCraftDetail?: { count: number; grams: number }
      }>
    }

    if (!records.length) return { merged: 0 }

    const values = records.map(r => ({
      userId: request.user.id,
      ceremonyDate: new Date(r.ceremonyDate),
      paperSavedGrams: r.paperSavedGrams,
      co2ReducedGrams: r.co2ReducedGrams,
      jossPaperDetail: r.jossPaperDetail ?? null,
      paperCraftDetail: r.paperCraftDetail ?? null,
    }))

    await app.db.insert(ecoImpactRecords).values(values)

    return { merged: records.length }
  })
}
