import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { createClient } from '@supabase/supabase-js'

async function authPlugin(app: FastifyInstance) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  app.decorate('supabase', supabase)

  app.decorate('verifyAuth', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.slice(7)
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return reply.code(401).send({ error: 'Invalid or expired token' })
    }

    request.user = data.user
  })

  // socket.io JWT 驗證 middleware
  if (app.io) {
    app.io.use(async (socket, next) => {
      const token = socket.handshake.auth?.token as string | undefined
      if (!token) {
        return next(new Error('Authentication required'))
      }

      const { data, error } = await supabase.auth.getUser(token)
      if (error || !data.user) {
        return next(new Error('Invalid or expired token'))
      }

      socket.data.user = data.user
      next()
    })
  }
}

export default fp(authPlugin, {
  name: 'auth',
  dependencies: ['socket'],
})
