import Fastify from 'fastify'
import cors from '@fastify/cors'
import healthRoutes from './routes/health.js'

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: true,
})

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
