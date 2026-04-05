import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schema/index.js'

async function databasePlugin(app: FastifyInstance) {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const client = postgres(databaseUrl)
  const db = drizzle(client, { schema })

  app.decorate('db', db)
  app.addHook('onClose', async () => {
    await client.end()
  })
}

export default fp(databasePlugin, {
  name: 'database',
})
