'use strict'

const Autoload = require('fastify-autoload')
const ip = require('ip')
const path = require('path')

const mediaDir = process.env.TV_MEDIA_DIRECTORY

if (mediaDir === undefined) {
  fastify.log.error(
    'Please define a media directory by defining the TV_MEDIA_DIRECTORY environment variable. For example:\n\nexport TV_MEDIA_DIRECTORY=/data/tv'
  )
  process.exit(1)
}

module.exports = function(fastify, opts, next) {
  fastify.ready().then(() => {
    const serverAddress = `http://${ip.address()}:${
      fastify.server.address().port
    }/`
    fastify.log.info(`server listening at ${serverAddress}`)
    fastify.log.info(`using media from ${mediaDir}`)
  })

  fastify.register(require('fastify-cors'))

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public', 'assets'),
    prefix: '/assets/'
  })

  fastify.register(Autoload, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({mediaDir}, opts)
  })

  next()
}
