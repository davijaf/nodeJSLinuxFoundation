'use strict'

module.exports = async function (fastify, opts) {
  fastify.get(
    '/:category',
    { websocket: true },
    async (socket, request) => { // Alterado aqui: de ({ socket }, request) para (socket, request)
      for (const order of fastify.currentOrders(request.params.category)) {
        socket.send(order)
      }
      for await (const order of fastify.realtimeOrders()) {
        if (socket.readyState >= socket.CLOSING) break
        socket.send(order)
      }
    }
  )
}