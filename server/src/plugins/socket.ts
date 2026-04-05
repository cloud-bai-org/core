import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Server } from 'socket.io'

async function socketPlugin(app: FastifyInstance) {
  const io = new Server(app.server, {
    cors: {
      origin: true,
    },
  })

  io.on('connection', (socket) => {
    app.log.info({ socketId: socket.id }, 'Client connected')

    socket.on('disconnect', (reason) => {
      app.log.info({ socketId: socket.id, reason }, 'Client disconnected')
    })
  })

  app.decorate('io', io)

  app.addHook('onClose', async () => {
    io.close()
  })
}

export default fp(socketPlugin, {
  name: 'socket',
})
