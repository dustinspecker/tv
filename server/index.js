'use strict'

const Autoload = require('fastify-autoload')
const fs = require('fs')
const ip = require('ip')
const path = require('path')

const mediaDir = process.env.TV_MEDIA_DIRECTORY
const port = 3000
const serverAddress = `http://${ip.address()}:${port}/`

if (mediaDir === undefined) {
  fastify.log.error(
    'Please define a media directory by defining the TV_MEDIA_DIRECTORY environment variable. For example:\n\nexport TV_MEDIA_DIRECTORY=/data/tv'
  )
  process.exit(1)
}

module.exports = function(fastify, opts, next) {
  fastify.register(require('fastify-cors'))

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public', 'assets'),
    prefix: '/assets/'
  })

  fastify.get('/*', (request, reply) => {
    reply
      .header('Content-Type', 'text/html')
      .send(fs.readFileSync(path.join(__dirname, 'public', 'index.html')))
  })

  fastify.register(Autoload, {
    dir: path.join(__dirname, 'services'),
    opts: Object.assign({}, opts)
  })

  fastify.log.info(`server listening at ${serverAddress}`)
  fastify.log.info(`using media from ${mediaDir}`)

  next()
}
