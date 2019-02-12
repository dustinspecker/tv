'use strict'

const fastifyAutoload = require('fastify-autoload')
const fastifyCors = require('fastify-cors')
const fastifyEnv = require('fastify-env')
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
    .register(fastifyAutoload, {
      dir: path.join(__dirname, 'services'),
      options: Object.assign({}, opts)
    })
    .ready()
    .then(() => {
      fastify.log.info(`using media from ${fastify.config.TV_MEDIA_DIRECTORY}`)
    })

  next()
}
