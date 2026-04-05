import { pgTable, uuid, timestamp, real, integer, jsonb } from 'drizzle-orm/pg-core'

export const ecoImpactRecords = pgTable('eco_impact_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  ceremonyDate: timestamp('ceremony_date', { withTimezone: true }).notNull().defaultNow(),
  paperSavedGrams: real('paper_saved_grams').notNull(),
  co2ReducedGrams: real('co2_reduced_grams').notNull(),
  jossPaperDetail: jsonb('joss_paper_detail').$type<Array<{ name: string; grams: number }>>(),
  paperCraftDetail: jsonb('paper_craft_detail').$type<{ count: number; grams: number }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
