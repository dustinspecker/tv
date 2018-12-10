'use strict'

const fs = require('fs')
const path = require('path')

module.exports = function(fastify, opts, next) {
  fastify.get('/*', (request, reply) => {
    reply
      .header('Content-Type', 'text/html')
      .send(
        fs.readFileSync(
          path.join(__dirname, '..', '..', 'public', 'index.html')
        )
      )
  })

  next()
}
