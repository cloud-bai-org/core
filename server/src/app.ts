import Fastify from 'fastify'
import cors from '@fastify/cors'
import databasePlugin from './plugins/database.js'
import socketPlugin from './plugins/socket.js'
import healthRoutes from './routes/health.js'

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: true,
})

// Plugins（依賴順序：database → auth → socket → routes）
if (process.env.DATABASE_URL) {
  await app.register(databasePlugin)
}
await app.register(socketPlugin)

// Routes
await app.register(healthRoutes)

const port = Number(process.env.PORT) || 3001

try {
  await app.listen({ port, host: '0.0.0.0' })
  app.log.info(`Server listening on port ${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
