import type { FastifyInstance } from 'fastify'
import type { HealthResponse } from '@cloud-bai/shared'

export default async function healthRoutes(app: FastifyInstance) {
  app.get<{ Reply: HealthResponse }>('/health', async () => {
    return { status: 'ok' }
  })
}
