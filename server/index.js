'use strict'

const autoload = require('fastify-autoload')
const fastifyCors = require('fastify-cors')
const fastifyEnv = require('fastify-env')
const fastifyStatic = require('fastify-static')
const ip = require('ip')
const path = require('path')

module.exports = function(fastify, opts, next) {
  const envSchema = {
    type: 'object',
    required: ['TV_MEDIA_DIRECTORY'],
    properties: {
      TV_MEDIA_DIRECTORY: {
        type: 'string'
      }
    }
  }

  fastify
    .register(fastifyEnv, {schema: envSchema})
    .register(fastifyCors)
    .register(fastifyStatic, {
      root: path.join(__dirname, 'public', 'assets'),
      prefix: '/assets/'
    })
    .register(autoload, {
      dir: path.join(__dirname, 'services'),
      options: Object.assign({}, opts)
    })
    .ready()
    .then(() => {
      const serverAddress = `http://${ip.address()}:${
        fastify.server.address().port
      }`
      fastify.log.info(`server listening at ${serverAddress}`)
      fastify.log.info(`using media from ${fastify.config.TV_MEDIA_DIRECTORY}`)
    })

  next()
}
