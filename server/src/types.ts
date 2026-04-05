import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Server } from 'socket.io'
import type * as schema from './schema/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>
    supabase: SupabaseClient
    io: Server
    verifyAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: User
  }
}
