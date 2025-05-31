'use strict'
module.exports = async function (fastify, opts) {
  function monitorMessages(socket) {
    socket.on('message', (data) => {
      console.log('WebSocket Message:', data)
      try {
        const { cmd, payload } = JSON.parse(data)
        if (cmd === 'update-category') {
          sendCurrentOrders(payload.category, socket)
        }
      } catch (err) {
        console.error('WebSocket Message Error:', err)
        fastify.log.warn(
          'WebSocket Message (data: %o) Error: %s',
          data,
          err.message
        )
      }
    })
  }

  function sendCurrentOrders(category, socket) {
    console.log('Sending current orders for category:', category)
    for (const order of fastify.currentOrders(category)) {
      socket.send(order)
    }
  }

  fastify.get(
     '/:category',
    { websocket: true },
    async (socket, request) => {
     monitorMessages(socket)
     sendCurrentOrders(request.params.category, socket)
      for await (const order of fastify.realtimeOrders()) {
        if (socket.readyState >= socket.CLOSING) break
        socket.send(order)
      }
    }
  )
}