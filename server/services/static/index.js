'use strict'

const fs = require('fs')
const path = require('path')

module.exports = function(fastify, opts, next) {
  fastify.get('/*', (request, reply) => {
    fs.promises
      .readFile(path.join(__dirname, '..', '..', 'public', 'index.html'))
      .then(file => {
        reply.header('Content-Type', 'text/html').send(file)
      })
  })

  next()
}
